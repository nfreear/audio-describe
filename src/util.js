/**
 * Utilities for SEAD project.
 *
 * @license MIT
 * @copyright Nick Freear, 10-April-2026.
 * @see https://github.com/nfreear/audio-describe
 */
import AudioDescribeElement from './util/AudioDescribeElement.js';
import { PushButtonElement, isOnCommand } from './util/PushButtonElement.js';
import VoiceSelectElement from './util/VoiceSelectElement.js';
import videoData from './util/videoData.js';

const { customElements } = globalThis;

export function defineCustomElements () {
  customElements.define('audio-describe-controller', AudioDescribeElement);
  customElements.define('push-button', PushButtonElement);
  customElements.define('voice-select', VoiceSelectElement);
}

export { AudioDescribeElement, PushButtonElement, VoiceSelectElement, videoData, isOnCommand };
