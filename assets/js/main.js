;(() => {
  'use strict';

  // ---------- Helpers ----------
  function markOnce(target, key) {
    if (!target) return false;
    if (target.dataset?.[key] === '1') return false;
    if (target.dataset) target.dataset[key] = '1';
    return true;
  }

  // ---------- Reveal on scroll ----------
  function initReveal() {
    const root = document.documentElement;
    if (!markOnce(root, 'revealInit')) return;

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

  // ---------- Parallax for hero image ----------
  function initParallax() {
    const el = document.querySelector('.intro-hero.parallax');
    if (!el || !markOnce(el, 'parallaxBound')) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const offset = (window.innerHeight - rect.top) * 0.06;
      el.style.transform = `translateY(${offset.toFixed(2)}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------- Dropdown menus (keyboard + click) ----------
  function initNavDropdowns() {
    const root = document.documentElement;
    if (!markOnce(root, 'dropdownsBound')) return;

    const items = document.querySelectorAll('.nav-item');
    if (!items.length) return;

    items.forEach(item => {
      const submenu = item.querySelector('.nav-sub');

      item.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && submenu) {
          e.preventDefault();
          const willOpen = !submenu.classList.contains('is-active');
          document.querySelectorAll('.nav-sub.is-active').forEach(s => s.classList.remove('is-active'));
          submenu.classList.toggle('is-active', willOpen);
          item.setAttribute('aria-expanded', String(willOpen));
        }
        if (e.key === 'Escape' && submenu?.classList.contains('is-active')) {
          submenu.classList.remove('is-active');
          item.setAttribute('aria-expanded', 'false');
          item.blur();
        }
      });

      item.addEventListener('click', () => {
        if (!submenu) return;
        const willOpen = !submenu.classList.contains('is-active');
        document.querySelectorAll('.nav-sub.is-active').forEach(s => s.classList.remove('is-active'));
        submenu.classList.toggle('is-active', willOpen);
        item.setAttribute('aria-expanded', String(willOpen));
      });
    });

    // Click-away to close any open submenus
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-item')) {
        document.querySelectorAll('.nav-sub.is-active').forEach(s => s.classList.remove('is-active'));
        document.querySelectorAll('.nav-item[aria-expanded="true"]')
          .forEach(i => i.setAttribute('aria-expanded', 'false'));
      }
    });
  }

  // ---------- Mobile hamburger (animated, top-right popover) ----------
  function initMobileMenu() {
    // If header is injected into #landing-header or #site-header, bind within it; otherwise fall back to document
    const host = document.querySelector('#landing-header, #site-header') || document;

    const toggle = host.querySelector('.nav-toggle');
    const navbar = host.querySelector('.navbar');
    if (!toggle || !navbar) return;

    // prevent double-binding if partials fire multiple times
    if (!markOnce(toggle, 'menuBound')) return;

    const close = () => {
      navbar.classList.remove('is-open');
      toggle.classList.remove('is-active');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
      const open = !navbar.classList.contains('is-open');
      navbar.classList.toggle('is-open', open);
      toggle.classList.toggle('is-active', open); // rotates the icon via CSS
      toggle.setAttribute('aria-expanded', String(open));
    });

    // Click-away to close
    document.addEventListener('click', (e) => {
      if (!navbar.classList.contains('is-open')) return;
      if (!navbar.contains(e.target) && !toggle.contains(e.target)) close();
    });

    // Escape to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  }

  // ---------- Guard: close hamburger when resizing to desktop ----------
  function initNavResizeGuard() {
    if (window.__resizeGuardBound) return;
    window.__resizeGuardBound = true;

    const onResize = () => {
      const navbar = document.querySelector('.navbar');
      const toggle = document.querySelector('.nav-toggle');
      if (!navbar || !toggle) return;

      if (window.innerWidth > 992 && navbar.classList.contains('is-open')) {
        navbar.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    };
    window.addEventListener('resize', onResize, { passive: true });
  }

  // ---------- Boot ----------
  function initAll() {
    initReveal();
    initParallax();
    initNavDropdowns();
    initMobileMenu();
    initNavResizeGuard();
  }

  document.addEventListener('DOMContentLoaded', initAll);
  // Fired by includes.js after partials are injected
  document.addEventListener('partials:loaded', initAll);
})();
