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

  const applyFilter = (filter, cards) => {
    cards.forEach(card => {
      const matches = filter === 'all' || card.dataset.spaceType === filter;
      card.classList.toggle('is-hidden', !matches);
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    const cards = Array.from(document.querySelectorAll('[data-space-gallery] .space-card'));
    const normalise = (value) => (value || '').toString().trim().toLowerCase();
    const slugify = (value) => normalise(value).replace(/\s+/gu, '-');

    cards.forEach((card) => {
      if (!card.dataset.spaceId) {
        const fallback = card.dataset.title || card.querySelector('.space-card__title')?.textContent || '';
        if (fallback) {
          card.dataset.spaceId = fallback.trim();
        }
      }
    });

    cards.forEach(card => {
      card.addEventListener('click', () => openModal(card));
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openModal(card);
        }
      });
    });

    const filterButtons = Array.from(document.querySelectorAll('[data-space-filter]'));
    if (filterButtons.length) {
      filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          const filter = button.dataset.spaceFilter || 'all';
          filterButtons.forEach(btn => {
            const isActive = btn === button;
            btn.classList.toggle('is-active', isActive);
            btn.setAttribute('aria-pressed', String(isActive));
          });
          applyFilter(filter, cards);
        });
      });
    }

    document.getElementById('space-modal').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeModal();
    });

    document.querySelectorAll('#space-modal [data-close]').forEach(btn => {
      btn.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !document.getElementById('space-modal').hidden) {
        closeModal();
      }
    });

    if (filterButtons.length) {
      const active = filterButtons.find(btn => btn.classList.contains('is-active')) || filterButtons[0];
      filterButtons.forEach(btn => {
        const isActive = btn === active;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
      });
      applyFilter(active ? active.dataset.spaceFilter || 'all' : 'all', cards);
    }

    const openFromQuery = () => {
      const params = new URLSearchParams(window.location.search);
      let requested = params.get('space');
      if (!requested && window.location.hash.startsWith('#space=')) {
        requested = window.location.hash.slice('#space='.length);
      }
      if (!requested) return;

      const decoded = decodeURIComponent(requested);
      const target = normalise(decoded);
      const targetSlug = slugify(decoded);

      const match = cards.find((card) => {
        const id = card.dataset.spaceId || '';
        const idNorm = normalise(id);
        const idSlug = slugify(id);
        return idNorm === target || idSlug === targetSlug;
      });

      if (match) {
        openModal(match);
      }
    };

    openFromQuery();
  });
})();
