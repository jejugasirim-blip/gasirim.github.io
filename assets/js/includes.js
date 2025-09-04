async function inject(selector, file) {
  const el = document.querySelector(selector);
  if (!el) return;
  try {
    const html = await fetch(file).then(r => r.text());
    el.innerHTML = html;
  } catch (err) {
    console.error("Include failed for", file, err);
  }
}

// Inject header & footer into every page
inject('#site-header', 'partials/header.html');
inject('#site-footer', 'partials/footer.html');
