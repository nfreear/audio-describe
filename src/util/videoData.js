/**
 * Demo videos with WebVTT audio description tracks.
 */
const DATA = [
  {
    id: 'yt:uncrpd1',
    title: 'Committee on the Rights of Persons with Disabilities (CRPD), by UN Human Rights',
    rights: 'License: CC:BY',
    mediaUrl: 'https://www.youtube.com/watch?v=dX2zmMSLkj4',
    trackUrl: import.meta.resolve('../../tracks/un-crpd.ext-ad.en.vtt'),
    language: 'en',
    moreUrl: 'https://www.ohchr.org/TreatyBodies',
    duration: '00:38',
    provider: 'youtube'
  }, {
    // Important: put 'default' last!
    id: 'default',
    title: 'Sailing Bib Bear Lake from the sky, by Tim Hanley',
    rights: 'License: Public Domain (CC0)',
    mediaUrl: 'https://vimeo.com/1006361470',
    trackUrl: import.meta.resolve('../../tracks/sailing-bib-bear.ext-ad.en.vtt'),
    language: 'en',
    duration: '01:39',
    provider: 'vimeo'
  }
];

export function findVideo (query) {
  return DATA.find((it) => it.id === query);
}

export default DATA;
