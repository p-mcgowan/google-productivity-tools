chrome.storage.sync.get(['enabled'], (items) => {
  if (!items.enabled) {
    return;
  }
  location.replace(location.href.replace(/https:\/\/(www|new)\.reddit/, 'https://old.reddit'));
});
