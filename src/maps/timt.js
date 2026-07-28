import { initializeMap, hoverPopup } from './base.js';
import { TIMT_UNKNOWN_STATION } from '../data/timt.js';

const TIMT_COLOR = '#7d2f2b';

export function createTIMTMap(timt, matrix) {
  const map = initializeMap('TIMT', 19.278608, -99.513984, 11);

  // Atribución de fuente del trazo
  map.attributionControl.addAttribution(
    'Trazo: <a href="https://masivoedomex.blogspot.com/p/tren-interurbano.html" target="_blank">Masivo Edomex</a>'
  );

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
      // Coordenadas tomadas del KML oficial (Masivo Edomex)
      const estacionesTIMT = [
        { name: 'Zinacantepec',    lat: 19.2802287, lng: -99.6946995 },
        { name: 'Toluca Centro',   lat: 19.2703383, lng: -99.641383  },
        { name: 'Metepec',         lat: 19.2775398, lng: -99.5745151 },
        { name: 'Lerma',           lat: 19.278648,  lng: -99.5149599 },
        { name: 'Santa Fe',         lat: 19.3639686, lng: -99.2687198 },
        { name: 'Vasco de Quiroga',lat: 19.3849423, lng: -99.2364669 },
        { name: 'Observatorio',    lat: 19.3984849, lng: -99.2008108 },
      ];

      const hasMatrixTotals = matrix && typeof matrix.getStationTotals === 'function';
      const fallbackTotals = {};

      if (!hasMatrixTotals) {
        (timt || []).forEach(viaje => {
          const sumar = (nombre, field) => {
            const key = (nombre || '').trim().toLowerCase();
            if (!key || key === TIMT_UNKNOWN_STATION) return;
            fallbackTotals[key] = fallbackTotals[key] || { origin: 0, destination: 0 };
            fallbackTotals[key][field] += 1;
          };
          sumar(viaje.estacionOrigen || viaje.estacion, 'origin');
          sumar(viaje.estacionDestino, 'destination');
        });
      }

      const getStationTotals = name => {
        if (!name) return { origin: 0, destination: 0, total: 0 };
        if (hasMatrixTotals) {
          return matrix.getStationTotals(name);
        }
        const key = name.trim().toLowerCase();
        const fromFallback = fallbackTotals[key] || { origin: 0, destination: 0 };
        return {
          origin: fromFallback.origin,
          destination: fromFallback.destination,
          total: fromFallback.origin + fromFallback.destination,
        };
      };

      const MIN_RADIUS = 4;
      estacionesTIMT.forEach(({ name, lat, lng }) => {
        const { origin, destination, total } = getStationTotals(name);
        const maxFlow = Math.max(origin, destination);
        const marker = L.circleMarker([lat, lng], {
          radius: Math.min(MIN_RADIUS + maxFlow, 20),
          color: 'blue',
          fillColor: 'blue',
          fillOpacity: 0.9
        }).bindPopup(
          `<strong>${name}</strong><br>` +
          `Total de viajes asociados: ${(total).toLocaleString()}<br>` +
          `Como origen: ${origin.toLocaleString()}<br>` +
          `Como destino: ${destination.toLocaleString()}`
        );
        marker.addTo(map);
        hoverPopup(marker);
      });

      // Mantener el zoom inicial solicitado; no ajustar a bounds
    })
    .catch(err => console.error('Error al cargar el mapa TIMT:', err));
}
