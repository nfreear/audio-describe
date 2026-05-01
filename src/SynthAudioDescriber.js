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
  #lang;
  #speechRate = 1.0;

  set onMetadata (callbackFN) { this.#metadataCallback = callbackFN; }
  get onMetadata () { return this.#metadataCallback; }

  constructor () {
    window.addEventListener('voice-select', (ev) => this.#onVoiceSelect(ev));
  }

  async fetchAndParse (trackUrl, trackLang) {
    console.assert(typeof this.#metadataCallback === 'function', 'Missing onMetadata function');

    this.#lang = trackLang;
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
    utterance.lang = this.#lang;
    utterance.rate = this.#speechRate;
    utterance.onerror = (err) => this.#onSpeechError(err);
    speechSynthesis.speak(utterance);
    console.debug('Speak:', text, utterance);
  }

  #onSpeechError (err) {
    console.error('Speech Error:', err.code, err);
    document.documentElement.dataset.error = `speech:${err.error}`;
    const ELEM = document.querySelector('[role = alert]');
    console.assert(ELEM, 'Missing alert element');
    if (ELEM) {
      ELEM.textContent = `Speech Error: ${err.error}`;
    }
  }

  #onVoiceSelect (ev) {
    console.assert(ev.detail, 'Missing event detail');
    console.assert(ev.detail.voice, 'Missing voice');
    console.assert(ev.detail.speechRate, 'Missing rate');
    const { voice, speechRate } = ev.detail;

    this.#voice = voice;
    this.#speechRate = speechRate;

    console.debug('onVoiceSelect:', voice, speechRate, ev);
  }
}
