# Documentación: `src/maps/ecobici.js`

- **Ruta del archivo:** [`src/maps/ecobici.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/maps/ecobici.js)
- **Tipo:** Mapa Leaflet de cicloestaciones Ecobici

---

## 🎯 Propósito
Renderiza en el mapa Leaflet (`mapEcobici`) las cicloestaciones utilizadas por el usuario, mostrando marcadores de tamaño proporcional a la suma de inicios y fines de viaje registrados en cada estación.

---

## 🔗 Dependencias
- `src/maps/base.js`: `initializeMap`, `hoverPopup`.
- `src/state.js`: `state.mapInstances`.
- `src/utils/strings.js`: `homogenizeString`.

---

## ⚙️ Funciones Exportadas
- `createEcobiciMap(inicioViaje, finViaje)`:
  - Inicializa el mapa centrado en el polígono central de Ecobici en la CDMX.
  - Suma la frecuencia de salidas y devoluciones por cicloestación utilizando claves de texto homogeneizadas.
  - Carga `maps/cicloestaciones_ecobici.geojson` y añade marcadores verdes con tooltip/popup que desglosan: `Total viajes`, `Inicio de viaje` y `Fin de viaje`.
