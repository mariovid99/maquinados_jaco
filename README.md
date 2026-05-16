# JACO — Rediseño Web Premium (Brief Maestro para Agente)

> **Agente de IA: lee este documento de principio a fin antes de escribir una sola línea de código.** Luego, lee en orden:
> 1. `DESIGN_BRIEF.md` — sistema visual, tipografía, color, animaciones
> 2. `CONTENT_BRIEF.md` — TODO el contenido del PDF transcrito + secciones nuevas (incluye "Nuestra Historia")
> 3. `BACKEND_CONTEXT.md` — el CMS serverless ya construido (S3 + JWT + Vercel) que vas a reutilizar
> 4. `CONTENT_STRUCTURE.md` — schema completo de `content.json` que el admin debe poder editar
> 5. `reference/JACO_INSPO.pdf` — abre el PDF de inspiración del cliente, es la **fuente de verdad visual**
> 6. `reference/content_actual.json` — contenido actual usado hoy (puedes reutilizar redacciones)
> 7. `assets/` — logos y hero image disponibles

---

## 1. Objetivo del proyecto

**Cliente:** Maquinados Jaco — empresa de manufactura industrial CNC en Monterrey, N.L.

**Encargo:** Rediseño completo del sitio web. El sitio actual (`../index.html`) es HTML/CSS/JS plano. Lo vas a reemplazar por una **aplicación moderna con frameworks de última generación**, manteniendo intacto el backend CMS que ya existe.

**Estándar de calidad:** "Una página de **$50,000 MXN**." Esto significa:
- Animaciones fluidas y orquestadas (no efectos aislados de plantilla)
- Microinteracciones en cada elemento interactivo
- Tipografía dramática, jerarquía clara
- Transiciones entre secciones cinematográficas
- Sensación de "obra de arte industrial" — no template genérico
- Carga rápida (<2.5s LCP), Lighthouse 90+ en todo
- Responsive impecable mobile-first
- **Propósito del visitante en <20 segundos:** que sepa qué hace JACO y cómo puede ayudarle

**Conversión:** El sitio debe llevar al usuario a:
- Mandar WhatsApp (botón flotante siempre visible)
- Llenar el formulario de contacto (vía EmailJS)
- Llamar al teléfono

---

## 2. Stack tecnológico requerido

**NO uses HTML/CSS/JS plano.** Usa este stack:

| Capa | Tecnología | Por qué |
|---|---|---|
| Framework | **Next.js 15** (App Router) + **React 19** + **TypeScript** | SSR/ISR para SEO industrial, routing, optimización de imágenes |
| Estilos | **Tailwind CSS v4** | Velocidad de desarrollo, sistema consistente |
| Componentes base | **shadcn/ui** | Buttons, dialogs, accordions accesibles |
| Animaciones | **Framer Motion** (motion/react) + **GSAP + ScrollTrigger** | Motion para microinteracciones; GSAP para timelines complejos scroll-driven |
| Scroll suave | **Lenis** (@studio-freight/lenis) | Suaviza el scroll, base para parallax |
| 3D / hero | **React Three Fiber** + **drei** (opcional pero recomendado para el hero — una pieza CNC rotando, o partículas) | Diferenciador visual premium |
| Iconos | **Lucide React** + **react-icons** (para logos de marca) | Stroke consistente |
| Carrusel/slider | **Embla Carousel** | Performante, sin lock-in |
| Formulario | **react-hook-form** + **zod** + **@emailjs/browser** | Validación robusta + envío |
| Mapas | iframe Google Maps embed (igual que hoy) | Sin costo de API |
| Fuentes | **next/font** con `Bebas Neue` (display industrial) + `Inter` (UI) + `Space Grotesk` (técnico) | Las fuentes de la marca |
| Imágenes | `next/image` + WebP | Lazy load + optimización automática |
| Deploy | **Vercel** (mismo proyecto) | Ya configurado con env vars |

**Si necesitas un componente que no está en esta lista, justifícalo en código con un comentario corto.**

---

## 3. Lo que NO debes tocar (backend ya construido)

El proyecto padre (`../`) tiene un CMS serverless funcional. Léelo en detalle en **`BACKEND_CONTEXT.md`**. Resumen:

