import Player from '@vimeo/player';
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

  constructor (containerElement, options) {
    this.#containerElem = containerElement;
    this.#opt = options;

    this.#assertTests();
  }

  #assertTests () {
    console.assert(this.#containerElem, 'Missing container element');
    console.assert(typeof this.#opt.describeCallback === 'function', 'Missing describeCallback function');
    console.assert(this.#opt.mediaUrl, 'Missing mediaUrl');
    console.assert(this.#opt.trackUrl, 'Missing trackUrl (WebVTT)');
  }

  async initialize () {
    this.#player = new Player(this.#containerElem, {
      url: this.#opt.mediaUrl,
      width: this.#opt.width ?? 640,
      dnt: this.#opt.dnt ?? false
    });

    this.#describer = new SynthAudioDescriber();
    this.#describer.onMetadata((entry, ev) => this.#onMetadata(entry, ev));

    await this.#describer.fetchAndParse(this.#opt.trackUrl);

    this.#player.on('timeupdate', (ev) => this.#describer.onTimeupdateEvent(ev, this.#opt.describeCallback()));
    this.#player.on('play', (ev) => console.debug('Play video:', this.#player.element.title, ev));
    this.#player.on('error', (ev) => console.error('Vimeo Error:', ev));

    await this.#player.ready();

    console.debug('SEAD player ready:', this);
  }

  #onMetadata (entry, ev) {
    console.assert(entry && entry.meta, 'Missing meta');
    const { meta } = entry;

    if (meta.pauseMedia) {
      if (this.#pauseID) {
        console.debug('Already paused:', this.#pauseID);
      } else {
        this.#setTimeout(meta, () => {
          this.#containerElem.dataset.extPause = false;

          this.#player.play();
          console.debug('Resume player');
        });

        this.#player.pause();
        console.debug('Pause player');

        this.#containerElem.dataset.extPause = true;
      }
    }
    console.debug('>> onMetadata:', meta, ev);
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
