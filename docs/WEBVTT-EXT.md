
←[Readme][]

# Extending WebVTT, for Synthesised & Extended Audio Description

> Work-In-Progress!

This is a discussion document about proposed extensions to the [WebVTT 1][] standard to support Synthesised & [Extended Audio Description][wcag-u:ead].

## Why Synthesised & Extended Audio Description?

[Audio Description][wai:ad] is typically provided as an additional audio track to describe elements of a film, TV programme or video that can't be perceived by the user because of partial or total sight loss, and are not included in the existing audio.

However, on social media and the Web there are a number of challenges:

1. Videos are often of a short duration, with many short cuts, and few gaps in the existing audio.
2. Audio Description is often not [planned][wai:av-plan] as part of the production process. However, even when it is planned, point 1 still applies.
3. Recording an Audio Description track using a professional narrator is potentially costly.
4. Managing and delivering original and audio-described versions of a video to the user can be cumbersome.
5. Point 4 above can in theory be overcome using a player that supports toggling Audio Description on and off. Several platforms, including [YouTube][yt:ad] now support this, but it is a relatively recent and underused feature.

As a result of the above, and a general lack of awareness, the vast majority of videos on the Web are not audio described, depriving end-users of an equivalent and accessible experience.

The accepted way to overcome the lack of sufficient gaps in audio is [Extended Audio Description][wcag:u-ead], where the video is paused to allow a longer description to be uttered.

And, people including a Working Group at the W3C have proposed [text video description][w3c:tvd], which would enable screen reader software to speak the Audio Description to the user. The drawbacks to this include:

1. The video player on the web page does not have control over the precise time that the screen reader starts speaking. So, even if video is paused, the gap may be insufficient.
2. The video player does not have control of the speech rate.
3. Not all users who may benefit from Audio Description will necessarily have a screen reader installed, or have the screen reader switched on at the time when they encounter the video.

For these reasons, it is proposed that the [Speech Synthesis][cg:tts] engine built into [most][can-i:tts] modern Web browsers is used, instead of relying on the user's screen reader.

## Why WebVTT?

[WebVTT 1][] is a modern standard for the synchronisation, formatting and delivery of subtitles, captions and other textual data to accompany multimedia. It is published by the World Wide Web Consortium as a Candidate Recommendation in 2019.

←[Readme][]
[Readme]: https://github.com/nfreear/audio-describe#readme

[yt:ad]: https://support.google.com/youtube/answer/16166822
[wai:ad]: https://www.w3.org/WAI/media/av/description/
[wai:av-plan]: https://www.w3.org/WAI/media/av/planning/
[wcag:ead]: https://www.w3.org/TR/WCAG22/#extended-audio-description-prerecorded
  "WCAG 2.2, Success Criterion 1.2.7 Extended Audio Description (Prerecorded) - Level AAA"
[wcag-u:ead]: https://www.w3.org/WAI/WCAG22/Understanding/extended-audio-description-prerecorded.html
[3play:ead]: https://www.3playmedia.com/blog/does-your-video-need-extended-or-standard-description/
[whatwg:kind]: https://html.spec.whatwg.org/multipage/media.html#attr-track-kind-keyword-descriptions
[webvtt 1]: https://www.w3.org/TR/webvtt1/
  "WebVTT: The Web Video Text Tracks Format, W3C Candidate Recommendation 4 April 2019"
[vtt:meta]: https://www.w3.org/TR/webvtt1/#introduction-metadata

[cg:tts]: https://webaudio.github.io/web-speech-api/#tts-section
  "Web Speech API, Draft Community Group Report, 7 July 2025"
[can-i:tts]: https://caniuse.com/mdn-api_speechsynthesis
  "SpeechSynthesis API - Global: 95.77%"

[w3c:dv]: https://www.w3.org/TR/media-accessibility-reqs/#described-video
  "Media Accessibility User Requirements, W3C Working Group Note 03 December 2015"
[w3c:tvd]: https://www.w3.org/TR/media-accessibility-reqs/#text-video-description
[w3c:evd]: https://www.w3.org/TR/media-accessibility-reqs/#extended-video-descriptions
