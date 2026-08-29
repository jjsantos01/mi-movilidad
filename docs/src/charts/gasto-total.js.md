# Documentación: `src/charts/gasto-total.js`

- **Ruta del archivo:** [`src/charts/gasto-total.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/charts/gasto-total.js)
- **Tipo:** Gráfica de gasto total agrupado por período

---

## 🎯 Propósito
Calcula el gasto monetario acumulado en transporte público agrupado por intervalos de tiempo (mensual o semanal ISO de lunes a domingo) y lo visualiza en una gráfica de líneas interactiva con selector de período.

---

## 🔗 Dependencias
- `src/charts/common.js`: `mountChart`.
- `src/state.js`: `registerChart`.
- `src/utils/date.js`: `parseFechaHora`.

---

## ⚙️ Funciones Exportadas
- `createGastoTotalChart(data, periodo)`:
  - Argumentos: `data` (registros crudos) y `periodo` (`'mes'` o `'semana'`).
  - Filtra operaciones que no sean gasto (ignora `00-RECARGA`).
  - Agrupa la suma de montos según el bucket temporal correspondiente.
  - Renderiza la serie temporal en `#gastoTotalChart` con formateadores personalizados de rangos de fechas y montos en moneda ($).
