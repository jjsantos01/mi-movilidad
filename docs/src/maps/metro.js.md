# Documentación: `src/maps/metro.js`

- **Ruta del archivo:** [`src/maps/metro.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/maps/metro.js)
- **Tipo:** Renderizador de mapas geoespaciales para Metro y Metrobús

---

## 🎯 Propósito
Carga y dibuja las líneas de la red de transporte y los marcadores circulares de estaciones visitadas por el usuario (con radio proporcional al número de viajes registrados en cada estación) para STC Metro o Metrobús.

---

## 🔗 Dependencias
- `src/maps/base.js`: `initializeMap`, `hoverPopup`.
- `src/config/constants.js`: `sistemas`, `metroLineColors`.
- `src/state.js`: `state.mapInstances`.

---

## ⚙️ Funciones Exportadas
- `createMetroMap(metro, organismo)`:
  - Inicializa el mapa centrado en la CDMX (`mapMetro` o `mapMetrobús`).
  - Descarga `maps/lineas_${sistema}.geojson` y dibuja las líneas con su color característico y popup informativo.
  - Agrupa la frecuencia de viajes del usuario por estación.
  - Descarga `maps/estaciones_${sistema}.geojson` y dibuja marcadores circulares (`L.circleMarker`) cuyo radio varía en función de los viajes realizados en esa estación.
