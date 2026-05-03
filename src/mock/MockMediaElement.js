import { EventTarget, Event } from 'event-target-shim';

/**
 * A minimal class that fulfills the API requirements for a `mediaElement`.
 *
 * @see https://github.com/nfreear/audio-describe/blob/main/docs/API.md#mediaelement-property
 */
export default class MockMediaElement extends EventTarget {
  #count = 0;
  #duration;
  #intervalID;
  #intervalMS = 250;

  constructor (durationSeconds = 30) {
    super();
    this.#duration = durationSeconds;
  }

  get currentTime () { return parseFloat(this.#count * this.#intervalMS / 1000); }
  get paused () { return !this.#intervalID; }
  get ended () { return this.currentTime >= this.#duration; }

  async play () {
    if (this.ended) {
      return Promise.reject(new Error('Error: already ended.'));
    }
    if (!this.paused) {
      return Promise.reject(new Error('Error: already playing.'));
    }
    this.#intervalID = setInterval(() => this.#onInterval(), this.#intervalMS);

    return Promise.resolve();
  }

  pause () {
    if (this.#intervalID) {
      clearInterval(this.#intervalID);
      this.#intervalID = null;
    }
  }

  #onInterval () {
    this.#count++;
    this.dispatchEvent(new Event('timeupdate'));

    if (this.ended) {
      this.pause();
      this.dispatchEvent(new Event('ended'));
    }
  }
}
