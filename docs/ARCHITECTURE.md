# Arquitectura General del Proyecto

`mi-movilidad` es una Single-Page Application (SPA) estática en JavaScript vainilla (ES Modules) diseñada para ejecutarse 100% en el navegador del cliente sin necesidad de backend, compiladores ni empaquetadores (buildless).

---

## 🏛️ Principios de Diseño
1. **Privacidad Total (Client-Side Only):** Los archivos Excel descargados de SEMOVI son procesados exclusivamente en memoria en el navegador. No existe recolección ni envío de datos a servidores externos.
2. **Cero Dependencias de Build (Static SPA):** Se sirve directamente con cualquier servidor estático HTTP. Las dependencias externas (ApexCharts, Leaflet, D3, DataTables, XLSX) se cargan vía CDN en `index.html`.
3. **Flujo de Datos Unidireccional:**
   - **I/O:** Parseo y detección inteligente de tablas en `src/io/excel.js`.
   - **Estado:** Almacenamiento centralizado y reactivo en `src/state.js`.
   - **Datos y Métricas:** Normalización, deduplicación, cálculo de métricas y emparejamiento de viajes (TIMT, Ecobici) en `src/data/`.
   - **Visualización y UI:** Representación gráfica en `src/charts/`, mapas espaciales en `src/maps/`, y componentes DOM en `src/ui/`.
4. **Carga Perezosa (Lazy Loading):** Los módulos pesados u opcionales (ej. mapas de calor de Ecobici) se cargan dinámicamente con `import()`.

---

## 🔄 Flujo de Datos

```
[ Usuario sube Excel (.xlsx) ]
              │
              ▼
    [ src/io/excel.js ] (Detecta cabeceras, limpia diacríticos, parsea a JSON)
              │
              ▼
   [ src/data/normalize.js ] (Normaliza fechas, momentos del día, deduplica TIMT)
              │
              ▼
       [ src/state.js ] (Almacena rawData, viajes, ecobiciViajes, timtValidations)
              │
              ▼
     [ src/index.js -> renderAll() ]
   ┌──────────┼──────────────────────┬──────────────────────┐
   ▼          ▼                      ▼                      ▼
[Métricas] [Gráficas Generales] [Secciones Específicas] [Tabla & Export]
 - Viajes   - Heatmap Calendario  - Metro (Map + Top 10) - DataTables
 - Recargas - Barras por momento  - Metrobús (Map+Top10) - Export CSV/JSON
 - Inconsis.- Gasto por período   - STE (Subsistemas)    - Marcas de error
            - Saldo final         - TIMT (OD Matrix+Map)
            - Pastel organismos   - Ecobici (OD+Map+Anim)
```

---

## 🌳 Índice de Documentación por Archivo

Explora la documentación concisa de cada componente en el árbol:

- **Raíz y Configuración del Servidor**
  - [`index.html`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/index.html.md) - Estructura del DOM, contenedores y scripts CDN.
  - [`styles.css`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/styles.css.md) - Estilos globales, layout CSS grid/flex, diseño responsivo y modales.
  - [`server.py`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/server.py.md) - Servidor HTTP local de desarrollo con cabeceras CORS.
  - [`maps/`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/maps.md) - Capas espaciales GeoJSON (Metro, Metrobús, TIMT, Ecobici).

- **Núcleo de la Aplicación (`src/`)**
  - [`src/index.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/index.js.md) - Orquestador central, carga de datos y renderizado.
  - [`src/state.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/state.js.md) - Almacén de estado global y registro de instancias de gráficas/mapas.
  - [`src/config/constants.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/config/constants.js.md) - Paletas de color, nombres de sistemas y selectores DOM.

- **Entrada / Salida (`src/io/`)**
  - [`src/io/excel.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/io/excel.js.md) - Drag & drop y parseo resiliente de hojas de cálculo SEMOVI.

