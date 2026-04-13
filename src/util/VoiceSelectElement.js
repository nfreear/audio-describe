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
  #voices;
  #filtered;
  #selectedVoice;

  /** The lang tag to filter by - can be a plain string or a RegEx pattern.
   */
  get #locale () { return this.getAttribute('locale') ?? 'en'; }

  get #label () { return this.getAttribute('label') ?? 'Voice '; }

  connectedCallback () {
    const root = this.attachShadow({ mode: 'open' });
    const { label, select, button } = this.#createElements();

    root.appendChild(label);
    root.appendChild(select);
    root.appendChild(button);

    select.addEventListener('change', (ev) => this.#onChange(ev));
    button.addEventListener('click', (ev) => this.#speak('Hello world!', ev));

    this.#populateVoiceList(select);

    if (
      this.#speechSynthesisSupported &&
      speechSynthesis.onvoiceschanged !== undefined
    ) {
      speechSynthesis.onvoiceschanged = () => this.#populateVoiceList(select);
    }
    console.debug('voice-select:', [this]);
  }

  #createElements () {
    const label = document.createElement('label');
    const select = document.createElement('select');
    const button = document.createElement('button');

    label.setAttribute('for', 'select');
    select.id = 'select';
    label.textContent = this.#label;
    button.textContent = 'Test';

    label.setAttribute('part', 'label');
    select.setAttribute('part', 'select');
    button.setAttribute('part', 'button');

    return { label, select, button };
  }

  #onChange (ev) {
    const { target } = ev;
    const { value } = target;
    // const part = value.split('/');

    const voice = this.#filtered.find((it) => `${it.name}/${it.lang}` === value);

    console.assert(voice, 'Voice not found');

    this.#selectedVoice = voice;

    this.#dispatchEvent(voice, value, ev);
  }

  #dispatchEvent (voice, value, originalEvent) {
    const event = new CustomEvent(this.#eventName, {
      detail: { voice, value, originalEvent }
    });
    this.#eventTarget.dispatchEvent(event);
    // console.debug('Dispatched:', voice, event);
  }

  #populateVoiceList (selectElem) {
    if (!this.#speechSynthesisSupported) {
      console.warn('speechSynthesis is not supported!');
      this.dataset.error = 'no-support';
      return;
    }

    this.#voices = speechSynthesis.getVoices();

    this.#filtered = this.#voices.filter((it) => this.#filterByLang(it));

    for (const voice of this.#filtered) {
      const option = document.createElement('option');
      option.textContent = `${voice.name} (${voice.lang})`;
      option.value = `${voice.name}/${voice.lang}`;

      if (voice.default) {
        option.textContent += ' — DEFAULT';
      }

      option.dataset.lang = voice.lang;
      option.dataset.name = voice.name;

      selectElem.appendChild(option);
    }

    if (this.#filtered.length) {
      this.dataset.ready = true;
    }
  }

  #speak (text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.#selectedVoice;
    speechSynthesis.speak(utterance);
    console.debug('Speak:', text);
  }

  #filterByLang (voice) {
    const RE = new RegExp(`^${this.#locale}`, 'i');
    return RE.test(voice.lang);
  }

  get #speechSynthesisSupported () {
    return typeof speechSynthesis !== 'undefined';
  }
}
