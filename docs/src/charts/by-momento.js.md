# Documentación: `src/charts/by-momento.js`

- **Ruta del archivo:** [`src/charts/by-momento.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/charts/by-momento.js)
- **Tipo:** Gráfica de barras por momento del día (Mañana, Tarde, Noche)

---

## 🎯 Propósito
Compara la actividad de viajes entre los distintos sistemas de transporte clasificados según el momento del día: `Mañana` ($\le$ 11h), `Tarde` (12h a 18h) y `Noche` ($\ge$ 19h).

---

## 🔗 Dependencias
- `src/charts/common.js`: `mountChart`.
- `src/state.js`: `registerChart`.

---

## ⚙️ Funciones Exportadas
- `createBarChartByMomentoDia(viajes)`:
  - Agrupa la cantidad de viajes por combinación de `organismo + momento_dia`.
  - Construye y renderiza barras agrupadas por sistema de transporte en `#barChartMomentoDia`.
