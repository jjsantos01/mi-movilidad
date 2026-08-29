# Documentación: `src/charts/saldo-final.js`

- **Ruta del archivo:** [`src/charts/saldo-final.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/charts/saldo-final.js)
- **Tipo:** Serie temporal de evolución de saldo restante

---

## 🎯 Propósito
Muestra cómo ha cambiado el saldo disponible en la tarjeta de movilidad a lo largo del tiempo, deduplicando puntos consecutivos redundantes para generar una línea de tiempo limpia y fiel a cada recarga o cobro.

---

## 🔗 Dependencias
- `src/charts/common.js`: `mountChart`.
- `src/state.js`: `registerChart`.
- `src/utils/date.js`: `parseFechaHora`.

---

## ⚙️ Funciones Exportadas
- `createSaldoFinalChart(data)`:
  - Filtra eventos que no modifican saldo contable de la tarjeta (`70-INICIO DE VIAJE`, `71-FIN DE VIAJE`).
  - Parsea fechas con precisión de hora/minuto y ordena cronológicamente.
  - Retiene únicamente transacciones donde el saldo final experimentó un cambio respecto a la transacción previa.
  - Renderiza una gráfica de línea en `#saldoFinalChart` con eje X temporal (`datetime`).
