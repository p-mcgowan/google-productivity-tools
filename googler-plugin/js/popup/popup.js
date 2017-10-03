let onSelect = (index, ctrl) => {
    console.log(index, suggestionResults);
    let suggestion = suggestionResults[index];

    switch (suggestion.type) {
        case 'bookmark':
            // Update the current tab's url
            chrome.tabs.getSelected(null, tab => {
                chrome.tabs.update(tab.id, { url: suggestion.url });
            });
        break;
        case 'tab':
            // Change to the target tab (and window if applicable)
            chrome.windows.update(suggestion.windowId, { focused: true }, w => {
                chrome.tabs.update(suggestion.tabId, { active: true });
            });
        break;
        case 'history':
            // Update the current tab's url
            chrome.tabs.getSelected(null, tab => {
                chrome.tabs.update(tab.id, { url: suggestion.url });
            });
        break;
        case 'lucky':
            // Update the current tab's url
            chrome.tabs.getSelected(null, tab => {
                chrome.tabs.update(tab.id, { url: suggestion.url });
            });
        break;
    }
}

let suggestionResults = [];

let doSuggestions = (e, text) => {
    suggestionResults = [];
    Suggester.getSuggestions(text).then(res => {
        suggestionResults = res;
        console.log(text, res);
        let template = document.getElementById('selectTemplate');
        let results = document.getElementById('modalResults');
        results.innerHTML = '';

        selectIndex = 0;

        let count = 0;
        for (let i in res) {
            let el = template.content.cloneNode(true).firstElementChild;
            el.innerHTML = i;
            el.onclick = () => { onSelect(res[i]); };
            if (!count) {
                el.setAttribute('selected', '');
                first = false;
            }
            el.setAttribute('number', count);
            el.onmouseenter = (e) => {
                oldIndex = selectIndex;
                selectIndex = e.target.getAttribute('number');
                updateActive();
            };
            results.appendChild(el);
            count++;
        }

    }).catch(e => {
        console.trace.bind(window.console)(e);
    });
}

let selectIndex = 0, oldIndex = 0;


let updateActive = () => {
    let selections = document.getElementsByClassName('selection');
    if (selections.length) {
        if (oldIndex !== selectIndex) {
            selections[(oldIndex % selections.length)].removeAttribute('selected');
            selections[(selectIndex % selections.length)].setAttribute('selected', '');
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
        doSuggestions(event, event.target.value);
    }, 150);

});

// var app = chrome.runtime.getBackgroundPage();
