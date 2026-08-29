# Documentación: `src/charts/by-hour.js`

- **Ruta del archivo:** [`src/charts/by-hour.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/charts/by-hour.js)
- **Tipo:** Distribución horaria de viajes (Stacked Bar Chart 0-23h)

---

## 🎯 Propósito
Muestra el perfil de movilidad a lo largo del día, registrando el número de viajes por cada hora (de 0 a 23 horas) con desglose apilado por organismo de transporte.

---

## 🔗 Dependencias
- `src/config/constants.js`: `colorPalette`.
- `src/charts/common.js`: `mountChart`.
- `src/state.js`: `registerChart`.

---

## ⚙️ Funciones Exportadas
- `crearGraficoViajesPorHoraYOrganismo(viajes)`:
  - Genera un histograma de 24 posiciones por cada organismo presente en los datos.
  - Renderiza la gráfica de barras apiladas verticales en `#viajesPorHora`.
