# Documentación: `src/charts/calendar.js`

- **Ruta del archivo:** [`src/charts/calendar.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/charts/calendar.js)
- **Tipo:** Mapa de calor de calendario anual (D3.js)

---

## 🎯 Propósito
Construye una visualización de calendario diario interactiva estilo contribuciones de GitHub para el año correspondiente a los datos del usuario.

---

## 🔗 Dependencias
- `d3` (Global CDN): Proyecciones temporales (`d3.timeDay`, `d3.timeWeek`, `d3.timeMonth`), escalas secuenciales e interpolador de verdes (`d3.interpolateGreens`).

---

## ⚙️ Funciones Exportadas
- `createCalendarHeatmap(viajes)`:
  - Limpia el contenedor `#calendarHeatmap`.
  - Agrupa los viajes por fecha (`YYYY-MM-DD`).
  - Genera una cuadrícula SVG con celdas de 7 filas (días de la semana) y 52+ columnas (semanas del año).
  - Incluye escala de color proporcional a la intensidad de viajes por día.
  - Añade etiquetas de meses, días de la semana y tooltip dinámico que muestra fecha, día y cantidad de viajes al pasar el cursor.
