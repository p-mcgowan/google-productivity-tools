/* collapse comments and remove custom subreddit styles */

const fadeSubreddit = (subredditAnchor, reason) => {
  let thing = subredditAnchor;
  for (let i = 0; i < 4; ++i) {
    thing = thing?.parentElement || thing;
  }
  if (thing) {
    thing.classList.add('beddit-faded');
    if (reason) {
      thing.classList.add('beddit-' + reason);
    }
  }
};

const assertStyle = (sheet) => {
  const style = document.getElementById('redstyle') || document.createElement('style');
  style.innerHTML = sheet;
  if (!style.id) {
    style.id = 'redstyle';
    document.head.append(style);
  }
};

const reds = (fadeSubreddits) => {
  const keys = Object.keys(fadeSubreddits)
    .reduce((filters, key) => {
      if (key.indexOf('r/') === 0) {
        return filters;
      }

      if (key[0] === 't' && key[1] === '/') {
        filters.push(key.slice(2));
      } else {
        filters.push(key);
      }

      return filters;
    }, [])
    .join('|');

  const textFilter = keys ? new RegExp(keys, 'i') : null;

  document.querySelectorAll('a.subreddit').forEach((a) => {
    if (fadeSubreddits[a.innerText?.trim()?.toLowerCase()]) {
      fadeSubreddit(a, 'text-match');
    }
    const title = a?.parentElement?.parentElement?.firstChild?.innerText?.toLowerCase?.();
    if (!title) {
      return;
    }

    if (textFilter?.test?.(title)) {
      fadeSubreddit(a, 'regex-match');
    }
  });

  document.querySelectorAll(`link[title="applied_subreddit_stylesheet"]`).forEach((link) => link.remove());
  const hideIfPresent = (qs) => document.querySelector(qs)?.classList.add('beddit-hidden');

  document.querySelectorAll(`.top-matter .tagline`).forEach((tagline) => tagline.classList.add('beddit-tagline'));

  const pinnedVideo = document.querySelector('body > div.content .pinnable-placeholder .pinnable-content.pinned');
  if (pinnedVideo) {
    const video = pinnedVideo.querySelector('video');
    if (video) {
      video.autoplay = false;
      video.pause();
    }
    pinnedVideo.querySelector('.dismiss-pinnable')?.click();
  }

  hideIfPresent('body > div.side');
  hideIfPresent('body > div.content > section.infobar');
  hideIfPresent('#header-bottom-left > a');
  assertStyle(`
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
    .beddit-enabled .top-matter .title *:not(a) {
      visibility: hidden;
    }
    .beddit-enabled .top-matter ul.flat-list li:not(:first-of-type, .first) {
      display: none;
    }
    .beddit-enabled .beddit-tagline {
      font-size: 0px;
    }
    .beddit-enabled .beddit-tagline time,
    .beddit-enabled .beddit-tagline a.subreddit,
    .beddit-enabled .beddit-tagline a.author {
      font-size: x-small;
      margin-right: 1rem;
    }
    .beddit-enabled .beddit-tagline .awardings-bar {
      display: none;
    }
  `);

  document
    .querySelectorAll(
      '.commentarea > div.sitetable > .thing > .child > div.sitetable > div.thing > div.entry > p.tagline > a.expand',
    )
    .forEach((expando) => {
      if (!expando || expando.innerHTML.indexOf('+') !== -1) {
        return;
      }
      expando.click?.();
      expando.onclick?.();
    });

  const styleOn = document.getElementById('res-style-checkbox');
  if (styleOn && styleOn.checked === true) {
    styleOn.click();
  }

  document.querySelectorAll('p a[href^="https://preview.redd.it"]').forEach((a) => {
    a.innerHTML = `<img src="${a.href}" width="400" />`;
  });
};

chrome.storage.local.onChanged.addListener(() => {
  chrome.storage.local.get(['enabled', 'ignored'], (items) => {
    if (items.enabled) {
      document.body.classList.add('beddit-enabled');
    } else {
      document.body.classList.remove('beddit-enabled');
      return;
    }
    reds(items.ignored);
  });
});
chrome.storage.local.get(['enabled', 'ignored'], (items) => {
  if (items.enabled) {
    document.body.classList.add('beddit-enabled');
  } else {
    document.body.classList.remove('beddit-enabled');
    return;
  }
  reds(items.ignored);
});

if (location.pathname === '/media') {
  document.querySelector('html').style.height = '100%';
  document.body.style.height = '100%';

  const img = document.querySelector('img').cloneNode();
  img.removeAttribute('class');
  img.style.margin = '0 auto';
  img.style.maxHeight = '100vh';
  const toggleZoom = () => {
    if (img.style.maxHeight) {
      img.style.maxHeight = '';
      img.style.maxWidth = '';
      img.style.cursor = 'zoom-out';
      document.body.style.display = 'initial';
      document.body.style.placeContent = 'initial';
    } else {
      img.style.maxHeight = '100vh';
      img.style.maxWidth = '100vw';
      img.style.cursor = 'zoom-in';
      document.body.style.display = 'grid';
      document.body.style.placeContent = 'center';
    }
  };
  toggleZoom();
  img.addEventListener('click', toggleZoom);
  document.body.innerHTML = '';
  document.body.append(img);
}
