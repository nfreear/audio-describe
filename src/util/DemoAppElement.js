import { defineCustomElements, videoData } from '../util.js';

const { HTMLElement, location } = globalThis;

export class AppNotFoundError extends Error {
  constructor (query) {
    super(`App Error. Video data not found: "${query}"`);
    this.name = 'AppNotFoundError';
  }
}

/**
 * Demo app, optionally using a URL query parameter.
 *
 * @customElement demo-app
 * @copyright Nick Freear, 12-April-2026.
 */
export default class DemoAppElement extends HTMLElement {
  #errorEvent = 'sead-error';
  #localVttImport = '../../vtt-data/index.js';
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

  get #queryLocalVtt () { return new URLSearchParams(location.search).has('local'); }
  get #videoDataSrc () { return this.getAttribute('data-src') ?? this.#localVttImport; }

  get #alertElement () { return this.querySelector('[ role = alert ]'); }
  get #trackElement () { return this.querySelector('track[ kind = descriptions ]'); }
  get #mediaElement () { return this.querySelector(this.#mediaSelector); }
  get #voiceSelectElement () { return this.querySelector('voice-select'); }

  get #provider () { return this.#mediaElement.tagName.toLowerCase(); }

  #expectations () {
    console.assert(this.#query, 'Missing query');
    console.assert(this.#alertElement, 'Missing alert element');
    console.assert(this.#trackElement, 'Missing track element');
    console.assert(this.#mediaElement, 'Missing media element');
    console.assert(this.#voiceSelectElement, 'Missing voice-select');
    console.assert(this.#alertElement, 'Missing alert element');
    console.assert(this.#result, 'Missing media entry');
  }

  #handleError (error) {
    console.assert(this.#alertElement, 'Missing alert element');
    console.assert(error instanceof Error, 'Expecting Error instance');
    console.error(error);
    const { message, name, status } = error;
    this.dataset.error = name;
    this.dataset.errorMessage = message;
    if (status) { this.dataset.errorStatus = status; }
    document.documentElement.dataset.error = name;
    this.#alertElement.textContent = message;
  }

  async #importVendorLibs () {
    if (this.#provider !== 'video') {
      await import(`${this.#provider}-element`);
    }
    if (this.#mediaChrome) {
      await import('media-chrome');
    }
  }

  async connectedCallback () {
    this.addEventListener(this.#errorEvent, ({ error }) => this.#handleError(error));

    await this.#importVideoData();
    if (!this.#findVideo()) {
      return this.#handleError(new AppNotFoundError(this.#query));
    }
    this.#expectations();

    this.#trackElement.src = this.#result.trackUrl;
    this.#trackElement.srclang = this.#result.language ?? null;
    this.#mediaElement.setAttribute('src', this.#result.mediaUrl);
    this.#voiceSelectElement.setAttribute('locale', this.#voiceSelectLocale);

    await this.#importVendorLibs();

    defineCustomElements();

    this.dataset.trackLang = this.#result.language;

    console.debug('demo-app:', [this]);
  }

  get #voiceSelectLocale () {
    const lang = this.#result.language;
    // Reduce the number of English voices!
    return lang === 'en' ? 'en-(gb|ie|au)' : lang;
  }

  async #importVideoData () {
    let allData = videoData;
    if (this.#vendorVtt) {
      const { default: vendorData } = await import('vtt-data');
      allData = [...vendorData, ...videoData];
    }
    if (this.#queryLocalVtt) {
      const { default: localData } = await import(this.#videoDataSrc);
      allData = [...localData, ...videoData];
    }
    this.#videoData = allData;
  }

  #findVideo () {
    this.#result = this.#videoData.find((it) => it.id === this.#query);
    return this.#result;
  }
}
