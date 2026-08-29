# Documentación: `src/data/metro-stats.js`

- **Ruta del archivo:** [`src/data/metro-stats.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/data/metro-stats.js)
- **Tipo:** Agregador de métricas y formateador de tarjetas para sistemas guiados (Metro, Metrobús, TIMT)

---

## 🎯 Propósito
Calcula métricas clave para un sistema de transporte específico (total de viajes, número de estaciones únicas visitadas, días distintos de uso y monto total gastado) y actualiza los elementos del DOM correspondientes a sus tarjetas informativas con estilos acordes a su color oficial.

---

## 🔗 Dependencias
- `src/config/constants.js`: `colorPalette`.

---

## ⚙️ Funciones Exportadas
- `getMetroStats(data, organismo, options)`:
  - Argumentos:
    - `data`: Arreglo de viajes correspondientes al sistema.
    - `organismo`: Identificador del organismo (`'STC'`, `'METROBÚS'`, `'STE'`).
    - `options`: Objeto opcional `{ elementId, color, getStations }` para personalizar el prefijo de los IDs de los elementos DOM (ej. `'TIMT'`), el color base o la función extractora de estaciones para viajes con origen y destino múltiples.
  - Actualiza en el DOM: `totalViajes[Id]`, `estacionesVisitadas[Id]`, `diasUso[Id]` y `montoGastado[Id]`.
  - Aplica color de fondo con opacidad al contenedor `[Id]StatsContainer`.
