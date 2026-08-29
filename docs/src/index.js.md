# Documentación: `src/index.js`

- **Ruta del archivo:** [`src/index.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/index.js)
- **Tipo:** Orquestador principal (Module Entrypoint)

---

## 🎯 Propósito
Punto de entrada de la lógica JavaScript. Coordina la inicialización de eventos del DOM, la ingesta y desinfección de datos, la invocación secuencial de procesadores y métricas, la construcción de todas las gráficas y mapas, y la carga perezosa (*lazy loading*) de submódulos pesados.

---

## 🔗 Dependencias Principales
- `src/state.js`: Getters y setters del estado (`state`, `setRawData`, `setViajes`, `setEcobiciViajes`, `setTimtValidations`).
- `src/io/excel.js`: Binding del drag & drop (`bindDropZone`), parseo y normalización de organismo/valor.
- `src/data/*`: Procesamiento (`processViajes`, `extractTimtValidations`, `createMetroObject`), métricas (`getTotalViajes`, `getTotalRecargas`, `detectInconsistencias`), y módulos específicos (`ecobici`, `metro-stats`, `ste`, `timt`).
- `src/charts/*`: Constructores de ApexCharts y D3 (calendar, pie, line, stacked, hour, momento, heatmap, saldo, gasto, top10, ste, ecobici).
- `src/maps/*`: Creadores de mapas Leaflet (`createMetroMap`, `createEcobiciMap`, `createTIMTMap`).
- `src/ui/*`: Configuración de secciones (`setupCollapsibleSections`, `updateSection`, `showAllSections`), tabla DataTables (`displayResults`), descargas (`bindDownloads`) y modales (`attachGlobalModalHandlers`).

---

## ⚙️ Funciones Principales
- `onDataLoaded(rows)`: Limpia nombres de organismos y operaciones, actualiza el estado global y desencadena `renderAll()`.
- `renderAll()`: Calcula métricas, monta gráficas globales, detecta inconsistencias y evalúa las secciones específicas (`metroSection`, `metrobusSection`, `steSection`, `timtSection`, `ecobiciSection`) para mostrarlas solo si contienen registros válidos.
- `DOMContentLoaded`: Registra listeners, inicia la animación de Ecobici y, en entorno `localhost`, intenta cargar automáticamente datos de prueba desde `datos/data.xlsx` o `datos/data.json`.
