javascript: (() => {
  /* 2025-06-01 */
  links = document.querySelectorAll('link[title="applied_subreddit_stylesheet"]');
  removeIfPresent = (qs) => (document.querySelector(qs) || { remove: () => null }).remove();

  [].forEach.call(links, (link) => link.remove());

  removeIfPresent("body > div.side");
  removeIfPresent("body > div.content > section.infobar");
  removeIfPresent(".header-bottom-left > a");

  mainContent = document.querySelector("body > div.content");
  if (mainContent) {
    mainContent.style.marginRight = mainContent.style.marginLeft;
  }
  expandos = document.querySelectorAll(
    ".commentarea > div.sitetable > .thing > .child > div.sitetable > div.thing > div.entry > p.tagline > a.expand",
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

  styleOn = document.getElementById("res-style-checkbox");
  if (styleOn && styleOn.checked === true) {
    styleOn.click();
  }
  document
    .querySelectorAll("a.may-blank.gallery-item-thumbnail-link img")
    .forEach((img) => (img.src = img.parentElement.href));

  document.querySelectorAll("a").forEach((a) => {
    if (a.innerText !== "<image>") {
      return;
    }
    img = document.createElement("img");
    img.src = a.href;
    a.replaceWith(img);
  });
})();

