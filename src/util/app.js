import { AudioDescribeElement, VoiceSelectElement } from '../../index.js';
import videoData from './videoData.js';

const { customElements, HTMLElement, location } = globalThis;

/**
 * Demo app, optionally using a URL query parameter.
 *
 * @copyright Nick Freear, 12-April-2026.
 */
export default class DemoAppElement extends HTMLElement {
  #videoData;
  #result;

  get #vendorVtt () { return this.hasAttribute('vendor-vtt'); }
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

  #expectations () {
    console.assert(this.#query, 'Missing query');
    console.assert(this.#alertElement, 'Missing alert element');
    console.assert(this.#trackElement, 'Missing track element');
    console.assert(this.#mediaElement, 'Missing media element');
    console.assert(this.#result, 'Missing media entry');
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
    await this.#importFindVideo();
    if (!this.#result) {
      return this.#handleNotFoundError();
    }
    this.#expectations();

    this.#trackElement.src = this.#result.trackUrl;
    this.#mediaElement.setAttribute('src', this.#result.mediaUrl);

    customElements.define('voice-select', VoiceSelectElement);

    await this.#importVendorLibs();

    customElements.define('audio-describe-controller', AudioDescribeElement);

    console.debug('demo-app:', [this]);
  }

  async #importFindVideo () {
    let allData = videoData;
    if (this.#vendorVtt) {
      const { default: vendorData } = await import('vtt-data');
      allData = [...vendorData, ...videoData];
    }
    this.#videoData = allData;
    this.#result = this.#videoData.find((it) => it.id === this.#query);
    return this.#result;
  }
}
