# Documentación: `src/ui/timt-table.js`

- **Ruta del archivo:** [`src/ui/timt-table.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/ui/timt-table.js)
- **Tipo:** Renderizador de la Matriz Origen-Destino de TIMT en el DOM

---

## 🎯 Propósito
Construye dinámicamente la tabla HTML de la matriz Origen-Destino (`.timt-od-table`) para el Tren Interurbano, con cabeceras fijas, totales marginales por fila/columna y soporte para alternar entre el conteo de viajes y la duración promedio en minutos mediante un selector interactivo.

---

## 🔗 Dependencias
- `src/data/timt.js`: `TIMT_UNKNOWN_STATION`.

---

## ⚙️ Funciones Exportadas
- `renderTimtMatrix(matrix, metric)`:
  - Argumentos: objeto `matrix` (retornado por `buildTimtMatrix`) y `metric` (`'viajes'` o `'duracion'`).
  - Actualiza el título `#timtODTitle`.
  - Construye la tabla HTML con `<thead>`, `<tbody>` y `<tfoot>`.
  - En modo `'viajes'`: muestra conteos y totales absolutos.
  - En modo `'duracion'`: muestra duraciones promedio en minutos (`XX min`) y promedios marginales.
- `setupTimtTableEvents(matrix)`: Vincula el evento `change` del selector `#timtMetricSelect` para redibujar la matriz según la métrica elegida por el usuario.
