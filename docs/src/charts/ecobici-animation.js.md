# Documentación: `src/charts/ecobici-animation.js`

- **Ruta del archivo:** [`src/charts/ecobici-animation.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/charts/ecobici-animation.js)
- **Tipo:** Reproductor animado de trayectos de Ecobici sobre mapa SVG (D3.js)

---

## 🎯 Propósito
Renderiza un mapa geográfico interactivo con soporte de Zoom/Pan donde se reproducen cronológicamente los viajes de Ecobici mediante flechas orientadas y coloreadas según su frecuencia, acompañado de controles de reproducción (iniciar, pausar, fotograma anterior/siguiente y velocidad).

---

## 🔗 Dependencias
- `d3` (Global CDN): Proyecciones cartográficas (`d3.geoMercator`, `d3.geoPath`), zoom (`d3.zoom`), escalas continuas de color (`d3.interpolateYlOrRd`) y manipulación SVG.
- `maps/cicloestaciones_ecobici.geojson` y `maps/colonias_ecobici_bordes.geojson`.

---

## ⚙️ Funciones Exportadas
- `attachEcobiciAnimation(getData)`:
  - Vincula los listeners de control de la animación (`#startAnimation`, `#pauseAnimation`, `#previousFrame`, `#nextFrame`, `#animationSpeed`).
  - Prepara el lienzo base SVG con el contorno de colonias y puntos de cicloestaciones.
  - Ejecuta la reproducción paso a paso trazando flechas SVG entre origen y destino, actualizando contadores en tiempo real (`Total de viajes`, `Hora y duración`) y desplegando tooltips informativos en hover.
