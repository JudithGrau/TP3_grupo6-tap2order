# Tap2Order · Pedidos a bordo

## 1. Datos del proyecto
- **Startup:** Tap2Order (Gastronomía y turismo).
- **Objetivo:** Plataforma de pedidos de comida en cruceros con modalidades de entrega en camarote o atención en comedor y sincronización operativa con cocina.
- **Origen:** Proyecto original creado por estudiantes del IFTS N.º 16; retomado, documentado e implementado por el IFTS N.º 29.
- **Grupo:** Grupo 06.
- **Carrera / Institución:** Desarrollo de Software – IFTS N.º 29.
- **Bloque asignado:** Confirmación y cocina.
- **Fecha de entrega:** 26/11/2026.

---

## 2. Sentencias asignadas y propuestas

### Regla R3 · Envío y recepción confirmada por cocina

> "Si el pedido está en edición, completo, conserva productos disponibles y el pasajero confirma el envío, el sistema solicita enviarlo a cocina y lo marca como envío pendiente; solo lo registra como recibido por cocina cuando esta confirma la recepción de esa misma versión."

- **Título de la propuesta:** Envío y recepción confirmada por cocina.
- **Beneficio:** Garantiza consistencia transaccional al desacoplar el despacho del pasajero del acuse de recibo efectivo en cocina mediante un estado transitorio verificable. Previene el procesamiento de comandas incompletas o sin inventario real a bordo, eliminando discrepancias entre lo solicitado en cabina y lo preparado en cocina.
- **Qué proviene de la sentencia:**
  - Control de precondiciones: pedido en estado *en edición*, con datos completos y stock disponible de todos los ítems.
  - La confirmación de envío por parte del pasajero como disparador unívoco.
  - La transición inicial al estado intermedio *envío pendiente*.
  - La condición de que únicamente la confirmación emitida por cocina respecto de esa misma versión del pedido concreta el paso a *recibido por cocina*.
- **Qué agrega el grupo (decisión de diseño):**
  - Manejo explícito de un número de versión `N` para evitar solapamientos si el comensal intenta ediciones sucesivas.
  - Bloqueo preventivo en interfaz con indicación específica de faltantes de stock o campos obligatorios de ubicación (camarote o mesa).
  - Protocolo visual de reintento automático y alerta al personal de sala si cocina demora en confirmar el acuse de recibo.

### Regla R4 · Pedido "listo" informado por cocina

> "Si cocina informa que la versión vigente de un pedido recibido está lista y no hay una modificación pendiente, el sistema cambia su estado a listo; la confirmación del pasajero por sí sola no produce ese cambio."

- **Título de la propuesta:** Pedido "listo" informado por cocina.
- **Beneficio:** Protege el flujo operativo impidiendo que el cliente fuerce estados de preparación de manera unilateral. Asegura que la notificación de despacho solo se active cuando los platos están efectivamente listos y correspondan a la versión exacta sin modificaciones intermedias.
- **Qué proviene de la sentencia:**
  - Exclusividad del rol de cocina como emisor autorizado del aviso de pedido completado.
  - Verificación de correspondencia con la versión vigente previamente registrada en estado *recibido por cocina*.
  - Validación de ausencia de modificaciones pendientes antes de permitir el cambio a *listo*.
  - Bloqueo del cambio de estado ante cualquier acción unilateral proveniente del pasajero.
- **Qué agrega el grupo (decisión de diseño):**
  - Estado visual intermedio *En preparación* para dar certidumbre al comensal en su pantalla sin desvirtuar la lógica de la regla.
  - Enrutamiento diferenciado de la notificación de despacho final según la modalidad seleccionada (camarote o comedor).
  - Alerta de versión desactualizada ante discrepancias entre pantalla de cocina y cambios solicitados a último momento.

---

## 3. Integrantes y aportes

| Integrante | Rol / Etapa | Aporte concreto y verificable en el proyecto |
| :--- | :--- | :--- |
| **Judith Grau** | Etapa 1 | Creación del repositorio, estructura HTML5 inicial, maquetado de cabecera fija y sección de presentación, identidad visual en `style.css` (variables de paleta y tipografía), integración del logotipo en formato WebP con respaldo visual y semántico, y base de paneles desplegables (`<details>`). |
| **Lucas Luccaroni** | Etapa 2 | Redacción y estructuración técnica de las propuestas para las reglas R3 y R4 en `index.html`, diferenciación explícita entre requisitos normativos de la sentencia y decisiones de diseño, y redacción de los contenidos detallados de datos, excepciones e intervención humana en los paneles desplegables. |
| **Matías Jara** | Etapa 3 | Maquetado e implementación de los diagramas de flujo interactivos para R3 y R4 en `index.html` y `style.css` (leyenda de formas, nodos y conectores SVG), desarrollo de la lógica de simulación en `script.js` (caminos "Sí", "No" y "Reiniciar"), accesibilidad mediante `aria-pressed`, regiones `aria-live` y adaptación a `prefers-reduced-motion`, y verificación de layout en desktop. |
| **Mauro Flores** | Etapa 4 | Elaboración y estructuración técnica de la documentación final en `README.md`, despliegue de la landing page en la plataforma Vercel y auditoría funcional en ventana de navegación de incógnito. |

---

## 4. Herramientas de IA

