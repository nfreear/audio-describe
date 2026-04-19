import MetaVttParser from './MetaVttParser.js';

const { speechSynthesis, SpeechSynthesisUtterance } = globalThis;

/**
 * Use the browser's speech synthesiser for Audio Description.
 *
 * @copyright Nick Freear, 10-April-2026.
 * @see https://html.spec.whatwg.org/multipage/media.html#attr-track-kind-keyword-descriptions
 */
export default class SynthAudioDescriber {
  #delayMS = 300;
  #parser;
  #spoken = [];
  #metadataCallback;
  #voice;

  set onMetadata (callbackFN) { this.#metadataCallback = callbackFN; }
  get onMetadata () { return this.#metadataCallback; }

  constructor () {
    window.addEventListener('voice-select', (ev) => this.#onVoiceSelect(ev));
  }

  async fetchAndParse (trackUrl) {
    console.assert(typeof this.#metadataCallback === 'function', 'Missing onMetadata function');

    this.#parser = new MetaVttParser();
    const { entries } = await this.#parser.fetchAndParse(trackUrl);

    console.debug('VTT entries:', entries);
  }

  onTimeupdateEvent (ev, seconds, describeEnabled = true) {
    console.assert(typeof seconds === 'number', 'Missing timeupdate seconds.');

    const entry = this.#parser.findByTime(seconds);
    if (entry && describeEnabled) {
      if (entry.text) {
        this.#speakOnce(entry.text);
        // .
      } else if (entry.meta) {
        this.#metadataCallback(entry, ev);

        // For WebVTT file: "vbde2" - it works!
        if (entry.meta.text) {
          setTimeout(() => this.#speakOnce(entry.meta.text), this.#delayMS);
        }
      } else {
        console.error('Unexpected entry:', entry);
      }
    }
    // console.debug('timeupdate:', describeEnabled, entry, ev);
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
    utterance.voice = this.#voice;
    speechSynthesis.speak(utterance);
    console.debug('Speak:', text);
  }

  #onVoiceSelect (ev) {
    console.assert(ev.detail, 'Missing event detail');
    console.assert(ev.detail.voice, 'Missing voice');
    const { voice } = ev.detail;

    this.#voice = voice;

    console.debug('onVoiceSelect:', voice, ev);
  }
}
