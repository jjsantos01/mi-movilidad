# Documentación: `src/data/timt.js`

- **Ruta del archivo:** [`src/data/timt.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/data/timt.js)
- **Tipo:** Emparejamiento de viajes y construcción de Matriz Origen-Destino del Tren Interurbano

---

## 🎯 Propósito
Reconstruye viajes completos del Tren Interurbano México-Toluca "El Insurgente" emparejando eventos secuenciales de ingreso (`06-INGRESO` o `03-VALIDACION`) y salida (`0B-SALIDA` o `03-VALIDACION`) dentro de una ventana temporal máxima (`TIMT_WINDOW_MINUTES`). Genera la matriz bidimensional de viajes y duraciones promedio entre estaciones.

---

## 🔗 Dependencias
- `src/config/constants.js`: `TIMT_WINDOW_MINUTES`.

---

## ⚙️ Funciones y Constantes Exportadas
- `TIMT_UNKNOWN_STATION`: Cadena constante (`'desconocido'`) para estaciones incompletas o no identificadas.
- `groupTimtTrips(events, windowMinutes)`:
  - Ordena cronológicamente los eventos de validación de TIMT.
  - Empareja un ingreso con su salida correspondiente cuando la diferencia de tiempo es menor o igual a `windowMinutes`.
  - Calcula la duración en minutos (`duracionMinutos`), suma los montos cobrados en ambos puntos y produce una lista de objetos de viaje consolidados con `{ estacionOrigen, estacionDestino, fecha, fechaFin, monto, duracionMinutos, eventos }`.
  - Maneja eventos incompletos o registros con validación genérica (`03`).
- `buildTimtMatrix(trips)`:
  - Genera una estructura bidimensional origen $\times$ destino.
  - Provee métodos auxiliares:
    - `getCount(origen, destino)`: Número de viajes entre el par.
    - `getAvgDuration(origen, destino)`: Duración promedio en minutos.
    - `getOriginTotal(origen)` / `getDestinationTotal(destino)`: Totales por fila/columna.
    - `getOriginAvgDuration(origen)` / `getDestinationAvgDuration(destino)`: Duraciones promedio por fila/columna.
    - `getStationTotals(estacion)`: Flujo total asociado a una estación (como origen, destino y suma).
    - `grandTotal`, `grandAvgDuration`: Totales y promedio globales.
- `filterTimtEntryValidations(events, windowMinutes)`: Retorna exclusivamente los eventos brutos de entrada para evitar duplicar el conteo general de viajes en la app.
