/* redirect to old reddit */
const rediretCallback = (details) => {
  chrome.storage.local.get(['enabled'], (items) => {
    return !items.enabled
      ? null
      : {
          redirectUrl: details.url.replace(/:\/\/(new|www)\.reddit\.com/, '://old.reddit.com'),
        };
  });
};

const filter = {
  urls: ['*://www.reddit.com/*', '*://new.reddit.com/*'],
  types: ['main_frame'],
};

const options = ['blocking'];

chrome.webRequest.onBeforeRequest.addListener(rediretCallback, filter, options);
