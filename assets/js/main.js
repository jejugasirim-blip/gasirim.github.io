// Reveal on scroll
(function() {
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function(el) { el.classList.add('is-visible'); });
    return;
  }
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(function(el) { io.observe(el); });
})();

// Simple parallax effect
(function() {
  var parallaxEls = document.querySelectorAll('.parallax');
  if (!parallaxEls.length) return;
  function onScroll() {
    parallaxEls.forEach(function(el) {
      var rect = el.getBoundingClientRect();
      var offset = (window.innerHeight - rect.top) * 0.06; // tune depth
      el.style.transform = 'translateY(' + offset.toFixed(2) + 'px)';
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
