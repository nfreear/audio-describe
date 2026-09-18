const { customElements, document, HTMLElement } = globalThis;

/**
 *
 */
export default class EmojiFilterElement extends HTMLElement {
  #emojiArray = [];

  static define (tagName = 'emoji-filter') {
    customElements.define('emoji-filter', EmojiFilterElement);
  }

  static query (cssSelector = 'emoji-filter') {
    const result = document.querySelector(cssSelector);
    console.assert(result, `Element not found: ${cssSelector}`);
    return result;
  }

  set emojis (emojiArray) {
    console.assert(Array.isArray(emojiArray) && emojiArray.length, 'Missing emoji array');
    this.#emojiArray = emojiArray;
  }

  get emojis () { return this.#emojiArray; }

  get value () { return this.#elements.query.value; }

  // get #allEmoji () { return EMOJI; }
  get #op () { return 'filter'; }
  get #matcher () { return 'includes'; }
  get #field () { return 'subgroup'; }
  get #form () { return this.querySelector('form'); }
  get #elements () { return this.#form.elements; }
  get #input () { return this.#elements.query; }
  get #output () { return this.#elements.output; }
  get #area () { return this.#elements.area; }

  /** @TODO Doesn't work?!
  */
  get #emojiOp () {
    const func = this.emojis[this.#op];
    console.assert(typeof func === 'function', `Bad op: ${this.#op}`);
    return func;
  }

  #expectations () {
    console.assert(Array.isArray(this.emojis), 'Missing emoji');
    console.assert(this.#form, 'Missing form');
    console.assert(this.#input, 'Missing input');
    console.assert(this.#output, 'Missing output');
    console.assert(this.#area, 'Missing textarea');
  }

  connectedCallback () {
    this.#expectations();

    this.#form.addEventListener('submit', (ev) => this.#onSubmit(ev));

    console.debug('emoji-search:', [this]);
  }

  #sortByName (a, b) {
    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
  }

  #onSubmit (event) {
    event.preventDefault();

    const result = this.emojis[this.#op](it => it[this.#field].includes(this.value));

    result.sort((a, b) => this.#sortByName(a, b));

    this.#output.value = `${result.length} results`;
    this.#area.value = JSON.stringify(result, null, 2);

    console.debug('submit:', this.value, result.length, result, event);
  }
}
