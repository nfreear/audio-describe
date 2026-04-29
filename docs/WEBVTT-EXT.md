
←[Readme][]

# Extending WebVTT, for Synthesised & Extended Audio Description

> Work-In-Progress!

This is a discussion document about proposed extensions to the [WebVTT 1][] standard to support Synthesised & [Extended Audio Description][wcag-u:ead].

## Why WebVTT?

[WebVTT 1][] is a modern standard for the synchronisation, formatting and delivery of subtitles, captions and other textual data to accompany multimedia. It was published by the World Wide Web Consortium as a Candidate Recommendation in 2019.

[Section 1.7][vtt:meta] of the WebVTT standards gives an example of a VTT file containing time-aligned metadata. It states that, "Metadata can be any string and is often provided as a JSON construct."

There are third-party, open source software libraries, including JavaScript ones such as [@plussub/srt-vtt-parser][] that are available to parse WebVTT files. Popular video-sharing sites such as [YouTube][youtube:vtt] and [Vimeo][vimeo:vtt] support WebVTT, and there are online [editors and other tools][search:vtt editor].

Finally, the [kind][whatwg:kind] attribute for the `<track>` element in HTML can have values of `descriptions` for audio description, and `metadata`.

For the reasons above, WebVTT is an obvious candidate for proposed extensions to support Extended Audio Description.

## Proposal 1: EAD text separate from metadata

```vtt
WEBVTT

…

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

←[Readme][]

[Readme]: https://github.com/nfreear/audio-describe#readme

[whatwg:kind]: https://html.spec.whatwg.org/multipage/media.html#attr-track-kind-keyword-descriptions
[webvtt 1]: https://www.w3.org/TR/webvtt1/
  "WebVTT: The Web Video Text Tracks Format, W3C Candidate Recommendation 4 April 2019"
[vtt:meta]: https://www.w3.org/TR/webvtt1/#introduction-metadata

[@plussub/srt-vtt-parser]: https://www.npmjs.com/package/@plussub/srt-vtt-parser
[gh:srt-vtt-parser]: https://github.com/plussub/srt-vtt-parser
[search:vtt editor]: https://duckduckgo.com/?q=VTT+editor&ia=web
[youtube:vtt]: https://support.google.com/youtube/answer/2734698?hl=en#zippy=%2Cadvanced-file-formats
[vimeo:vtt]: https://help.vimeo.com/hc/en-us/articles/21956884955537-How-to-add-captions-or-subtitles-to-my-video#h_01JJZA1ETEF5C0RCR1Z2WASC4D

[w3c:dv]: https://www.w3.org/TR/media-accessibility-reqs/#described-video
  "Media Accessibility User Requirements, W3C Working Group Note 03 December 2015"
[w3c:tvd]: https://www.w3.org/TR/media-accessibility-reqs/#text-video-description
[w3c:evd]: https://www.w3.org/TR/media-accessibility-reqs/#extended-video-descriptions
