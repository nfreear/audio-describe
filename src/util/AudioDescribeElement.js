import SEADController from '../ExAudioDescriptionPlayer.js';

const { HTMLElement } = globalThis;

/**
 * Custom element wrapper around SEADController.
 * @customElement audio-describe-controller
 */
export default class AudioDescribeControllerElement extends HTMLElement {
  #defaultSelector = 'video, audio, [src *= "vimeo.com"], [src *= "youtube.com"]';
  #seadController;

  get #mediaSelector () { return this.getAttribute('media-selector') ?? this.#defaultSelector; }

  get #mediaElement () { // 'https://vimeo.com/1006361470'
    return this.querySelector(this.#mediaSelector);
  }

  get #descriptionTracks () {
    return this.querySelectorAll('track[ kind = descriptions ][ src ]');
  }

  get #descriptionTrack () {
    return [...this.#descriptionTracks].find(it => it.srclang === this.#srclang);
  }

  get #srclang () { return this.getAttribute('srclang') ?? 'en'; }

  get #doNotTrack () { return this.hasAttribute('dnt'); }
  get #label () { return this.getAttribute('label') ?? 'Audio description'; }

  // get #iframeElem () { return this.shadowRoot.querySelector('iframe'); }

  #expectations () {
    console.assert(this.#mediaElement, 'Expecting a video, audio, vimeo-video, youtube-video element (or similar)');
    console.assert(this.#descriptionTrack, 'Expecting at least one <track> element with kind="descriptions"');
  }

  async connectedCallback () {
    this.#expectations();

    const root = this.attachShadow({ mode: 'open' });
    const { slot, label, checkbox } = this.#createElements();

    root.appendChild(label);
    root.appendChild(slot);
    // root.appendChild(container);

    // console.debug('src:', this.#descriptionTrack.src)

    this.#seadController = new SEADController({
      isEnabledCallback: () => checkbox.checked, // Evaluate each time "timeupdate" event is fired.
      onStateChange: (ev) => this.#onStateChange(ev),
      mediaElement: this.#mediaElement,
      trackUrl: this.#descriptionTrack.src
    });

    await this.#seadController.initialize();

    // this.#iframeElem.setAttribute('part', 'iframe');

    console.debug('sead-controller (V2):', [this]);
  }

  #createElements () {
    const slot = document.createElement('slot');
    const label = document.createElement('label');
    const span = document.createElement('span');
    const checkbox = document.createElement('input');
    // const container = document.createElement('div');

    span.textContent = this.#label;
    checkbox.type = 'checkbox';
    checkbox.checked = true;

    label.setAttribute('part', 'label');
    checkbox.setAttribute('part', 'checkbox input');

    label.appendChild(checkbox);
    label.appendChild(span);

    return { slot, label, checkbox };
  }

  #onStateChange (ev) {
    const { state } = ev;
    this.dataset.extState = state;
    console.debug('>> onStateChange ~ ext AD:', state, ev);
  }
}
