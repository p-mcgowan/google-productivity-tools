/**
 * Handles all the popup stuff (usually activated by the keyboard)
 */

const onSelect = (index, ctrl, shift) => {
  loadingSuggestions
    .then(() => {
      let suggestion = suggestionResults[index];
      if (!suggestion) {
        return;
      }

      switch (suggestion.type) {
        case 'bookmark':
          // Update the current tab's url, or if ctrl-enter pressed, a new tab
          if (!ctrl) {
            chrome.tabs.getSelected(null, (tab) => {
              if (/^javascript/.test(suggestion.url)) {
                let code = suggestion.url.replace(/^\ *javascript\ *:\ */, '');
                code = code.replace(/%([a-zA-Z0-9]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
                chrome.tabs.executeScript(tab.id, { code }, console.log);
              } else {
                chrome.tabs.update(tab.id, { url: suggestion.url });
              }
              window.close();
            });
          } else {
            chrome.tabs.create({ url: suggestion.url, active: shift });
          }
          break;
        case 'tab':
          // Change to the target tab (and window if applicable)
          chrome.windows.update(suggestion.windowId, { focused: true }, (w) => {
            chrome.tabs.update(suggestion.tabId, { active: true });
            window.close();
          });
          break;
        case 'history':
          // Update the current tab's url
          if (!ctrl) {
            chrome.tabs.getSelected(null, (tab) => {
              chrome.tabs.update(tab.id, { url: suggestion.url });
              window.close();
            });
          } else {
            chrome.tabs.create({ url: suggestion.url, active: shift });
          }
          break;
        case 'lucky':
          // Update the current tab's url
          if (!ctrl) {
            chrome.tabs.getSelected(null, (tab) => {
              chrome.tabs.update(tab.id, { url: suggestion.url });
              window.close();
            });
          } else {
            chrome.tabs.create({ url: suggestion.url, active: shift });
          }
          break;
        default:
          // probably some kind of error...
          console.log({
            index,
            suggestionResults,
            error: `Uknown suggestion type: ${suggestion.type}`,
            suggestion,
          });
          return;
      }
    })
    .catch((e) => {
      console.trace.bind(window.console)(e);
      reject(e);
    });
};

let suggestionResults = [];

const doSuggestions = async (e, text) => {
  suggestionResults.length = 0;

  suggestionResults = await Suggester.getSuggestions(text);
  console.log({ text, suggestionResults });
  const results = document.getElementById('modalResults');
  results.innerHTML = '';
  selectIndex = 0;

  for (let i = 0; i < suggestionResults.length; i++) {
    const result = suggestionResults[i];

    const el = document.createElement('div');
    el.classList.add('selection');
    el.innerHTML = result.display;
    el.title = `${result.description} [${/^javascript:/.test(result.content) ? 'bookmarklet' : result.content}]`;

    el.setAttribute('number', i);
    el.addEventListener('click', () => onSelect(el.getAttribute('number'), e.ctrlKey, e.shiftKey));
    el.addEventListener('mouseenter', () => {
      selectIndex = i;
      updateActive();
    });

    results.appendChild(el);
  }

  updateActive();
};

let selectIndex = 0;
let loadingSuggestions = Promise.resolve();

const updateActive = () => {
  const suggestionElements = document.querySelectorAll('.selection');
  if (!suggestionElements?.length) {
    return;
  }
  document.querySelector('.selection[selected]')?.removeAttribute?.('selected');
  suggestionElements[selectIndex].setAttribute('selected', '');
};

document.onkeydown = (e) => {
  switch (e.key) {
    case 'ArrowDown':
      selectIndex = (selectIndex + 1) % suggestionResults.length;
      e.preventDefault();
      updateActive();
      break;
    case 'ArrowUp':
      selectIndex--;
      if (selectIndex == -1) {
        selectIndex = suggestionResults.length - 1;
      }
      e.preventDefault();
      updateActive();
      break;
    case 'Enter':
      onSelect(selectIndex, e.ctrlKey, e.shiftKey);
      break;
    default:
      return;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  let settings = document.getElementById('settingsButton');
  settings.addEventListener('click', () => chrome.runtime.openOptionsPage());

  let input = document.getElementById('modalInput');
  input.focus();
  const debouncer = new Debounce();
  input.addEventListener(
    'input',
    debouncer.run((event) => (loadingSuggestions = doSuggestions(event, event.target.value)), 100)
  );
});

// var app = chrome.runtime.getBackgroundPage();
