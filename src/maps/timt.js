import { initializeMap, hoverPopup } from './base.js';
import { TIMT_UNKNOWN_STATION } from '../data/timt.js';

const TIMT_COLOR = '#7d2f2b';

export function createTIMTMap(timt) {
  const map = initializeMap('TIMT', 19.278608, -99.513984, 11);

  fetch('maps/TIMT.geojson')
    .then(r => r.json())
    .then(data => {
      // Línea (LineString/MultiLineString)
      const lineLayer = L.geoJSON(data, {
        filter: f => (f && f.geometry && /LineString/i.test(f.geometry.type)),
        style: () => ({ color: TIMT_COLOR, weight: 4 }),
        onEachFeature: function (feature, layer) {
          if (feature.properties && feature.properties.description) {
            layer.bindPopup(feature.properties.description);
            hoverPopup(layer);
          }
        }
      }).addTo(map);

      // Estaciones: usar mapeo manual y tamaño proporcional a viajes usados
      const estacionesTIMT = [
        { name: 'Zinacantepec', lat: 19.28004529999825, lng: -99.69412896442051 },
        { name: 'Toluca Centro', lat: 19.270347655433053, lng: -99.64138567976912 },
        { name: 'Metepec', lat: 19.277527684501802, lng: -99.5751154733823 },
        { name: 'Lerma', lat: 19.278635754416907, lng: -99.51455309325662 },
        { name: 'Santa Fe', lat: 19.36400409808579, lng: -99.26865733713247 },
        { name: 'Vasco de Quiroga', lat: 19.38502, lng: -99.23519 },
        { name: 'Observatorio', lat: 19.39883508933639, lng: -99.19948057577304 },
      ];

      const viajesEstaciones = (timt || []).reduce((acc, viaje) => {
        const sumar = nombre => {
          const key = (nombre || '').trim().toLowerCase();
          if (!key || key === TIMT_UNKNOWN_STATION) return;
          acc[key] = (acc[key] || 0) + 1;
        };
        sumar(viaje.estacionOrigen || viaje.estacion);
        sumar(viaje.estacionDestino);
        return acc;
      }, {});

      const MIN_RADIUS = 4;
      estacionesTIMT.forEach(({ name, lat, lng }) => {
        const key = name.toLowerCase();
        const numViajes = viajesEstaciones[key] || 0;
        const marker = L.circleMarker([lat, lng], {
          radius: Math.min(MIN_RADIUS + numViajes, 20),
          color: 'blue',
          fillColor: 'blue',
          fillOpacity: 0.9
        }).bindPopup(`<strong>${name}</strong><br>Viajes: ${numViajes}`);
        marker.addTo(map);
        hoverPopup(marker);
      });

      // Mantener el zoom inicial solicitado; no ajustar a bounds
    })
    .catch(err => console.error('Error al cargar el mapa TIMT:', err));
}
