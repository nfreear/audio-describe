import MockMediaElement from './MockMediaElement.js';
import SEADController, { VoiceSelectElement } from '../../index.js';

export default async function mockWebApp (durationSeconds = 20) {
  window.customElements.define('voice-select', VoiceSelectElement);

  const trackUrl = import.meta.resolve('../../tracks/example.ext-ad.en.vtt');
  const appElem = document.querySelector('#mock-app');
  const playButton = appElem.querySelector('button');
  const outputElem = appElem.querySelector('output');
  const checkBox = appElem.querySelector('[type = checkbox]');

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

  checkBox.addEventListener('change', (ev) => {
    const { checked } = ev.target;
    outputElem.setAttribute('aria-live', checked ? 'polite' : 'off');
    console.debug('live region change:', checked, ev);
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

export { MockMediaElement, mockWebApp };
