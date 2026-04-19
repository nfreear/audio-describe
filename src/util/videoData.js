/**
 * Demo videos with WebVTT audio description tracks.
 */
const DATA = [
  {
    id: 'yt:uncrpd1',
    title: 'Committee on the Rights of Persons with Disabilities (CRPD), by UN Human Rights',
    rights: 'License: CC:BY',
    mediaUrl: 'https://www.youtube.com/watch?v=dX2zmMSLkj4',
    trackUrl: '../tracks/un-crpd.ext-ad.en.vtt',
    moreUrl: 'https://www.ohchr.org/TreatyBodies',
    provider: 'youtube'
  }, {
    // Important: put 'default' last!
    id: 'default',
    title: 'Sailing Bib Bear Lake from the sky, by Tim Hanley',
    rights: 'License: Public Domain (CC0)',
    mediaUrl: 'https://vimeo.com/1006361470',
    trackUrl: '../tracks/sailing-bib-bear.ext-ad.en.vtt',
    provider: 'vimeo'
  }
];

export function findVideo (query) {
  return DATA.find((it) => it.id === query);
}

export default DATA;
