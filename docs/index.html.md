# Documentación: `index.html`

- **Ruta del archivo:** [`index.html`](file:///c:/Users/jjsan/Github/mi-movilidad/index.html)
- **Tipo:** Punto de entrada SPA (HTML5)

---

## 🎯 Propósito
Define la estructura DOM de toda la aplicación, incluye las bibliotecas CDN de terceros (ApexCharts, jQuery, DataTables, Leaflet, D3, FontAwesome, XLSX) y carga el módulo principal `src/index.js` como script tipo módulo ES.

---

## 📦 Dependencias Externas (CDN)
- `ApexCharts` (gráficas interactivas)
- `jQuery` + `DataTables` (tabla paginada y filtrable)
- `Leaflet` (mapas interactivos)
- `D3.js v7` (gráfica de calendario y animación de Ecobici)
- `SheetJS (xlsx.full.min.js)` (lectura de archivos Excel en el cliente)
- `FontAwesome` (iconografía)

---

## 🧩 Contenedores DOM Clave
- `#dropZoneContainer` / `#dropZone`: Zona de carga y selección de archivos.
- `#statsContainer`: Tarjetas de estadísticas globales (`#totalViajes`, `#totalRecargas`).
- `#calendarHeatmap`: Contenedor D3 para el calendario anual.
- `#chartContainer`: Gráficas generales (pie, líneas, barras por momento, heatmap, gasto, saldo).
- `#metroSection`, `#metrobusSection`, `#steSection`, `#timtSection`, `#ecobiciSection`: Secciones colapsables (`.collapsible-section`) con mapas y estadísticas por sistema.
- `#results` / `#resultsTable`: Tabla de registros completos y botones de descarga CSV/JSON.
- `#aboutModal`: Modal emergente con información sobre la plataforma.
