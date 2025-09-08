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


  // ---------- Header scroll behavior ----------
  function initHeaderScroll() {

    const header = document.querySelector('[data-header]');
    if (!header) return;
    let lastY = window.scrollY;
    const HYST = 3; // small deadzone

    const setHidden   = () => { header.classList.add('is-hidden'); header.classList.remove('is-scrolled','is-gradient'); document.documentElement.classList.remove('hdr-overlay'); header.setAttribute('aria-hidden', 'true');};
    const setWhite    = () => { header.classList.remove('is-hidden'); header.classList.add('is-scrolled'); header.classList.remove('is-gradient'); document.documentElement.classList.add('hdr-overlay'); header.setAttribute('aria-hidden', 'false');};
    const setGradient = () => { header.classList.remove('is-hidden'); header.classList.remove('is-scrolled'); header.classList.add('is-gradient'); document.documentElement.classList.add('hdr-overlay'); header.setAttribute('aria-hidden', 'false');};

    function onScroll(){
      const y = window.scrollY;
      const goingDown = y > lastY + HYST;
      const goingUp   = y < lastY - HYST;

      if (goingDown){
        if (y > 0) setHidden();
      } else if (goingUp){
        if (y <= 0) setGradient();
        else setWhite();
      }

      lastY = y;
    }

    // Initial state: gradient at top, otherwise hidden (until a scroll-up occurs)
    if (window.scrollY <= 0) setGradient(); else setHidden();

    addEventListener('scroll', () => { requestAnimationFrame(onScroll); }, { passive:true });
  }

  // ---------- Hero carousel ----------
  function initHeroCarousel() {
    const hero = document.querySelector('.embla');
    if (!hero || !markOnce(hero, 'heroCarouselBound')) return;

    const autoplay = EmblaCarouselAutoplay({ delay: 5000 });
    const embla = EmblaCarousel(hero.querySelector('.embla__viewport'), { loop: true }, [autoplay]);

    const prev = hero.querySelector('.embla__prev');
    const next = hero.querySelector('.embla__next');
    prev?.addEventListener('click', embla.scrollPrev);
    next?.addEventListener('click', embla.scrollNext);

    const assetTexts = hero.querySelectorAll('.asset-text');
    const setAsset = (i) => {
      assetTexts.forEach((el, idx) => el.classList.toggle('is-active', idx === i));
    };
    setAsset(embla.selectedScrollSnap());
    embla.on('select', () => setAsset(embla.selectedScrollSnap()));
  }

  // ---------- Boot ----------
  function initAll() {
    initReveal();
    initParallax();
    initNavDropdowns();
    initMobileMenu();
    initNavResizeGuard();
    initHeaderScroll();
    initHeroCarousel();
  }

  document.addEventListener('DOMContentLoaded', initAll);
  // Fired by includes.js after partials are injected
  document.addEventListener('partials:loaded', initAll);
  // ---------- Page heading auto-fill ----------
  document.addEventListener("DOMContentLoaded", () => {
    const heading = document.querySelector("#site-header .page-heading");
    if (heading) {
      // Example: "Shop | 가시림" → "Shop"
      const pageTitle = document.title.replace(" | 가시림", "");
      heading.textContent = pageTitle;
    }
  });
})();
