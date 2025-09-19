import { state } from '../state.js';

export function initializeMap(suffix, lat, lng, zoom) {
  const mapId = `map${suffix}`;
  if (state.mapInstances[mapId]) {
    try { state.mapInstances[mapId].remove(); } catch {}
  }
  const map = L.map(mapId).setView([lat, lng], zoom);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>'
  }).addTo(map);
  state.mapInstances[mapId] = map;
  return map;
}

export function hoverPopup(layer) {
  layer.on('mouseover', function () { this.openPopup(); });
  layer.on('mouseout', function () { this.closePopup(); });
}

