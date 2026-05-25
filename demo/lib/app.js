import DemoAppElement from '../../src/util/DemoAppElement.js';
import MyIncludeElement from 'ndf-elements/my-include';

const myIncludeEl = document.querySelector('my-include');
myIncludeEl && myIncludeEl.addEventListener('ready', (ev) => {
  console.debug('my-include ready:', [ev.target], ev);
});

window.customElements.define('demo-app', DemoAppElement);
window.customElements.define('my-include', MyIncludeElement);
