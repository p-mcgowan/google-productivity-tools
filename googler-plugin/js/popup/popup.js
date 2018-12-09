let onSelect = (index, ctrl) => {
    loadingSuggestions.then(() => {
        let suggestion = suggestionResults[index];
        if (!suggestion) { return; }

        switch (suggestion.type) {
            case 'bookmark':
                // Update the current tab's url, or if ctrl-enter pressed, a new tab
                if (!ctrl) {
                    chrome.tabs.getSelected(null, tab => {
                        console.log(suggestion.url);
                        if (/^javascript/.test(suggestion.url)) {
                            chrome.tabs.executeScript({ code: suggestion.url });
                        } else {
                            chrome.tabs.update(tab.id, { url: suggestion.url });
                        }
                        window.close();
                    });
                } else {
                    chrome.tabs.create({ url: suggestion.url, active: false });
                }
            break;
            case 'tab':
                // Change to the target tab (and window if applicable)
                chrome.windows.update(suggestion.windowId, { focused: true }, w => {
                    chrome.tabs.update(suggestion.tabId, { active: true });
                    window.close();
                });
            break;
            case 'history':
                // Update the current tab's url
                if (!ctrl) {
                    chrome.tabs.getSelected(null, tab => {
                        chrome.tabs.update(tab.id, { url: suggestion.url });
                        window.close();
                    });
                } else {
                    chrome.tabs.create({ url: suggestion.url, active: false });
                }
            break;
            case 'lucky':
                // Update the current tab's url
                if (!ctrl) {
                    chrome.tabs.getSelected(null, tab => {
                        chrome.tabs.update(tab.id, { url: suggestion.url });
                        window.close();
                    });
                } else {
                    chrome.tabs.create({ url: suggestion.url, active: false });
                }
            break;
            default:
                // probably some kind of error...
                console.log({
                    index,
                    suggestionResults,
                    error: `Uknown suggestion type: ${suggestion.type}`
                });
                return;
        }
    }).catch(e => {
        console.trace.bind(window.console)(e);
        reject(e);
    });
}

let suggestionResults = [];

let doSuggestions = (e, text) => {
    suggestionResults = [];
    return Suggester.getSuggestions(text).then(res => {
        suggestionResults = res;
        console.log({ text, res });
        let template = document.getElementById('selectTemplate');
        let results = document.getElementById('modalResults');
        results.innerHTML = '';

        selectIndex = 0;

        let count = 0;
        res.forEach(r => {
            let el = document.createElement('div');
            el.classList.add('selection');
            el.innerHTML = r.description;
            if (!count) {
                el.setAttribute('selected', '');
            }

            el.setAttribute('number', count);

            el.addEventListener('click', e => {
                onSelect(el.getAttribute('number'), e.ctrlKey);
            });

            results.appendChild(el);
            count++;
        });

        updateActive();
        return;
    });
}

let selectIndex = 0;
let oldIndex = 0;
let loadingSuggestions = Promise.resolve();

let updateActive = () => {
    let suggestionElements = document.getElementsByClassName('selection');
    if (suggestionElements.length) {
        if (oldIndex !== selectIndex) {
            suggestionElements[(oldIndex % suggestionElements.length)].removeAttribute('selected');
            suggestionElements[(selectIndex % suggestionElements.length)].setAttribute('selected', '');
        }
    }
}

document.onkeydown = (e) => {
    oldIndex = selectIndex;
    switch (e.keyCode) {
        case 40: /* down */
            selectIndex++;
            e.preventDefault();
            updateActive();
            break;
        case 38: /* up */
            selectIndex--;
            if (selectIndex == -1) {
                selectIndex = suggestionResults.length;
            }
            e.preventDefault();
            updateActive();
            break;
        case 13: /* enter */
            onSelect(selectIndex, e.ctrlKey);
            break;
        default:
            return;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    let settings = document.getElementById('settingsButton');
    settings.addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
    });

    let input = document.getElementById('modalInput');
    input.focus();
    const debouncer = new Debounce();
    input.addEventListener('input', debouncer.run(event => {
        loadingSuggestions = doSuggestions(event, event.target.value);
    }, 100));
});

// var app = chrome.runtime.getBackgroundPage();
