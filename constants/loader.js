(function () {
  const bar = document.createElement('div');
  bar.id = 'loading-bar';
  document.documentElement.appendChild(bar);

  let width = 0;
  const interval = setInterval(() => {
    width += Math.random() * 15;
    if (width < 90) {
      bar.style.width = width + '%';
    } else {
      clearInterval(interval);
    }
  }, 200);

  window.addEventListener('load', () => {
    clearInterval(interval);
    bar.style.width = '100%';
    setTimeout(() => {
      bar.style.opacity = '0';
    }, 200);
    setTimeout(() => {
      bar.remove();
    }, 500);
  });
})();
