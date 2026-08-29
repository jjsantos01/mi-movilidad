# Documentación: `src/utils/strings.js`

- **Ruta del archivo:** [`src/utils/strings.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/utils/strings.js)
- **Tipo:** Utilidades de manipulación y homogeneización de texto

---

## 🎯 Propósito
Provee funciones puras de normalización de cadenas para comparar nombres de estaciones o lugares de forma tolerante a diferencias ortográficas, tildes, signos de puntuación o espacios múltiples.

---

## ⚙️ Funciones Exportadas
- `homogenizeString(str)`:
  - Elimina acentos/diacríticos mediante descomposición Unicode NFD (`replace(/[\u0300-\u036f]/g, '')`).
  - Convierte a minúsculas.
  - Elimina caracteres especiales y signos de puntuación no alfanuméricos.
  - Colapsa espacios múltiples en un solo espacio y aplica `trim()`.
