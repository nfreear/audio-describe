
[![Deploy][ci-badge]][ci]
[![VTT Deploy][ci-vtt-badge]][vtt-data]
[![NPM Version][npm-badge]][npm-pkg]
[![VTT Tracks][count-badge]][vtt-data]

# Synthesised & Extended Audio Description (SEAD)

__Experimental__: I have not (_yet much_) researched how acceptable synthesised speech is to end-users for audio description on the Web.

* Demo: [nfreear.github.io/audio-describe/demo][ghp]

## Usage

```sh
npm install audio-describe
```

### CDNs
* Unpkg.com: [unpkg.com/audio-describe][cdn:un]
* esm.sh: [esm.sh/audio-describe][cdn:esm.sh]

### Javascript
JavaScript to import and register the `audio-describe-controller` custom element:
```js
import { AudioDescribeElement } from 'audio-describe';

customElements.define('audio-describe-controller', AudioDescribeElement);
```

### HTML
```html
<audio-describe-controller>
  <video src="path/to/video.mp4" controls>
    <track kind="descriptions" srclang="en" src="path/to/ext-audio-description.en.vtt">
  </video>
</audio-describe-controller>
```

Other elements can be substituted in place of `<video>`, to support for example, YouTube, Vimeo, and Video.js — see [`mediaElement` property][mediaElement] in the API.

## Problem

Organisations frequently produce short videos for social media and the Web, with many short cuts and few gaps in the audio track. Even with the benefit of [planning][wai:av-plan], it would be hard to find spaces for standard audio description.

## Proposed Solution

The proposed solution combines:

* [Extended audio description][wcag-u:ead]
* [WebVTT tracks for '_descriptions_'][whatwg:kind]
* [WebVTT files containing JSON metadata][vtt:meta]
* [Speech Synthesis Web API][mdn:synth] ([widely supported][can-i:synth])

## Documentation

> Work-In-Progress!

* [Background][doc:background]
* [WebVTT extension, for Synthesised & Extended Audio Description][doc:vtt-ext]
* [API][doc:api]

## WebVTT

An example of [WebVTT][vtt:meta] containing extended audio description and metadata:

```vtt
WEBVTT

...

4
00:00:16.000 --> 00:00:17.000
The next line is extended audio description!

5
00:00:18.000 --> 00:00:18.400
Now the yacht is sailing down wind, parallel with the shore.

6
00:00:18.600 --> 00:00:19.100
{
  "pauseMedia": 3000
}

7
00:00:21.000 --> 00:00:22.000
End of extended audio description.
```

More [example VTT][vtt-data].

## License

* License: [MIT][]

[mit]: https://github.com/nfreear/audio-describe/blob/main/LICENSE
[doc:vtt-ext]: https://github.com/nfreear/audio-describe/blob/main/docs/WEBVTT-EXT.md
[doc:api]: https://github.com/nfreear/audio-describe/blob/main/docs/API.md
[doc:background]: https://github.com/nfreear/audio-describe/blob/main/docs/BACKGROUND.md
[mediaElement]: https://github.com/nfreear/audio-describe/blob/main/docs/API.md#mediaelement-property

[wai:av-plan]: https://www.w3.org/WAI/media/av/planning/
[wcag:ead]: https://www.w3.org/TR/WCAG22/#extended-audio-description-prerecorded
  "WCAG 2.2, Success Criterion 1.2.7 Extended Audio Description (Prerecorded) - Level AAA"
[wcag-u:ead]: https://www.w3.org/WAI/WCAG22/Understanding/extended-audio-description-prerecorded.html
[3play:ead]: https://www.3playmedia.com/blog/does-your-video-need-extended-or-standard-description/
[whatwg:kind]: https://html.spec.whatwg.org/multipage/media.html#attr-track-kind-keyword-descriptions
[vtt:meta]: https://www.w3.org/TR/webvtt1/#introduction-metadata
[mdn:synth]: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
[can-i:synth]: https://caniuse.com/mdn-api_speechsynthesis
  "SpeechSynthesis API - Global: 95.77%"

[ghp]: https://nfreear.github.io/audio-describe/demo/
[ci]: https://github.com/nfreear/audio-describe/actions/workflows/node.js.yml
[ci-badge]: https://github.com/nfreear/audio-describe/actions/workflows/node.js.yml/badge.svg

[vtt-data]: https://github.com/nfreear/vtt-data.git
[count-badge]: https://nfreear.github.io/vtt-data/badge.svg
[ci-vtt]: https://github.com/nfreear/vtt-data/actions/workflows/node.js.yml
  "Deploy VTT-data"
[ci-vtt-badge]: https://github.com/nfreear/vtt-data/actions/workflows/node.js.yml/badge.svg
  "Deploy VTT-data"

[npm-pkg]: https://www.npmjs.com/package/audio-describe
[npm-badge]: https://img.shields.io/npm/v/audio-describe

[cdn:un]: http://unpkg.com/audio-describe
[cdn:esm.sh]: https://esm.sh/audio-describe
