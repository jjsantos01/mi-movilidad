import { initializeMap, hoverPopup } from './base.js';
import { state } from '../state.js';
import { homogenizeString } from '../utils/strings.js';

export function createEcobiciMap(inicioViaje, finViaje) {
  initializeMap('Ecobici', 19.389688, -99.167158, 13);

  const viajesEstacionesInicio = (inicioViaje || []).reduce((acc, v) => {
    const k = homogenizeString(v.estacion);
    acc[k] = (acc[k] || 0) + 1; return acc;
  }, {});
  const viajesEstacionesFin = (finViaje || []).reduce((acc, v) => {
    const k = homogenizeString(v.estacion);
    acc[k] = (acc[k] || 0) + 1; return acc;
  }, {});

  fetch('maps/cicloestaciones_ecobici.geojson')
    .then(r => r.json())
    .then(ecobici => {
      L.geoJSON(ecobici, {
        pointToLayer: function (feature, latlng) {
          const nombreEstacion = homogenizeString(feature.properties.estacion);
          const numViajes = (viajesEstacionesInicio[nombreEstacion] || 0) + (viajesEstacionesFin[nombreEstacion] || 0);
          if (numViajes > 0) {
            return L.circleMarker(latlng, {
              radius: Math.min(numViajes, 20), color: 'green', fillColor: 'green', fillOpacity: 0.8
            }).bindPopup(`<strong>${feature.properties.estacion}</strong><br>Total viajes: ${numViajes}<br> inicio de viaje: ${viajesEstacionesInicio[nombreEstacion] || 0}<br> fin de viaje: ${viajesEstacionesFin[nombreEstacion] || 0}`);
          }
        },
        onEachFeature: function(feature, layer) { if (feature.properties && feature.properties.estacion) hoverPopup(layer); }
      }).addTo(state.mapInstances['mapEcobici']);
    })
    .catch(err => console.error('Error al cargar las estaciones de ecobici', err));
}

