// javascript:
links = document.querySelectorAll('link[title="applied_subreddit_stylesheet"]');
[].forEach.call(links, link => link.remove());

expandos = document.querySelectorAll('.commentarea > div.sitetable > .thing > .child > div.sitetable > div.thing > div.entry > p.tagline > a.expand');
[].forEach.call(expandos, expando => {
    if (!expando || expando.innerHTML.indexOf('+') !== -1) {
        return;
    }
    if (typeof expando.click === 'function') {
        expando.click();
    } else if (typeof expando.onclick === 'function') {
        expando.onclick();
    }
});
styleOn = document.getElementById('res-style-checkbox');
if (styleOn && styleOn.checked === true) {
    styleOn.click();
}
