# Documentación: `src/data/metrics.js`

- **Ruta del archivo:** [`src/data/metrics.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/data/metrics.js)
- **Tipo:** Cálculo de métricas agregadas globales

---

## 🎯 Propósito
Calcula los indicadores numéricos principales mostrados en el encabezado de estadísticas globales del dashboard: total de viajes procesados y monto monetario total de recargas.

---

## ⚙️ Funciones Exportadas
- `getTotalViajes(viajes)`: Obtiene la longitud del arreglo de viajes y actualiza el texto del elemento DOM `#totalViajes` formateado con separadores de miles.
- `getTotalRecargas(data)`: Recorre `data` buscando operaciones `00-RECARGA` (o que contengan la palabra `'RECARGA'`), acumula el monto total en pesos y actualiza el texto del elemento DOM `#totalRecargas` (formato `$X,XXX`).
