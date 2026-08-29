# Documentación: `src/charts/metro-top10.js`

- **Ruta del archivo:** [`src/charts/metro-top10.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/charts/metro-top10.js)
- **Tipo:** Gráficas de barras horizontales Top 10 para Metro y Metrobús

---

## 🎯 Propósito
Genera los rankings de las 10 líneas más transitadas y las 10 estaciones/paradas más frecuentadas tanto para el STC Metro como para Metrobús, coloreando cada barra según el color oficial de la línea de transporte correspondiente.

---

## 🔗 Dependencias
- `src/config/constants.js`: `metroLineColors`.
- `src/charts/common.js`: `mountChart`.
- `src/state.js`: `registerChart`.

---

## ⚙️ Funciones Exportadas
- `createTop10MetroLinesChart(viajes, organismo)`:
  - Ordena de mayor a menor las líneas por número de viajes y toma las primeras 10.
  - Normaliza códigos de línea (ej. `'01'` -> `'1'`) para asociar su color en `metroLineColors`.
  - Renderiza barras horizontales distribuidas en `#top10MetroLinesChart` o `#top10MetrobusLinesChart`.
- `createTop10MetroStationsChart(viajes, organismo)`:
  - Cuenta viajes por estación, toma el Top 10 y mapea el color de la estación al color de la línea asociada.
  - Renderiza en `#top10MetroStationsChart` o `#top10MetrobusStationsChart`.
