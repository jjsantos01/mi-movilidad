# Documentación: `src/charts/line.js`

- **Ruta del archivo:** [`src/charts/line.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/charts/line.js)
- **Tipo:** Serie temporal mensual por sistema de transporte (Line Chart)

---

## 🎯 Propósito
Visualiza la evolución mensual del número de viajes a lo largo del tiempo, desglosando una serie por cada organismo de transporte utilizado.

---

## 🔗 Dependencias
- `src/config/constants.js`: `colorPalette`.
- `src/charts/common.js`: `mountChart`.
- `src/state.js`: `registerChart`.

---

## ⚙️ Funciones Exportadas
- `createLineChart(viajes)`:
  - Agrupa los viajes por mes (`YYYY-MM`) y por organismo.
  - Ordena cronológicamente los meses y completa los valores faltantes con 0.
  - Renderiza una gráfica de líneas suavizadas (*smooth curve*) con marcadores en `#lineChart`.
