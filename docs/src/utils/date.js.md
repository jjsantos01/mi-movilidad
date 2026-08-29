# Documentación: `src/utils/date.js`

- **Ruta del archivo:** [`src/utils/date.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/utils/date.js)
- **Tipo:** Utilidades de fecha, hora y clasificación temporal

---

## 🎯 Propósito
Provee funciones utilitarias puras para parsear de forma resiliente cadenas de texto con fechas en diversos formatos provenientes de SEMOVI (soportando tanto `YYYY-MM-DD` como `DD-MM-YYYY`, con o sin hora), y clasificar la hora en momentos del día.

---

## ⚙️ Funciones Exportadas
- `getMomentoDia(hora)`: Retorna `'Mañana'` si $\text{hora} \le 11$, `'Tarde'` si $\text{hora} \le 18$, y `'Noche'` para horas posteriores.
- `parseFechaHora(fechaHora)`: Convierte cadenas de fecha/hora (ej. `'2025-12-01 08:30:00'` o `'01-12-2025 08:30:00'`) en objetos `Date` nativos válidos de JavaScript. Retorna `new Date(0)` si la entrada no es válida.
- `parseDateTime(dateTimeString)`: Alias directo de `parseFechaHora`.
