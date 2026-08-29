# Documentación: `src/io/excel.js`

- **Ruta del archivo:** [`src/io/excel.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/io/excel.js)
- **Tipo:** Módulo de Entrada/Salida de Archivos y Parseo Excel

---

## 🎯 Propósito
Controla la interacción con la zona de arrastre (*Drag & Drop*) y el botón de selección de archivos. Lee archivos binarios Excel (`.xlsx`, `.xls`) usando SheetJS (`XLSX`), detecta automáticamente la fila de encabezados y transforma las filas en un arreglo JSON estandarizado y desinfectado.

---

## 🔗 Dependencias
- `src/ui/sections.js`: `showLoadingMessage` (muestra mensaje de carga durante el parseo).
- `XLSX` (Global CDN): Lectura del libro de trabajo.

---

## ⚙️ Funciones Exportadas
- `normalizeValue(v)`: Elimina marcas diacríticas/tildes, espacios en blanco superfluos y convierte a mayúsculas.
- `normalizeOrganismo(v)`: Mapea variaciones de organismos a sus nombres canónicos (ej. `'METROBUS'` -> `'METROBÚS'`, `'CABLEBUS'` -> `'CABLEBÚS'`).
- `detectRange(worksheet)`: Analiza las primeras 10 filas de la hoja para identificar la fila que contiene las cabeceras de columnas conocidas (`fechahora`, `organismo`, `linea`, `estacion`, `operacion`, `monto`, `saldofinal`, `numserie`), resolviendo desfases de formato generados por SEMOVI.
- `excelToJson(file)`: Lee un objeto `File`/`Blob` como `ArrayBuffer`, parsea la primera hoja y extrae objetos con propiedades normalizadas (`numero`, `num_serie`, `organismo`, `linea`, `estacion`, `operacion`, `monto`, `saldo_final`, `fecha`).
- `bindDropZone(onData)`: Vincula eventos dragover, dragleave, drop y change en `#dropZone` y `#fileInput`.
