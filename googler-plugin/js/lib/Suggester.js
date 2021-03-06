class Suggester {

    static getSuggestions(text) {
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

        return new Promise((resolve, reject) => {
            if (text && text.length > 1) {
                let flag;
                // Catch flags
                if (['b ', 't ', 'h ', 'l '].indexOf(text.substring(0, 2)) != -1) {
                    flag = text.substring(0, 1);
                    text = text.substring(2);

                    // Dont do anything on just a flag
                    if (text.length < 1) {
                        resolve(suggestions);
                    }
                }

                console.log(flag);

                // Wait for all promises to complete, then return the results
                Promise.all([
                    // Lucky
                    new Promise((resolve, reject) => {
                        // lucky search a string
                        if (flag === 'l') {
                            let index = `${text.encodeHTML()} => lucky search`;
                            suggestions.push({
                                description : index,
                                content     : `lucky search: ${text.encodeHTML()}`,
                                type        : 'lucky',
                                url         : `http://google.ca/search?btnI=1&q=${text}`
                            });

                            resolve('using lucky');
                        } else {
                            resolve(`lucky: flag = ${flag}`);
                        }
                    }),

                    // Tabs
                    new Promise((resolve, reject) => {
                        if (typeof flag === 'undefined' || flag === 't') {
                            // Search tabs content
                            chrome.tabs.query({ title: text }, tabs => {
                                // Add matches to suggestions
                                tabs.forEach(tab => {
                                    let index = `${tab.title.encodeHTML()} => tab`
                                    suggestions.push({
                                        description : index,
                                        content     : `switch to tab: ${tab.title.encodeHTML()}`,
                                        type        : 'tab',
                                        windowId    : tab.windowId,
                                        tabId       : tab.id
                                    });
                                });

                                resolve('using tabs');
                            });
                        } else {
                            resolve(`tabs: flag = ${flag}`);
                        }
                    }),

                    // Bookmarks
                    new Promise((resolve, reject) => {
                        if (typeof flag === 'undefined' || flag === 'b') {
                            // Search bookmark content
                            chrome.bookmarks.search(text, bookmarks => {
                                // Loop over results and parse them into suggestions
                                bookmarks.forEach(bookmark => {
                                    // Don't push folders
                                    if (bookmark.url) {
                                        let index = `${bookmark.title.encodeHTML()} => bookmark`;
                                        suggestions.push({
                                            description : index,
                                            content     : bookmark.url.encodeHTML(),
                                            type        : 'bookmark',
                                            url         : bookmark.url
                                        });
                                    }
                                });

                                resolve('using bookmarks');
                            });
                        } else {
                            resolve(`book: flag = ${flag}`);
                        }
                    }),

                    // search history
                    new Promise((resolve, reject) => {
                        if (typeof flag === 'undefined' || flag === 'h') {
                            // Search history content
                            chrome.history.search({ text: text }, history => {
                                // Add matches to suggestions
                                history.forEach(page => {
                                    let index = `${page.title.encodeHTML()} => history`;
                                    suggestions.push({
                                        description : index,
                                        content     : `history: ${page.title.encodeHTML()}`,
                                        type        : 'history',
                                        url         : page.url
                                    });
                                });

                                resolve('using history');
                            });
                        } else {
                            resolve(`hist: flag = ${flag}`);
                        }
                    })
                ]).then(() => {
                    resolve(suggestions);
                }).catch(e => {
                    console.trace.bind(window.console)(e);
                    reject(e);
                });
            } else {
                resolve(suggestions);
            }
        });
    }
}