- **`/api/login`** — POST contraseña → JWT (8h)
- **`/api/content`** — GET `content.json` desde S3 (cacheado 60s edge)
- **`/api/save`** — POST (con JWT) → guarda `content.json` en S3
- **`/api/upload`** — POST (con JWT) → sube imagen a S3, devuelve URL pública

**Variables de entorno (Vercel) — REUTILIZAR LAS MISMAS:**
- `ADMIN_PASSWORD`, `JWT_SECRET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET_NAME`

**Nueva variable a agregar:**
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`

Genera un `.env.example` con todas las variables documentadas. NUNCA subas `.env.local`.

**Reutiliza tal cual** las funciones serverless `api/*.js` del proyecto padre, adaptadas a la estructura `app/api/` de Next.js (Route Handlers). El schema de `content.json` SÍ va a crecer — ver `CONTENT_STRUCTURE.md`.

---

## 4. Estructura de secciones (orden final)

> El PDF tiene 8 capítulos. Vas a expandirlos a una landing de una sola página con scroll cinematográfico + algunas vistas adicionales para listas largas.

1. **Navbar fijo** — logo + links + CTA WhatsApp
2. **Hero (DARK)** — el único bloque oscuro permitido. Aquí los colores de marca (azul #001A8B + rojo #B90001) deben dominar. Headline impactante, video/imagen de fondo + partículas o pieza 3D, CTA dual (Cotizar / Ver Servicios). Indicador de scroll.
3. **Barra de stats** (NUEVA — propuesta) — 4 contadores animados: años, proyectos, clientes, materiales. Fondo blanco con franja roja diagonal.
4. **¿Quiénes somos?** (claro) — 4 pilares: Sustentabilidad, Soluciones, Calidad, Experiencia. Diseño tipo bento con cards animadas en hover.
5. **Nuestra Historia** (NUEVA — timeline) — línea del tiempo vertical en desktop, horizontal scroll en mobile, con 5–6 hitos inventados que el cliente luego ajusta. Animación scroll-driven (línea que se traza con `<motion.path>`).
6. **Investigación y Desarrollo + Enfoque** — split-screen sticky. Texto izquierdo + imagen industrial parallax derecha.
7. **Precisión en el Diseño Industrial** — galería tipo masonry con hover-zoom + lightbox.
8. **Soldadura de Alta Calidad** — sección con cards horizontales tipo "antes/después" o un slider tipo Embla con técnicas (MIG, TIG, SMAW).
9. **Soluciones Personalizadas** — proceso de trabajo en 4–5 pasos (NUEVA propuesta de marketing): Análisis → Diseño → Prototipo → Producción → Entrega. Cards con números grandes 01–05 al estilo del PDF (página 2 del PDF muestra esta numeración con tipografía Bebas).
10. **Innovación y Tecnología Avanzada** — grid de software (Fusion 360, Mastercam, Cricut, Prusa Slicer, Illustrator, Bambu Lab) + grid de equipo (centro de maquinado, torno CNC, fresadora, cortadora láser, etc.). Logos en grises con hover a color.
11. **Servicios completos** (NUEVA expansión del PDF) — 3 columnas: Manufactura Avanzada, Pailería/Soldadura/Estructuras, Diseño CAD/CAM. Cada una con su lista de servicios + equipo. Editable desde admin (array dinámico).
12. **Comercialización** — grid de marcas que comercializan (DeWalt, Bosch, Black&Decker, Starrett, Dremel, etc.) + lista de categorías. Carrusel infinito con efecto marquee.
13. **Clientes** — logos de clientes reales (BAC, Fastenal, Genvamex, Grupo Geyser, Howmet Aerospace, Vertiv, Plastiexports, Sanilock) en grid con hover.
14. **Testimonios** (NUEVA — recomendado para conversión) — slider con 3–4 testimonios. Inventa placeholders editables.
15. **FAQ** (NUEVA — recomendado para SEO + retención) — accordion con 6–8 preguntas frecuentes (tiempos de entrega, mínimos, materiales, certificaciones, etc.).
16. **CTA intermedia (banner)** — antes de contacto, banner de ancho completo con headline + 2 CTAs (WhatsApp + Cotizar).
17. **Contacto** — split: formulario (EmailJS) izquierda + info de contacto + mapa derecha. Mantener whatsapp_href y maps_embed_src del JSON actual.
18. **Footer** — logo + tagline + 3 columnas de links + redes + copyright "Diseñado por Mario Vidaña".

**Botón flotante WhatsApp** siempre visible, esquina inferior derecha, pulsa suave cada 5 segundos.

---

## 5. Filosofía visual (resumen — detalles en DESIGN_BRIEF.md)

El PDF del cliente es muy específico. Respétalo:

- **Fondo dominante BLANCO/CREMA**, pero NUNCA un blanco plano sin vida. Llénalo de:
  - **Franjas diagonales** azul #001A8B y rojo #B90001 (ver páginas 1, 2, 7, 10, 11 del PDF)
  - **Cortes geométricos / parallelogramas** en imágenes (todas las fotos del PDF tienen cortes diagonales en los bordes)
  - **Patrones sutiles** de círculos/líneas técnicas en backgrounds (página 12 del PDF tiene patrón de círculos)
  - **Marcas técnicas** tipo cota industrial, líneas de plano CAD, puntos de coordenadas
- **Tipografía display:** UPPERCASE, condensed, geometric (Bebas Neue es la apuesta segura — el PDF usa algo muy parecido a "Industry" o "Eurostile")
- **Numeración de secciones** estilo "01 / 02 / 03" gigante, como en la página 2 del PDF
- **Acentos rojos** como marcadores: pequeñas barras horizontales/verticales rojas debajo de títulos (ver página 3 del PDF: barra roja bajo "¿Quiénes somos?")
- **Hero dark:** fondo azul oscuro #0A1342 o negro, con la geometría angular del logo JACO repetida sutilmente como background pattern
- **Imágenes con clip-path diagonal** (`polygon()`) — todas las fotos deben verse "cortadas" como en el PDF, no rectangulares simples

---

## 6. Logos disponibles

En `assets/`:
- **`Jaco_logo.jpeg`** — logo principal (texto JACO + tagline + ícono de prisma). **Úsalo en navbar, footer y hero.** Tiene fondo blanco; si lo soporta Tailwind/Next, aplica `mix-blend-mode: multiply` o conviértelo a PNG transparente vía herramienta de tu elección (`remove.bg` API si tienes, o `sharp` con detección de bg). Si no es posible automatizar, deja una nota clara en el README final indicándole al usuario que suba la versión transparente con el mismo nombre.
- **`Jaco_logo_icono_claro.jpeg`** — solo el ícono de prisma sobre fondo blanco. Úsalo para favicon, watermarks pequeños, decoraciones.
- **`Jaco_logo_icono_oscuro.jpeg`** — variante oscura, úsalo en secciones claras si el otro no contrasta.
- **`image_hero.png`** — imagen industrial para hero (úsala como fallback si no implementas Three.js).

**Acción requerida:** Genera versiones PNG/SVG transparentes en `public/logos/` durante el setup. Si no puedes quitar el fondo programáticamente, deja un TODO claro en el README final.

---

## 7. Editabilidad desde admin

**TODO** lo siguiente debe poder editarse desde `/admin` sin tocar código:

- Hero: headline (3 líneas), badge, subheading, CTAs (texto + link), imagen/video de fondo
- Stats: array de {label, valor numérico, sufijo} — añadir/eliminar
- Quiénes somos: 4 pilares (icono Lucide, título, descripción) editables
- Historia: array de hitos {año, título, descripción, imagen?} — añadir/eliminar/reordenar
- I+D / Enfoque: textos + imágenes
- Galería precisión: array de imágenes con caption — añadir/eliminar
- Soldadura: descripción + array de técnicas + imágenes
- Proceso (Soluciones Personalizadas): array de pasos {número, título, descripción}
- Software: array de logos {nombre, logo_url, link?}
- Equipo: array por categoría
- Servicios (3 columnas): array de categorías cada una con array de items
- Comercialización: array de marcas (logo_url) + array de categorías
- Clientes: array de {nombre, logo_url}
- Testimonios: array de {nombre, empresa, cargo, texto, foto?}
- FAQ: array de {pregunta, respuesta}
- Contacto: todos los campos del JSON actual
- Footer: tagline, copyright, redes

El panel `/admin` debe tener:
- Pestañas por sección (sidebar a la izquierda)
- Para arrays: botones "+ Agregar" y "🗑 Eliminar" por item, drag-handle para reordenar (usa `@dnd-kit`)
- Upload de imágenes inline (drag & drop) — usa `/api/upload` existente
- Botón "Guardar Cambios" sticky abajo
- Preview en vivo o link "Ver sitio en pestaña nueva"

**Mismas credenciales** que el proyecto actual (`ADMIN_PASSWORD` en Vercel).

---

## 8. Formulario de contacto — EmailJS

El formulario apunta a EmailJS (no a una API propia). Campos:
- Nombre completo (required)
- Empresa (opcional)
- Email (required, validación)
- Teléfono (required, validación regex MX)
- Tipo de servicio (select: Manufactura CNC / Soldadura / Diseño CAD-CAM / Comercialización / Otro)
- Mensaje (textarea, required, mínimo 20 caracteres)
- Checkbox "Acepto términos y aviso de privacidad"

Validación con `zod` + `react-hook-form`. Envío con `@emailjs/browser` usando las 3 env vars `NEXT_PUBLIC_EMAILJS_*`. Estado de loading + toast de éxito/error (usa `sonner` de shadcn).

El usuario va a configurar EmailJS después; deja el código listo para que solo pegue las 3 variables y funcione.

---

## 9. Estructura de archivos del proyecto

```
JACO_Website/
├── README.md                  ← este archivo
├── DESIGN_BRIEF.md            ← sistema visual completo
├── CONTENT_BRIEF.md           ← todo el contenido transcrito
├── BACKEND_CONTEXT.md         ← APIs reutilizadas
├── CONTENT_STRUCTURE.md       ← schema de content.json
├── reference/
│   ├── JACO_INSPO.pdf
│   └── content_actual.json
├── assets/
│   ├── Jaco_logo.jpeg
│   ├── Jaco_logo_icono_claro.jpeg
│   ├── Jaco_logo_icono_oscuro.jpeg
│   └── image_hero.png
│
└── (acá vas a generar el proyecto Next.js completo)
    ├── package.json
    ├── next.config.ts
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── .env.example
    ├── .env.local            ← gitignored
    ├── .gitignore
    ├── public/
    │   ├── logos/
    │   │   ├── jaco-full.png (transparente)
    │   │   ├── jaco-icon-light.png
    │   │   └── jaco-icon-dark.png
    │   ├── brands/           ← logos comercialización (a buscar/agregar)
    │   └── clients/          ← logos clientes
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx          ← landing one-page
    │   ├── globals.css
    │   ├── admin/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx      ← panel admin
    │   │   └── login/page.tsx
    │   └── api/
    │       ├── login/route.ts
    │       ├── content/route.ts
    │       ├── save/route.ts
    │       └── upload/route.ts
    ├── components/
    │   ├── sections/         ← Hero, Stats, Nosotros, Historia, etc.
    │   ├── ui/               ← shadcn
    │   ├── admin/            ← editores por sección
    │   ├── animations/       ← wrappers reutilizables (FadeIn, ParallaxImg, etc.)
    │   └── shared/           ← Navbar, Footer, WhatsAppFloat, etc.
    ├── lib/
    │   ├── s3.ts
    │   ├── jwt.ts
    │   ├── content.ts        ← fetcher tipado del JSON
    │   └── emailjs.ts
    └── types/
        └── content.ts        ← TypeScript types del schema completo
```

---

## 10. Animaciones — lineamientos

- **Entrada de secciones:** stagger con `whileInView` de Framer Motion. Cada sección entra con su propia firma (fade+up, clip-path reveal, mask-image scan).
- **Scroll-linked:** usa GSAP ScrollTrigger para:
  - El timeline de la sección Historia (la línea se traza con `drawSVG` o `pathLength`)
  - Imágenes con parallax (translateY proporcional al scroll)
  - Contadores en la barra de stats (intersección + tween)
  - Pin de sección I+D (sticky con scroll horizontal interno)
- **Hover:** todos los botones, cards y links tienen estado hover con `motion`. Los CTAs tienen un efecto de "fill" desde un lado (clip-path o background-position).
- **Cursor:** considera un cursor custom (un pequeño círculo + ring) solo en desktop. No exageres.
- **Loading inicial:** una pantalla de carga muy breve (1.5s max) con el ícono JACO ensamblándose desde sus 3 piezas (azul + rojo + negro) — usa SVG + Framer Motion.
- **Transiciones de scroll:** Lenis activo en toda la página. Easing suave (0.1 lerp).
- **Performance:** todas las animaciones a 60fps. Usa `will-change` con cuidado. Respeta `prefers-reduced-motion` (Framer Motion lo hace automáticamente si lo configuras).

---

## 11. SEO y conversión

- Meta tags completos: title, description, OG, Twitter Card (genera OG image con la geometría del logo)
- `<JsonLd>` con schema.org `LocalBusiness` + `Service`
- Sitemap + robots.txt
- Texto alt en TODAS las imágenes
- `hreflang="es-MX"` y `lang="es"` en html
- Botón WhatsApp con `aria-label` y deeplink `wa.me/528114883334?text=Hola%20JACO`
- Tracking: deja stubs comentados para Google Analytics 4 y Meta Pixel (cliente los puede activar después con env vars `NEXT_PUBLIC_GA_ID` y `NEXT_PUBLIC_META_PIXEL_ID`)

---

## 12. Entrega esperada

1. Proyecto Next.js completo dentro de `JACO_Website/` listo para `npm install && npm run dev`
2. Un `SETUP.md` final en la raíz del proyecto generado con pasos para:
   - Variables de entorno (heredando del proyecto padre)
   - Configuración de EmailJS (template y service)
   - Despliegue en Vercel
   - Nota explícita si los logos quedaron pendientes de quitar fondo
3. `content.json` semilla actualizado con TODA la información del PDF
4. Captura de pantalla (puedes describirla en texto si no la generas) de cómo se ve el resultado
5. README final que indique al cliente cómo entrar a `/admin`

---

## 13. Pasos sugeridos de ejecución

1. **Lee primero** todos los `.md` de este folder + abre el PDF de inspiración
2. Inicia el proyecto: `npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"`
3. Configura Tailwind v4 con la paleta de marca (ver DESIGN_BRIEF.md)
4. Instala dependencias del stack (sección 2)
5. Copia las 4 funciones serverless de `../api/` y conviértelas a Route Handlers de Next.js (Node runtime, no Edge — necesitan `@aws-sdk/client-s3`)
6. Define los TypeScript types en `types/content.ts` (sigue CONTENT_STRUCTURE.md)
7. Construye `lib/content.ts` para fetch tipado del JSON
8. Construye el layout con navbar + footer + whatsapp float + Lenis provider
9. Construye sección por sección, en orden, validando responsive en cada una
10. Construye el admin al final (es lo que menos cambia visualmente)
11. Llena `content.json` semilla con todo el contenido del PDF + textos inventados de la sección Historia
12. Prueba flujo completo: visita → admin → editar → guardar → ver cambio
13. Genera `SETUP.md` final y entrega

---

## 14. Recordatorios críticos

- ❌ **NO** uses HTML/CSS plano. Esto es Next.js + React.
- ❌ **NO** uses paletas genéricas tipo "azul Tailwind 600". Usa los hex exactos de marca.
- ❌ **NO** copies templates. El cliente quiere algo único.
- ❌ **NO** rompas el backend existente. Reutiliza la lógica de S3/JWT tal cual.
- ❌ **NO** subas secrets al repo.
- ❌ **NO** entregues sin probar el formulario, el admin y el flujo de guardado.
- ✅ **SÍ** piensa como diseñador industrial — geometría, líneas técnicas, precisión.
- ✅ **SÍ** anima TODO lo que tenga sentido animar — pero con propósito, no por animar.
- ✅ **SÍ** documenta cualquier decisión no obvia en código con un comentario corto.
- ✅ **SÍ** pregunta al usuario humano si encuentras una ambigüedad bloqueante. No inventes credenciales ni endpoints.

---

**Cuando termines este documento y los 4 .md restantes, comienza a construir.** El cliente está esperando una obra de arte industrial. Hazlo memorable.
