
// Inject a fullscreen overlay with centered logo and a top progress bar.
(function () {
  const overlay = document.createElement('div');
  overlay.id = 'loading-overlay';
  const logo = document.createElement('img');
  logo.src = '/img/whitelogo.png';
  logo.alt = 'JTech logo';
  overlay.appendChild(logo);
  document.documentElement.appendChild(overlay);

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
      overlay.style.opacity = '0';
    }, 200);
    setTimeout(() => {
      bar.remove();
      overlay.remove();
    }, 500);
  });
})();
