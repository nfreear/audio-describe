import Player from '@vimeo/player';
import SynthAudioDescriber from './src/SynthAudioDescriber.js';

/**
 * @copyright Nick Freear, 10-April-2026.
 */
export default async function demoApp (url) {
  const speakButton = document.querySelector('#speakButton');
  const audioDescribe = document.querySelector('#checkAD');
  const containerElem = document.querySelector('my-player');

  const player = new Player(containerElem, {
    url, // : 'https://vimeo.com/1006361470',
    width: 640
  });

  const trackUrl = containerElem.dataset.trackUrl;

  const describer = new SynthAudioDescriber(trackUrl);
  await describer.fetchAndParse();

  player.on('timeupdate', (ev) => describer.onTimeupdateEvent(ev, audioDescribe.checked));
  player.on('play', (ev) => console.debug('Play video:', player.element.title, ev));
  player.on('error', (ev) => console.error('Vimeo Error:', ev));

  await player.ready();

  console.debug('Vimeo player ready:', player);

  speakButton.addEventListener('click', (ev) => {
    describer.speak('Hello world!');
    console.debug('Click to speak:', ev);
  });
}
