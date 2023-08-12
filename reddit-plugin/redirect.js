chrome.storage.sync.get(['enabled'], (items) => {
  if (!items.enabled) {
    return;
  }
  // allow i.reddit redirects
  if (location.pathname.startsWith('/media')) {
    return;
  }
  location.replace(location.href.replace(/https:\/\/(www|new)\.reddit/, 'https://old.reddit'));
});
