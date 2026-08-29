# Documentación: `src/charts/stacked-by-day.js`

- **Ruta del archivo:** [`src/charts/stacked-by-day.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/charts/stacked-by-day.js)
- **Tipo:** Gráfica de barras apiladas por día de la semana

---

## 🎯 Propósito
Muestra el volumen acumulado de viajes para cada día de la semana (de lunes a domingo), desglosando la contribución de cada sistema de transporte en barras apiladas.

---

## 🔗 Dependencias
- `src/config/constants.js`: `colorPalette`.
- `src/charts/common.js`: `mountChart`.
- `src/state.js`: `registerChart`.

---

## ⚙️ Funciones Exportadas
- `createStackedBarChart(viajes)`:
  - Agrupa los viajes por día de la semana (`lunes` a `domingo`) y organismo.
  - Genera las series apiladas con los colores institucionales correspondientes en `#stackedBarChart`.
