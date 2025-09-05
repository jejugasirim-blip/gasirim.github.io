// Simple HTML partials loader (hardened)
(function () {
  function run() {
    const targets = document.querySelectorAll('[data-include]');
    if (!targets.length) {
      // Still notify so callers can rely on this event unconditionally
      document.dispatchEvent(new CustomEvent('partials:loaded'));
      return;
    }

    let remaining = targets.length;

    targets.forEach(async (el) => {
      const url = el.getAttribute('data-include');

      try {
        const res = await fetch(url, { cache: 'no-cache' });
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        const html = await res.text();

        // Inject HTML
        el.innerHTML = html;

        // Re-execute any scripts that came with the partial
        el.querySelectorAll('script').forEach((oldScript) => {
          const s = document.createElement('script');
          // Copy attributes (type, src, etc.)
          for (const { name, value } of [...oldScript.attributes]) {
            s.setAttribute(name, value);
          }
          // Inline script content
          s.textContent = oldScript.textContent;
          oldScript.replaceWith(s);
        });

        // Optional: per-element event if you ever need it
        el.dispatchEvent(new CustomEvent('partial:loaded', { bubbles: true, detail: { url } }));
      } catch (err) {
        console.error('[includes] Failed to load', url, err);
        el.innerHTML = '<!-- include failed -->';
      } finally {
        remaining -= 1;
        if (remaining === 0) {
          document.dispatchEvent(new CustomEvent('partials:loaded'));
        }
      }
    });
  }

  // Works even if this script is not loaded with `defer`
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
