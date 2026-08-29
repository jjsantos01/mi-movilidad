# Documentación: `src/data/normalize.js`

- **Ruta del archivo:** [`src/data/normalize.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/data/normalize.js)
- **Tipo:** Normalización y enriquecimiento de registros de viajes

---

## 🎯 Propósito
Filtra operaciones que no constituyen inicios de viaje (como recargas o fines de viaje de Ecobici), enriquece cada registro con atributos temporales (`dayOfWeek`, `momento_dia`, `hora`), deduplica viajes de salida en validaciones por tramo de TIMT y extrae subconjuntos de datos por organismo.

---

## 🔗 Dependencias
- `src/utils/date.js`: `getMomentoDia`, `parseFechaHora`.
- `src/data/timt.js`: `filterTimtEntryValidations`.

---

## ⚙️ Funciones Exportadas
- `processViajes(data)`: Filtra `00-RECARGA` y `71-FIN DE VIAJE`, enriquece cada registro con hora, día de la semana y momento del día, y para TIMT retiene únicamente la validación de entrada por cada trayecto para evitar sobreconteo de viajes.
- `createMetroObject(viajes, selectedOrganismo)`: Filtra el arreglo de viajes por el organismo indicado (por defecto `'STC'`).
- `populateOrganismoSelector(viajes)`: Obtiene la lista única de organismos presentes en los datos, anteponiendo la opción `'Todos'`.
- `extractTimtValidations(data)`: Extrae todas las validaciones brutas correspondientes a TIMT enriquecidas con atributos temporales.
