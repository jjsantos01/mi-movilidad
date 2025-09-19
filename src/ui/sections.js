import { state } from '../state.js';

export function setupCollapsibleSections() {
  const sections = document.querySelectorAll('.collapsible-section h2');
  sections.forEach(section => {
    section.addEventListener('click', () => {
      section.classList.toggle('active');
      const content = section.nextElementSibling;
      if (!content) return;
      if (content.style.display === 'block') {
        content.style.display = 'none';
      } else {
        content.style.display = 'block';
        // Invalidate Leaflet maps when section expands
        const mapContainers = content.querySelectorAll('[id^="map"]');
        mapContainers.forEach(mapContainer => {
          const mapId = mapContainer.id;
          if (state.mapInstances[mapId]) {
            try { state.mapInstances[mapId].invalidateSize(); } catch {}
          }
        });
      }
    });
  });
}

export function showLoadingMessage() {
  document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
  const el = document.getElementById('loadingMessage');
  if (el) el.innerText = 'Espere mientras se cargan sus datos...';
}

export function showAllSections() {
  document.querySelectorAll('.section').forEach(section => {
    section.style.display = section.id === 'statsContainer' ? 'flex' : 'block';
  });
  const el = document.getElementById('loadingMessage');
  if (el) el.innerHTML = '';
}

export function updateSection(sectionId, data, updateFunction) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  if (data && data.length > 0) {
    updateFunction(data);
    section.style.display = 'block';
  } else {
    section.style.display = 'none';
  }
}

