let onSelect = (index, ctrl) => {
    loadingSuggestions.then(() => {
        let suggestion = suggestionResults[index];

        switch (suggestion.type) {
            case 'bookmark':
                // Update the current tab's url, or if ctrl-enter pressed, a new tab
                if (!ctrl) {
                    chrome.tabs.getSelected(null, tab => {
                        chrome.tabs.update(tab.id, { url: suggestion.url });
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
                console.log({ index: index, sugs: suggestionResults });
                return;
        }
    });
}

let suggestionResults = [];

let doSuggestions = (e, text) => {
    return new Promise((resolve, reject) =>{
        suggestionResults = [];
        Suggester.getSuggestions(text).then(res => {
            suggestionResults = res;
            console.log({ text: text, res: res });
            let template = document.getElementById('selectTemplate');
            let results = document.getElementById('modalResults');
            results.innerHTML = '';

            selectIndex = 0;

            let count = 0;
            res.forEach(r => {
                let el = template.content.cloneNode(true).firstElementChild;
                el.innerHTML = r.description;
                el.onclick = () => { onSelect(selectIndex); };
                if (!count) {
                    el.setAttribute('selected', '');
                }
                el.setAttribute('number', count);
                el.onmouseover = (e) => {
                    oldIndex = selectIndex;
                    selectIndex = e.target.getAttribute('number');
                    updateActive();
                };
                results.appendChild(el);
                count++;
            });

            updateActive();
            resolve();
        }).catch(e => {
            console.trace.bind(window.console)(e);
            reject(e);
        });
    })
}

let selectIndex = 0, oldIndex = 0, loadingSuggestions;

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
        case 38: /* down */
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
            return
    }
}


document.addEventListener('DOMContentLoaded', () => {
    let settings = document.getElementById('settingsButton');
    settings.onclick = () => { chrome.runtime.openOptionsPage(); };

    let input = document.getElementById('modalInput');
    input.focus();
    input.oninput = new Debounce().run(event => {
        loadingSuggestions = doSuggestions(event, event.target.value);
    }, 150);

});

// var app = chrome.runtime.getBackgroundPage();
