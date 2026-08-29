# Tus viajes con tarjeta MI - CDMX

Una aplicación web interactiva para visualizar, explorar y analizar los datos de viajes y recargas realizados con la **Tarjeta de Movilidad Integrada (MI)** de la Ciudad de México y su Zona Metropolitana.

[![Demo en vivo](https://img.shields.io/badge/Demo-gh.jjsantoso.com%2Fmi--movilidad-blue)](https://gh.jjsantoso.com/mi-movilidad/)

![](/images/tus-viajes-mi.png)

---

## 🚀 ¿Cómo usarlo?

1. **Obtén tus datos:** Entra a la página pública oficial de SEMOVI: [MI Movilidad Trazabilidad](https://app.semovi.cdmx.gob.mx/MI_movilidad/trazabilidad), ingresa tu número de tarjeta MI y descarga tu historial en formato Excel (`.xlsx`).
2. **Carga tu archivo:** Abre [Tus viajes MI](https://gh.jjsantoso.com/mi-movilidad/) y arrastra o selecciona tu archivo Excel.
3. **Explora tus estadísticas:** La herramienta procesará tus registros automáticamente y generará métricas, gráficos interactivos y mapas de tus trayectos.

---

## ✨ Características y Visualizaciones

### 📊 Métricas Generales y Patrones Temporales
- **Resumen global:** Conteo total de viajes, total recargado, balance y gasto.
- **Calendario Heatmap:** Mapa de calor con la actividad de viajes por día del año.
- **Distribución por Organismo:** Gráfica de pastel y series temporales por medio de transporte (Metro, Metrobús, STE, Ecobici, Cablebús/ORT, RTP, etc.).
- **Patrones de uso horario:** Desglose de viajes por momento del día (Mañana, Tarde, Noche), por hora y organismo, y heatmap interactivo por horas/días de la semana.
- **Gasto y Saldo:** Gráfica de gasto total agrupado por período (mensual o semanal) y evolución del saldo final de la tarjeta.

### 🚆 Secciones Especializadas por Sistema
- **STC Metro:** Top 10 de líneas y estaciones más concurridas, junto con mapa interactivo de estaciones y líneas de la red.
- **Metrobús:** Top 10 de líneas y paradas más utilizadas con mapa de rutas y estaciones.
- **Servicio de Transportes Eléctricos (STE):** Métricas y desgloses específicos para Trolebús y Tren Ligero.
- **Tren Interurbano México-Toluca "El Insurgente" (TIMT):**
  - Emparejamiento de validaciones (ingreso/salida) para reconstruir viajes completos.
  - Matriz de Origen-Destino interactiva (con selector para alternar entre cantidad de viajes y duración promedio).
  - Cálculo de duración promedio de viaje.
  - Mapa interactivo con trazo completo de la ruta y estaciones.
- **Ecobici:**
  - Emparejamiento automático de retiros y devoluciones de bicicletas.
  - Mapas de calor de cicloestaciones (por número de viajes y por tiempo de uso).
  - Animación interactiva de viajes.

### 🔍 Calidad de Datos y Exportación
- **Detección de inconsistencias:** Alerta automática sobre transacciones atípicas o cargos duplicados.
- **Explorador de datos:** Tabla interactiva con búsqueda, ordenación y paginación rápida (DataTables).
- **Exportación:** Descarga de los registros normalizados en formatos **CSV** y **JSON**.

---

## 🔒 Privacidad y Seguridad

- **100% en el cliente:** Todo el procesamiento de datos y la generación de gráficos ocurren localmente en tu navegador.
- **Sin servidores intermedios:** No se envía, almacena ni recopila ninguna información personal o de tu tarjeta en servidores externos.
- **Proyecto independiente:** Es un proyecto personal, de código abierto y sin fines de lucro, sin afiliación oficial con SEMOVI o el Gobierno de la CDMX.

---

## 🛠️ Desarrollo Local

Este proyecto no requiere pasos de compilación ni manejadores de paquetes (*build-free static site*). Utiliza módulos ES estándar en JavaScript.

Para ejecutarlo localmente:

1. Clona el repositorio:
   ```bash
   git clone https://github.com/jjsantos01/mi-movilidad.git
   cd mi-movilidad
   ```

2. Inicia un servidor web local (necesario para cargar módulos ES):
   ```bash
   python server.py 8000
   ```
   *(o alternativamente: `python -m http.server 8000`)*

3. Abre en tu navegador `http://localhost:8000`.

---

## 📁 Estructura del Código

```text
├── index.html            # Entrada de la aplicación SPA
├── styles.css            # Estilos principales de la interfaz
├── server.py             # Servidor HTTP local con soporte CORS
├── maps/                 # Capas GeoJSON (Metro, Metrobús, Ecobici, TIMT)
├── src/
│   ├── index.js          # Orquestador principal y flujo de la aplicación
│   ├── state.js          # Gestión del estado global
│   ├── charts/           # Generadores de gráficas (ApexCharts, D3)
│   ├── data/             # Transformaciones, normalización y métricas
│   ├── io/               # Carga de archivos y parseo Excel (XLSX)
│   ├── maps/             # Integración y capas de Leaflet
│   ├── ui/               # Componentes de interfaz (tablas, modales, descargas)
│   ├── utils/            # Utilidades compartidas (fechas, cadenas)
│   └── config/           # Constantes y paletas de colores
└── AGENTS.md             # Guía técnica de desarrollo y arquitectura
```

---

## 🔗 Enlaces de Interés

- [Portal oficial de trazabilidad SEMOVI](https://app.semovi.cdmx.gob.mx/MI_movilidad/trazabilidad)
- [Cartelera Cineteca Nacional](https://gh.jjsantoso.com/cineteca-schedule-grid) (Proyecto hermano)
- [Perfil de GitHub del autor](https://github.com/jjsantos01)
