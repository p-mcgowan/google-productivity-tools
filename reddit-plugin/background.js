/* redirect to old reddit */
const rediretCallback = (details) => {
  if (localStorage.getItem('nored')) {
    return;
  }
  return { redirectUrl: details.url.replace(/:\/\/(new|www)\.reddit\.com/, '://old.reddit.com') };
};

const filter = {
  urls: ["*://www.reddit.com/*", "*://new.reddit.com/*"],
  types: ["main_frame"]
};

const options = ["blocking"];

chrome.webRequest.onBeforeRequest.addListener(rediretCallback, filter, options);
