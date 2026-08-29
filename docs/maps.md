# Documentación: Capas Geoespaciales (`maps/`)

- **Directorio:** `maps/`
- **Tipo:** Datasets GeoJSON estáticos

---

## 🎯 Propósito
Contiene las geometrías espaciales (líneas, puntos de estaciones, límites de colonias) utilizadas por los módulos de mapas Leaflet y visualizaciones D3.

---

## 📁 Archivos GeoJSON
1. **`TIMT.geojson`**:
   - Geometría del trazo completo y estaciones del Tren Interurbano México-Toluca "El Insurgente" (hasta Observatorio). Fuente: *Masivo Edomex*.
2. **`lineas_metro.geojson`**:
   - Trazado de las 12 líneas del Sistema de Transporte Colectivo (STC) Metro.
3. **`estaciones_metro.geojson`**:
   - Puntos georreferenciados de todas las estaciones de la red del Metro.
4. **`lineas_metrobús.geojson`**:
   - Trazado de los corredores y líneas del sistema Metrobús.
5. **`estaciones_metrobús.geojson`**:
   - Puntos georreferenciados de las estaciones y paradas de Metrobús.
6. **`cicloestaciones_ecobici.geojson`**:
   - Puntos georreferenciados de todas las cicloestaciones del sistema Ecobici en la CDMX.
7. **`colonias_ecobici_bordes.geojson`**:
   - Polígonos de colonias con cobertura Ecobici, usados como mapa base en la animación D3.
