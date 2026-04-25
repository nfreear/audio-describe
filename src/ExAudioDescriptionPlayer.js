import SynthAudioDescriber from './SynthAudioDescriber.js';

const { HTMLElement } = globalThis;

/**
 * Synthesised & Extended Audio Description (SEAD).
 *
 * @copyright Nick Freear, 10-April-2026.
 */
export default class ExAudioDescriptionController {
  #opt = {};
  #describer;
  #pauseID;
  #lastFromTime;

  get #mediaEl () { return this.#opt.mediaElement; }
  get #isEnabledFN () { return this.#opt.isEnabledCallback; }
  get #onStateChangeFN () { return this.#opt.onStateChange; }

  constructor (options) {
    this.#opt = options;

    this.#expectations();
  }

  /** Do a form of Duck typing via asserts.
   */
  #expectations () {
    console.assert(this.#mediaEl instanceof HTMLElement, 'mediaElement should extend HTMLElement');
    console.assert(typeof this.#mediaEl.addEventListener === 'function', 'Missing addEventListener'); // Superfluous?
    console.assert(typeof this.#mediaEl.play === 'function', 'Missing play method');
    console.assert(typeof this.#mediaEl.pause === 'function', 'Missing pause method');
    console.assert(typeof this.#mediaEl.currentTime === 'number', 'Missing currentTime property (getter)');
    console.assert(typeof this.#isEnabledFN === 'function', 'Missing isEnabledCallback');
    console.assert(typeof this.#onStateChangeFN === 'function', 'Missing onStateChange function');
    console.assert(this.#opt.trackUrl, 'Missing trackUrl (WebVTT)'); // In theory 'trackUrl' can be anything accepted by `fetch()`
    console.assert(this.#opt.trackLang, 'Missing trackLang');
    // console.assert(this.#opt.provider, 'Missing provider'); // Redundant?
  }

  async initialize () {
    this.#describer = new SynthAudioDescriber();
    this.#describer.onMetadata = (entry, ev) => this.#onMetadata(entry, ev);

    await this.#describer.fetchAndParse(this.#opt.trackUrl, this.#opt.trackLang);

    this.#mediaEl.addEventListener('timeupdate', (ev) => this.#onTimeupdateEvent(ev));
    this.#mediaEl.addEventListener('play', (ev) => console.debug('Play:', ev));
    this.#mediaEl.addEventListener('pause', (ev) => console.debug('Pause:', ev));
    this.#mediaEl.addEventListener('error', (ev) => console.error('Media Error:', ev));

    /** @LEGACY - Video.js */
    if (typeof this.#mediaEl.ready === 'function') {
      await this.#mediaEl.ready();
    }

    // console.debug('SEAD controller ready:', this);
  }

  /**
   * https://html.spec.whatwg.org/multipage/media.html#event-media-timeupdate
   */
  #onTimeupdateEvent (ev) {
    const seconds = this.#mediaEl.currentTime;
    this.#describer.onTimeupdateEvent(ev, seconds, this.#isEnabledFN());
  }

  #onMetadata (entry, event) {
    console.assert(entry && entry.meta, 'Missing meta');
    const { meta, from } = entry;

    if (from === this.#lastFromTime) {
      console.debug('onMeta repeat:', entry);
      return;
    }

    if (meta.pauseMedia) {
      if (this.#pauseID) {
        console.debug('Already paused:', this.#pauseID);
      } else {
        this.#setTimeout(meta, () => {
          this.#mediaEl.play();
          this.#onStateChangeFN({ state: 'play', entry, event });
        });

        this.#mediaEl.pause();
        this.#onStateChangeFN({ state: 'pause', entry, event });
      }
    }
    this.#lastFromTime = from;

    console.debug('onMetadata:', meta, event);
  }

  #setTimeout (meta, callbackFN) {
    this.#pauseID = setTimeout(() => {
      this.#pauseID = null;
      callbackFN();
    },
    this.#milliseconds(meta));
  }

  #milliseconds (meta) {
    console.assert(typeof meta.pauseMedia === 'number', 'pauseMedia should be a positive integer');
    const pauseMS = parseInt(meta.pauseMedia);
    console.assert(pauseMS > 1000, 'pauseMedia should be greater than 1000ms');
    return pauseMS;
  }

  // Legacy?
  speak (text) { return this.#describer.speak(text); }
}
