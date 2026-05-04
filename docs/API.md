
←[Readme][]

# API

> Work-In-Progress!

There are two main components of the API: the [`SEADController`](#seadcontroller-class) core class, and the `<audio-describe-controller>` autonomous [custom element][]. The custom element is a wrapper around `SEADController`.

## `SEADController` class

The core `SEADController` JavaScript class constructor takes an `options` object as its only parameter. After calling the constructor, the `initialize()` method should be called.

```js
import SEADController from 'audio-describe';

const controller = new SEADController({
  mediaElement: document.querySelector('video'),
  trackUrl: 'path/to/ext-audio-description.en.vtt',
  trackLang: 'en',
  isEnabledCallback:  () => { …; return true; }, // Return true or false.
  onStateChange: ({ state }) => { …; return undefined; }
});

// initialize returns Promise<undefined>.
await controller.initialize();
```

The `options` object has the following required properties:

* `mediaElement` — `object` [documented below](#mediaelement-property).
* `trackUrl` — Defines the audio description WebVTT file or URL resource that we wish to fetch. Accepts any of the types supported by [`fetch`][fetch], including `string`, `URL` and [`Request`][request].
* `trackLang` — The [BCP 47][] language tag for the human language of the WebVTT track. In general, prefer less-specific tags like `en` and `es` instead of the more specific, `en-gb` or `es-mx`. Exceptions include `zh-hans` for Simplified Chinese and `zh-hant` for Traditional Chinese.
* `isEnabledCallback` — A callback function that takes no arguments, and returns a `boolean` indicating whether audio description is enabled (for example, from the state of a checkbox). Evaluated before each call to the speech synthesis `speak` method.
* `onStateChange` — An event handler function that accepts a single `event` parameter, and has an `undefined` return. The event contains a `state` property, which indicates whether the video is currently paused for Extended Audio Description, or playing — `const { state } = event`.

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

* [`<video>`][video] — The native HTML5 video element — [video demo][].
* [`<vimeo-video>`][vimeo-video] — "A custom element for the Vimeo player with an API that matches the `<video>` API" — [Vimeo demo][].
* [`<youtube-video>`][youtube-video] — "A custom element for the YouTube player with an API that matches the `<video>` API" — [YouTube demo][].
* [`<videojs-video`][videojs-video] — _(Work-in-progress)_ "A custom element for Video.js with an API that matches the `<video>` API" — [Video.js demo][].

Note, in theory any of the custom video elements listed in [muxinc/media-elements][] repository on GitHub should work (_thank you [Mux Inc][]!_). They have _not_ been tested, except for the ones listed above.

## `<audio-describe-controller>` custom element

Below is an example of using the `<audio-describe-controller>` custom element:

```html
<audio-describe-controller>
  <video src="path/to/video.mp4" controls>
    <track kind="descriptions" srclang="en" src="path/to/ext-audio-description.en.vtt">
  </video>
</audio-describe-controller>
```

### Required child elements

The `<audio-describe-controller>` custom element has two required child elements:

* A `<video>` element, or another element that fulfills the [`mediaElement` requirements](#mediaelement-property).
* A `<track>` element, with a `kind` value of `descriptions` and `src` and `srclang` attributes.

Other elements can be substituted in place of `<video>` — see [Examples of supported `mediaElement`](#examples-of-supported-mediaelement) above.

### Optional attributes

The `<audio-describe-controller>` custom element has no required attributes. It has the following optional attributes:

* `media-selector` — A CSS selector to get the child `mediaElement`.
* `track-selector` — A CSS selector to get the child `<track>` element.

### Importmap

```html
<script type="importmap">
{
  "imports": {
    "@plussub/srt-vtt-parser": "https://esm.sh/@plussub/srt-vtt-parser@^2"
    "audio-describe": "https://esm.sh/audio-describe"
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

---
←[Readme][]

[Readme]: https://github.com/nfreear/audio-describe#readme

[cdn:un]: http://unpkg.com/audio-describe
[cdn:esm.sh]: https://esm.sh/audio-describe

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

[bcp 47]: https://developer.mozilla.org/en-US/docs/Glossary/BCP_47_language_tag
[rfc5646]: https://www.rfc-editor.org/info/rfc5646

[video demo]: https://nfreear.github.io/audio-describe/demo/
[youtube demo]: https://nfreear.github.io/audio-describe/demo/youtube.html
[vimeo demo]: https://nfreear.github.io/audio-describe/demo/vimeo.html
[video.js demo]: https://nfreear.github.io/audio-describe/demo/videojs.html
[mock demo]: https://nfreear.github.io/audio-describe/demo/mock.html
