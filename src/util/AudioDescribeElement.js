import SEADPlayer from '../ExAudioDescriptionPlayer.js';

const { HTMLElement } = globalThis;

/**
 * Custom element wrapper around SEADPlayer.
 * @customElement sead-player
 */
export default class AudioDescribeElement extends HTMLElement {
  #seadPlayer;

  get #mediaUrl () { return this.dataset.mediaUrl; } // 'https://vimeo.com/1006361470',
  get #trackUrl () { return this.dataset.trackUrl; }
  get #provider () { return this.dataset.provider; }

  get #doNotTrack () { return this.hasAttribute('dnt'); }
  get #label () { return this.getAttribute('label') ?? 'Audio description'; }

  get #iframeElem () { return this.shadowRoot.querySelector('iframe'); }

  async connectedCallback () {
    const root = this.attachShadow({ mode: 'open' });
    const { label, checkbox, container } = this.#createElements();

    root.appendChild(label);
    root.appendChild(container);

    this.#seadPlayer = new SEADPlayer(container, {
      isEnabledCallback: () => checkbox.checked, // Evaluate each time "timeupdate" event is fired.
      onStateChange: (ev) => this.#onStateChange(ev),
      provider: this.#provider,
      mediaUrl: this.#mediaUrl,
      trackUrl: this.#trackUrl,
      width: 640,
      dnt: this.#doNotTrack
    });

    await this.#seadPlayer.initialize();

    this.#iframeElem.setAttribute('part', 'iframe');

    console.debug('sead-player:', [this]);
  }

  #createElements () {
    const label = document.createElement('label');
    const span = document.createElement('span');
    const checkbox = document.createElement('input');
    const container = document.createElement('div');

    span.textContent = this.#label;
    checkbox.type = 'checkbox';
    checkbox.checked = true;

    label.setAttribute('part', 'label');
    checkbox.setAttribute('part', 'checkbox input');

    label.appendChild(checkbox);
    label.appendChild(span);

    return { label, checkbox, container };
  }

  #onStateChange (ev) {
    const { state } = ev;
    this.dataset.extState = state;
    console.debug('>> onStateChange ~ ext AD:', state, ev);
  }
}
