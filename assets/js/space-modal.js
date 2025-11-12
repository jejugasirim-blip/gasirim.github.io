(() => {
  'use strict';

  let emblaInstance = null;
  let spaceCards = [];
  let currentFilter = 'all';
  let queryHandled = false;

  function openModal(card) {
    const modal = document.getElementById('space-modal');
    const slides = modal.querySelector('#modal-slides');
    const titleEl = modal.querySelector('#modal-title');
    const descEl = modal.querySelector('#modal-desc');

    slides.innerHTML = '';
    const images = (card.dataset.images || '').split(',').map((s) => s.trim()).filter(Boolean);
    images.forEach((src) => {
      const slide = document.createElement('div');
      slide.className = 'embla__slide';
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      slide.appendChild(img);
      slides.appendChild(slide);
    });

    titleEl.textContent = card.dataset.title || '';
    descEl.textContent = card.dataset.desc || '';

    modal.hidden = false;

    emblaInstance = EmblaCarousel(modal.querySelector('.embla__viewport'), { loop: true });
    const prev = modal.querySelector('.embla__prev');
    const next = modal.querySelector('.embla__next');
    if (prev) prev.onclick = () => emblaInstance?.scrollPrev();
    if (next) next.onclick = () => emblaInstance?.scrollNext();
  }

  function closeModal() {
    const modal = document.getElementById('space-modal');
    modal.hidden = true;
    modal.querySelector('#modal-slides').innerHTML = '';
    if (emblaInstance) {
      emblaInstance.destroy();
      emblaInstance = null;
    }
  }

  const normalise = (value) => (value || '').toString().trim().toLowerCase();
  const slugify = (value) => normalise(value).replace(/\s+/gu, '-');

  const applyFilter = (filter) => {
    currentFilter = filter;
    spaceCards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.spaceType === filter;
      card.classList.toggle('is-hidden', !matches);
    });
  };

  function ensureSpaceIds(card) {
    if (!card.dataset.spaceId) {
      const fallback = card.dataset.title || card.querySelector('.space-card__title')?.textContent || '';
      if (fallback) card.dataset.spaceId = fallback.trim();
    }
  }

  function bindCardEvents(card) {
    if (card.dataset.spaceCardBound === '1') return;
    card.dataset.spaceCardBound = '1';
    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal(card);
      }
    });
  }

  function openFromQuery() {
    if (queryHandled) return;
    const params = new URLSearchParams(window.location.search);
    let requested = params.get('space');
    if (!requested && window.location.hash.startsWith('#space=')) {
      requested = window.location.hash.slice('#space='.length);
    }
    if (!requested) return;

    const decoded = decodeURIComponent(requested);
    const target = normalise(decoded);
    const targetSlug = slugify(decoded);

    const match = spaceCards.find((card) => {
      const id = card.dataset.spaceId || '';
      const idNorm = normalise(id);
      const idSlug = slugify(id);
      return idNorm === target || idSlug === targetSlug;
    });

    if (match) {
      openModal(match);
      queryHandled = true;
    }
  }

  function refreshSpaceCards() {
    const gallery = document.querySelector('[data-space-gallery]');
    if (!gallery) return;
    const cards = Array.from(gallery.querySelectorAll('.space-card'));
    if (!cards.length) return;
    spaceCards = cards;
    spaceCards.forEach((card) => {
      ensureSpaceIds(card);
      bindCardEvents(card);
    });
    applyFilter(currentFilter);
    openFromQuery();
  }

  function initFilters() {
    const filterButtons = Array.from(document.querySelectorAll('[data-space-filter]'));
    if (!filterButtons.length) return;
    filterButtons.forEach((button, index) => {
      if (index === 0 && !button.classList.contains('is-active')) {
        button.classList.add('is-active');
        button.setAttribute('aria-pressed', 'true');
      }
      button.addEventListener('click', () => {
        const filter = button.dataset.spaceFilter || 'all';
        filterButtons.forEach((btn) => {
          const isActive = btn === button;
          btn.classList.toggle('is-active', isActive);
          btn.setAttribute('aria-pressed', String(isActive));
        });
        applyFilter(filter);
      });
    });
  }

  function initModalChrome() {
    const modal = document.getElementById('space-modal');
    if (!modal || modal.dataset.modalBound === '1') return;
    modal.dataset.modalBound = '1';
    modal.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeModal();
    });
    document.querySelectorAll('#space-modal [data-close]').forEach((btn) => {
      btn.addEventListener('click', closeModal);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) {
        closeModal();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initModalChrome();
    initFilters();
    refreshSpaceCards();
  });

  document.addEventListener('spaces:ready', () => {
    refreshSpaceCards();
  });
})();
