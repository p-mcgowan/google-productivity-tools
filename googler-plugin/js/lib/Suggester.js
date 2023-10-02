class Suggester {
  static icon = {
    bookmark: '<i class="material-symbols-outlined icon-button">bookmark</i>',
    tab: '<i class="material-symbols-outlined icon-button">tab</i>',
    history: '<i class="material-symbols-outlined icon-button">history</i>',
    lucky: '<i class="material-symbols-outlined icon-button">casino</i>',
    bookmarklet: '<i class="material-symbols-outlined icon-button">javascript</i>',
  };

  static encodeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  static getSuggestions(text) {
    return new Promise((resolve, reject) => {
      if (!text || text?.length <= 1) {
        return resolve([]);
      }

      let flag;
      if (['b ', 't ', 'h ', 'l '].indexOf(text.substring(0, 2)) != -1) {
        flag = text.substring(0, 1);
        text = text.substring(2);

        if (text.length < 1) {
          return resolve([]);
        }
      }

      // console.log(flag);

      Promise.all([
        this.searchBookmarks(flag, text),
        this.searchHistory(flag, text),
        this.searchTabs(flag, text),
        this.luckySearch(flag, text),
      ])
        .then((results) => {
          // console.log(results);

          return resolve([].concat(...results).sort((a, b) => this.getSortValue(a, text) - this.getSortValue(b, text)));
        })
        .catch((e) => {
          console.trace.bind(window.console)(e);

          return reject(e);
        });
    });
  }

  static getSortValue(suggestion, query) {
    const { description, content } = suggestion;

    let index = description.indexOf(query);
    if (index !== -1) {
      return index;
    }

    if (description === content || /^javascript:/.test(content)) {
      return Infinity;
    }

    index = content.indexOf(query);
    if (index !== -1) {
      return index + 100;
    }

    return Infinity;
  }

  static searchBookmarks(flag, text) {
    return new Promise((resolve) => {
      if (typeof flag !== 'undefined' && flag !== 'b') {
        return resolve([]);
      }

      chrome.bookmarks.search(text, (bookmarks) => {
        const suggestions = [];

        bookmarks.forEach((bookmark) => {
          if (!bookmark.url) {
            return;
          }

          const description = this.encodeHTML(bookmark.title);
          const content = this.encodeHTML(bookmark.url);
          const icon = /^javascript:/.test(content) ? this.icon.bookmarklet : this.icon.bookmark;
          suggestions.push({
            description,
            content,
            type: 'bookmark',
            url: bookmark.url,
            display: `${icon} ${description.replace(text, `<em>${text}</em>`)}`,
          });
        });

        resolve(suggestions);
      });
    });
  }

  static searchHistory(flag, text) {
    return new Promise((resolve) => {
      if (typeof flag !== 'undefined' && flag !== 'h') {
        return resolve([]);
      }

      chrome.history.search({ text: text }, (history) => {
        const suggestions = [];

        history.forEach((page) => {
          const description = this.encodeHTML(page.title);
          suggestions.push({
            description,
            content: description,
            type: 'history',
            url: page.url,
            display: `${this.icon.history} ${description.replace(text, `<em>${text}</em>`)}`,
          });
        });

        resolve(suggestions);
      });
    });
  }

  static searchTabs(flag, text) {
    return new Promise((resolve) => {
      if (typeof flag !== 'undefined' && flag !== 't') {
        return resolve([]);
      }

      chrome.tabs.query({ title: text }, (tabs) => {
        const suggestions = [];

        tabs.forEach((tab) => {
          const description = this.encodeHTML(tab.title);
          suggestions.push({
            description,
            content: `switch to tab: ${description}`,
            type: 'tab',
            windowId: tab.windowId,
            tabId: tab.id,
            display: `${this.icon.tab} ${description.replace(text, `<em>${text}</em>`)}`,
          });
        });

        resolve(suggestions);
      });
    });
  }

  static luckySearch(flag, text) {
    return new Promise((resolve) => {
      if (flag !== 'l') {
        return resolve([]);
      }

      const suggestions = [];
      const description = this.encodeHTML(text);
      suggestions.push({
        description,
        content: `lucky search: ${description}`,
        type: 'lucky',
        url: `http://google.ca/search?btnI=1&q=${text}`,
        display: description.replace(text, `<em>${text}</em>`),
      });

      resolve(suggestions);
    });
  }
}
