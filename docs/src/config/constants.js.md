# Documentación: `src/config/constants.js`

- **Ruta del archivo:** [`src/config/constants.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/config/constants.js)
- **Tipo:** Constantes globales y configuración

---

## 🎯 Propósito
Define valores inmutables compartidos a lo largo de toda la aplicación: paleta de colores oficial de la Red de Movilidad Integrada (MI), códigos de color por línea de Metro, nombres canónicos de sistemas, selectores CSS y ventanas temporales de agrupación.

---

## ⚙️ Constantes Exportadas
- `prod`: Bandera numérica (`0` en `localhost`, `1` en producción).
- `colorPalette`: Diccionario de colores RGBA por organismo (`STC`, `METROBÚS`, `ECOBICI`, `STE`, `CABLEBÚS`, `ORT`, `RTP`, `CETRAM`, `RUTA`) y por momento del día (`Mañana`, `Tarde`, `Noche`).
- `metroLineColors`: Diccionario de colores hexadecimales oficiales para las 12 líneas del Metro (`'1'` a `'12'`, `'A'`, `'B'`).
- `sistemas`: Mapeo de códigos de organismo a nombres legibles de sistema (`STC` -> `'Metro'`, `METROBÚS` -> `'Metrobús'`, etc.).
- `selectors`: Selectores CSS comunes (`#dropZone`, `#fileInput`, `#loadingMessage`, `#resultsTable`, etc.).
- `TIMT_WINDOW_MINUTES`: Ventana temporal en minutos (`120`) utilizada para emparejar validaciones de ingreso (`06`) y salida (`0B`) del Tren Interurbano.
