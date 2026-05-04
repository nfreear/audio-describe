import SEADController from '../ExAudioDescriptionPlayer.js';

const { HTMLElement } = globalThis;

/**
 * Autonomous custom element wrapper around SEADController.
 * @customElement audio-describe-controller
 */
export default class AudioDescribeControllerElement extends HTMLElement {
  #defaultMediaSelector = 'video, audio, [src *= "vimeo.com"], [src *= "youtube.com"]';
  #defaultTrackSelector = 'track[ kind = descriptions ][ src ][ srclang ]'; // 'srclang' is required!
  #seadController;

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
    console.assert(this.#descriptionTrack.srclang, 'Expecting <track> element to have a "srclang" attribute')
  }

  async connectedCallback () {
    this.#expectations();

    const root = this.attachShadow({ mode: 'open' });
    const { slot, label, checkbox } = this.#createElements();

    root.appendChild(label);
    root.appendChild(slot);

    this.#seadController = new SEADController({
      isEnabledCallback: () => checkbox.checked, // Evaluate each time "timeupdate" event is fired.
      onStateChange: (event) => this.#onStateChange(event),
      mediaElement: this.#mediaElement,
      trackUrl: this.#descriptionTrack.src,
      trackLang: this.#descriptionTrack.srclang
    });

    await this.#seadController.initialize();

    console.debug('audio-describe-controller:', [this]);
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
}
