# Documentación: `src/state.js`

- **Ruta del archivo:** [`src/state.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/state.js)
- **Tipo:** Store y Registro Central de Estado

---

## 🎯 Propósito
Centraliza el estado mutable de la aplicación y gestiona el ciclo de vida de las instancias de gráficas y mapas. Evita variables globales dispersas en el `window`.

---

## 📦 Estructura del Estado (`state`)
```javascript
export const state = {
  rawData: [],          // Registros íntegros normalizados del archivo Excel
  viajes: [],           // Viajes procesados y filtrados (sin recargas ni fin de viaje)
  ecobiciViajes: [],    // Viajes emparejados de Ecobici (origen, destino, duración)
  timtValidations: [],  // Validaciones correspondientes a TIMT
  charts: new Map(),    // Mapa de instancias de ApexCharts activas (clave -> chart)
  mapInstances: {},     // Instancias de Leaflet map creadas (mapMetro, mapTIMT, etc.)
};
```

---

## ⚙️ Funciones Exportadas
- `setRawData(rows)`: Asigna los datos crudos saneados.
- `setViajes(viajes)`: Asigna la lista de viajes procesados.
- `setEcobiciViajes(v)`: Asigna los viajes emparejados de Ecobici (sincroniza `window.ecobiciViajes` para compatibilidad).
- `setTimtValidations(rows)`: Asigna las validaciones de TIMT.
- `registerChart(key, chartInstance)`: Registra una gráfica en `state.charts`. Si ya existía una gráfica con esa clave, ejecuta `destroy()` antes de registrar la nueva para prevenir fugas de memoria o superposiciones en el DOM.
