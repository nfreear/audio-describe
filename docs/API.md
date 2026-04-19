
←[Readme][]

# API

> Work-In-Progress!

## Custom element example

Below is an example of using the `<audio-describe-controller>` custom element:

```html
<audio-describe-controller>
  <video src="path/to/video.mp4" controls>
    <track kind="descriptions" srclang="en" src="path/to/ext-audio-description.en.vtt">
  </video>
</audio-describe-controller>
```

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

```js
import { AudioDescribeElement } from 'audio-describe';

customElements.define('audio-describe-controller', AudioDescribeElement);
```

## `SEADController`

```js
import SEADController from 'audio-describe';

const controller = new SEADController({
  mediaElement: document.querySelector('video'),
  trackUrl: 'path/to/ext-audio-description.en.vtt',
  isEnabledCallback: () => { ...; return true; },
  onStateChange: (ev) => { ... }
});

await controller.initialize();
```

### `mediaElement`

The `mediaElement` parameter is an instance of any class that extends [`HTMLElement`][HTMLElement], and supports the following:

#### Methods
* `addEventListener()`
* [`pause()`][pause] — Pauses the video.
* [`play()`][play] — Plays the video.

#### Properties
* [`currentTime`][currentTime] — "A double-precision floating-point value indicating the current playback time in seconds;…"

#### Events
* [`timeupdate`][timeupdate] — "The current playback position changed as part of normal playback or…"

#### Examples of `mediaElement`

* [`<video>`][video] — The native HTML video element.
* [`<vimeo-video>`][vimeo-video] — "A custom element for the Vimeo player with an API that matches the `<video>` API."
* [`<youtube-video>`][youtube-video] — "A custom element for the YouTube player with an API that matches the `<video>` API."
* [`<videojs-video`][videojs-video] — _(Work-in-progress)_ "A custom element for Video.js with an API that matches the `<video>` API."

←[Readme][]
[Readme]: https://github.com/nfreear/audio-describe#readme

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
[currentTime]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime
[timeupdate]: https://html.spec.whatwg.org/multipage/media.html#event-media-timeupdate
[videojs-video]: https://www.media-chrome.org/docs/en/media-elements/videojs-video
[vimeo-video]: https://www.media-chrome.org/docs/en/media-elements/vimeo-video
[youtube-video]: https://www.media-chrome.org/docs/en/media-elements/youtube-video
