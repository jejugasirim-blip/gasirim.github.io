(() => {
  'use strict';

  let emblaInstance = null;

  function openModal(card) {
    const modal = document.getElementById('space-modal');
    const slides = modal.querySelector('#modal-slides');
    const titleEl = modal.querySelector('#modal-title');
    const descEl = modal.querySelector('#modal-desc');

    // Populate slides
    slides.innerHTML = '';
    const images = (card.dataset.images || '').split(',').map(s => s.trim()).filter(Boolean);
    images.forEach(src => {
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
    prev.onclick = emblaInstance.scrollPrev;
    next.onclick = emblaInstance.scrollNext;
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

  document.addEventListener('DOMContentLoaded', () => {
    const modalRoot = document.getElementById('space-modal');
    const grid = document.querySelector('[data-space-grid]');
    const cards = grid ? Array.from(grid.querySelectorAll('.space-card')) : [];
    const filters = Array.from(document.querySelectorAll('.space-filter'));

    const bindCard = (card) => {
      if (!card) return;
      card.addEventListener('click', () => openModal(card));
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openModal(card);
        }
      });
    };

    cards.forEach(bindCard);

    const applyFilter = (value) => {
      const normalized = value === 'facility' ? 'facility' : value === 'garden' ? 'garden' : 'all';
      cards.forEach((card) => {
        const category = card.dataset.category || '';
        const match = normalized === 'all' || category === normalized;
        card.toggleAttribute('hidden', !match);
      });
      grid?.classList.remove('is-filtering');
      requestAnimationFrame(() => {
        grid?.classList.add('is-filtering');
      });
    };

    filters.forEach((btn) => {
      btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.toggle('is-active', b === btn));
        applyFilter(btn.dataset.filter || 'all');
      });
    });

    if (filters.length) {
      applyFilter(filters.find(btn => btn.classList.contains('is-active'))?.dataset.filter || 'all');
    }

    modalRoot?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeModal();
    });

    modalRoot?.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalRoot && !modalRoot.hidden) {
        closeModal();
      }
    });
  });
})();
