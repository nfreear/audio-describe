import MockMediaElement from './MockMediaElement.js';
import SEADController, { VoiceSelectElement } from '../../index.js';

export default async function mockWebApp (durationSeconds = 20) {
  window.customElements.define('voice-select', VoiceSelectElement);

  const trackUrl = import.meta.resolve('../../tracks/example.ext-ad.en.vtt');
  const appElem = document.querySelector('#mock-app');
  const playButton = appElem.querySelector('button');
  const outputElem = appElem.querySelector('output');

  const mockElement = new MockMediaElement(durationSeconds);

  const seadController = new SEADController({
    mediaElement: mockElement,
    trackUrl,
    trackLang: 'en',
    isEnabledCallback: () => true,
    onStateChange: ({ state }) => { outputElem.dataset.extState = state; },
  });

  await seadController.initialize();

  playButton.addEventListener('click', async (ev) => {
    if (mockElement.paused) {
      await mockElement.play();
    } else {
      mockElement.pause();
    }
  });

  mockElement.addEventListener('timeupdate', (ev) => {
    outputElem.value = `Current time: ${mockElement.currentTime}s`;
  });

  console.debug('mock-app:', mockElement, seadController);
}

export { MockMediaElement, mockWebApp };
