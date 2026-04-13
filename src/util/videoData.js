const DATA = [
  {
    id: 'vbde1',
    title: 'Christmas at …',
    mediaUrl: 'https://youtu.be/HgHj3g68Tr4',
    trackUrl: '../tracks/visit-britain-downton.ext-ad.en.vtt',
    provider: 'youtube'
  }, {
    // Important: put 'default' last!
    id: 'default',
    title: 'Sailing Bib Bear Lake from the sky, by Tim Hanley',
    mediaUrl: 'https://vimeo.com/1006361470',
    trackUrl: '../tracks/sailing-bib-bear.ext-ad.en.vtt',
    provider: 'vimeo'
  }
];

export default function findVideo (query) {
  return DATA.find((it) => it.id === query);
}
