import MetaVttParser from './MetaVttParser.js';

const { speechSynthesis, SpeechSynthesisUtterance } = globalThis;

/**
 * Use the browser's speech synthesiser for Audio Description.
 *
 * @copyright Nick Freear, 10-April-2026.
 * @see https://html.spec.whatwg.org/multipage/media.html#attr-track-kind-keyword-descriptions
 */
export default class SynthAudioDescriber {
  #trackUrl;
  #entries;
  #spoken = [];

  constructor (trackUrl) {
    this.#trackUrl = trackUrl;
  }

  async fetchAndParse () {
    const parser = new MetaVttParser();
    const { entries } = await parser.fetchAndParse(this.#trackUrl);

    this.#entries = entries;

    console.debug('VTT entries:', entries);
  }

  onTimeupdateEvent (ev, describe = true) {
    // https://github.com/vimeo/player.js#timeupdate
    const { seconds } = ev;

    const entry = this.#findEntry(seconds);
    if (entry && entry.text && describe) {
      // console.debug('Pre-speak:', entry);
      this.#speakOnce(entry.text);
    }
    console.debug('timeupdate', describe, entry, ev);
  }

  #findEntry (seconds) {
    const millis = parseInt(1000 * seconds);
    return this.#entries.find(({ from, to }) => millis >= from && millis <= to);
  }

  #speakOnce (text) {
    if (this.#spoken.find((it) => it === text)) {
      console.debug('No speak:', text);
    } else {
      this.#spoken.push(text);

      this.speak(text);
    }
  }

  speak (text) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
    console.debug('Speak:', text);
  }
}
