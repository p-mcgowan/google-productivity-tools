/* collapse comments and remove custom subreddit styles */

const fadeSubreddit = (subredditAnchor) => {
  let thing = subredditAnchor;
  for (let i = 0; i < 4; ++i) {
    thing = thing?.parentElement || thing;
  }
  if (thing) {
    thing.classList.add('beddit-faded')
  }
};

const assertStyle = (sheet) => {
  const style =
    document.getElementById("redstyle") || document.createElement("style");
  style.innerHTML = sheet;
  if (!style.id) {
    style.id = "redstyle";
    document.head.append(style);
  }
};

const reds = (fadeSubreddits) => {
  document.querySelectorAll("a.subreddit").forEach((a) => {
    if (fadeSubreddits[a.innerText?.trim()?.toLowerCase()]) {
      fadeSubreddit(a);
    }
  });

  document
    .querySelectorAll(`link[title="applied_subreddit_stylesheet"]`)
    .forEach((link) => link.remove());
  const hideIfPresent = (qs) => document.querySelector(qs)?.classList.add('beddit-hidden');

  document
    .querySelectorAll(`.top-matter .tagline`)
    .forEach((tagline) =>
      tagline.replaceChildren(
        ...tagline.querySelectorAll("time, a.subreddit, a.author")
      )
    );

  hideIfPresent("body > div.side");
  hideIfPresent("body > div.content > section.infobar");
  hideIfPresent("#header-bottom-left > a");
  assertStyle(`
    .beddit-enabled .top-matter .title *:not(a) {
      visibility: hidden;
    }
    .beddit-enabled .top-matter ul.flat-list li:not(:first-of-type, .first) {
      display: none;
    }
    .beddit-enabled .top-matter .tagline * {
      margin-right: 1rem;
    }
    .beddit-enabled .beddit-faded .rank,
    .beddit-enabled .beddit-faded .midcol,
    .beddit-enabled .beddit-faded .thumbnail,
    .beddit-enabled .beddit-faded .entry .top-matter {
      opacity: 0.3;
    }
    .beddit-enabled .beddit-hidden {
      display: none;
    }
    .beddit-enabled .media-preview-content {
      width: 100%;
    }
  `);

  document.querySelectorAll(
    ".commentarea > div.sitetable > .thing > .child > div.sitetable > div.thing > div.entry > p.tagline > a.expand"
  ).forEach((expando) => {
    if (!expando || expando.innerHTML.indexOf("+") !== -1) {
      return;
    }
    expando.click?.();
    expando.onclick?.();
  });

  const styleOn = document.getElementById("res-style-checkbox");
  if (styleOn && styleOn.checked === true) {
    styleOn.click();
  }
};

chrome.storage.onChanged.addListener(() => {
  chrome.storage.local.get(["enabled", "ignored"], (items) => {
    if (items.enabled) {
      document.body.classList.add('beddit-enabled');
    } else {
      document.body.classList.remove('beddit-enabled');
      return;
    }
    reds(items.ignored);
  });
});
chrome.storage.local.get(["enabled", "ignored"], (items) => {
  if (items.enabled) {
    document.body.classList.add('beddit-enabled');
  } else {
    document.body.classList.remove('beddit-enabled');
    return;
  }
  reds(items.ignored);
});
