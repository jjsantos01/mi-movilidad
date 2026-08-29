# Documentación: `src/ui/downloads.js`

- **Ruta del archivo:** [`src/ui/downloads.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/ui/downloads.js)
- **Tipo:** Exportación y descarga de datos en el cliente

---

## 🎯 Propósito
Permite al usuario descargar los datos procesados y normalizados en formatos CSV y JSON directamente desde el navegador, generando archivos nombrados según el número de serie de la tarjeta MI.

---

## ⚙️ Funciones Exportadas
- `bindDownloads(currentDataRef)`:
  - Vincula los listeners de clic en `#downloadCSV` y `#downloadJSON`.
  - `currentDataRef`: Función callback que retorna el arreglo actual de registros crudos normalizados (`() => state.rawData`).
  - Convierte los objetos a texto CSV delimitado por comas o JSON indentado.
  - Crea objetos `Blob` y enlaces `<a>` temporales para detonar la descarga automática con el nombre `mi-movilidad-[serie].csv` o `mi-movilidad-[serie].json`.
