# Documentación: `src/data/ste.js`

- **Ruta del archivo:** [`src/data/ste.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/data/ste.js)
- **Tipo:** Clasificación y métricas del Servicio de Transportes Eléctricos (STE)

---

## 🎯 Propósito
Diferencia y clasifica los viajes de STE en sus subsistemas operativos (`Trolebús`, `Tren Ligero`, `TIMT`, `Otros STE`), calcula el desglose de uso y alimenta las tarjetas informativas de la sección STE en el DOM.

---

## 🔗 Dependencias
- `src/config/constants.js`: `colorPalette`.

---

## ⚙️ Funciones Exportadas
- `classifySTESubsystem(linea)`: Determina el subsistema analizando el texto del campo línea (identifica `'TROLEBÚS'`, `'TREN LIGERO'`, `'TIMT'` u otros).
- `getSTESubsystemBreakdown(steTrips)`: Retorna un objeto contador con el número de viajes por subsistema (`{ 'Trolebús': N, 'Tren Ligero': M, ... }`).
- `getSTEStats(data)`: Calcula el total de viajes, viajes en Trolebús, viajes en Tren Ligero, días únicos de uso y monto gastado, actualizando los elementos DOM (`#totalViajesSTE`, `#viajesTrolebusSTE`, `#viajesTrenLigeroSTE`, `#diasUsoSTE`, `#montoGastadoSTE`) y aplicando el color institucional al contenedor `#STEStatsContainer`.
