class Suggester {
  static icon = {
    bookmark: '<i class="material-symbols-outlined icon-button">bookmark</i>',
    tab: '<i class="material-symbols-outlined icon-button">tab</i>',
    history: '<i class="material-symbols-outlined icon-button">history</i>',
    lucky: '<i class="material-symbols-outlined icon-button">casino</i>',
    search: '<i class="material-symbols-outlined icon-button">search</i>',
    bookmarklet:
      '<i class="material-symbols-outlined icon-button">javascript</i>',
  };

  static encodeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  static normalizeText(text) {
    return text?.replace?.(/\W+/g, " ");
  }

  static suggestions = null;

  static async getSuggestions(text) {
    if (!text || text?.length <= 1) {
      return [];
    }

    let flag;
    if (["b ", "t ", "h ", "l ", "g "].indexOf(text.substring(0, 2)) !== -1) {
      flag = text.substring(0, 1);
      text = text.substring(2);

      if (text.length < 1) {
        return [];
      }
    }

    if (flag === "g") {
      const description = `search google: ${text}`;
      return [
        {
          description,
          content: description,
          type: "search",
          url: `https://www.google.com/search?udm=web&q=-ai+${text}`,
          display: `${this.icon.search} ${text}`,
          searchDescription: description,
          searchContent: description,
        },
      ];
    }

    const normalSearch = this.normalizeText(text);
    const normalReplace = new RegExp(normalSearch.replace(/\ /g, "."), "g");

    try {
      const results = await Promise.all([
        this.searchBookmarks(flag, text, normalReplace),
        this.searchHistory(flag, text, normalReplace),
        this.searchTabs(flag, text, normalReplace),
        this.luckySearch(flag, text, normalReplace),
      ]);

      return []
        .concat(...results)
        .sort(
          (a, b) =>
            this.getSortValue(a, normalSearch) -
            this.getSortValue(b, normalSearch),
        );
    } catch (e) {
      console.trace.bind(window.console)(e);

      throw e;
    }
  }

  static getSortValue(suggestion, query) {
    console.log({ suggestion });
    const description = suggestion.searchDescription;
    const content = suggestion.searchContent;

    console.log({ description, query });
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

  static searchBookmarks(flag, text, normalReplace) {
    return new Promise((resolve) => {
      if (typeof flag !== "undefined" && flag !== "b") {
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
          const icon = /^javascript:/.test(content)
            ? this.icon.bookmarklet
            : this.icon.bookmark;
          suggestions.push({
            description,
            content,
            type: "bookmark",
            url: bookmark.url,
            display: `${icon} ${description.replace(normalReplace, (x) => `<em>${x}</em>`)}`,
            searchDescription: this.normalizeText(description),
            searchContent: this.normalizeText(content),
          });
        });

        resolve(suggestions);
      });
    });
  }

  static searchHistory(flag, text, normalReplace) {
    return new Promise((resolve) => {
      if (typeof flag !== "undefined" && flag !== "h") {
        return resolve([]);
      }

      chrome.history.search({ text: text }, (history) => {
        const suggestions = [];

        history.forEach((page) => {
          const description = this.encodeHTML(page.title);
          suggestions.push({
            description,
            content: description,
            type: "history",
            url: page.url,
            display: `${this.icon.history} ${description.replace(normalReplace, (x) => `<em>${x}</em>`)}`,
            searchDescription: this.normalizeText(description),
            searchContent: this.normalizeText(description),
          });
        });

        resolve(suggestions);
      });
    });
  }

  static searchTabs(flag, text, normalReplace) {
    return new Promise((resolve) => {
      if (typeof flag !== "undefined" && flag !== "t") {
        return resolve([]);
      }

      chrome.tabs.query({ title: text }, (tabs) => {
        const suggestions = [];

        tabs.forEach((tab) => {
          const description = this.encodeHTML(tab.title);
          suggestions.push({
            description,
            content: `switch to tab: ${description}`,
            type: "tab",
            windowId: tab.windowId,
            tabId: tab.id,
            display: `${this.icon.tab} ${description.replace(normalReplace, (x) => `<em>${x}</em>`)}`,
            searchDescription: this.normalizeText(description),
            searchContent: this.normalizeText(description),
          });
        });

        resolve(suggestions);
      });
    });
  }

  static luckySearch(flag, text, normalReplace) {
    return new Promise((resolve) => {
      if (flag !== "l") {
        return resolve([]);
      }

      const suggestions = [];
      const description = this.encodeHTML(text);
      suggestions.push({
        description,
        content: `lucky search: ${description}`,
        type: "lucky",
        url: `http://google.ca/search?btnI=1&q=${text}`,
        display: description.replace(normalReplace, (x) => `<em>${x}</em>`),
        searchDescription: this.normalizeText(description),
        searchContent: this.normalizeText(description),
      });

      resolve(suggestions);
    });
  }
}
