/* collapse comments and remove custom subreddit styles */

const fadeSubreddit = (subredditAnchor) => {
  let thing = subredditAnchor;
  for (let i = 0; i < 4; ++i) {
    thing = thing?.parentElement || thing;
  }
  if (thing) {
    thing.style.opacity = 0.3;
  }
};

const assertStyle = (sheet) => {
  const style =
    document.getElementById("redstyle") || document.createElement("style");
  style.innerText = sheet;
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
  const removeIfPresent = (qs) =>
    (document.querySelector(qs) || { remove: () => null }).remove();

  document
    .querySelectorAll(`.top-matter .tagline`)
    .forEach((tagline) =>
      tagline.replaceChildren(
        ...tagline.querySelectorAll("time, a.subreddit, a.author")
      )
    );

  removeIfPresent("body > div.side");
  removeIfPresent("body > div.content > section.infobar");
  removeIfPresent("#header-bottom-left > a");
  assertStyle(`
    .top-matter .title *:not(a) {
      visibility: hidden;
    }
    .top-matter ul.flat-list li:not(:first-of-type) {
      display: none;
    }
    .top-matter .tagline * {
      margin-right: 1rem;
    }

   /* a.author {
      display: none;
    }
    #header-bottom-left .pagename a.author {
      display: none;
      visibility: visible;
    }*/
  `);

  const mainContent = document.querySelector("body > div.content");
  if (mainContent) {
    mainContent.style.marginRight = mainContent.style.marginLeft;
  }

  const expandos = document.querySelectorAll(
    ".commentarea > div.sitetable > .thing > .child > div.sitetable > div.thing > div.entry > p.tagline > a.expand"
  );
  [].forEach.call(expandos, (expando) => {
    if (!expando || expando.innerHTML.indexOf("+") !== -1) {
      return;
    }
    if (typeof expando.click === "function") {
      expando.click();
    } else if (typeof expando.onclick === "function") {
      expando.onclick();
    }
  });

  const styleOn = document.getElementById("res-style-checkbox");
  if (styleOn && styleOn.checked === true) {
    styleOn.click();
  }
};

chrome.storage.local.get(["enabled", "ignored"], (items) => {
  if (!items.enabled) {
    return;
  }
  reds(items.ignored);
});
