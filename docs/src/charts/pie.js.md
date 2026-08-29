# Documentación: `src/charts/pie.js`

- **Ruta del archivo:** [`src/charts/pie.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/charts/pie.js)
- **Tipo:** Gráfica de distribución por sistema de transporte (Donut Chart)

---

## 🎯 Propósito
Muestra la proporción de viajes realizados en cada organismo o sistema de transporte (Metro, Metrobús, STE, Ecobici, etc.) utilizando una gráfica tipo rosquilla (*donut*).

---

## 🔗 Dependencias
- `src/charts/common.js`: `getColorForOrganismo`, `mountChart`.
- `src/state.js`: `registerChart`.

---

## ⚙️ Funciones Exportadas
- `createPieChart(viajes)`:
  - Cuenta la frecuencia de viajes por valor de `organismo`.
  - Configura y renderiza un gráfico donut en el contenedor `#pieChart`.
  - Asigna los colores oficiales de cada medio de transporte y formatea las leyendas y tooltips.