| Integrante / Etapa | Aplicación | Modelo | Uso concreto por etapa |
| :--- | :--- | :--- | :--- |
| **Judith Grau** (Etapa 1) | Antigravity | Gemini 3.8 Flash (Medium) | Generación de la estructura semántica base en HTML5, definición de variables CSS para la paleta institucional y diseño del mecanismo de fallback para el logotipo oficial. |
| **Lucas Luccaroni** (Etapa 2) | Antigravity | Gemini 3.8 Flash (Medium) | Redacción técnica de las propuestas R3/R4, segregación entre especificación de la regla y aportes de diseño, y estructuración de los grupos de datos en `<details>`. |
| **Matías Jara** (Etapa 3) | Antigravity | Gemini 3.8 Flash (Medium) | Modelado de nodos y conectores de los diagramas de flujo en rombos con SVG inline y conectores en HTML/CSS, programación de la simulación paso a paso en JavaScript y soporte para movimiento reducido. |
| **Mauro Flores** (Etapa 4) | Antigravity | Gemini 3.8 Flash (Medium) | Redacción técnica del archivo `README.md` alineada estrictamente al código fuente comprobable y checklist de verificación. |

*Otras herramientas utilizadas por los integrantes:* 

| **Mauro Flores** | Claude Sonet 5.5 Medium | Gemini 4 Hydrogen |

---

## 5. Estructura del proyecto

### Árbol de archivos
```text
TP3_grupo6-tap2order/
├── img/
│   └── logo-tap2order.webp
├── index.html
├── README.md
├── script.js
└── style.css
```

### Paleta y tipografías (definidas en `style.css`)
- **Paleta corporativa:**
  - Azul marino principal: `--navy: #122B48`
  - Azul marino complementario: `--navy-700: #1C3A5E`
  - Naranja acento (Regla R3 y foco): `--orange: #FF8C32`
  - Naranja oscuro (estados hover/bordes): `--orange-600: #E5741C`
  - Turquesa acento (Regla R4): `--teal: #2A9D8F`
  - Turquesa complementario: `--teal-600: #21857A`
  - Neutros de interfaz: Fondo general `--bg: #F6F8FB`, fondo alternativo `--bg-alt: #EDF2F7`, texto `--text: #1E2A38`, texto secundario `--text-muted: #4A5868`, borde `--border: #D6DEE8`, blanco puro `--white: #FFFFFF`.
- **Tipografías (Google Fonts):**
  - Títulos y destacados: `--font-title: "Poppins", system-ui, sans-serif` (pesos 500, 600, 700).
  - Cuerpo de texto y controles: `--font-body: "Inter", system-ui, sans-serif` (pesos 400, 500, 600).

### Accesibilidad comprobada en código
- **Enlace de salto (`skip-link`):** elemento `<a class="skip-link" href="#contenido">` para permitir la omisión de cabecera con teclado directo al `<main>`.
- **Foco visible estricto:** regla global `:focus-visible` con contorno de 3px color naranja corporativo (`--focus-ring: 3px solid var(--orange)`), diferenciado de contenedores con `tabindex="-1"`.
- **Navegación activa programática:** uso de `IntersectionObserver` en `script.js` para asignar `aria-current="true"` y clase visual al ítem de menú que corresponde a la sección en pantalla.
- **Regiones dinámicas accesibles:** elementos con `aria-live="polite"` e IDs `#r3-live`, `#r4-live` y `#details-status` para verbalizar a lectores de pantalla el avance de simulaciones y apertura masiva de paneles.
- **Controles de simulación semánticos:** botones de caminos de diagrama en `role="toolbar"` con sincronización del atributo de estado `aria-pressed`.
- **Respeto a preferencias del usuario (`prefers-reduced-motion`):** detección de media query tanto en CSS como en JavaScript (`window.matchMedia`), desactivando transiciones continuas y ejecutando el resaltado de simulaciones de forma instantánea.
- **Respaldo de imagen (fallback):** validación por evento de error en `script.js` que oculta la imagen rota y despliega una insignia tipográfica accesible con `role="img"` y `aria-label`.
- **Estructura semántica nativa:** paneles con `<details class="panel">` y `<summary>` operables de forma estándar mediante teclado (Tab, Enter, Espacio).

### Optimización desktop comprobada en código
- **Ancho y alineación:** contenedor central con tope máximo de 1200px (`--container: 1200px`) centrado horizontalmente mediante `margin-inline: auto`.
- **Restricción de escala:** regla `min-width: 1024px` en el elemento `body` orientada a la visualización de escritorio establecida en la entrega.
- **Grillas CSS estructuradas:**
  - Layout hero en grilla de 2 columnas asimétricas (`1.2fr 1fr`).
  - Tarjetas de objetivos en 3 columnas (`repeat(3, 1fr)`).
  - Comparativa de propuestas R3/R4 en 2 columnas paralelas (`repeat(2, 1fr)`).
  - Leyenda de formas de diagramas en 4 columnas horizontales (`repeat(4, 1fr)`).
  - Lienzos de diagramas de flujo y columnas de desplegables en 2 columnas simétricas (`repeat(2, 1fr)`).

### Ejecución local
Abrir directamente el archivo `index.html` en cualquier navegador web moderno o servir el directorio del proyecto mediante un servidor local estático (por ejemplo, con `npx serve .` o la extensión Live Server de VS Code).

---

## 6. Enlaces públicos
- **Repositorio:** https://github.com/JudithGrau/TP3_grupo6-tap2order
- **Comprobación en modo incógnito:** [PENDIENTE: Fecha y resultado de la comprobación en ventana de incógnito]
