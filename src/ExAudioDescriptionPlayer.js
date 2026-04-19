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

  constructor (options) {
    this.#opt = options;

    this.#expectations();
  }

  #expectations () {
    console.assert(this.#mediaEl instanceof HTMLElement, 'mediaElement should extend HTMLElement');
    console.assert(typeof this.#mediaEl.addEventListener === 'function', 'Missing addEventListener'); // Superfluous?
    console.assert(typeof this.#mediaEl.play === 'function', 'Missing play method');
    console.assert(typeof this.#mediaEl.pause === 'function', 'Missing pause method');
    console.assert(typeof this.#mediaEl.currentTime === 'number', 'Missing currentTime property (getter)');
    console.assert(typeof this.#isEnabledFN === 'function', 'Missing isEnabledCallback');
    console.assert(typeof this.#opt.onStateChange === 'function', 'Missing onStateChange function');
    console.assert(this.#opt.trackUrl, 'Missing trackUrl (WebVTT)');
    // console.assert(this.#opt.provider, 'Missing provider'); // Redundant?
  }

  async initialize () {
    this.#describer = new SynthAudioDescriber();
    this.#describer.onMetadata = (entry, ev) => this.#onMetadata(entry, ev);

    await this.#describer.fetchAndParse(this.#opt.trackUrl);

    this.#mediaEl.addEventListener('timeupdate', (ev) => this.#onTimeupdateEvent(ev));
    this.#mediaEl.addEventListener('play', (ev) => console.debug('Play:', ev));
    this.#mediaEl.addEventListener('pause', (ev) => console.debug('Pause:', ev));
    this.#mediaEl.addEventListener('error', (ev) => console.error('Media Error:', ev));

    if (typeof this.#mediaEl.ready === 'function') {
      await this.#mediaEl.ready();
    }

    // console.debug('SEAD player ready:', this);
  }

  /**
   * https://html.spec.whatwg.org/multipage/media.html#event-media-timeupdate
   */
  #onTimeupdateEvent (ev) {
    const seconds = this.#mediaEl.currentTime;
    this.#describer.onTimeupdateEvent(ev, seconds, this.#isEnabledFN());
  }

  #onMetadata (entry, event) {
    console.debug('onMetaData:', entry, event);

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
          // this.#containerElem.dataset.extPause = false;

          this.#mediaEl.play();
          this.#opt.onStateChange({ state: 'play', entry, event });
        });

        this.#mediaEl.pause();
        // console.debug('>> PAUSE:', this.#milliseconds(meta));
        this.#opt.onStateChange({ state: 'pause', entry, event });

        // this.#containerElem.dataset.extPause = true;
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
