# Documentación: `src/charts/common.js`

- **Ruta del archivo:** [`src/charts/common.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/charts/common.js)
- **Tipo:** Helper común para renderizado y registro de gráficas

---

## 🎯 Propósito
Centraliza la lógica para instanciar gráficas de ApexCharts, gestionar su montaje seguro en el DOM (destruyendo instancias previas mediante el registro de estado) y resolver colores institucionales por organismo.

---

## 🔗 Dependencias
- `src/config/constants.js`: `colorPalette`.
- `ApexCharts` (Global CDN).

---

## ⚙️ Funciones Exportadas
- `getColorForOrganismo(label)`: Retorna el color RGBA correspondiente al organismo desde `colorPalette`, o un gris por defecto (`'#888'`).
- `mountChart(key, elementId, options, register)`: Localiza el contenedor DOM por `elementId`, instancia `ApexCharts`, ejecuta la función de registro (`register(key, chart)`) para destruir instancias anteriores y llama a `chart.render()`.
