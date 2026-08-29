# Documentación: `src/charts/ste.js`

- **Ruta del archivo:** [`src/charts/ste.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/charts/ste.js)
- **Tipo:** Visualizaciones específicas de Transportes Eléctricos (STE)

---

## 🎯 Propósito
Construye las gráficas dedicadas de la sección STE: un gráfico tipo donut con la distribución porcentual entre subsistemas (Trolebús, Tren Ligero, TIMT) y un gráfico de barras horizontales con el volumen de viajes por línea o corredor.

---

## 🔗 Dependencias
- `src/data/ste.js`: `getSTESubsystemBreakdown`.
- `src/charts/common.js`: `mountChart`.
- `src/state.js`: `registerChart`.

---

## ⚙️ Funciones Exportadas
- `createSTESubsystemsChart(steTrips)`: Renderiza una gráfica donut en `#steSubsystemsChart` mostrando la participación relativa de cada subsistema STE con colores distintivos (azul para Trolebús, verde para Tren Ligero, marrón para TIMT).
- `createSTELinesChart(steTrips)`: Agrupa los viajes por nombre de línea y renderiza un gráfico de barras horizontales en `#steLinesChart` ordenado descendentemente.
