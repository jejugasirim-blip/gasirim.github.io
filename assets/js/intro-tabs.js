document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-tabs]').forEach(tabList => {
    const tabs = tabList.querySelectorAll('[role="tab"]');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(btn => {
          const panel = document.getElementById(btn.getAttribute('aria-controls'));
          const active = btn === tab;
          btn.classList.toggle('active', active);
          btn.setAttribute('aria-selected', active);
          if (panel) panel.hidden = !active;
        });
      });
    });
  });
});