- **Transformación de Datos y Métricas (`src/data/`)**
  - [`src/data/normalize.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/data/normalize.js.md) - Enriquecimiento de viajes, cálculo temporal y filtros.
  - [`src/data/metrics.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/data/metrics.js.md) - Cálculo de totales de viajes y montos de recargas.
  - [`src/data/inconsistencias.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/data/inconsistencias.js.md) - Detección de saltos atípicos en saldo y cobros indebidos.
  - [`src/data/metro-stats.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/data/metro-stats.js.md) - Métricas para Metro, Metrobús y tarjetas de transporte guiado.
  - [`src/data/ste.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/data/ste.js.md) - Clasificación de subsistemas STE (Trolebús vs. Tren Ligero) y estadísticas.
  - [`src/data/timt.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/data/timt.js.md) - Emparejamiento de viajes TIMT por tramo (06/0B) y construcción de matriz OD.
  - [`src/data/ecobici.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/data/ecobici.js.md) - Emparejamiento de viajes inicio/fin (70/71) y agregaciones OD.

- **Visualizaciones y Gráficas (`src/charts/`)**
  - [`src/charts/common.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/charts/common.js.md) - Montaje de ApexCharts y resolución de colores.
  - [`src/charts/calendar.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/charts/calendar.js.md) - Heatmap diario estilo GitHub anual con D3.
  - [`src/charts/pie.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/charts/pie.js.md) - Gráfica donut de viajes por organismo de transporte.
  - [`src/charts/line.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/charts/line.js.md) - Serie temporal de viajes mensuales por organismo.
  - [`src/charts/stacked-by-day.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/charts/stacked-by-day.js.md) - Barras apiladas de viajes por día de la semana.
  - [`src/charts/by-hour.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/charts/by-hour.js.md) - Distribución de viajes por hora del día (0-23) y organismo.
  - [`src/charts/by-momento.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/charts/by-momento.js.md) - Barras por momento del día (Mañana, Tarde, Noche).
  - [`src/charts/heatmap.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/charts/heatmap.js.md) - Mapa de calor día de la semana vs. momento del día.
  - [`src/charts/gasto-total.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/charts/gasto-total.js.md) - Gasto acumulado temporal con selector mensual/semanal.
  - [`src/charts/saldo-final.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/charts/saldo-final.js.md) - Serie continua de saldo restante en la tarjeta.
  - [`src/charts/metro-top10.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/charts/metro-top10.js.md) - Top 10 líneas y estaciones (Metro y Metrobús).
  - [`src/charts/ste.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/charts/ste.js.md) - Donut de subsistemas STE y barras horizontales por línea.
  - [`src/charts/ecobici-heatmap.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/charts/ecobici-heatmap.js.md) - Mapas de calor de rutas más comunes (viajes y tiempo).
  - [`src/charts/ecobici-animation.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/charts/ecobici-animation.js.md) - Reproductor animado de rutas en mapa D3 interactivo.

- **Mapas Geoespaciales (`src/maps/`)**
  - [`src/maps/base.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/maps/base.js.md) - Inicializador de mapas Leaflet con tiles Esri Light Gray Canvas.
  - [`src/maps/metro.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/maps/metro.js.md) - Renderizado de líneas y marcadores de estaciones para Metro/Metrobús.
  - [`src/maps/timt.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/maps/timt.js.md) - Trazo y estaciones del Tren Interurbano proporcionales al flujo.
  - [`src/maps/ecobici.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/maps/ecobici.js.md) - Marcadores de cicloestaciones con conteo de inicio/fin.

- **Interfaz de Usuario y DOM (`src/ui/`)**
  - [`src/ui/sections.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/ui/sections.js.md) - Acordeones colapsables, visibilidad condicional y redibujado de mapas.
  - [`src/ui/table.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/ui/table.js.md) - Tabla DataTables con filtro de transacciones inconsistentes.
  - [`src/ui/timt-table.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/ui/timt-table.js.md) - Tabla interactiva para la matriz Origen-Destino TIMT.
  - [`src/ui/downloads.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/ui/downloads.js.md) - Generación y descarga de archivos CSV y JSON en el cliente.
  - [`src/ui/modal.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/ui/modal.js.md) - Control del modal explicativo ("Sobre esta página").

- **Utilidades (`src/utils/`)**
  - [`src/utils/date.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/utils/date.js.md) - Parseo robusto de formatos de fecha/hora y clasificación de momentos.
  - [`src/utils/strings.js`](file:///c:/Users/jjsan/Github/mi-movilidad/docs/src/utils/strings.js.md) - Homogeneización de texto (sin diacríticos ni puntuación).
