import { AudioDescribeElement, VoiceSelectElement } from '../../index.js';
import findVideo from './videoData.js';

const { customElements, HTMLElement, location } = globalThis;

/**
 * Demo app, optionally using a URL query parameter.
 *
 * @copyright Nick Freear, 12-April-2026.
 */
export default class DemoAppElement extends HTMLElement {
  get #mediaChrome () { return this.hasAttribute('media-chrome'); }
  get #mediaSelector () { return this.getAttribute('media-selector') ?? 'video'; }
  get #defaultId () { return this.getAttribute('default-id') ?? 'default'; }
  get #query () {
    const params = new URLSearchParams(location.search);
    return params.get('q') ?? this.#defaultId;
  }

  get #alertElement () { return this.querySelector('[ role = alert ]'); }
  get #trackElement () { return this.querySelector('track[ kind = descriptions ]'); }
  get #mediaElement () { return this.querySelector(this.#mediaSelector); }
  get #data () { return findVideo(this.#query); }

  #expectations () {
    console.assert(this.#query, 'Missing query');
    console.assert(this.#alertElement, 'Missing alert element');
    console.assert(this.#trackElement, 'Missing track element');
    console.assert(this.#mediaElement, 'Missing media element');
    console.assert(this.#data, 'Missing media entry');
  }

  #handleNotFoundError () {
    console.assert(this.#alertElement, 'Missing alert element');
    document.documentElement.dataset.error = 'not-found';
    this.#alertElement.textContent = `Error. Video not found: ${this.#query}`;
    console.error('Error. Video not found:', this.#query);
  }

  async #importVendorLibs () {
    await import(`${this.#mediaSelector}-element`);
    if (this.#mediaChrome) {
      await import('media-chrome');
    }
  }

  async connectedCallback () {
    if (!this.#data) {
      return this.#handleNotFoundError();
    }
    this.#expectations();

    this.#trackElement.src = this.#data.trackUrl;
    this.#mediaElement.setAttribute('src', this.#data.mediaUrl);

    customElements.define('voice-select', VoiceSelectElement);

    await this.#importVendorLibs();

    customElements.define('audio-describe-controller', AudioDescribeElement);

    console.debug('demo-app:', [this]);
  }
}
