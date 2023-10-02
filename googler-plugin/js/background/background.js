/**
 * Handles omnibox stuff - runs the in background, functionality matches popup
 */
// Hash for suggestion data
const Data = { suggestions: {}, default: {} };

const encodeHTML = (str) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

chrome.omnibox.onInputChanged.addListener(async (text, suggest) => {
  const suggestions = await Suggester.getSuggestions(text);

  if (!suggestions.length) {
    return;
  }

  Data.suggestions = {};
  const omniSuggestions = [];
  for (const suggestion of suggestions) {
    const { content, description, type } = suggestion;
    Data.suggestions[content] = { content, description, type, url: content };
    omniSuggestions.push({ content, description });
  }

  Data.default = Data.suggestions[omniSuggestions[0].content];
  // console.log(omniSuggestions);
  suggest(omniSuggestions);
  chrome.omnibox.setDefaultSuggestion({ description: omniSuggestions[0].description });
});

chrome.omnibox.onInputEntered.addListener((content) => {
  const suggestion = Data.suggestions[content] || Data.default;

  // console.log(suggestion, content);
  // console.log(Data);

  switch (suggestion.type) {
    case 'bookmark':
      // Update the current tab's url
      chrome.tabs.getSelected(null, (tab) => {
        if (/^javascript/.test(suggestion.url)) {
          let code = suggestion.url.replace(/^\ *javascript\ *:\ */, '');
          code = code.replace(/%([a-zA-Z0-9]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
          chrome.tabs.executeScript(tab.id, { code }, console.log);
        } else {
          chrome.tabs.update(tab.id, { url: suggestion.url });
        }
      });
      break;
    case 'tab':
      // Change to the target tab (and window if applicable)
      chrome.windows.update(suggestion.windowId, { focused: true }, (w) => {
        chrome.tabs.update(suggestion.tabId, { active: true });
      });
      break;
    case 'history':
      // Update the current tab's url
      chrome.tabs.getSelected(null, (tab) => {
        chrome.tabs.update(tab.id, { url: suggestion.url });
      });
      break;
    case 'lucky':
      // Update the current tab's url
      chrome.tabs.getSelected(null, (tab) => {
        chrome.tabs.update(tab.id, { url: suggestion.url });
      });
      break;
  }
});
