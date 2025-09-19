import { initializeMap, hoverPopup } from './base.js';
import { sistemas, metroLineColors } from '../config/constants.js';
import { state } from '../state.js';

export function createMetroMap(metro, organismo = 'STC') {
  const sistema = sistemas[organismo];
  initializeMap(sistema, 19.432608, -99.133209, 12);

  fetch(`maps/lineas_${sistema.toLowerCase()}.geojson`)
    .then(r => r.json())
    .then(data => {
      L.geoJSON(data, {
        style: f => ({ color: metroLineColors[f.properties.LINEA] || 'red', weight: 3 }),
        onEachFeature: function (feature, layer) {
          if (feature.properties && feature.properties.LINEA) {
            layer.bindPopup(`Línea ${feature.properties.LINEA}: ${feature.properties.RUTA}`);
            hoverPopup(layer);
          }
        }
      }).addTo(state.mapInstances[`map${sistema}`]);
    })
    .catch(err => console.error('Error al cargar las líneas del metro:', err));

  const viajesEstaciones = metro.reduce((acc, viaje) => {
    if (viaje.estacion) acc[(viaje.estacion || '').toLowerCase()] = (acc[(viaje.estacion || '').toLowerCase()] || 0) + 1;
    return acc;
  }, {});

  fetch(`maps/estaciones_${sistema.toLowerCase()}.geojson`)
    .then(r => r.json())
    .then(data => {
      L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
          const nombreEstacion = (feature.properties.NOMBRE || '').toLowerCase();
          const numViajes = viajesEstaciones[nombreEstacion] || 0;
          if (numViajes > 0) {
            return L.circleMarker(latlng, {
              radius: Math.min(numViajes, 20),
              color: 'blue', fillColor: 'blue', fillOpacity: 0.8
            }).bindPopup(`<strong>${feature.properties.NOMBRE}</strong><br>Viajes: ${numViajes}`);
          }
        },
        onEachFeature: function(feature, layer) { if (feature.properties && feature.properties.LINEA) hoverPopup(layer); }
      }).addTo(state.mapInstances[`map${sistema}`]);
    })
    .catch(err => console.error('Error al cargar las estaciones del metro:', err));
}

