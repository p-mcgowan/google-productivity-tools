/* collapse comments and remove custom subreddit styles */
const reds = () => {
  const links = document.querySelectorAll(`link[title="applied_subreddit_stylesheet"]`);
  const removeIfPresent = (qs) => (document.querySelector(qs) || { remove: () => null }).remove();

  [].forEach.call(links, (link) => link.remove());

  removeIfPresent('body > div.side');
  removeIfPresent('body > div.content > section.infobar');
  removeIfPresent('.header-bottom-left > a');

  const mainContent = document.querySelector('body > div.content');
  if (mainContent) {
    mainContent.style.marginRight = mainContent.style.marginLeft;
  }

  const expandos = document.querySelectorAll(
    '.commentarea > div.sitetable > .thing > .child > div.sitetable > div.thing > div.entry > p.tagline > a.expand'
  );
  [].forEach.call(expandos, (expando) => {
    if (!expando || expando.innerHTML.indexOf('+') !== -1) {
      return;
    }
    if (typeof expando.click === 'function') {
      expando.click();
    } else if (typeof expando.onclick === 'function') {
      expando.onclick();
    }
  });

  const styleOn = document.getElementById('res-style-checkbox');
  if (styleOn && styleOn.checked === true) {
    styleOn.click();
  }
};

reds();
