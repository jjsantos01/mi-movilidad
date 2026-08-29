import { state } from '../state.js';

export function initializeMap(suffix, lat, lng, zoom) {
  const mapId = `map${suffix}`;
  if (state.mapInstances[mapId]) {
    try { state.mapInstances[mapId].remove(); } catch {}
  }
  const map = L.map(mapId).setView([lat, lng], zoom);
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 16,
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
  }).addTo(map);
  state.mapInstances[mapId] = map;
  return map;
}

export function hoverPopup(layer) {
  layer.on('mouseover', function () { this.openPopup(); });
  layer.on('mouseout', function () { this.closePopup(); });
}

