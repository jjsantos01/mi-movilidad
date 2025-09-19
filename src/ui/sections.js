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
  // Reveal only the stats container here; leave other sections
  // visibility to be controlled by updateSection calls.
  const stats = document.getElementById('statsContainer');
  if (stats) stats.style.display = 'flex';
  const charts = document.getElementById('chartContainer');
  if (charts) charts.style.display = 'block';
  const results = document.getElementById('results');
  if (results) results.style.display = 'block';
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
