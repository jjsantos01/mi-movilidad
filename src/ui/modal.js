export function openAboutModal() {
  const el = document.getElementById('aboutModal');
  if (el) el.style.display = 'block';
}

export function closeAboutModal() {
  const el = document.getElementById('aboutModal');
  if (el) el.style.display = 'none';
}

export function attachGlobalModalHandlers() {
  // Keep inline onclick compatibility
  window.openAboutModal = openAboutModal;
  window.closeAboutModal = closeAboutModal;
  window.addEventListener('click', (event) => {
    const modal = document.getElementById('aboutModal');
    if (event.target === modal) closeAboutModal();
  });
}

