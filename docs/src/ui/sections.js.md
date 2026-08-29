# Documentación: `src/ui/sections.js`

- **Ruta del archivo:** [`src/ui/sections.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/ui/sections.js)
- **Tipo:** Controlador de secciones colapsables y visibilidad en el DOM

---

## 🎯 Propósito
Maneja el comportamiento interactivo de acordeón para las secciones colapsables (`.collapsible-section`), forzando la invalidación de tamaño de los mapas Leaflet (`invalidateSize()`) cuando una sección oculta se expande, y gestiona la visualización condicional de bloques según existan datos.

---

## 🔗 Dependencias
- `src/state.js`: `state.mapInstances`.

---

## ⚙️ Funciones Exportadas
- `setupCollapsibleSections()`: Agrega listeners de clic a los encabezados `h2` de secciones colapsables para alternar su despliegue (`display: block` / `none`) e invalidar el tamaño de los contenedores de mapas hijos para corregir problemas de renderizado de Leaflet.
- `showLoadingMessage()`: Oculta secciones de datos y coloca el mensaje de carga en `#loadingMessage`.
- `showAllSections()`: Muestra contenedores base (`#statsContainer`, `#chartContainer`, `#results`) y limpia el mensaje de carga.
- `updateSection(sectionId, data, updateFunction)`: Si `data` contiene elementos ($>0$), ejecuta `updateFunction(data)` y hace visible la sección (`display: block`); si está vacía, oculta el contenedor (`display: none`).
