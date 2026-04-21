import { parse } from '@plussub/srt-vtt-parser';

/**
 * Fetch and parse a WebVTT file, optionally containing JSON meta-data.
 *
 * @copyright Nick Freear, 10-April-2026.
 * @see https://w3.org/TR/webvtt1/#introduction-metadata
 * @see https://codepen.io/nfreear/pen/myrzjXz
 */
export default class MetaVttParser {
  #entries;
  #response;

  async fetchAndParse (resource, options) {
    const { fetch } = globalThis;

    this.#response = await fetch(resource, options);
    const rawVTT = await this.#response.text();
    // console.debug('Response:', response);
    return this.parse(rawVTT);
  }

  parse (rawString) {
    const output = parse(rawString);

    const entries = output.entries.map(({ from, to, text, id }) => {
      if (text.startsWith('{')) {
        const meta = JSON.parse(text);
        return { from, to, text: null, id, meta };
      } else {
        return { from, to, text, id, meta: null };
      }
    });
    this.#entries = entries;

    return { entries };
  }

  findByTime (seconds) {
    const millis = 1000 * parseInt(seconds);
    return this.#entries.find(({ from, to }) => millis >= from && millis <= to);
  }
}
