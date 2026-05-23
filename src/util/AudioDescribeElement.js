import SEADController from '../ExAudioDescriptionPlayer.js';

const { HTMLElement } = globalThis;

export class SEADErrorEvent extends Event {
  #error;
  get error () { return this.#error; }
  constructor (error) {
    console.assert(error instanceof Error, 'Expecting Error');
    super('sead-error', { bubbles: true, composed: true });
    this.#error = error;
  }
}

/**
 * Autonomous custom element wrapper around SEADController.
 * @customElement audio-describe-controller
 */
export default class AudioDescribeControllerElement extends HTMLElement {
  #defaultMediaSelector = 'video, audio, [src *= "vimeo.com"], [src *= "youtube.com"]';
  #defaultTrackSelector = 'track[ kind = descriptions ][ src ][ srclang ]'; // 'srclang' is required!
  #seadController;
  #isEnabled = true;

  get #controls () { return this.hasAttribute('controls'); }
  get #mediaSelector () { return this.getAttribute('media-selector') ?? this.#defaultMediaSelector; }
  get #trackSelector () { return this.getAttribute('track-selector') ?? this.#defaultTrackSelector; }

  // Was: get #doNotTrack () { return this.hasAttribute('dnt'); }
  get #label () { return this.getAttribute('label') ?? 'Audio description'; }

  get #mediaElement () {
    return this.querySelector(this.#mediaSelector);
  }

  get #descriptionTracks () {
    return this.querySelectorAll(this.#trackSelector);
  }

  get #descriptionTrack () {
    return this.#descriptionTracks[0];
    // Was: return [...this.#descriptionTracks].find(it => it.srclang === this.#srclang);
  }

  #expectations () {
    console.assert(this.#mediaElement, 'Expecting a video, audio, vimeo-video, youtube-video element (or similar)');
    console.assert(this.#descriptionTrack, 'Expecting at least one <track> element with kind="descriptions", src and srclang attributes');
    console.assert(this.#descriptionTrack.srclang, 'Expecting <track> element to have a "srclang" attribute');
  }

  async connectedCallback () {
    this.#expectations();
    this.#createControls();

    this.#seadController = new SEADController({
      isEnabledCallback: () => this.#isEnabled, // Was: checkbox.checked, // Evaluate each time "timeupdate" event is fired.
      onStateChange: (event) => this.#onStateChange(event),
      mediaElement: this.#mediaElement,
      trackUrl: this.#descriptionTrack.src,
      trackLang: this.#descriptionTrack.srclang
    });

    try {
      await this.#seadController.initialize();
    } catch (error) {
      this.#handleError(error);
    }

    this.addEventListener('command', (ev) => this.#onCommandEvent(ev));

    console.debug('audio-describe-controller:', [this]);
  }

  #handleError (error) {
    console.error(error);
    this.dataset.error = error.name;
    this.dispatchEvent(new SEADErrorEvent(error));
    // throw error;
  }

  #createControls () {
    if (this.#controls) {
      const root = this.attachShadow({ mode: 'open' });
      const { slot, label, checkbox } = this.#createElements();
      this.#checkboxEvent(checkbox);

      root.appendChild(label);
      root.appendChild(slot);
    }
  }

  #createElements () {
    const slot = document.createElement('slot');
    const label = document.createElement('label');
    const span = document.createElement('span');
    const checkbox = document.createElement('input');

    span.textContent = this.#label;
    checkbox.type = 'checkbox';
    checkbox.checked = true;

    label.setAttribute('part', 'label');
    checkbox.setAttribute('part', 'checkbox input');

    label.appendChild(checkbox);
    label.appendChild(span);

    return { slot, label, checkbox };
  }

  #onStateChange (event) {
    const { state } = event;
    this.dataset.extState = state;
    console.debug('>> onStateChange ~ ext AD:', state, event);
  }

  #checkboxEvent (cbElem) {
    cbElem.addEventListener('change', () => { this.#isEnabled = cbElem.checked; });
  }

  #onCommandEvent (event) {
    const { command } = event;
    switch (command) {
      case '--on':
        this.#isEnabled = true;
        break;
      case '--off':
        this.#isEnabled = false;
        break;
      default:
        throw new Error(`Unexpected command: ${command}`);
    }
    console.debug('command:', command, event);
  }
}
