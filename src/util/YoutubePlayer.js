/**
 * YoutubePlayer class that is compatible with Vimeo's Player interface.
 *
 * @see https://developers.google.com/youtube/iframe_api_reference
 * @see https://github.com/nfreear/elements/blob/main/src/components/MyYoutubeEmbedElement.js
 */
export default class YoutubePlayer {
  #ytJavaScript = 'https://www.youtube.com/iframe_api';
  #urlRegex = /(youtu.be\/|youtube.com\/watch\?v=)([\w-_]{11,})/;
  #player;
  #isReady = false;
  #opt;
  #listeners = [];

  get element () { return this.#player.g; } /** @TODO fragile? */

  on (event, handler) {
    console.assert(typeof handler === 'function', 'Expected function');
    this.#listeners.push({ event, handler });
    console.debug('on:', event, handler);
  }

  #callListener (eventName, eventPayload) {
    const found = this.#listeners.find((it) => it.event === eventName);
    console.assert(found, 'Listener not found');
    if (found) {
      found.handler(eventPayload);
    }
  }

  constructor (containerElem, options) {
    this.#opt = options;

    this.#onYouTubeIframeAPIReady(containerElem);

    window.addEventListener('message', (ev) => this.#onMessage(ev));

    this.#loadJavascript(document.body);
  }

  play () { this.#player.playVideo(); }
  pause () { this.#player.pauseVideo(); }

  async ready () {
    return new Promise((resolve) => {
      // if (this.#isReady)
      const intID = setInterval(() => {
        if (this.#isReady) {
          clearInterval(intID);
          resolve();
        }
      },
      100);
    });
  }

  #onYouTubeIframeAPIReady (playerElem) {
    window.onYouTubeIframeAPIReady = () => {
      const { YT } = window;
      this.#player = new YT.Player(playerElem, {
        height: this.#opt.height ?? 360,
        width: this.#opt.width ?? 640,
        videoId: this.#videoId, // 'M7lc1UVf-VE',
        playerVars: {
          playsinline: 1
        },
        events: {
          onReady: (ev) => this.#onPlayerReady(ev),
          // onStateChange: (ev) => this.#onPlayerStateChange(ev)
        }
      });
      console.debug('onYouTubeIframeAPIReady:', this);
    };
  }

  #onPlayerReady (ev) {
    this.#isReady = true;
    console.debug('onPlayerReady:', ev);
  }

  #onMessage (ev) {
    if (ev.origin !== 'https://www.youtube.com') {
      return; // Security!
    }
    const DATA = JSON.parse(ev.data);
    const { event, info } = DATA;
    if (event === 'infoDelivery') {
      const { currentTime } = info; // Float, seconds. (, progressState)
      this.#callListener('timeupdate', { seconds: currentTime, duration: this.#player.getDuration(), percent: null });
      // console.debug('message:', event, currentTime, info, ev);
    } else {
      console.debug('message:', event, info, ev);
    }
  }

  async #loadJavascript (parent) {
    const SCRIPT = document.createElement('script');
    SCRIPT.src = this.#ytJavaScript;
    parent.appendChild(SCRIPT);
  }

  get #videoId () {
    console.assert(this.#opt.url, 'Missing url');
    const M = this.#opt.url.match(this.#urlRegex);
    console.assert(M, `YouTube URL doesn't match: ${this.#opt.url}`);
    return M ? M[2] : null;
  }
}
