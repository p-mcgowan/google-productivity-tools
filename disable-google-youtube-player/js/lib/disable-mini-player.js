document.querySelectorAll('a[href*="#fpstate="').forEach(thumb => {
  const a = document.createElement('a');
  const videoRow = thumb.parentElement;
  a.href = thumb.nextElementSibling.href;

  const newThumb = document.createElement('div');
  newThumb.innerHTML = thumb.innerHTML;
  thumb.parentNode.replaceChild(newThumb, thumb);

  a.classList = videoRow.classList;
  a.innerHTML = videoRow.innerHTML;
  videoRow.parentElement.replaceChild(a, videoRow);
});
