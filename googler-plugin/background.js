// Hash for suggestion data
let Data = { suggestions: {}, default: {} };
// Suggestion array
let suggestions = [];

if (!String.prototype.encodeHTML) {
    String.prototype.encodeHTML = function() {
        return this.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    };
}

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
    suggestions = [];
    Data        = { suggestions: {}, default: {} };

    if (text && text.length > 1) {

        let flag;
        // Catch flags
        if (['b ', 't ', 'h ', 'l '].indexOf(text.substring(0, 2)) != -1) {
            flag = text.substring(0, 1);
            text = text.substring(2);

            // Dont do anything on just a flag
            if (text.length < 1) {
                return;
            }
        }

        let promises = [];

        promises.push(new Promise((resolve, reject) => {
            // lucky search a string
            if (flag === 'l') {
                let suggestion = {
                    content     : `lucky search: ${text.encodeHTML()}`,
                    description : `${text.encodeHTML()} => lucky search`
                };

                Data.suggestions[suggestion.content] = {
                    type : 'lucky',
                    url  : `http://google.ca/search?ie=UTF-8&oe=UTF-8&sourceid=navclient&btnI=1&q=${text}`
                };

                suggestions.push(suggestion);
                resolve('using lucky');
            } else {
                resolve(`lucky: flag = ${flag}`);
            }
        }));

        // search open tabs
        promises.push(new Promise((resolve, reject) => {
            if (typeof flag === 'undefined' || flag === 't') {
                chrome.tabs.query({ title: text }, (tabs) => {
                    tabs.forEach((tab, tabIndex) => {
                        let suggestion = {
                            content     : `switch to tab: ${tab.title.encodeHTML()}`,
                            description : `${tab.title.encodeHTML()} => tab`
                        };

                        Data.suggestions[suggestion.content] = {
                            type     : 'tab',
                            windowId : tab.windowId,
                            tabId    : tab.id
                        };

                        suggestions.push(suggestion);
                    });

                    resolve('using tabs');
                });
            } else {
                resolve(`tabs: flag = ${flag}`);
            }
        }));

        // search bookmarks
        promises.push(new Promise((resolve, reject) => {
            if (typeof flag === 'undefined' || flag === 'b') {
                // Search bookmark content
                chrome.bookmarks.search(text, (bookmarks) => {
                    bookmarks.forEach((bookmark, bookmarkIndex) => {
                        // Don't push folders
                        if (bookmark.url) {
                            let suggestion = {
                                content     : bookmark.url.encodeHTML(),
                                description : `${bookmark.title.encodeHTML()} => bookmark`
                            };

                            Data.suggestions[suggestion.content] = {
                                type : 'bookmark',
                                url  : bookmark.url
                            };

                            suggestions.push(suggestion);
                        }
                    });

                    resolve('using bookmarks');
                });
            } else {
                resolve(`book: flag = ${flag}`);
            }
        }));

        // search history
        promises.push(new Promise((resolve, reject) => {
            if (typeof flag === 'undefined' || flag === 'h') {
                chrome.history.search({ text: text }, (history) => {
                    history.forEach((page, index) => {
                        let suggestion = {
                            content     : `history: ${page.title.encodeHTML()}`,
                            description : `${page.title.encodeHTML()} - history`
                        };

                        Data.suggestions[suggestion.content] = {
                            type : 'history',
                            url  : page.url
                        };

                        suggestions.push(suggestion);
                    });

                    resolve('using history');
                });
            } else {
                resolve(`hist: flag = ${flag}`);
            }
        }));

        Promise.all(promises).then((v) => {
            try {
                if (suggestions.length) {
                    chrome.omnibox.setDefaultSuggestion({ description: suggestions[0].description });
                    Data.default = Data.suggestions[suggestions[0].content];
                    suggestions.shift();
                    suggest(suggestions);
                }
            } catch (e) {
                console.trace.bind(window.console)(e, suggestions);
            }
        }).catch((e) => { console.trace.bind(window.console)(e); });
    }
});


chrome.omnibox.onInputEntered.addListener((content) => {
    // If the suggestion is undefined, it means the default suggestion was entered
    let suggestion = Data.suggestions[content];
    if (typeof suggestion === 'undefined') {
        suggestion = Data.default;
    }

    console.log(Data);

    switch (suggestion.type) {
        case 'bookmark':
            // Update the current tab's url
            chrome.tabs.getSelected(null, (tab) => {
                chrome.tabs.update(tab.id, { url: suggestion.url });
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
