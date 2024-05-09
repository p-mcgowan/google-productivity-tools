const noRedirects = [
  '/media',
  '/gallery',
  '/poll',
];

chrome.storage.sync.get(['enabled'], (items) => {
  if (!items.enabled) {
    return;
  }
  // allow i.reddit redirects

  if (noRedirects.find(path => location.pathname.indexOf(path) === 0)) {
    return;
  }

  location.replace(location.href.replace(/https:\/\/(www|new)\.reddit/, 'https://old.reddit'));
});
