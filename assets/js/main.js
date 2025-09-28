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

  // ---------- Intro video autoplay ----------
  function initIntroVideo() {
    const hero = document.querySelector('.intro-hero[data-video]');
    const video = hero?.querySelector('video');
    if (!hero || !video || !markOnce(hero, 'introVideoBound')) return;

    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.controls = false;
    video.setAttribute('muted', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');

    const attemptPlay = () => {
      video.play().catch(() => {
        /* Some browsers require user interaction before autoplay */
      });
    };

    const onVisibilityChange = () => {
      if (!document.hidden) {
        attemptPlay();
      }
    };

    video.addEventListener('canplay', attemptPlay, { once: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    attemptPlay();
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

    const setHidden   = () => { header.classList.add('is-hidden'); header.classList.remove('is-scrolled','is-gradient'); document.documentElement.classList.remove('hdr-overlay'); };
    const setWhite    = () => { header.classList.remove('is-hidden'); header.classList.add('is-scrolled'); header.classList.remove('is-gradient'); document.documentElement.classList.add('hdr-overlay'); };
    const setGradient = () => { header.classList.remove('is-hidden'); header.classList.remove('is-scrolled'); header.classList.add('is-gradient'); document.documentElement.classList.add('hdr-overlay'); };

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

  // ---------- Intro gallery slider ----------
  function initIntroGalleries() {
    const galleries = document.querySelectorAll('[data-gallery]');
    if (!galleries.length) return;

    galleries.forEach((gallery) => {
      if (!markOnce(gallery, 'introGalleryBound')) return;

      const track = gallery.querySelector('.intro-gallery-track');
      const viewport = gallery.querySelector('.intro-gallery-viewport');
      const baseSlides = track ? Array.from(track.children) : [];
      const prev = gallery.querySelector('[data-gallery-prev]');
      const next = gallery.querySelector('[data-gallery-next]');

      if (!track || !viewport || baseSlides.length <= 1) {
        prev?.setAttribute('disabled', '');
        next?.setAttribute('disabled', '');
        return;
      }

      // Clone slides to create a seamless loop
      baseSlides.forEach((slide) => {
        const clone = slide.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.dataset.clone = 'true';
        track.appendChild(clone);
      });

      let itemWidth = 0;
      let loopWidth = 0;
      let offset = 0;
      let animationId = null;
      let lastTs = null;
      let pendingStart = false;
      const requestedSpeed = Number(gallery.dataset.gallerySpeed);
      const hasExplicitSpeed = Number.isFinite(requestedSpeed) && requestedSpeed > 0;
      const requestedDuration = Number(gallery.dataset.galleryDuration || 20);
      let pixelsPerSecond = hasExplicitSpeed ? requestedSpeed : 0;
      const motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
      let allowAutoplay = !(motionQuery?.matches);
      const getTransitionDuration = () => {
        const raw = window.getComputedStyle(gallery).getPropertyValue('--intro-gallery-transition').trim();
        if (!raw) return 600;
        if (raw.endsWith('ms')) {
          const value = parseFloat(raw);
          return Number.isFinite(value) ? value : 600;
        }
        if (raw.endsWith('s')) {
          const value = parseFloat(raw);
          return Number.isFinite(value) ? value * 1000 : 600;
        }
        const value = parseFloat(raw);
        return Number.isFinite(value) ? value : 600;
      };
      const transitionDurationMs = getTransitionDuration();

      const wrapOffset = (value) => {
        if (!loopWidth) return value;
        let wrapped = value % loopWidth;
        if (wrapped < 0) wrapped += loopWidth;
        return wrapped;
      };

      const applyTransform = () => {
        track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      };

      const measure = () => {
        if (!baseSlides.length) return;
        const rect = baseSlides[0].getBoundingClientRect();
        if (!rect.width) {
          requestAnimationFrame(measure);
          return;
        }
        const style = window.getComputedStyle(baseSlides[0]);
        const margin = (parseFloat(style.marginLeft) || 0) + (parseFloat(style.marginRight) || 0);
        itemWidth = rect.width + margin;
        loopWidth = itemWidth * baseSlides.length;
        if (!hasExplicitSpeed) {
          const duration = Number.isFinite(requestedDuration) && requestedDuration > 0 ? requestedDuration : 20;
          pixelsPerSecond = loopWidth / duration;
        }
        offset = wrapOffset(offset);
        applyTransform();
        if (pendingStart && allowAutoplay && !animationId && !document.hidden) {
          pendingStart = false;
          startAutoplay();
        }
      };

      const step = (ts) => {
        if (!allowAutoplay) {
          animationId = null;
          return;
        }
        if (lastTs == null) lastTs = ts;
        const delta = ts - lastTs;
        lastTs = ts;
        if (loopWidth && delta > 0 && pixelsPerSecond > 0) {
          const advance = (pixelsPerSecond * delta) / 1000;
          offset = wrapOffset(offset + advance);
          applyTransform();
        }
        animationId = requestAnimationFrame(step);
      };

      const startAutoplay = () => {
        if (!allowAutoplay || animationId) return;
        if (!itemWidth || !loopWidth) {
          pendingStart = true;
          measure();
          return;
        }
        gallery.classList.add('is-autoplaying');
        lastTs = null;
        animationId = requestAnimationFrame(step);
      };

      const stopAutoplay = () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
        lastTs = null;
        pendingStart = false;
        gallery.classList.remove('is-autoplaying');
      };

      const snapToNearest = () => {
        if (!itemWidth || !loopWidth) return;
        offset = wrapOffset(Math.round(offset / itemWidth) * itemWidth);
        applyTransform();
      };

      const shiftBy = (deltaSlides) => {
        if (!itemWidth || !loopWidth) return;
        stopAutoplay();
        snapToNearest();
        offset = wrapOffset(offset + deltaSlides * itemWidth);
        track.classList.add('is-animating');
        applyTransform();
        const onEnd = () => {
          track.classList.remove('is-animating');
          track.removeEventListener('transitionend', onEnd);
          startAutoplay();
        };
        track.addEventListener('transitionend', onEnd, { once: true });
        // Fallback in case transitionend doesn't fire (e.g., reduced-motion settings)
        window.setTimeout(() => {
          if (track.classList.contains('is-animating')) {
            track.classList.remove('is-animating');
            startAutoplay();
          }
        }, transitionDurationMs + 100);
      };

      prev?.addEventListener('click', () => shiftBy(-1));
      next?.addEventListener('click', () => shiftBy(1));

      const onVisibilityChange = () => {
        if (document.hidden) {
          stopAutoplay();
        } else {
          startAutoplay();
        }
      };

      document.addEventListener('visibilitychange', onVisibilityChange);

      const onMotionPreferenceChange = () => {
        allowAutoplay = !(motionQuery?.matches);
        if (!allowAutoplay) {
          stopAutoplay();
        } else {
          startAutoplay();
        }
      };
      if (motionQuery?.addEventListener) {
        motionQuery.addEventListener('change', onMotionPreferenceChange);
      } else if (motionQuery?.addListener) {
        motionQuery.addListener(onMotionPreferenceChange);
      }

      measure();
      window.addEventListener('resize', measure, { passive: true });
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });
  }

  // ---------- Boot ----------
  function initAll() {
    initReveal();
    initParallax();
    initIntroVideo();
    initNavDropdowns();
    initMobileMenu();
    initNavResizeGuard();
    initHeaderScroll();
    initHeroCarousel();
    initIntroGalleries();
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
