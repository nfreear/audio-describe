import SEADPlayer from './src/ExAudioDescriptionPlayer.js';
import SynthAudioDescriber from './src/SynthAudioDescriber.js';
import MetaVttParser from './src/MetaVttParser.js';

/**
 * @copyright Nick Freear, 10-April-2026.
 */
async function demoApp () {
  const testButton = document.querySelector('#speakButton');
  const audioDescribe = document.querySelector('#checkAD');
  const containerElem = document.querySelector('sead-player');

  const seadPlayer = new SEADPlayer(containerElem, {
    describeCallback: () => audioDescribe.checked,
    mediaUrl: containerElem.dataset.mediaUrl, // 'https://vimeo.com/1006361470',
    trackUrl: containerElem.dataset.trackUrl,
    width: 640,
    dnt: true
  });

  await seadPlayer.initialize();

  testButton.addEventListener('click', (ev) => {
    seadPlayer.speak('Hello world!');
    console.debug('Click to speak:', ev);
  });
}

export {
  demoApp, MetaVttParser, SynthAudioDescriber, SEADPlayer
};

export default SEADPlayer;
