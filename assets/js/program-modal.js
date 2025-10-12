(() => {
  'use strict';

  let currentIndex = 0;
  let images = [];
  let lastTrigger = null;

  const qs  = (sel, el = document) => el.querySelector(sel);
  const qsa = (sel, el = document) => Array.from(el.querySelectorAll(sel));

  // -------- Core open/close --------
  function openProgramModal(triggerEl) {
    lastTrigger = triggerEl;

    // Expecting data attributes on the trigger element:
    // data-images="url1,url2,..." (required)
    // data-title, data-subtitle, data-cta-label, data-cta-href (optional)
    images = (triggerEl.dataset.images || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (!images.length) return;

    const modal  = qs('#program-modal');
    const dialog = qs('.program-modal__dialog', modal);

    // Populate header
    const titleEl    = qs('.program-modal__title', modal);
    const subtitleEl = qs('.program-modal__subtitle', modal);
    const ctaEl      = qs('.program-modal__cta', modal);

    if (titleEl)    titleEl.textContent = triggerEl.dataset.title || '';
    if (subtitleEl) subtitleEl.textContent = triggerEl.dataset.subtitle || '';
    if (ctaEl) {
      const href  = triggerEl.dataset.ctaHref || '#';
      const label = triggerEl.dataset.ctaLabel || '';
      ctaEl.href = href;
      ctaEl.textContent = label;
      ctaEl.hidden = !label;
    }

    // Build stage and thumbs
    const stageEl    = qs('.program-modal__stage', modal);
    const thumbsWrap = qs('.program-modal__thumb-track', modal);
    thumbsWrap.innerHTML = '';

    images.forEach((src, i) => {
      const btn = document.createElement('button');
      btn.className = 'program-modal__thumb';
      btn.type = 'button';
      btn.dataset.index = String(i);
      btn.setAttribute('aria-label', `이미지 ${i + 1}`);
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      btn.appendChild(img);
      btn.addEventListener('click', () => goTo(i, modal, true));
      thumbsWrap.appendChild(btn);
    });

    // Stage image
    stageEl.innerHTML = '';
    const stageImg = document.createElement('img');
    stageEl.appendChild(stageImg);

    // Show modal
    modal.hidden = false;
    document.body.classList.add('modal-open');

    // Initial state
    currentIndex = 0;
    goTo(0, modal, false);

    // Focus management
    dialog.setAttribute('tabindex', '-1');
    dialog.focus();

    // Arrow controls
    const prevBtn = qs('.program-modal__thumb-arrow[data-dir="prev"]', modal);
    const nextBtn = qs('.program-modal__thumb-arrow[data-dir="next"]', modal);
    prevBtn?.addEventListener('click', () => goPrev(modal));
    nextBtn?.addEventListener('click', () => goNext(modal));

    // Save refs for cleanup
    modal._prevBtn = prevBtn;
    modal._nextBtn = nextBtn;
  }

  function closeProgramModal() {
    const modal = qs('#program-modal');
    if (!modal || modal.hidden) return;

    // Cleanup content
    const thumbsWrap = qs('.program-modal__thumb-track', modal);
    const stageEl    = qs('.program-modal__stage', modal);
    thumbsWrap && (thumbsWrap.innerHTML = '');
    stageEl && (stageEl.innerHTML = '');

    // Hide modal
    modal.hidden = true;
    document.body.classList.remove('modal-open');

    // Return focus to opener if possible
    if (lastTrigger && typeof lastTrigger.focus === 'function') {
      lastTrigger.focus();
    }

    images = [];
    currentIndex = 0;
  }

  // -------- Navigation helpers --------
  function goTo(index, modal, fromThumb) {
    if (!images.length) return;
    const count = images.length;
    currentIndex = ((index % count) + count) % count;

    const stageImg = qs('.program-modal__stage img', modal);
    if (stageImg) {
      stageImg.src = images[currentIndex];
      stageImg.alt = ''; // If you have alt texts, set them here
    }

    // Active thumb state
    const thumbs = qsa('.program-modal__thumb', modal);
    thumbs.forEach((t, i) => t.classList.toggle('is-active', i === currentIndex));

    // Ensure active thumb is visible when clicked via arrows
    if (!fromThumb) {
      const active = thumbs[currentIndex];
      active?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    }
  }

  function goPrev(modal) { goTo(currentIndex - 1, modal, false); }
  function goNext(modal) { goTo(currentIndex + 1, modal, false); }

  // -------- Wire up events on DOM ready --------
  document.addEventListener('DOMContentLoaded', () => {
    const modal = qs('#program-modal');
    if (!modal) return;

    // Openers: any element with data-program-open
    qsa('[data-program-open]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openProgramModal(el);
      });
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openProgramModal(el);
        }
      });
    });

    // Close controls
    const backdrop = qs('.program-modal__backdrop', modal);
    const closeBtn = qs('.program-modal__close', modal);

    backdrop?.addEventListener('click', closeProgramModal);
    closeBtn?.addEventListener('click', closeProgramModal);

    // Esc key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) {
        closeProgramModal();
      }
    });

    // Optional: deep-linking via ?program= or #program=
    const normalise = (v) => (v || '').toString().trim().toLowerCase();
    const slugify   = (v) => normalise(v).replace(/\s+/gu, '-');

    const openFromQuery = () => {
      const params = new URLSearchParams(window.location.search);
      let requested = params.get('program');
      if (!requested && window.location.hash.startsWith('#program=')) {
        requested = window.location.hash.slice('#program='.length);
      }
      if (!requested) return;

      const decoded   = decodeURIComponent(requested);
      const target    = normalise(decoded);
      const targetSlug= slugify(decoded);

      // Match against data-program-id or fall back to data-title
      const triggers = qsa('[data-program-open]');
      const match = triggers.find((el) => {
        const id   = el.dataset.programId || el.dataset.title || '';
        const norm = normalise(id);
        const slg  = slugify(id);
        return norm === target || slg === targetSlug;
      });

      if (match) openProgramModal(match);
    };

    // Ensure each opener has a stable id for deep links
    qsa('[data-program-open]').forEach((el) => {
      if (!el.dataset.programId) {
        const fallback = el.dataset.title || el.getAttribute('aria-label') || el.textContent || '';
        if (fallback) el.dataset.programId = fallback.trim();
      }
    });

    openFromQuery();
  });
})();
