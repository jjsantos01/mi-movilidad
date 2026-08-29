# Documentación: `src/maps/base.js`

- **Ruta del archivo:** [`src/maps/base.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/maps/base.js)
- **Tipo:** Inicializador base de mapas Leaflet

---

## 🎯 Propósito
Provee funciones comunes para crear y resetear instancias de mapas Leaflet sobre contenedores con id `map${suffix}`, montando la capa de teselas *Esri Light Gray Canvas* (la cual no requiere API key) y registrando la instancia en `state.mapInstances`.

---

## 🔗 Dependencias
- `src/state.js`: `state.mapInstances`.
- `L` (Leaflet Global CDN).

---

## ⚙️ Funciones Exportadas
- `initializeMap(suffix, lat, lng, zoom)`: Destruye cualquier mapa previo asociado a `map${suffix}`, inicializa un nuevo mapa centrado en `[lat, lng]` con nivel de zoom especificado, añade la capa de teselas de Esri y almacena la referencia en `state.mapInstances[mapId]`.
- `hoverPopup(layer)`: Asocia eventos `mouseover` (abre popup) y `mouseout` (cierra popup) a cualquier capa o marcador de Leaflet para interacción ágil sin requerir clics.
