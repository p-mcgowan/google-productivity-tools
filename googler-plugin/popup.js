//// Copyright (c) 2014 The Chromium Authors. All rights reserved.
//// Use of this source code is governed by a BSD-style license that can be
//// found in the LICENSE file.
//
///**
// * Get the current URL.
// *
// * @param {function(string)} callback - called when the URL of the current tab
// *   is found.
//function getCurrentTabUrl(callback) {
//  // Query filter to be passed to chrome.tabs.query - see
//  // https://developer.chrome.com/extensions/tabs#method-query
//  var queryInfo = {
//    active: true,
//    currentWindow: true
//  };
//
//  chrome.tabs.query(queryInfo, function(tabs) {
//    // chrome.tabs.query invokes the callback with a list of tabs that match the
//    // query. When the popup is opened, there is certainly a window and at least
//    // one tab, so we can safely assume that |tabs| is a non-empty array.
//    // A window can only have one active tab at a time, so the array consists of
//    // exactly one tab.
//    var tab = tabs[0];
//
//    // A tab is a plain object that provides information about the tab.
//    // See https://developer.chrome.com/extensions/tabs#type-Tab
//    var url = tab.url;
//
//    // tab.url is only available if the "activeTab" permission is declared.
//    // If you want to see the URL of other tabs (e.g. after removing active:true
//    // from |queryInfo|), then the "tabs" permission is required to see their
//    // "url" properties.
//    console.assert(typeof url == 'string', 'tab.url should be a string');
//
//    callback(url);
//  });
//
//  // Most methods of the Chrome extension APIs are asynchronous. This means that
//  // you CANNOT do something like this:
//  //
//  // var url;
//  // chrome.tabs.query(queryInfo, function(tabs) {
//  //   url = tabs[0].url;
//  // });
//  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
//}
//
///**
// * @param {string} searchTerm - Search term for Google Image search.
// * @param {function(string,number,number)} callback - Called when an image has
// *   been found. The callback gets the URL, width and height of the image.
// * @param {function(string)} errorCallback - Called when the image is not found.
// *   The callback gets a string that describes the failure reason.
//function getImageUrl(searchTerm, callback, errorCallback) {
//  // Google image search - 100 searches per day.
//  // https://developers.google.com/image-search/
//  var searchUrl = 'https://ajax.googleapis.com/ajax/services/search/images' +
//    '?v=1.0&q=' + encodeURIComponent(searchTerm);
//  var x = new XMLHttpRequest();
//  x.open('GET', searchUrl);
//  // The Google image search API responds with JSON, so let Chrome parse it.
//  x.responseType = 'json';
//  x.onload = function() {
//    // Parse and process the response from Google Image Search.
//    var response = x.response;
//    if (!response || !response.responseData || !response.responseData.results ||
//        response.responseData.results.length === 0) {
//      errorCallback('No response from Google Image search!');
//      return;
//    }
//    var firstResult = response.responseData.results[0];
//    // Take the thumbnail instead of the full image to get an approximately
//    // consistent image size.
//    var imageUrl = firstResult.tbUrl;
//    var width = parseInt(firstResult.tbWidth);
//    var height = parseInt(firstResult.tbHeight);
//    console.assert(
//        typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
//        'Unexpected respose from the Google Image Search API!');
//    callback(imageUrl, width, height);
//  };
//  x.onerror = function() {
//    errorCallback('Network error.');
//  };
//  x.send();
//}
//
//function renderStatus(statusText) {
//  document.getElementById('status').textContent = statusText;
//}
//*/

// Hash for suggestion data
let Data = { suggestions: {}, default: {} };
// Suggestion array
let suggestions = [];

/**
 * Debouncer wrapper
 */
class Debounce {

    /**
     * Debounce function - no more spamming
     * @param  {Function} func      - Function to debounce
     * @param  {Number}   wait      - Time to wait (ms)
     * @param  {Boolean}  immediate - If true, runs immediately
     * @return {Function}           - The debounce activation function
     */
    run(func, wait, immediate) {
        let context = this;

        return function () {
            var later = () => {
                context.timeout = null;
                if (!immediate) {
                    func.apply(context, arguments);
                }
            };
            var callNow = immediate && !context.timeout;
            clearTimeout(context.timeout);
            context.timeout = setTimeout(later, wait);
            if (callNow) {
                func.apply(context, arguments);
            }
        };
    }
}

if (!String.prototype.encodeHTML) {
    String.prototype.encodeHTML = function() {
        return this.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    };
}

let getSuggestions = (text) => {
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
                let results = document.getElementById('modalResults');
                results.innerHTML = '';
                if (suggestions.length) {
                    console.log(Data);
                    Data.suggestions.forEach(s => {

                    })
                    // chrome.omnibox.setDefaultSuggestion({ description: suggestions[0].description });
                    // Data.default = Data.suggestions[suggestions[0].content];
                    // suggestions.shift();
                    // suggest(suggestions);
                } else {

                }
            } catch (e) {
                console.trace.bind(window.console)(e, suggestions);
            }
        }).catch((e) => { console.trace.bind(window.console)(e); });
    }
}

let onchange = (e, text) => {
    console.log(e, text);
    getSuggestions(text);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('content loaded');
    let input = document.getElementById('modalInput');
    input.focus();
    input.oninput = new Debounce().run((event) => {
        onchange(event, event.target.value);
    }, 150);
});

// var app = chrome.runtime.getBackgroundPage();
