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
    document.querySelectorAll('#panel-facility-detail .space-card, #panel-garden-detail .space-card').forEach(card => {
      card.addEventListener('click', () => openModal(card));
    });

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
  });
})();
