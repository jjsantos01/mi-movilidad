# Documentación: `src/ui/table.js`

- **Ruta del archivo:** [`src/ui/table.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/ui/table.js)
- **Tipo:** Controlador de la tabla de datos completa (jQuery DataTables)

---

## 🎯 Propósito
Instancia y gestiona la tabla interactiva de registros crudos en `#resultsTable`, aplicando paginación, ordenamiento, búsqueda, resaltado visual de transacciones inconsistentes y filtrado exclusivo mediante checkbox.

---

## 🔗 Dependencias
- `src/data/inconsistencias.js`: `inconsistentKeys`.
- `jQuery` + `DataTables` (Global CDN).

---

## ⚙️ Funciones Exportadas
- `displayResults(rows)`:
  - Inicializa o actualiza la instancia de DataTable sobre `#resultsTable`.
  - Configura columnas dinámicamente según las claves presentes en los objetos.
  - Aplica la clase `.inconsistent-row` y tooltips explicativos a las filas detectadas en `inconsistentKeys`.
  - Vincula el checkbox `#showInconsistentCheckbox` a la extensión de búsqueda de DataTables para filtrar y mostrar únicamente registros inconsistentes cuando está activado.
