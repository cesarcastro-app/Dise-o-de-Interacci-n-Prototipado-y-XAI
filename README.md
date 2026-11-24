# Prototipo web académico de SDATR — Tarea 4

Este directorio contiene un prototipo estático y navegable de las funciones propuestas para la Tarea 4 de Fundamentos de Interacción Humano-Computador.

No es una API, no consulta bases de datos y no contiene información real. Todos los eventos, IP, usuarios, reglas y métricas son ficticios y se incluyen únicamente para demostrar interacción, explicabilidad y responsabilidad humana.

## Contenido visual

- Bandeja inteligente y accesible de alertas.
- Detalle de alerta con reglas, Isolation Forest y XGBoost.
- Explicación progresiva y acceso a evidencias.
- Consulta RAG con citas y límites visibles.
- Corrección, anulación, escalamiento y auditoría.
- Gobernanza del diálogo y prevención del Valle Inquietante.
- Preferencias de texto, contraste y densidad.
- Preparación para evaluación con cinco usuarios reales.

## Ejecutar localmente

Puede abrir `index.html` directamente. Para evitar restricciones del navegador se recomienda un servidor estático:

```powershell
Set-Location "C:\Desarrollo\MAESTRIA\SDATR\evidencias\TAREA4_PROTOTIPO_WEB_SDATR"
python -m http.server 8080
```

Después, abra:

```text
http://localhost:8080
```

Rutas demostrativas:

```text
http://localhost:8080/#alerts
http://localhost:8080/#alert-detail
http://localhost:8080/#rag
http://localhost:8080/#governance
```

## Publicar posteriormente con GitHub Pages

1. Cree un repositorio nuevo en GitHub.
2. Copie el contenido de esta carpeta en la raíz del repositorio.
3. Confirme que `index.html`, `styles.css`, `app.js` y `.nojekyll` estén en la raíz.
4. En GitHub abra **Settings → Pages**.
5. Seleccione **Deploy from a branch**.
6. Seleccione la rama `main` y la carpeta `/ (root)`.
7. Guarde y espere a que GitHub muestre la URL pública.
8. Pruebe la URL en una ventana privada antes de enviarla al profesor.

No publique credenciales, archivos `.env`, logs reales ni respaldos de PostgreSQL.

## Correspondencia con la rúbrica

| Criterio | Evidencia del prototipo |
|---|---|
| Tres pantallas clave | Bandeja, detalle XAI y consulta RAG |
| Coherencia con fases anteriores | Navegación estable, accesibilidad P1/P2, citas y rutas canónicas |
| Tono y proactividad | Vista Gobernanza y mensajes aceptados/rechazados |
| Transparencia sintética | Etiquetas IA, límites y ausencia de avatar humano |
| Explicabilidad | Regla, anomalía, clase, probabilidad, contribución y evidencia |
| Agencia | Confirmar, corregir, falso positivo, deshacer y escalar |
| Responsabilidad humana | Diálogo de decisión, línea de tiempo y roles explícitos |

## Estructura

```text
TAREA4_PROTOTIPO_WEB_SDATR/
├── index.html
├── styles.css
├── app.js
├── README.md
└── .nojekyll
```

## Alcance técnico

- HTML5 semántico.
- CSS responsivo sin frameworks.
- JavaScript local para navegación e interacciones demostrativas.
- Navegación mediante fragmentos `#`, compatible con GitHub Pages.
- Sin dependencias, compilación, API, cookies o almacenamiento remoto.

