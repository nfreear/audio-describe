import VimeoPlayer from '@vimeo/player';
import YoutubePlayer from './util/YoutubePlayer.js';
import SynthAudioDescriber from './SynthAudioDescriber.js';

/**
 * Synthetic & Extended Audio Description (SEAD).
 *
 * @copyright Nick Freear, 10-April-2026.
 */
export default class ExAudioDescriptionPlayer {
  #containerElem;
  #opt = {};
  #player;
  #describer;
  #pauseID;
  #lastFromTime;

  get #isEnabledFN () { return this.#opt.isEnabledCallback; }

  #getPlayerKlass () {
    const { provider } = this.#opt;
    console.assert(/^(vimeo|youtube)/.test(provider), `Unexpected provider: ${provider}`);
    const providers = {
      vimeo: VimeoPlayer,
      youtube: YoutubePlayer
    };
    return providers[provider];
  }

  // TODO: get element () { return this.#player.element; }

  constructor (containerElement, options) {
    this.#containerElem = containerElement;
    this.#opt = options;

    this.#assertTests();
  }

  #assertTests () {
    console.assert(this.#containerElem, 'Missing container element');
    console.assert(typeof this.#isEnabledFN === 'function', 'Missing isEnabledCallback');
    console.assert(typeof this.#opt.onStateChange === 'function', 'Missing onStateChange function');
    console.assert(this.#opt.mediaUrl, 'Missing mediaUrl');
    console.assert(this.#opt.trackUrl, 'Missing trackUrl (WebVTT)');
    console.assert(this.#opt.provider, 'Missing provider');
  }

  async initialize () {
    const PlayerKlass = this.#getPlayerKlass();

    this.#player = new PlayerKlass(this.#containerElem, {
      url: this.#opt.mediaUrl,
      width: this.#opt.width ?? 640,
      dnt: this.#opt.dnt ?? false
    });

    this.#describer = new SynthAudioDescriber();
    this.#describer.onMetadata = (entry, ev) => this.#onMetadata(entry, ev);

    await this.#describer.fetchAndParse(this.#opt.trackUrl);

    this.#player.on('timeupdate', (ev) => this.#describer.onTimeupdateEvent(ev, this.#isEnabledFN()));
    this.#player.on('play', (ev) => console.debug('Play video:', this.#player.element.title, ev));
    this.#player.on('error', (ev) => console.error('Player Error:', ev));

    await this.#player.ready();
    // this.#player.element.setAttribute('part', 'iframe');

    // console.debug('SEAD player ready:', this);
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
          this.#containerElem.dataset.extPause = false;

          this.#player.play();
          this.#opt.onStateChange({ state: 'play', entry, event });
        });

        this.#player.pause();
        // console.debug('>> PAUSE:', this.#milliseconds(meta));
        this.#opt.onStateChange({ state: 'pause', entry, event });

        this.#containerElem.dataset.extPause = true;
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

  speak (text) { return this.#describer.speak(text); }
}
