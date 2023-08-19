chrome.storage.sync.get(['enabled'], (items) => {
  if (!items.enabled) {
    return;
  }
  // allow i.reddit redirects
  if (location.pathname.startsWith('/media') || location.pathname.startsWith('/gallery')) {
    return;
  }
  location.replace(location.href.replace(/https:\/\/(www|new)\.reddit/, 'https://old.reddit'));
});
