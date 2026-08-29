# Documentación: `src/charts/ecobici-heatmap.js`

- **Ruta del archivo:** [`src/charts/ecobici-heatmap.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/charts/ecobici-heatmap.js)
- **Tipo:** Mapas de calor de matrices de viaje en Ecobici (ApexCharts)

---

## 🎯 Propósito
Visualiza en formato de mapa de calor bidimensional las rutas más populares de Ecobici (cicloestaciones con al menos 2 viajes), soportando tanto el conteo total de viajes como el tiempo promedio de recorrido entre estaciones. Se carga de forma perezosa (*lazy loaded*).

---

## 🔗 Dependencias
- `src/data/ecobici.js`: `getEcobiciODViajes`, `getEcobiciODMeanTime`.
- `src/charts/common.js`: `mountChart`.
- `src/state.js`: `registerChart`.

---

## ⚙️ Funciones Exportadas
- `createEcobiciHeatmap(inicioViaje, finViaje, tipo)`:
  - Argumentos: arreglos de inicios y fines de viaje, y `tipo` (`'viajes'` o `'tiempo'`).
  - Identifica las estaciones más frecuentes ($\ge 2$ viajes).
  - Construye una matriz de origen vs. destino ordenada y monta el heatmap en `#ecobici-viajes` o `#ecobici-tiempo`.
