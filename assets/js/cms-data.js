;(() => {
  'use strict';

  const cache = new Map();

  function loadJSON(path) {
    if (!cache.has(path)) {
      const request = fetch(path, { cache: 'no-store' }).then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
        return res.json();
      });
      cache.set(path, request);
    }
    return cache.get(path);
  }

  function asParagraphs(list) {
    return (list || []).map((entry) => (typeof entry === 'string' ? entry : entry?.text || '')).filter(Boolean);
  }

  function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  async function initIndexIntros() {
    const targets = document.querySelectorAll('[data-index-intro]');
    if (!targets.length) return;
    try {
      const data = await loadJSON('data/index-intros.json');
      const map = new Map((data.intros || []).map((item) => [item.id, item]));
      targets.forEach((container) => {
        const id = container.dataset.indexIntro;
        const item = map.get(id);
        if (!item) return;
        container.innerHTML = '';

        const eyebrow = createEl('p', 'home-programs__eyebrow', item.eyebrow || '');
        const heading = createEl('h3', item.heading_class || 'h', item.heading || '');
        container.appendChild(eyebrow);
        container.appendChild(heading);

        asParagraphs(item.paragraphs).forEach((text) => {
          container.appendChild(createEl('p', item.paragraph_class || 'p', text));
        });

        if (item.button?.href) {
          const button = createEl('a', 'intro-button', item.button.label || '자세히 보기');
          button.href = item.button.href;
          container.appendChild(button);
        }
      });
    } catch (err) {
      console.error('[cms-data] Failed to load index intros', err);
    }
  }

  function buildSpaceCard(space) {
    const card = document.createElement('article');
    card.className = 'space-card';
    card.setAttribute('role', 'button');
    card.tabIndex = 0;
    card.dataset.spaceType = space.space_type || 'facility';
    card.dataset.images = (space.gallery || []).join(',');
    card.dataset.title = space.title || space.id || '';
    card.dataset.desc = space.description || '';
    if (space.space_id) {
      card.dataset.spaceId = space.space_id;
    }

    const figure = document.createElement('figure');
    figure.className = 'space-card__media';
    const img = document.createElement('img');
    img.src = space.image?.src || '';
    img.alt = space.image?.alt || '';
    img.loading = 'lazy';
    figure.appendChild(img);

    const body = document.createElement('div');
    body.className = 'space-card__body';
    body.appendChild(createEl('h3', 'space-card__title', space.title || ''));
    body.appendChild(createEl('p', 'space-card__summary', space.summary || ''));

    card.appendChild(figure);
    card.appendChild(body);
    return card;
  }

  async function initSpaces() {
    const galleryRoot = document.querySelector('[data-space-gallery]');
    const tourRoot = document.querySelector('[data-gallery-cards]');
    if (!galleryRoot && !tourRoot) return;
    try {
      const data = await loadJSON('data/spaces.json');
      if (galleryRoot) {
        galleryRoot.innerHTML = '';
        (data.spaces || []).forEach((space) => {
          galleryRoot.appendChild(buildSpaceCard(space));
        });
        document.dispatchEvent(new Event('spaces:ready'));
      }
      if (tourRoot) {
        tourRoot.innerHTML = '';
        (data.gallery || []).forEach((item) => {
          const article = document.createElement('article');
          article.className = 'card';
          const img = document.createElement('img');
          img.className = 'card-img';
          img.src = item.src;
          img.alt = item.alt || '';
          img.loading = 'lazy';
          article.appendChild(img);
          tourRoot.appendChild(article);
        });
      }
    } catch (err) {
      console.error('[cms-data] Failed to load spaces', err);
    }
  }

  async function initProgramSummaries() {
    const nodes = document.querySelectorAll('[data-program-summary]');
    if (!nodes.length) return;
    try {
      const data = await loadJSON('data/program-summaries.json');
      const map = new Map((data.summaries || []).map((entry) => [entry.id, entry.excerpt]));
      nodes.forEach((node) => {
        const text = map.get(node.dataset.programSummary);
        if (text) node.textContent = text;
      });
    } catch (err) {
      console.error('[cms-data] Failed to load program summaries', err);
    }
  }

  function createProgramCard(program) {
    const card = document.createElement('article');
    card.className = 'program-card';
    card.setAttribute('role', 'button');
    card.tabIndex = 0;
    card.setAttribute('aria-haspopup', 'dialog');
    card.dataset.programId = program.id;

    const figure = document.createElement('figure');
    figure.className = 'program-card__media';
    const img = document.createElement('img');
    img.src = program.card.image?.src || '';
    img.alt = program.card.image?.alt || '';
    img.loading = 'lazy';
    figure.appendChild(img);

    const body = document.createElement('div');
    body.className = 'program-card__body';

    const meta = document.createElement('div');
    meta.className = 'program-card__meta';
    meta.appendChild(createEl('p', 'program-hero__eyebrow', program.card.eyebrow || ''));
    meta.appendChild(createEl('p', 'program-card__category', program.card.category || ''));
    meta.appendChild(createEl('p', 'program-card__subtitle', program.card.subtitle || ''));

    body.appendChild(meta);
    body.appendChild(createEl('p', 'program-card__description', program.card.description || ''));

    const footer = document.createElement('div');
    footer.className = 'program-card__footer';
    footer.appendChild(createEl('p', 'program-card__duration', program.card.duration || ''));
    footer.appendChild(createEl('p', 'program-card__price', program.card.price || ''));
    body.appendChild(footer);

    card.appendChild(figure);
    card.appendChild(body);
    return card;
  }

  function renderProgramGrids(programs) {
    const grids = document.querySelectorAll('[data-program-grid]');
    if (!grids.length) {
      document.dispatchEvent(new Event('program-cards:ready'));
      return;
    }
    grids.forEach((grid) => {
      const filter = grid.dataset.programGrid || 'all';
      const fragment = document.createDocumentFragment();
      programs
        .filter((program) => program.visible !== false)
        .filter((program) => program.card)
        .filter((program) => {
          if (filter === 'all') return true;
          if (filter === 'featured') return !!program.featured;
          return (program.categories || []).includes(filter);
        })
        .forEach((program) => {
          fragment.appendChild(createProgramCard(program));
        });
      grid.innerHTML = '';
      grid.appendChild(fragment);
    });
    document.dispatchEvent(new Event('program-cards:ready'));
  }

  async function initPrograms() {
    try {
      const data = await loadJSON('data/programs.json');
      const map = {};
      (data.programs || []).forEach((program) => {
        map[program.id] = program.modal;
      });
      window.PROGRAM_DATA = map;
      window.PROGRAM_DATA_READY = true;
      document.dispatchEvent(new CustomEvent('program-data:ready', { detail: { programs: map } }));
      renderProgramGrids(data.programs || []);
    } catch (err) {
      console.error('[cms-data] Failed to load program data', err);
    }
  }

  function buildProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    if (product.category) card.dataset.category = product.category;

    const figure = document.createElement('figure');
    figure.className = 'product-card__media';
    if (product.media?.type === 'image' && product.media.src) {
      const img = document.createElement('img');
      img.src = product.media.src;
      img.alt = product.media.alt || '';
      img.loading = 'lazy';
      figure.appendChild(img);
    } else {
      figure.classList.add('product-card__media--placeholder');
      figure.setAttribute('aria-hidden', 'true');
      figure.appendChild(document.createTextNode(product.media?.text || '상품 준비 중'));
    }

    const copy = document.createElement('div');
    copy.className = 'product-card__copy';
    copy.appendChild(createEl('p', 'product-card__description', product.description || ''));

    const purchase = document.createElement('div');
    purchase.className = 'product-card__purchase';
    purchase.appendChild(createEl('p', 'product-card__price', product.price || ''));
    if (product.cta?.href) {
      const cta = createEl('a', 'product-card__cta', product.cta.label || '바로가기');
      cta.href = product.cta.href;
      cta.target = '_blank';
      cta.rel = 'noopener noreferrer';
      purchase.appendChild(cta);
    }
    copy.appendChild(purchase);

    card.appendChild(figure);
    card.appendChild(copy);
    return card;
  }

  async function initShop() {
    const filterRoot = document.querySelector('[data-shop-filters]');
    const gridRoot = document.querySelector('[data-shop-grid]');
    if (!filterRoot && !gridRoot) return;
    try {
      const data = await loadJSON('data/shop.json');
      if (filterRoot) {
        filterRoot.innerHTML = '';
        (data.filters || []).forEach((filter, index) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'shop-filter';
          if (index === 0) {
            button.classList.add('is-active');
            button.setAttribute('aria-pressed', 'true');
          } else {
            button.setAttribute('aria-pressed', 'false');
          }
          button.dataset.filter = filter.value || 'all';
          button.textContent = filter.label || '';
          filterRoot.appendChild(button);
        });
      }
      if (gridRoot) {
        gridRoot.innerHTML = '';
        (data.products || []).forEach((product) => {
          gridRoot.appendChild(buildProductCard(product));
        });
      }
      document.dispatchEvent(new Event('shop:ready'));
    } catch (err) {
      console.error('[cms-data] Failed to load shop data', err);
    }
  }

  const visitIcons = {
    transport: `
      <svg viewBox="0 0 24 24" focusable="false">
        <rect x="4" y="5" width="16" height="11" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="1.6"></rect>
        <line x1="4" y1="10.5" x2="20" y2="10.5" stroke="currentColor" stroke-width="1.6"></line>
        <circle cx="9" cy="17" r="1.2" fill="currentColor"></circle>
        <circle cx="15" cy="17" r="1.2" fill="currentColor"></circle>
      </svg>
    `,
    weather: `
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M4 12a5 5 0 0 1 5-5h6a5 5 0 0 1 0 10H7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M16 17c-1.2-1.4-2.8-2.1-4.8-2.1" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path>
        <line x1="6" y1="18.5" x2="11" y2="18.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></line>
      </svg>
    `
  };

  async function initVisit() {
    const hoursList = document.querySelector('[data-visit-hours-list]');
    const hoursImage = document.querySelector('[data-visit-image]');
    const notesRoot = document.querySelector('[data-visit-notes]');
    const rateBody = document.querySelector('[data-visit-rate-body]');
    const guidelineRoot = document.querySelector('[data-visit-guidelines]');
    if (!hoursList && !rateBody && !guidelineRoot) return;
    try {
      const data = await loadJSON('data/visit.json');
      if (hoursImage && data.hours?.image) {
        hoursImage.innerHTML = '';
        const img = document.createElement('img');
        img.src = data.hours.image.src;
        img.alt = data.hours.image.alt || '';
        img.loading = 'lazy';
        hoursImage.appendChild(img);
        if (data.hours.image.caption) {
          hoursImage.appendChild(createEl('figcaption', '운영시간__caption', data.hours.image.caption));
        }
      }
      if (hoursList && data.hours?.list) {
        hoursList.innerHTML = '';
        data.hours.list.forEach((item) => {
          const wrapper = document.createElement('div');
          wrapper.className = 'visit-hours-list__item';
          const dt = createEl('dt', '', item.label || '');
          const dd = document.createElement('dd');
          dd.innerHTML = item.value || '';
          wrapper.appendChild(dt);
          wrapper.appendChild(dd);
          hoursList.appendChild(wrapper);
        });
      }
      if (notesRoot && data.hours?.notes) {
        notesRoot.innerHTML = '';
        data.hours.notes.forEach((note) => {
          const alert = document.createElement('div');
          alert.className = 'visit-hours-alert';
          const icon = document.createElement('span');
          icon.className = 'visit-hours-alert__icon';
          icon.setAttribute('aria-hidden', 'true');
          icon.innerHTML = visitIcons[note.icon] || visitIcons.transport;
          const text = createEl('p', 'visit-hours-note', note.text || '');
          alert.appendChild(icon);
          alert.appendChild(text);
          notesRoot.appendChild(alert);
        });
      }
      if (rateBody && data.rates) {
        rateBody.innerHTML = '';
        data.rates.forEach((row) => {
          const tr = document.createElement('tr');
          const th = createEl('th', '');
          th.scope = 'row';
          th.textContent = row.label || '';
          const price = createEl('td', '', row.price || '');
          const condition = createEl('td', '', row.condition || '');
          tr.appendChild(th);
          tr.appendChild(price);
          tr.appendChild(condition);
          rateBody.appendChild(tr);
        });
      }
      if (guidelineRoot && data.guidelines) {
        guidelineRoot.innerHTML = '';
        data.guidelines.forEach((guide) => {
          const details = document.createElement('details');
          details.className = 'visit-guideline';
          if (guide.open) details.setAttribute('open', '');
          const summary = document.createElement('summary');
          summary.textContent = guide.summary || '';
          const body = document.createElement('div');
          body.className = 'visit-guideline__body';
          body.innerHTML = guide.bodyHtml || '';
          details.appendChild(summary);
          details.appendChild(body);
          guidelineRoot.appendChild(details);
        });
      }
    } catch (err) {
      console.error('[cms-data] Failed to load visit data', err);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initIndexIntros();
    initSpaces();
    initProgramSummaries();
    initPrograms();
    initShop();
    initVisit();
  });
})();
