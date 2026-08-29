# Documentación: `server.py`

- **Ruta del archivo:** [`server.py`](file:///c:/Users/jjsan/Github/mi-movilidad/server.py)
- **Tipo:** Servidor HTTP local (Python 3)

---

## 🎯 Propósito
Proporciona un servidor de desarrollo HTTP ligero con soporte para cabeceras CORS (`Access-Control-Allow-Origin: *`). Es necesario para servir la aplicación en `localhost` respetando la política de módulos ES (`<script type="module">`) y la carga asíncrona de archivos GeoJSON/Excel vía `fetch`.

---

## ⚙️ Uso
```bash
python server.py [PUERTO]
# Ejemplo por defecto (puerto 8000):
python server.py 8000
```

---

## 🔧 Componentes
- `CORSRequestHandler`: Hereda de `http.server.SimpleHTTPRequestHandler` y sobreescribe `end_headers()` para inyectar cabeceras CORS permisivas en entorno de desarrollo.
