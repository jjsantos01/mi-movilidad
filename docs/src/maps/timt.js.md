# Documentación: `src/maps/timt.js`

- **Ruta del archivo:** [`src/maps/timt.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/maps/timt.js)
- **Tipo:** Mapa del Tren Interurbano México-Toluca "El Insurgente" (TIMT)

---

## 🎯 Propósito
Renderiza el trazo completo del Tren Interurbano (desde Zinacantepec hasta Observatorio) y sitúa las estaciones en el mapa con marcadores circulares dimensionados de acuerdo al volumen total de viajes asociados (como origen o destino).

---

## 🔗 Dependencias
- `src/maps/base.js`: `initializeMap`, `hoverPopup`.
- `src/data/timt.js`: `TIMT_UNKNOWN_STATION`.

---

## ⚙️ Funciones Exportadas
- `createTIMTMap(timt, matrix)`:
  - Inicializa `mapTIMT` centrado en el corredor Toluca-CDMX.
  - Agrega atribución de fuente (*Masivo Edomex*).
  - Carga el trazo de línea desde `maps/TIMT.geojson` con color institucional (`#7d2f2b`).
  - Posiciona las 7 estaciones fijas (*Zinacantepec, Toluca Centro, Metepec, Lerma, Santa Fe, Vasco de Quiroga, Observatorio*).
  - Determina el flujo de cada estación mediante los métodos de `matrix` (o fallback sobre viajes brutos) y genera marcadores con radio dinámico y popup con el desglose de viajes como origen y destino.
