# Documentación: `src/data/ecobici.js`

- **Ruta del archivo:** [`src/data/ecobici.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/data/ecobici.js)
- **Tipo:** Emparejamiento de viajes y cálculo estadístico de Ecobici

---

## 🎯 Propósito
Reconstruye los trayectos completos en bicicleta emparejando los registros de retiro (`70-INICIO DE VIAJE`) con su respectiva devolución (`71-FIN DE VIAJE`), calcula duraciones de viaje y genera agregaciones por pares de cicloestaciones para mapas de calor y tarjetas de estadísticas.

---

## 🔗 Dependencias
- `src/utils/date.js`: `parseDateTime`.
- `src/config/constants.js`: `colorPalette`.

---

## ⚙️ Funciones Exportadas
- `matchInicioFinViaje(inicioViaje, finViaje)`: Empareja cada inicio con el fin de viaje consecutivo (`numero + 1`). Retorna objetos `{ estacionInicio, estacionFin, fechaInicio, fechaFin, duracion }`.
- `getEcobiciODViajes(inicioViaje, finViaje)`: Agrupa los viajes por par origen-destino y devuelve una lista `{ x: origen, y: destino, value: conteo }`.
- `getEcobiciODMeanTime(inicioViaje, finViaje)`: Agrupa por ruta y calcula la duración promedio en minutos `{ x: origen, y: destino, value: minutosPromedio }`.
- `getEcobiciStats(inicioViaje, finViaje)`: Calcula total de viajes, cicloestaciones únicas visitadas, tiempo total acumulado y tiempo promedio de uso. Actualiza los elementos DOM `#totalViajesEcobici`, `#estacionesVisitadas`, `#totalTiempoEcobici`, `#tiempoPromedioEcobici` y colorea `#ecobiciStatsContainer`.
