/* Reveal on scroll */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  els.forEach(el => io.observe(el));
}

/* Parallax for hero image */
function initParallax() {
  const parallaxEl = document.querySelector('.intro-hero.parallax');
  if (!parallaxEl) return;
  const onScroll = () => {
    const rect = parallaxEl.getBoundingClientRect();
    const offset = (window.innerHeight - rect.top) * 0.06;
    parallaxEl.style.transform = `translateY(${offset.toFixed(2)}px)`;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* Keyboard & toggle support for dropdown menus */
function initNavDropdowns() {
  const items = document.querySelectorAll('.nav-item');
  if (!items.length) return;

  items.forEach(item => {
    // Hover handled in CSS; keyboard + click toggle here
    const submenu = item.querySelector('.nav-sub');

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!submenu) return;
        submenu.classList.toggle('is-active');
        const expanded = submenu.classList.contains('is-active');
        item.setAttribute('aria-expanded', String(expanded));
      }
      if (e.key === 'Escape' && submenu?.classList.contains('is-active')) {
        submenu.classList.remove('is-active');
        item.setAttribute('aria-expanded', 'false');
        item.blur();
      }
    });

    item.addEventListener('click', (e) => {
      // Allow click to toggle on mobile
      if (!submenu) return;
      const already = submenu.classList.contains('is-active');
      document.querySelectorAll('.nav-sub.is-active').forEach(s => s.classList.remove('is-active'));
      submenu.classList.toggle('is-active', !already);
      item.setAttribute('aria-expanded', String(!already));
    });
  });

  // Click-away to close menus
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item')) {
      document.querySelectorAll('.nav-sub.is-active').forEach(s => s.classList.remove('is-active'));
      document.querySelectorAll('.nav-item[aria-expanded="true"]').forEach(i => i.setAttribute('aria-expanded', 'false'));
    }
  });
}

function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const navbar = document.querySelector('.navbar');
  if (!toggle || !navbar) return;

  toggle.addEventListener('click', () => {
    const open = navbar.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && e.target !== toggle) {
      navbar.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}


// Close hamburger when resizing back to desktop
function initNavResizeGuard() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.nav-toggle');
  if (!navbar || !toggle) return;
  const onResize = () => {
    if (window.innerWidth > 992 && navbar.classList.contains('is-open')) {
      navbar.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  };
  window.addEventListener('resize', onResize, { passive: true });
}

function initMobileMenu() {
  const header = document.getElementById('site-header');
  if (!header || header.dataset.mobileMenuInit === '1') return; // idempotent

  const btn = header.querySelector('.nav-toggle');
  const bar = header.querySelector('.navbar');
  if (!btn || !bar) return;

  header.dataset.mobileMenuInit = '1';

  const close = () => {
    bar.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  };

  btn.addEventListener('click', () => {
    const open = !bar.classList.contains('is-open');
    bar.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

/* Initialize when DOM is ready and after partials load */
function initAll() {
  if (window.__gasirimInitDone) return;   // <-- add this line
  window.__gasirimInitDone = true; 
  
  initReveal();
  initParallax();
  initNavDropdowns();
  initMobileMenu();
  initNavResizeGuard(); 
}

document.addEventListener('DOMContentLoaded', initAll);
document.addEventListener('partials:loaded', initAll);
document.addEventListener('partials:loaded', initMobileMenu);


