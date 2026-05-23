const { CommandEvent, HTMLElement } = globalThis;

/**
 * @customElement push-button
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API
 * @see https://w3c.github.io/aria/#aria-pressed
 */
export default class PushButtonElement extends HTMLElement {
  #target = document;
  // #initial = false;
  #button;

  get #command () { return this.getAttribute('command') ?? '--on'; }
  get #commandOff () { return this.getAttribute('command-off') ?? '--off'; }

  get #commandForElement () {
    const commandForID = this.getAttribute('commandfor');
    const ELEM = this.#target.getElementById(commandForID);
    console.assert(ELEM, 'Missing commandForElement');
    return ELEM;
  }

  get #initialTrue () {
    const initial = this.getAttribute('initial');
    return /true|on/.test(initial);
  }

  connectedCallback () {
    const root = this.attachShadow({ mode: 'open' });
    const button = this.#button = document.createElement('button');
    const slot = document.createElement('slot');

    root.appendChild(button);
    button.appendChild(slot);

    button.type = 'button';
    button.setAttribute('aria-pressed', this.#initialTrue);
    button.setAttribute('part', `button ${this.#initialTrue ? 'true on' : 'false off'}`);

    button.addEventListener('click', (ev) => this.#onClickEvent(ev));

    console.debug('push-button:', this.#commandForElement, [this]);
  }

  #onClickEvent (event) {
    const isTrue = this.#button.getAttribute('aria-pressed') === 'true';

    this.#button.setAttribute('aria-pressed', !isTrue);
    this.#button.setAttribute('part', `button ${isTrue ? 'false off' : 'true on'}`);

    const cmdEvent = this.#dispatchCommandEvent(isTrue);

    console.debug('click:', !isTrue, cmdEvent);
  }

  #dispatchCommandEvent (isTrue) {
    const cmdEvent = new CommandEvent('command', {
      command: isTrue ? this.#commandOff : this.#command,
      source: this.#button
    });
    this.#commandForElement.dispatchEvent(cmdEvent);
    return cmdEvent;
  }
}
