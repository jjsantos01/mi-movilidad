# Documentación: `src/ui/modal.js`

- **Ruta del archivo:** [`src/ui/modal.js`](file:///c:/Users/jjsan/Github/mi-movilidad/src/ui/modal.js)
- **Tipo:** Controlador del modal de información

---

## 🎯 Propósito
Controla la apertura, cierre e interacción con el modal emergente `#aboutModal` ("Sobre esta página"), manteniendo compatibilidad con llamadas `onclick` inline del HTML y cerrándose al hacer clic fuera del contenido del modal.

---

## ⚙️ Funciones Exportadas
- `openAboutModal()`: Despliega el modal cambiando `#aboutModal.style.display = 'block'`.
- `closeAboutModal()`: Oculta el modal cambiando `#aboutModal.style.display = 'none'`.
- `attachGlobalModalHandlers()`: Expone `openAboutModal` y `closeAboutModal` en el objeto `window` para compatibilidad con atributos HTML inline y añade un listener global al `window` para cerrar el modal al hacer clic en el backdrop oscuro.
