# Documentación: `styles.css`

- **Ruta del archivo:** [`styles.css`](file:///c:/Users/jjsan/Github/mi-movilidad/styles.css)
- **Tipo:** Hoja de estilos global (CSS3)

---

## 🎯 Propósito
Define la apariencia visual, la cuadrícula responsiva (*CSS grid/flexbox*), el comportamiento de animaciones y los estilos para los elementos interactivos del dashboard.

---

## 🎨 Secciones y Clases Principales
- **Layout y Tipografía:** Variables de espaciado, contenedor `.container`, estilos de texto e instrucciones.
- **Zona de Carga (`#dropZone`):** Estilos del área drag & drop, con efectos hover y estado `.dragover`.
- **Tarjetas de Estadísticas (`.stat-card` / `.stats-row`):** Grid responsivo para métricas numéricas destacadas con bordes redondeados y fondos con transparencia.
- **Secciones Colapsables (`.collapsible-section`):** Cabeceras `h2` clicables con indicador desplegable `::after` y transición suave.
- **Contenedores de Gráficas y Mapas:** `.chart-container`, `.map-container` (con altura fija y bordes), y controles de velocidad de animación.
- **Tabla Origen-Destino (`.timt-od-table`):** Matriz fija con cabeceras destacadas, scroll horizontal y celdas legibles.
- **Filas Inconsistentes (`.inconsistent-row`):** Resaltado en color rojizo para transacciones marcadas como anomalías.
- **Modal (`.modal` / `.modal-content`):** Overlay de fondo oscuro y caja centrada con botón de cierre.
