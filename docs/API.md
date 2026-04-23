
←[Readme][]

# API

> Work-In-Progress!

There are two main components of the API: the [`SEADController`][#seadcontroller-class] core class, and the `<audio-describe-controller>` autonomous [custom element][]. The custom element is a wrapper around `SEADController`.

## Custom element example

Below is an example of using the `<audio-describe-controller>` custom element:

```html
<audio-describe-controller>
  <video src="path/to/video.mp4" controls>
    <track kind="descriptions" srclang="en" src="path/to/ext-audio-description.en.vtt">
  </video>
</audio-describe-controller>
```

Other elements can be substituted in place of `<video>` — see [Examples of supported `mediaElement`][#examples-of-supported-mediaelement] below.

### Importmap

```html
<script type="importmap">
{
  "imports": {
    "@plussub/srt-vtt-parser": "https://esm.sh/@plussub/srt-vtt-parser@^2"
    "audio-describe": "https://esm.sh/gh/nfreear/audio-describe"
  }
}
</script>
```

### Javascript

JavaScript to import and register the custom element:
```js
import { AudioDescribeElement } from 'audio-describe';

customElements.define('audio-describe-controller', AudioDescribeElement);
```

## `SEADController` class

The core `SEADController` JavaScript class constructor takes an `options` object as its only parameter. After calling the constructor, the `Promise<undefined> initialize()` method should be called.
```js
import SEADController from 'audio-describe';

const controller = new SEADController({
  mediaElement: document.querySelector('video'),
  trackUrl: 'path/to/ext-audio-description.en.vtt',
  isEnabledCallback:  () => { …; return true; }, // Return true or false.
  onStateChange: ({ state }) => { …; return undefined; }
});

await controller.initialize();
```

The `options` object has the following properties:

* `mediaElement` — `object` [documented below][#mediaelement-property].
* `trackUrl` — Defines the audio description WebVtt file or URL resource that we wish to fetch. Accepts any of the types supported by [`fetch`][fetch], including `string`, `URL` and [`Request`][request].
* `isEnabledCallback` — A function that has no arguments, and returns a `boolean` indicating whether audio description is enabled (for example, from the state of a checkbox). Evaluated before each call to the speech synthesis `speak` method.
* `onStateChange` — A function that has a single `event` parameter, and an `undefined` return. The event contains a `state` property, which indicates whether the video is currently paused for Extended Audio Description, or playing.

### `mediaElement` property

The `mediaElement` property is an instance of any class that extends [`HTMLElement`][HTMLElement], and supports a subset of the [`HTMLMediaElement`][HTMLMediaElement] API, as follows:

#### Methods
* [`addEventListener()`][addEventListener] — Register an event handler.
* [`Promise<undefined> play()`][play] — Play the video. Returns a `Promise`.
* [`undefined pause()`][pause] — Pause the video.

#### Properties
* [`double currentTime`][currentTime] — "A double-precision floating-point value indicating the current playback time in seconds;…" (often a _getter_)

#### Events
* [`timeupdate`][timeupdate] — "The current playback position changed as part of normal playback or…" (dispatched on `this`).

#### Examples of supported `mediaElement`

* [`<video>`][video] — The native HTML5 video element.
* [`<vimeo-video>`][vimeo-video] — "A custom element for the Vimeo player with an API that matches the `<video>` API."
* [`<youtube-video>`][youtube-video] — "A custom element for the YouTube player with an API that matches the `<video>` API."
* [`<videojs-video`][videojs-video] — _(Work-in-progress)_ "A custom element for Video.js with an API that matches the `<video>` API."

Note, in theory any of the custom video elements listed in [muxinc/media-elements][] repository on GitHub should work (_thank you [Mux Inc][]!_). They have _not_ been tested, except for the ones listed above.

←[Readme][]

[Readme]: https://github.com/nfreear/audio-describe#readme

[fetch]: https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch#resource
[Request]: https://developer.mozilla.org/en-US/docs/Web/API/Request
[custom element]: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
[EventTarget]: https://dom.spec.whatwg.org/#eventtarget
[addEventListener]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
[video]: https://html.spec.whatwg.org/multipage/media.html#the-video-element
[mdn:video]: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video
[HTMLElement]: https://html.spec.whatwg.org/multipage/dom.html#htmlelement
[mdn:HTMLElement]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
[HTMLMediaElement]: https://html.spec.whatwg.org/multipage/media.html#htmlmediaelement
[mdn:HTMLMediaElement]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
[play]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play
[pause]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause
[currentTime]: https://html.spec.whatwg.org/multipage/media.html#dom-media-currenttime
[mdn:currentTime]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime
[timeupdate]: https://html.spec.whatwg.org/multipage/media.html#event-media-timeupdate
[videojs-video]: https://www.media-chrome.org/docs/en/media-elements/videojs-video
[vimeo-video]: https://www.media-chrome.org/docs/en/media-elements/vimeo-video
[youtube-video]: https://www.media-chrome.org/docs/en/media-elements/youtube-video
[mux Inc]: http://mux.com/
[muxinc/media-elements]: https://github.com/muxinc/media-elements
