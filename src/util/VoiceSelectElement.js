const { HTMLElement, speechSynthesis, SpeechSynthesisUtterance } = globalThis;

/**
 * A custom element to allow the user to select a synthesis voice.
 * Voices are filtered by language.
 * Fires a "voice-select" event on window when the user makes a choice.
 *
 * @customElement voice-select
 * @fires voice-select
 * @copyright Nick Freear, 12-April-2026.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices
 */
export default class VoiceSelectElement extends HTMLElement {
  #eventName = 'voice-select';
  #eventTarget = window;
  #timeoutMS = 2000;
  #voices;
  #filtered;
  #selectedVoice;
  // https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/rate
  #speechRate = 1.0;

  #selectElem;
  #rateInputElem;

  /** The lang tag to filter by - can be a plain string or a RegEx pattern.
   */
  get #locale () {
    const locale = this.getAttribute('locale') ?? 'en';
    console.assert(locale !== 'undefined', 'Bad locale attribute');
    return locale;
  }

  get #label () { return this.getAttribute('label') ?? 'Voice'; }
  get #rateLabel () { return this.getAttribute('rate-label') ?? 'Speech rate'; }
  get #buttonLabel () { return this.getAttribute('button-label') ?? 'Test'; } // Was: 'Test speech'
  get #testText () { return this.getAttribute('test-text') ?? 'Hello world!'; }
  get #defaultText () { return this.getAttribute('default-text') ?? ' – default'; } // Thin space U+2009.

  get #voiceCount () { return this.#filtered.length; }
  get value () { return this.#selectedVoice; }

  connectedCallback () {
    if (!this.#speechSynthesisSupported) {
      this.dataset.state = 'no-support';
      return;
    }

    const root = this.attachShadow({ mode: 'open' });
    const { label, select, button } = this.#createElements();
    const { labelRate, inputRate } = this.#createSpeechRateElements();

    this.#selectElem = select;
    this.#rateInputElem = inputRate;

    root.appendChild(label);
    root.appendChild(select);
    root.appendChild(labelRate);
    root.appendChild(button);

    select.addEventListener('change', (ev) => this.#onChange(ev, 'voice'));
    inputRate.addEventListener('change', (ev) => this.#onChange(ev, 'rate'));
    button.addEventListener('click', (ev) => this.#speak(this.#testText, ev));

    this.#populateVoiceList(select);

    if (
      this.#speechSynthesisSupported &&
      speechSynthesis.onvoiceschanged !== undefined
    ) {
      speechSynthesis.onvoiceschanged = () => this.#populateVoiceList(select);
      console.debug('voice-select:', [this]);
    }
    this.#timeoutStatusCheck();
  }

  #timeoutStatusCheck () {
    setTimeout(() => {
      if (!this.#voiceCount) {
        this.dataset.state = 'no-voices';
      }
    }, this.#timeoutMS);
  }

  #createElements () {
    const label = document.createElement('label');
    const select = document.createElement('select');
    const button = document.createElement('button');

    label.setAttribute('for', 'select');
    select.id = 'select';
    label.textContent = this.#label;
    button.textContent = this.#buttonLabel;

    label.setAttribute('part', 'label');
    select.setAttribute('part', 'select');
    button.setAttribute('part', 'button');

    return { label, select, button };
  }

  #createSpeechRateElements () {
    const labelRate = document.createElement('label');
    const span = document.createElement('span');
    const input = document.createElement('input');

    labelRate.setAttribute('part', 'label rate');
    input.setAttribute('part', 'input rate');

    input.type = 'number';
    input.min = 0.5;
    input.max = 2.0;
    input.step = 0.25;
    input.value = 1.0;

    span.textContent = this.#rateLabel;

    labelRate.appendChild(span);
    labelRate.appendChild(input);

    return { labelRate, inputRate: input };
  }

  #onChange (ev, name) {
    const voiceValue = this.#selectElem.value;
    const rateValue = parseFloat(this.#rateInputElem.value);

    const voice = this.#filtered.find((it) => `${it.name}/${it.lang}` === voiceValue);

    console.assert(voice, 'Voice not found');

    this.#selectedVoice = voice;
    this.#speechRate = rateValue;

    this.#dispatchEvent(voice, rateValue, ev);
  }

  #dispatchEvent (voice, speechRate, originalEvent) {
    const { lang } = voice;
    const event = new CustomEvent(this.#eventName, {
      detail: { voice, lang, speechRate, originalEvent, source: this }
    });
    this.#eventTarget.dispatchEvent(event);
  }

  #populateVoiceList (selectElem) {
    if (!this.#speechSynthesisSupported) {
      console.warn('speechSynthesis is not supported!');
      this.dataset.state = 'no-support';
      return;
    }

    const filteredVoices = this.#getFilteredVoices();

    const optionArray = filteredVoices.map((voice) => {
      const option = document.createElement('option');
      option.textContent = `${voice.name} (${voice.lang})`;
      option.value = `${voice.name}/${voice.lang}`;

      if (voice.default) {
        option.textContent += this.#defaultText;
      }

      option.dataset.lang = voice.lang;
      option.dataset.name = voice.name;

      return option;
    });

    if (this.#voiceCount) {
      selectElem.replaceChildren(...optionArray);

      this.dataset.ready = true;
      this.dataset.count = this.#voiceCount;
      this.title = `${this.#voiceCount} voices`;
    }
  }

  #getFilteredVoices () {
    this.#voices = speechSynthesis.getVoices();

    this.#filtered = this.#voices.filter((it) => this.#filterByLang(it));
    return this.#filtered;
  }

  #speak (text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.#selectedVoice;
    utterance.rate = this.#speechRate;
    utterance.onerror = (err) => console.error('Speech Error:', err);
    speechSynthesis.speak(utterance);
    console.debug('Speak:', text, utterance);
  }

  #filterByLang (voice) {
    const RE = new RegExp(`^${this.#locale}`, 'i');
    return RE.test(voice.lang);
  }

  get #speechSynthesisSupported () {
    return typeof speechSynthesis !== 'undefined';
  }
}
