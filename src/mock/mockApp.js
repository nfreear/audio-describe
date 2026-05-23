import MockMediaElement from './MockMediaElement.js';
import SEADController from '../../index.js';
import { defineCustomElements, isOnCommand } from '../util.js';

export default async function mockWebApp (durationSeconds = 20) {
  defineCustomElements();

  const mockElement = new MockMediaElement(durationSeconds);

  const trackUrl = import.meta.resolve('../../tracks/example.ext-ad.en.vtt');
  const { playButton, outputElem } = mockAppElements();

  const seadController = new SEADController({
    mediaElement: mockElement,
    trackUrl,
    trackLang: 'en',
    isEnabledCallback: () => true,
    onStateChange: ({ state }) => { outputElem.dataset.extState = state; },
  });

  await seadController.initialize();

  playButton.addEventListener('click', async (ev) => {
    const METHOD = mockElement.paused ? 'play' : 'pause';

    await mockElement[METHOD]();
    /* WAS: if (mockElement.paused) {
      await mockElement.play();
    } else {
      mockElement.pause();
    } */
  });

  outputElem.addEventListener('command', (ev) => {
    outputElem.setAttribute('aria-live', isOnCommand(ev) ? 'polite' : 'off');
    console.debug('live region change:', ev.command, ev);
  });

  mockElement.addEventListener('timeupdate', (ev) => {
    const { currentTime } = ev.target;
    // Only update every second.
    if (currentTime === parseInt(currentTime)) {
      outputElem.value = `Current time: ${currentTime}s`;
    }
  });

  mockElement.addEventListener('ended', (ev) => {
    console.debug('ended:', mockElement);
    outputElem.value = 'The End.';
    outputElem.dataset.extState = 'ended';
  });

  console.debug('mock-app:', mockElement, seadController);
}

export function mockAppElements (appCssSelector = '#mock-app') {
  const appElem = document.querySelector(appCssSelector);
  console.assert(appElem, 'Missing app element');
  const playButton = appElem.querySelector('button');
  const outputElem = appElem.querySelector('output');
  const checkBox = appElem.querySelector('[ type = checkbox ]');

  return { appElem, playButton, outputElem, checkBox };
}

export { MockMediaElement, mockWebApp };
