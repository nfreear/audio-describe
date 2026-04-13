import SEADPlayer from './src/ExAudioDescriptionPlayer.js';
import SynthAudioDescriber from './src/SynthAudioDescriber.js';
import MetaVttParser from './src/MetaVttParser.js';
import AudioDescribeElement from './src/util/AudioDescribeElement.js';
import VoiceSelectElement from './src/util/VoiceSelectElement.js';

const { customElements } = globalThis;

/**
 * @copyright Nick Freear, 10-April-2026.
 */
async function demoApp () {
  const audioDescribe = document.querySelector('#checkAD');
  const containerElem = document.querySelector('sead-player');

  customElements.define('sead-player', AudioDescribeElement);
  customElements.define('voice-select', VoiceSelectElement);

  const seadPlayer = new SEADPlayer(containerElem, {
    describeCallback: () => audioDescribe.checked,
    mediaUrl: containerElem.dataset.mediaUrl, // 'https://vimeo.com/1006361470',
    trackUrl: containerElem.dataset.trackUrl,
    width: 640,
    dnt: true
  });

  await seadPlayer.initialize();
}

export {
  demoApp, MetaVttParser, SynthAudioDescriber, AudioDescribeElement, VoiceSelectElement, SEADPlayer
};

export default SEADPlayer;
