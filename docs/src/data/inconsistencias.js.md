# Documentación: `src/data/inconsistencias.js`

- **Ruta del archivo:** [`src/data/inconsistencias.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/data/inconsistencias.js)
- **Tipo:** Detección y renderizado de anomalías de saldo y cobro

---

## 🎯 Propósito
Verifica cronológicamente que la ecuación contable de la tarjeta (`saldo_anterior + recarga` o `saldo_anterior - monto_viaje == saldo_final`) se cumpla en cada transacción. Identifica cobros duplicados, desfasados o inconsistencias generadas por torniquetes/validadores.

---

## 🔗 Dependencias
- `src/utils/date.js`: `parseFechaHora`.

---

## ⚙️ Funciones y Estructuras Exportadas
- `inconsistentKeys` (`Set`): Conjunto reactivo con las claves compuestas (`${numero}__${fecha}`) de todas las transacciones marcadas como inconsistentes. Utilizado por `src/ui/table.js` para colorear y filtrar filas en la tabla DataTables.
- `detectInconsistencias(data)`: Ordena cronológicamente los registros, evalúa la variación de saldo contra el monto registrado, marca banderas internas en los objetos (`_inconsistente`, `_saldo_inicial`, `_esperado`) y devuelve un arreglo con el detalle de las discrepancias.
- `renderWarning(inconsistencias)`: Renderiza un recuadro de advertencia en `#warningContainer` listando las transacciones anómalas detectadas.
