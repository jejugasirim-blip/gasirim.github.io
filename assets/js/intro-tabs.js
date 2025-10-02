document.addEventListener('DOMContentLoaded', () => {
  const allTabs = Array.from(document.querySelectorAll('[role="tab"]'));

  const activateTab = tab => {
    const tabList = tab.closest('[data-tabs]');
    if (!tabList) return;

    const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));
    tabs.forEach(btn => {
      const panelId = btn.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : null;
      const isActive = btn === tab;

      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
      if (panel) {
        panel.hidden = !isActive;
      }
    });

    const targetId = tab.dataset.hash;
    if (targetId) {
      const encodedHash = `#${encodeURIComponent(targetId)}`;
      if (encodedHash !== window.location.hash) {
        history.replaceState(null, '', encodedHash);
      }

      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const activateTabByHash = hash => {
    if (!hash) return;
    const decodedHash = decodeURIComponent(hash.replace(/^#/, ''));
    const matchingTab = allTabs.find(tab => {
      const controls = tab.getAttribute('aria-controls');
      return decodedHash === tab.dataset.hash || decodedHash === controls;
    });

    if (matchingTab) {
      activateTab(matchingTab);
    }
  };

  document.querySelectorAll('[data-tabs]').forEach(tabList => {
    tabList.querySelectorAll('[role="tab"]').forEach(tab => {
      tab.addEventListener('click', () => activateTab(tab));
    });
  });

  activateTabByHash(window.location.hash);
  window.addEventListener('hashchange', () => activateTabByHash(window.location.hash));
});
