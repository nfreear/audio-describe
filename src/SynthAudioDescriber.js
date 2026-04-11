import MetaVttParser from './MetaVttParser.js';

const { speechSynthesis, SpeechSynthesisUtterance } = globalThis;

/**
 * Use the browser's speech synthesiser for Audio Description.
 *
 * @copyright Nick Freear, 10-April-2026.
 * @see https://html.spec.whatwg.org/multipage/media.html#attr-track-kind-keyword-descriptions
 */
export default class SynthAudioDescriber {
  #parser;
  #spoken = [];
  #metadataCallback;

  onMetadata (callbackFN) {
    this.#metadataCallback = callbackFN;
  }

  async fetchAndParse (trackUrl) {
    console.assert(typeof this.#metadataCallback === 'function', 'Missing onMetadata function');

    this.#parser = new MetaVttParser();
    const { entries } = await this.#parser.fetchAndParse(trackUrl);

    console.debug('VTT entries:', entries);
  }

  onTimeupdateEvent (ev, describe = true) {
    // https://github.com/vimeo/player.js#timeupdate
    const { seconds } = ev;

    const entry = this.#parser.findByTime(seconds);
    if (entry) {
      if (entry.text && describe) {
        this.#speakOnce(entry.text);
        // .
      } else if (entry.meta) {
        this.#metadataCallback(entry, ev);
      } else {
        console.error('Unexpected entry:', entry);
      }
    }
    console.debug('timeupdate:', describe, entry, ev);
  }

  #speakOnce (text) {
    if (this.#spoken.find((it) => it === text)) {
      // console.debug('No speak:', text);
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
