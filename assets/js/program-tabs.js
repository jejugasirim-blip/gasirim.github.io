document.addEventListener('DOMContentLoaded', () => {
  const TABLIST_SEL = '[data-tabs]';
  const TAB_SEL = '[role="tab"]';
  const PANEL_HIDDEN = 'hidden';

  const allTabs = Array.from(document.querySelectorAll(TAB_SEL));

  const setActive = (tab, focus = false) => {
    const tabList = tab.closest(TABLIST_SEL);
    if (!tabList) return;

    const tabs = Array.from(tabList.querySelectorAll(TAB_SEL));
    tabs.forEach(btn => {
      const panelId = btn.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : null;
      const isActive = btn === tab;

      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
      btn.setAttribute('tabindex', isActive ? '0' : '-1');
      if (panel) panel[PANEL_HIDDEN] = !isActive;
    });

    if (focus) tab.focus();

    // Update hash using data-hash (preferred) or aria-controls
    const target = tab.dataset.hash || tab.getAttribute('aria-controls');
    if (target) {
      const encoded = `#${encodeURIComponent(target)}`;
      if (encoded !== window.location.hash) {
        history.replaceState(null, '', encoded);
      }
      // Optional: smooth scroll the now-visible panel into view
      const panel = document.getElementById(target);
      if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const findTabByHash = (hash) => {
    if (!hash) return null;
    const decoded = decodeURIComponent(hash.replace(/^#/, ''));
    return allTabs.find(tab => {
      const controls = tab.getAttribute('aria-controls');
      return decoded === tab.dataset.hash || decoded === controls;
    }) || null;
  };

  // Click to activate
  const initialHashTab = findTabByHash(window.location.hash);

  document.querySelectorAll(TABLIST_SEL).forEach(tabList => {
    const tabs = Array.from(tabList.querySelectorAll(TAB_SEL));
    if (!tabs.length) return;

    const fallbackActive = tabs.find(t => t.classList.contains('active')) || tabs[0];
    const initial = tabs.includes(initialHashTab) ? initialHashTab : fallbackActive;

    tabs.forEach(t => t.setAttribute('tabindex', t === initial ? '0' : '-1'));
    if (initial) setActive(initial);

    tabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => setActive(tab, true));

      // Keyboard navigation (roving tabindex)
      tab.addEventListener('keydown', (e) => {
        const key = e.key;
        const last = tabs.length - 1;
        let nextIndex = null;

        if (key === 'ArrowRight') nextIndex = (idx + 1) % tabs.length;
        else if (key === 'ArrowLeft') nextIndex = (idx - 1 + tabs.length) % tabs.length;
        else if (key === 'Home') nextIndex = 0;
        else if (key === 'End') nextIndex = last;
        else if (key === 'Enter' || key === ' ') return setActive(tab, true);

        if (nextIndex !== null) {
          e.preventDefault();
          tabs[nextIndex].focus();
        }
      });
    });
  });

  // React to manual hash changes
  window.addEventListener('hashchange', () => {
    const t = findTabByHash(window.location.hash);
    if (t) setActive(t, true);
  });
});
