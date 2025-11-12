;(() => {
  'use strict';

  // ---------- Helpers ----------
  function markOnce(target, key) {
    if (!target) return false;
    if (target.dataset?.[key] === '1') return false;
    if (target.dataset) target.dataset[key] = '1';
    return true;
  }

  let PROGRAM_DATA = {};
  let PROGRAM_DATA_READY = false;

  document.addEventListener('program-data:ready', (event) => {
    PROGRAM_DATA = event?.detail?.programs || {};
    PROGRAM_DATA_READY = true;
  });


  
  function initProgramModals() {
    const modal = document.querySelector('[data-program-modal]');
    if (!modal || !markOnce(modal, 'programModalBound')) return;

    const bindModal = () => {
      if (!PROGRAM_DATA_READY) return false;
      const cards = document.querySelectorAll('[data-program-id]');
      if (!cards.length) return false;

      const dialog = modal.querySelector('.program-modal__dialog');
      const content = modal.querySelector('[data-program-modal-content]');
      let activeTrigger = null;

      const bindCloseTargets = () => {
        const closers = modal.querySelectorAll('[data-program-modal-close]');
        closers.forEach((closer) => {
          closer.addEventListener('click', (event) => {
            event.preventDefault();
            closeModal();
          });
        });
      };

      const updateGallery = (galleryRoot, images) => {
        const stageImg = galleryRoot.querySelector('[data-program-modal-stage]');
        const thumbButtons = Array.from(galleryRoot.querySelectorAll('.program-modal__thumb'));
        const prev = galleryRoot.querySelector('[data-program-modal-prev]');
        const next = galleryRoot.querySelector('[data-program-modal-next]');
        let activeIndex = 0;

        const setActive = (index) => {
          if (!images[index]) return;
          activeIndex = index;
          stageImg.src = images[index].src;
          stageImg.alt = images[index].alt;
          thumbButtons.forEach((btn, idx) => {
            btn.classList.toggle('is-active', idx === index);
            if (idx === index) {
              btn.setAttribute('aria-current', 'true');
              btn.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
            } else {
              btn.removeAttribute('aria-current');
            }
          });
        };

        thumbButtons.forEach((btn, idx) => {
          btn.addEventListener('click', () => setActive(idx));
        });

        prev?.addEventListener('click', () => {
          const nextIndex = (activeIndex - 1 + images.length) % images.length;
          setActive(nextIndex);
        });

        next?.addEventListener('click', () => {
          const nextIndex = (activeIndex + 1) % images.length;
          setActive(nextIndex);
        });

        setActive(0);
      };

      const renderModal = (id) => {
        const data = PROGRAM_DATA[id];
        if (!data) return false;
        content.innerHTML = '';

        const header = document.createElement('header');
        header.className = 'program-modal__header';
        header.innerHTML = `
          <div class="program-modal__header-top">
            <h2 class="program-modal__title" id="program-modal-title">${data.title}</h2>
            <a class="program-modal__cta" href="${data.ctaHref}" target="_blank" rel="noopener noreferrer">${data.ctaLabel}</a>
          </div>
          <p class="program-modal__subtitle">${data.subtitle}</p>
        `;
        content.appendChild(header);

        if (Array.isArray(data.gallery) && data.gallery.length) {
          const gallery = document.createElement('section');
          gallery.className = 'program-modal__gallery';
          gallery.setAttribute('aria-label', '프로그램 이미지 갤러리');
          gallery.innerHTML = `
            <figure class="program-modal__stage">
              <img src="${data.gallery[0].src}" alt="${data.gallery[0].alt}" data-program-modal-stage>
            </figure>
            <div class="program-modal__thumbs">
              <button type="button" class="program-modal__thumb-arrow" data-program-modal-prev aria-label="이전 이미지">&#8592;</button>
              <div class="program-modal__thumb-track" data-program-modal-track>
                ${data.gallery.map((image, index) => `
                  <button type="button" class="program-modal__thumb${index === 0 ? ' is-active' : ''}" data-index="${index}">
                    <img src="${image.src}" alt="${image.alt}">
                  </button>
                `).join('')}
              </div>
              <button type="button" class="program-modal__thumb-arrow" data-program-modal-next aria-label="다음 이미지">&#8594;</button>
            </div>
          `;
          content.appendChild(gallery);
          updateGallery(gallery, data.gallery);
        }

        const article = document.createElement('article');
        article.className = 'program-modal__article';
        article.innerHTML = data.bodyHtml;
        content.appendChild(article);

        content.scrollTop = 0;
        return true;
      };

      const closeModal = () => {
        if (modal.hasAttribute('hidden')) return;
        modal.setAttribute('hidden', '');
        modal.classList.remove('is-open');
        document.body.classList.remove('modal-open');
        content.innerHTML = '';
        if (activeTrigger) {
          activeTrigger.focus();
          activeTrigger = null;
        }
      };

      bindCloseTargets();

      const openModal = (id, trigger) => {
        if (!renderModal(id)) return;
        activeTrigger = trigger || null;
        modal.classList.add('is-open');
        modal.removeAttribute('hidden');
        document.body.classList.add('modal-open');
        if (dialog) {
          dialog.scrollTop = 0;
        }
        dialog?.focus({ preventScroll: true });
      };

      modal.addEventListener('click', (event) => {
        if (event.target.closest('[data-program-modal-close]')) {
          event.preventDefault();
          closeModal();
        }
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !modal.hasAttribute('hidden')) {
          event.preventDefault();
          closeModal();
        }
      });

      const normalise = (value) => (value || '').toString().trim().toLowerCase();

      cards.forEach((card) => {
        card.addEventListener('click', () => {
          const id = card.dataset.programId;
          openModal(id, card);
        });

        card.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const id = card.dataset.programId;
            openModal(id, card);
          }
        });
      });

      const openFromQuery = () => {
        const params = new URLSearchParams(window.location.search);
        let requested = params.get('program');
        if (!requested && window.location.hash.startsWith('#program=')) {
          requested = window.location.hash.slice('#program='.length);
        }
        if (!requested) return;

        const decoded = decodeURIComponent(requested);
        const target = normalise(decoded);

        const match = Array.from(cards).find((card) => normalise(card.dataset.programId) === target);
        if (match) {
          openModal(match.dataset.programId, match);
        }
      };

      openFromQuery();
      return true;
    };

    if (bindModal()) return;

    const handler = () => {
      if (bindModal()) {
        document.removeEventListener('program-data:ready', handler);
        document.removeEventListener('program-cards:ready', handler);
      }
    };

    document.addEventListener('program-data:ready', handler);
    document.addEventListener('program-cards:ready', handler);
  }

  function initHomeProgramList() {
    const container = document.querySelector('[data-program-list]');
    if (!container || !markOnce(container, 'homeProgramListBound')) return;

    const list = container.querySelector('[data-program-list-target]');
    if (!list) return;

    const renderList = () => {
      if (!PROGRAM_DATA_READY) return false;
      list.innerHTML = '';
      const fragment = document.createDocumentFragment();
      const entries = Object.entries(PROGRAM_DATA);

      entries.forEach(([id, data]) => {
        const item = document.createElement('li');
        item.className = 'home-programs__item';

        const title = document.createElement('h4');
        title.className = 'home-programs__title';
        title.textContent = data.title;

        const subtitle = document.createElement('p');
        subtitle.className = 'home-programs__subtitle';
        subtitle.textContent = data.subtitle;

        const link = document.createElement('a');
        link.className = 'home-programs__link';
        const encodedId = encodeURIComponent(id);
        link.href = `프로그램소개.html?program=${encodedId}`;
        link.textContent = '프로그램 자세히 보기';
        link.setAttribute('aria-label', `${data.title} 프로그램 자세히 보기`);

        item.appendChild(title);
        item.appendChild(subtitle);
        item.appendChild(link);
        fragment.appendChild(item);
      });

      list.appendChild(fragment);
      return true;
    };

    if (renderList()) return;
    const handler = () => {
      if (renderList()) {
        document.removeEventListener('program-data:ready', handler);
      }
    };
    document.addEventListener('program-data:ready', handler);
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
    const toggle = hero?.querySelector('[data-video-toggle]');
    const toggleText = toggle?.querySelector('.intro-video__toggle-text');
    if (!hero || !video || !markOnce(hero, 'introVideoBound')) return;

    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.controls = false;
    video.setAttribute('muted', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');

    const updateToggle = (isPlaying) => {
      if (!toggle) return;
      toggle.classList.toggle('is-paused', !isPlaying);
      toggle.setAttribute('aria-pressed', String(!isPlaying));
      const label = isPlaying ? '영상 일시 정지' : '영상 재생';
      toggle.setAttribute('aria-label', label);
      if (toggleText) {
        toggleText.textContent = isPlaying ? '일시 정지' : '재생';
      }
    };

    const attemptPlay = () => {
      video.play().catch(() => {
        /* Some browsers require user interaction before autoplay */
        updateToggle(!video.paused);
      });
    };

    const onVisibilityChange = () => {
      if (!document.hidden) {
        attemptPlay();
      }
    };

    const onToggleClick = () => {
      if (video.paused) {
        video.play().catch(() => {
          updateToggle(false);
        });
      } else {
        video.pause();
      }
    };

    if (toggle) {
      toggle.addEventListener('click', onToggleClick);
      toggle.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onToggleClick();
        }
      });
    }

    video.addEventListener('canplay', attemptPlay, { once: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    video.addEventListener('play', () => updateToggle(true));
    video.addEventListener('pause', () => updateToggle(false));

    updateToggle(!video.paused);
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
    const toggles = document.querySelectorAll('.nav-toggle');
    if (!toggles.length) return;

    toggles.forEach((toggle) => {
      if (!markOnce(toggle, 'menuBound')) return;

      const container = toggle.closest('header, [data-include]') || document;
      const navbar = container.querySelector('.navbar') || document.querySelector('.navbar');
      if (!navbar) return;

      const resetSubmenus = () => {
        navbar.querySelectorAll('.nav-sub.is-active')
          .forEach((submenu) => submenu.classList.remove('is-active'));
        navbar.querySelectorAll('.nav-item[aria-expanded="true"]')
          .forEach((item) => item.setAttribute('aria-expanded', 'false'));
      };

      const openMenu = () => {
        navbar.classList.add('is-open');
        toggle.classList.add('is-active');
        toggle.setAttribute('aria-expanded', 'true');
      };

      const close = () => {
        navbar.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        resetSubmenus();
      };

      toggle.addEventListener('click', () => {
        if (navbar.classList.contains('is-open')) {
          close();
        } else {
          resetSubmenus();
          openMenu();
        }
      });

      document.addEventListener('click', (e) => {
        if (!navbar.classList.contains('is-open')) return;
        if (!navbar.contains(e.target) && !toggle.contains(e.target)) close();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
      });
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
        navbar.querySelectorAll('.nav-sub.is-active')
          .forEach((submenu) => submenu.classList.remove('is-active'));
        navbar.querySelectorAll('.nav-item[aria-expanded="true"]')
          .forEach((item) => item.setAttribute('aria-expanded', 'false'));
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
      const requestedDuration = Number(gallery.dataset.galleryDuration || 35);
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

  // ---------- Shop filtering ----------
  function initShopFilters() {
    const catalog = document.querySelector('.shop-catalog');
    if (!catalog || !markOnce(catalog, 'shopFiltersBound')) return;

    const normalise = (value) => (value || '').trim().toLowerCase();

    const bindFilters = () => {
      const buttons = Array.from(catalog.querySelectorAll('[data-filter]'));
      const cards = Array.from(catalog.querySelectorAll('[data-category]'));
      if (!buttons.length || !cards.length) return false;

      const applyFilter = (filter) => {
        const target = normalise(filter) || 'all';
        cards.forEach((card) => {
          const category = normalise(card.dataset.category);
          const matches = target === 'all' || category === target;
          card.classList.toggle('is-hidden', !matches);
        });
      };

      const updateUrl = (filter) => {
        if (!window.history?.replaceState) return;
        const url = new URL(window.location.href);
        if (!filter || normalise(filter) === 'all') {
          url.searchParams.delete('category');
        } else {
          url.searchParams.set('category', normalise(filter));
        }
        window.history.replaceState({}, '', url);
      };

      const activate = (button) => {
        const filter = button?.dataset.filter || 'all';
        buttons.forEach((btn) => {
          const isActive = btn === button;
          btn.classList.toggle('is-active', isActive);
          btn.setAttribute('aria-pressed', String(isActive));
        });
        applyFilter(filter);
        updateUrl(filter);
      };

      buttons.forEach((button) => {
        button.addEventListener('click', () => {
          activate(button);
        });
      });

      const params = new URLSearchParams(window.location.search);
      const requested = normalise(params.get('category'));
      const initialButton = buttons.find((btn) => normalise(btn.dataset.filter) === requested) || buttons[0];
      activate(initialButton);
      return true;
    };

    if (bindFilters()) return;

    const handler = () => {
      if (bindFilters()) {
        document.removeEventListener('shop:ready', handler);
      }
    };
    document.addEventListener('shop:ready', handler);
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
    initHomeProgramList();
    initProgramModals();
    initShopFilters();
  }

  function main() {
    initAll();
  }

  document.addEventListener('DOMContentLoaded', main);
  // Fired by includes.js after partials are injected
  document.addEventListener('partials:loaded', main);
  
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

// ===== Popup from CMS (Decap) =====
(function () {
  const POPUP_SOURCE = 'cms'; // later: 'sheets' for fallback

  // Keys for "오늘 다시 보지 않기"
  const STORAGE_KEY = 'gasirim_popup_hide_until';
  const SESSION_KEY = 'gasirim_popup_closed_session';

  // ------- data loaders -------
  async function fetchFromCMS() {
    try {
      const res = await fetch('/data/popups.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('popups.json not found');
      const json = await res.json();
      return Array.isArray(json.items) ? json.items : [];
    } catch (e) {
      console.warn('[popup] CMS fetch failed:', e);
      return [];
    }
  }

  // Optional: implement if you later switch to Google Sheets
  async function fetchFromSheet() {
    // TODO: return [{...} items] from your published sheet
    return [];
  }

  function normalize(item) {
    return {
      enabled: !!item.enabled,
      priority: Number(item.priority ?? 10),
      locale: item.locale || 'ko',
      title: item.title || '',
      body: item.body || '',
      btn_text: item.btn_text || '자세히 보기',
      btn_url: item.btn_url || '#',
      image_url: item.image || item.image_url || '',
      start_date: item.start_date || '',
      end_date: item.end_date || '',
      once_per_day: !!item.once_per_day
    };
  }

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function isActiveToday(cfg) {
    const t = todayISO();
    return (!cfg.start_date || cfg.start_date <= t) &&
           (!cfg.end_date   || t <= cfg.end_date);
  }

  function shouldShowPopup() {
    try {
      const hideUntil = Number(localStorage.getItem(STORAGE_KEY) || 0);
      const closedThisSession = sessionStorage.getItem(SESSION_KEY) === '1';
      if (closedThisSession) return false;
      return Date.now() > hideUntil;
    } catch { return true; }
  }

  function endOfTodayLocal() {
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return end.getTime();
  }

  // ------- DOM helpers -------
  function mountRoot() {
    let root = document.getElementById('popup-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'popup-root';
      document.body.appendChild(root);
    }
    return root;
  }

  function renderPopup(cfg) {
    const root = mountRoot();
    root.innerHTML = `
      <div class="popup-overlay" data-popup-overlay style="position:fixed;inset:0;background:rgba(0,0,0,.45);display:none;align-items:center;justify-content:center;z-index:9999;backdrop-filter:blur(2px);">
        <section class="popup" role="dialog" aria-modal="true" tabindex="-1" data-popup
          style="width:min(560px,92vw);background:#fff;color:#111;border-radius:16px;box-shadow:0 18px 40px rgba(0,0,0,.25);overflow:hidden;transform:translateY(12px);opacity:0;transition:transform .26s ease,opacity .26s ease; position:relative;">
          <button class="popup-close" type="button" aria-label="닫기" data-popup-close
            style="position:absolute;top:10px;right:10px;width:36px;height:36px;display:grid;place-items:center;border-radius:999px;border:1px solid #e6e6e6;background:#fff;cursor:pointer;">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M18.3 5.7a1 1 0 0 0-1.4-1.4L12 9.17 7.1 4.3a1 1 0 1 0-1.4 1.4L10.83 12l-5.13 4.9a1 1 0 1 0 1.4 1.45L12 14.83l4.9 4.52a1 1 0 0 0 1.45-1.4L13.17 12l5.13-4.9Z"/></svg>
          </button>

          ${cfg.image_url ? `<div class="popup-media" aria-hidden="true" style="aspect-ratio:16/9;background:url('${cfg.image_url}') center/cover no-repeat;"></div>` : ''}

          <div class="popup-body" style="padding:20px 20px 8px;">
            <div class="popup-eyebrow" style="font-size:12px;color:#555;letter-spacing:.08em;text-transform:uppercase;">가시림 안내</div>
            <h2 class="popup-title" style="margin:6px 0 8px;font-size:clamp(20px,3.6vw,28px);letter-spacing:-.01em;">${escapeHtml(cfg.title)}</h2>
            <p class="popup-text" style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#555;">${escapeHtml(cfg.body)}</p>
          </div>

          <div class="popup-actions" style="display:flex;gap:8px;padding:0 20px 16px;">
            ${cfg.btn_url ? `<a class="btn primary" href="${cfg.btn_url}" data-popup-primary
              style="appearance:none;border:1px solid #111;background:#111;color:#fff;padding:10px 14px;border-radius:10px;cursor:pointer;font-weight:500;text-decoration:none;">${escapeHtml(cfg.btn_text || '자세히 보기')}</a>` : ''}
            <button class="btn" type="button" data-popup-close-plain
              style="appearance:none;border:1px solid #e6e6e6;background:#fff;color:#111;padding:10px 14px;border-radius:10px;cursor:pointer;font-weight:500;">닫기</button>
          </div>

          <div class="popup-footer" style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 16px;border-top:1px solid #e6e6e6;">
            <label class="dont-show" style="display:inline-flex;align-items:center;gap:8px;font-size:14px;color:#555;">
              <input type="checkbox" id="dontShowToday" style="width:16px;height:16px;" /> 오늘 다시 보지 않기
            </label>
            <small style="color:#555">필요 시 설정 &gt; 사이트 데이터에서 재설정</small>
          </div>
        </section>
      </div>
    `;

    const overlay = root.querySelector('[data-popup-overlay]');
    const dialog  = root.querySelector('[data-popup]');
    const dontShow = root.querySelector('#dontShowToday');

    function lockScroll(lock) { document.body.style.overflow = lock ? 'hidden' : ''; }
    function open() {
      overlay.style.display = 'flex';
      requestAnimationFrame(() => {
        dialog.style.transform = 'translateY(0)'; dialog.style.opacity = '1';
      });
      lockScroll(true);
      setTimeout(() => dialog.focus(), 0);
      document.addEventListener('keydown', onEsc);
      document.addEventListener('keydown', trapTab);
      overlay.addEventListener('click', onOverlay);
      root.querySelectorAll('[data-popup-close],[data-popup-close-plain],[data-popup-primary]').forEach(b=>{
        b && b.addEventListener('click', () => close(dontShow.checked));
      });
    }
    function close(persistToday) {
      overlay.style.display = 'none';
      dialog.style.transform = 'translateY(12px)'; dialog.style.opacity = '0';
      lockScroll(false);
      document.removeEventListener('keydown', onEsc);
      document.removeEventListener('keydown', trapTab);
      overlay.removeEventListener('click', onOverlay);
      sessionStorage.setItem(SESSION_KEY, '1');
      if (persistToday) localStorage.setItem(STORAGE_KEY, String(endOfTodayLocal()));
    }
    function onOverlay(e){ if (e.target === overlay) close(dontShow.checked); }
    function onEsc(e){ if (e.key === 'Escape') close(dontShow.checked); }
    function trapTab(e){
      if (e.key !== 'Tab') return;
      const list = dialog.querySelectorAll('a[href],button,input,textarea,select,[tabindex]:not([tabindex="-1"])');
      const arr = Array.from(list).filter(el=>!el.disabled);
      if (!arr.length) return;
      const first = arr[0], last = arr[arr.length-1];
      if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    }

    // Auto-open once per day unless user opted out
    if (shouldShowPopup()) open();
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  // ------- bootstrap -------
  (async function init() {
    const items = (POPUP_SOURCE === 'cms') ? await fetchFromCMS() : await fetchFromSheet();
    const active = items.map(normalize).filter(c => c.enabled && isActiveToday(c))
      .sort((a,b) => (b.priority||0) - (a.priority||0))[0];
    if (!active) return;
    renderPopup(active);
  })();
})();
