# Documentación: `src/charts/heatmap.js`

- **Ruta del archivo:** [`src/charts/heatmap.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/charts/heatmap.js)
- **Tipo:** Mapa de calor día de la semana vs. momento del día

---

## 🎯 Propósito
Construye una matriz de calor (Heatmap) interactiva que cruza los 7 días de la semana con los 3 momentos del día (Mañana, Tarde, Noche). Permite filtrar por un organismo específico o ver el consolidado global (`Todos`).

---

## 🔗 Dependencias
- `src/charts/common.js`: `mountChart`.
- `src/state.js`: `registerChart`.

---

## ⚙️ Funciones Exportadas
- `createHeatmap(viajes, selectedOrganismo)`:
  - Filtra los viajes por el organismo seleccionado en `#organismoSelector` (o incluye todos).
  - Mapea el conteo a una cuadrícula $7 \times 3$.
  - Renderiza el mapa de calor con escala monocromática en `#heatmapChart`.
