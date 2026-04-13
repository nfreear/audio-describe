import { AudioDescribeElement, VoiceSelectElement } from '../../index.js';
import findVideo from './videoData.js';

const { customElements, location } = globalThis;

/**
 * Demo app using a URL query parameter.
 *
 * @copyright Nick Freear, 12-April-2026.
 */
export default function queryApp () {
  const playerElem = document.querySelector('sead-player');
  const alertElem = document.querySelector('[ role = alert ]');
  const params = new URLSearchParams(location.search);
  const query = params.get('q') ?? 'default';

  console.assert(playerElem, 'Missing sead-player element');

  const found = findVideo(query);

  if (found) {
    playerElem.dataset.mediaUrl = found.mediaUrl;
    playerElem.dataset.trackUrl = found.trackUrl;
    playerElem.dataset.provider = found.provider;
  } else {
    document.documentElement.dataset.error = 'not-found';
    alertElem.textContent = `Error. Video not found: ${query}`;
    console.error('Error. Video not found:', query);
  }

  customElements.define('sead-player', AudioDescribeElement);
  customElements.define('voice-select', VoiceSelectElement);

  console.debug('queryApp:', query);
}
