# DESIGN BRIEF — Sistema Visual JACO

> Lee este documento con el PDF (`reference/JACO_INSPO.pdf`) abierto al lado. Las páginas que cito son del PDF.

---

## 1. Paleta de color

### Colores de marca (primarios — extraídos del logo y PDF)

| Token | Hex | Uso |
|---|---|---|
| `--jaco-blue` | **`#001A8B`** | Color institucional. Backgrounds oscuros, headlines en fondo claro, acentos navbar |
| `--jaco-blue-deep` | **`#0A1342`** | Hero background, secciones dark mode opcionales |
| `--jaco-red` | **`#B90001`** | Color de acción. CTAs, barras decorativas, hover states, marcadores |
| `--jaco-black` | **`#0A0A0A`** | Texto principal sobre fondo claro |
| `--jaco-white` | **`#FFFFFF`** | Fondo principal |
| `--jaco-bone` | **`#F7F5F0`** | Fondo alterno (off-white con calidez industrial). Úsalo intercalado |

### Grises técnicos (secundarios)

| Token | Hex | Uso |
|---|---|---|
| `--gray-50` | `#FAFAFA` | Backgrounds de cards muy sutiles |
| `--gray-100` | `#F1F1F2` | Separadores, dividers |
| `--gray-300` | `#D1D1D6` | Bordes |
| `--gray-500` | `#6B6B70` | Texto secundario |
| `--gray-700` | `#3A3A3F` | Texto sobre fondo gris claro |
| `--gray-900` | `#1A1A1D` | Casi negro, para footer |

### Reglas de uso

- El fondo dominante del sitio es **`--jaco-white`** alternado con **`--jaco-bone`** entre secciones para crear ritmo
- El **rojo es el acento de acción** — úsalo escaso pero estratégico: CTAs principales, barritas decorativas debajo de títulos, líneas marcadoras
- El **azul es identidad** — úsalo en headlines de sección, iconos, backgrounds dark, decoraciones geométricas grandes
- **Hero es la única sección dark por defecto** (fondo `--jaco-blue-deep` o gradiente azul → negro). Si quieres puedes hacer dark también el banner CTA intermedio y el footer
- **NUNCA** uses tonos morados, verdes, amarillos saturados u otros colores que no estén en esta paleta. El amarillo de las fotos industriales del PDF es color de PRODUCTO (cinta de seguridad, equipos), no de marca

---

## 2. Tipografía

### Familias

| Rol | Fuente | Pesos | Notas |
|---|---|---|---|
| **Display** | **Bebas Neue** (Google Fonts) | 400 | UPPERCASE, condensed. Para H1, H2, números grandes 01–08, labels de sección. Es lo más cercano a la display del PDF. Alternativas igualmente válidas: `Druk Wide` (paid), `Industry` (paid), `Saira Condensed` (free) |
| **UI** | **Inter** (Google Fonts) | 400, 500, 600, 700 | Body, párrafos, navbar, botones, forms |
| **Mono técnico** | **Space Grotesk** o **JetBrains Mono** | 400, 500 | Para datos técnicos, tolerancias, especificaciones (ej: "±0.005 mm"), labels tipo CAD |

Cárgalas con `next/font/google` con `display: 'swap'` y `variable: '--font-display' / '--font-sans' / '--font-mono'`.

### Escala tipográfica (mobile → desktop, en rem)

```
--text-xs:    0.75rem  → 0.75rem    (labels, meta)
--text-sm:    0.875rem → 0.875rem   (UI secondary)
--text-base:  1rem     → 1rem       (body)
--text-lg:    1.125rem → 1.25rem    (lead paragraphs)
--text-xl:    1.25rem  → 1.5rem     (subhead)
--text-2xl:   1.75rem  → 2rem       (H3)
--text-3xl:   2.25rem  → 2.75rem    (H2 small)
--text-4xl:   2.75rem  → 3.75rem    (H2)
--text-5xl:   3.5rem   → 5rem       (H1)
--text-6xl:   4.5rem   → 7rem       (Hero display)
--text-mega:  6rem     → 10rem      (Section numbers 01–08, "JACO" gigante decorativo)
```

### Reglas tipográficas

- Headlines display: `font-display`, `uppercase`, `leading-[0.9]`, `tracking-tight`
- Cuerpo: `font-sans`, `leading-relaxed`, `text-base/lg`, `text-gray-700`
- Datos técnicos: `font-mono`, `text-sm`, color `--jaco-blue` o `--gray-700`
- Subrayar palabras clave con una **barrita roja debajo** (no underline tradicional). Ver página 3 del PDF: la palabra "somos?" tiene una barra roja bajo ella. Usa `<span class="relative after:content-[''] after:absolute after:left-0 after:bottom-[-0.15em] after:w-[60%] after:h-[3px] after:bg-jaco-red">`
- Números de sección (01, 02...) gigantes en `font-display`, color `--jaco-white` cuando van sobre fondo azul (como página 2 del PDF), o `--jaco-blue` sobre fondo claro

---

## 3. Elementos geométricos decorativos

El PDF está LLENO de geometría — esto es la firma visual de la marca. Implementa estos elementos como SVG reutilizables:

### a. Franjas / barras de color

- **Barra roja vertical delgada** en bordes de sección (10–20px de ancho, alto variable). Páginas 1, 2, 6, 11 del PDF.
- **Barra azul gruesa vertical** lado derecho de hero/secciones destacadas. Página 1 del PDF.
- **Barra roja horizontal corta** (50–80px) bajo títulos importantes. Páginas 3, 5, 6.
- **Combinación rojo+azul apilados** en esquinas — vertical o horizontal. Páginas 1, 6, 11.

Implementa un componente `<AccentBar variant="vertical|horizontal" color="red|blue|stack" length="sm|md|lg" />`.

### a.1. Animación de las barras
Cuando entran al viewport, se animan con `scaleY: 0 → 1` (verticales) o `scaleX: 0 → 1` (horizontales), `origin: bottom` o `left`, duración 0.6s, easing `[0.22, 1, 0.36, 1]`.

### b. Cortes diagonales en imágenes (clip-path)

Casi TODAS las fotos del PDF tienen bordes diagonales. No uses imágenes rectangulares simples. Usa `clip-path: polygon()`:

```css
/* Variantes */
.clip-shard-tl { clip-path: polygon(15% 0, 100% 0, 100% 100%, 0 100%, 0 15%); }
.clip-shard-tr { clip-path: polygon(0 0, 85% 0, 100% 15%, 100% 100%, 0 100%); }
.clip-shard-br { clip-path: polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%); }
.clip-shard-bl { clip-path: polygon(0 0, 100% 0, 100% 100%, 15% 100%, 0 85%); }
.clip-arrow-r  { clip-path: polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%); }
.clip-parallelogram { clip-path: polygon(8% 0, 100% 0, 92% 100%, 0 100%); }
```

Anima la imagen entrando con un `clip-path` 0 → final (efecto "shutter abriéndose"). Combina con `scale: 1.1 → 1` para un mini-zoom out.

### c. Iconografía del logo como background pattern

El ícono de JACO es un **prisma angular tricolor** (azul/rojo/negro). Tómalo y úsalo en gran tamaño, monocromo, transparencia 5–8%, como elemento decorativo de fondo en secciones grandes (similar a la página 1 del PDF donde el logo se ve enorme y casi transparente al fondo).

### d. Líneas técnicas (estilo CAD)

Agrega detalles tipo plano técnico en backgrounds o esquinas:
- Líneas finas (1px) en azul al 30% con segmentos cortos perpendiculares (marcas de cota)
- Pequeños círculos vacíos (punto de coordenada) con coordenadas en `font-mono` muy pequeño
- Cuadrículas dotted muy sutiles (`bg-[radial-gradient(circle,_#001A8B22_1px,_transparent_1px)] bg-[size:24px_24px]`)

Página 12 del PDF tiene patrón de círculos al fondo — replícalo.

### e. Triángulos del logo como elementos sueltos

El ícono se compone de 3 triángulos angulares. Anímalos sueltos:
- En el loader de carga: los 3 triángulos vuelan desde fuera del viewport y se ensamblan formando el logo
- En transiciones entre secciones: aparecen pequeñas piezas como confetti geométrico
- Como bullet points en listas: usa un mini-triángulo rojo en lugar de `•`

---

## 4. Layout y espaciado

### Container

- `max-w-[1440px] mx-auto`
- Padding horizontal: `px-6 md:px-12 lg:px-20`
- Secciones verticales: `py-24 md:py-32 lg:py-40`

### Grid

- Sistema de 12 columnas con `grid-cols-12` y `gap-6 md:gap-8`
- Para layouts asimétricos (que son la firma del PDF), usa `col-span-7 / col-span-5`, `col-span-8 / col-span-4`, etc. Evita el 50/50 simétrico aburrido

### Asimetría

El PDF NUNCA divide 50/50. Siempre hay un lado dominante (60/40, 65/35). Replica esto. Las imágenes a menudo "sangran" hasta el borde de la pantalla en un lado mientras el texto respeta el container del otro.

---

## 5. Animaciones — biblioteca de efectos

### Entrada de elementos (Framer Motion)

```ts
// FadeInUp
{ initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }

// SlideInFromLeft
{ initial: { opacity: 0, x: -60 }, whileInView: { opacity: 1, x: 0 }, transition: { duration: 0.8 } }

// ClipReveal (para imágenes y headlines)
{ initial: { clipPath: 'inset(0 100% 0 0)' }, whileInView: { clipPath: 'inset(0 0% 0 0)' }, transition: { duration: 1, ease: [0.65, 0, 0.35, 1] } }

// StaggerChildren (contenedores)
{ initial: 'hidden', whileInView: 'show', variants: { hidden: {}, show: { transition: { staggerChildren: 0.08 } } } }
```

### Scroll-driven (GSAP + ScrollTrigger)

- **Parallax de imágenes:** `gsap.to(img, { yPercent: -15, scrollTrigger: { trigger: section, scrub: true } })`
- **Pin de secciones:** la sección I+D queda fija mientras el contenido interno avanza
- **Línea del tiempo:** SVG `<path>` con `stroke-dasharray` animado mientras se hace scroll en la sección Historia
- **Contadores:** la barra de stats incrementa números desde 0 al hacer scroll a viewport
- **Scroll horizontal interno:** para la galería de "Innovación y Precisión" considera un `pin + translateX` mientras se hace scroll vertical

### Microinteracciones (hover)

- **Botones primarios:** fondo se llena de color desde un lado con clip-path. Texto cambia de color simultáneo. Icono de flecha se desplaza 4px.
- **Cards:** elevan `translateY(-6px)`, sombra crece, una barrita roja aparece en el borde inferior con `scaleX 0→1`.
- **Links de navbar:** subrayado animado de izquierda a derecha (no `text-decoration`).
- **Imágenes en galería:** `scale: 1.05` + overlay azul al 20% con caption deslizándose desde abajo.
- **Logos de clientes:** filtro `grayscale(100%)` → `grayscale(0%)` en hover.

### Cursor custom (desktop only)

- Círculo pequeño (8px) que sigue el cursor con `lerp` suave
- Ring exterior (32px) con delay
- Sobre links/botones: el círculo se expande a 48px y se vuelve translúcido
- Sobre imágenes: aparece texto "VER" dentro del círculo
- Usa `mix-blend-mode: difference` para que se invierta sobre fondos oscuros/claros
- Respeta `prefers-reduced-motion`

### Loader inicial

1. Pantalla negra/azul con los 3 triángulos del logo separados, cada uno entrando desde fuera del viewport
2. Se ensamblan en el centro formando el logo completo
3. El logo se reduce a tamaño navbar y el fondo se desvanece a blanco
4. Duración total: 1.2–1.8s, NO más. Si es navegación interna, no se muestra de nuevo.

---

## 6. Componentes recurrentes — especificación

### Botón primario (CTA)
- Fondo: `--jaco-red`
- Texto: blanco, uppercase, `font-display` o Inter 600
- Padding: `px-8 py-4`
- Sin border-radius o muy poco (`rounded-sm`) — la marca es angular, no redonda
- Hover: shimmer de blanco al 10% cruza diagonalmente; flecha "→" se mueve 4px a la derecha
- Variante outline (sobre dark): borde 2px rojo, texto rojo, fondo transparente → en hover se llena de rojo

### Botón secundario
- Fondo transparente, borde 2px `--jaco-blue` o blanco (según fondo), texto del mismo color
- Mismo padding, mismo comportamiento de hover

### Cards (servicios, valores)
- Fondo `--jaco-white` con borde sutil `border border-gray-100`
- Padding `p-8 md:p-10`
- Esquina inferior derecha cortada en diagonal (`clip-path: polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)`)
- Icono Lucide en tamaño 48px, color `--jaco-blue`, encerrado en un cuadrado de 64px con un mini-borde rojo en una esquina
- Título: `font-display`, `text-2xl`, uppercase
- Hover: como descrito en sección 5

### Navbar
- Fixed, `h-20`, fondo blanco al 95% con `backdrop-blur-md`
- Cuando se scrollea, agrega border-bottom rojo de 2px
- Logo izquierda (h-10)
- Links centro: HOME / NOSOTROS / SERVICIOS / PROCESO / CLIENTES / CONTACTO
- CTA derecha: botón rojo "COTIZAR" + ícono WhatsApp
- Mobile: hamburger → menú fullscreen con animación de cortinas (clip-path)

### Footer
- Fondo `--jaco-blue-deep` (oscuro) o negro
- 4 columnas: Logo+tagline / Navegación / Servicios / Contacto
- Línea diagonal roja arriba (clip-path en un div hijo)
- Redes sociales con iconos Lucide en círculos
- Copyright + "Diseñado por Mario Vidaña" centrado

### WhatsApp flotante
- 56px círculo verde (`#25D366`) o variante con el rojo de marca + icono blanco
- Bottom-right, z-50, `mb-6 mr-6`
- Pulso suave cada 5s (`animate-ping` o keyframe custom)
- En hover muestra tooltip "Chatea con nosotros"
- Mobile: visible siempre, encima del bottom-nav si lo hubiera

---

## 7. Hero — especificación detallada

Es la sección más importante. Especificación:

- **Fondo:** Gradiente diagonal `linear-gradient(135deg, #0A1342 0%, #001A8B 50%, #0A0A0A 100%)`
- **Layer 2:** El ícono del logo JACO gigante (60% viewport height) en el lado derecho, opacidad 10%, rotando lentamente (1 rotación por minuto)
- **Layer 3:** Partículas/puntos pequeños distribuidos con `tsparticles` o un canvas custom (técnico, no festivo). Pocos puntos, líneas conectoras estilo plexo.
- **Layer 4 (opcional premium):** Una pieza CNC en 3D rotando con React Three Fiber. Si no hay tiempo, usa `image_hero.png` con efecto parallax.
- **Layer 5 (contenido):**
  - Badge superior con barra roja izquierda: "MANUFACTURA CNC DE PRECISIÓN · MONTERREY, N.L."
  - H1 dividido en 3 líneas con animación de entrada por palabra (cada palabra entra con `y: 30 → 0` + clipReveal). Ejemplo:
    ```
    PRECISIÓN QUE
    IMPULSA  ← esta palabra en rojo
    LA INDUSTRIA
    ```
  - Subheading párrafo (max-w 540px)
  - 2 CTAs: rojo "SOLICITAR COTIZACIÓN" + outline blanco "VER SERVICIOS"
  - Línea decorativa con stats inline: "10+ AÑOS · 500+ PROYECTOS · ±0.005 mm DE TOLERANCIA"
- **Indicador de scroll abajo:** línea vertical que se llena y vacía + texto "SCROLL"
- **Sangrado:** el hero ocupa `min-h-screen` (mínimo 100vh, sin overflow)

---

## 8. Responsive

- Mobile-first
- Breakpoints Tailwind estándar: sm 640, md 768, lg 1024, xl 1280, 2xl 1440
- En mobile: NO uses cursor custom; reduce animaciones complejas (mantén las esenciales); el grid asimétrico se colapsa a stack vertical; las imágenes con clip-path mantienen el clip pero más sutil
- Touch targets mínimo 44px
- Menú mobile a pantalla completa con animación de cortinas

---

## 9. Accesibilidad

- Contraste mínimo AAA en textos sobre fondos de color
- `aria-label` en botones con solo iconos
- `focus-visible` con anillo rojo de 2px en todos los elementos interactivos
- `prefers-reduced-motion`: desactiva parallax, scroll-pins, partículas. Mantén transitions cortas y opacity-only.
- Skip-to-content link al inicio
- Forms con labels visibles + descripción de errores

---

## 10. Inspiración (referencias externas — sin copiar)

Para entender el "feel" que buscamos, mira estos sitios (no para copiarlos, sino para entender el estándar):
- igus.com — industrial alemán con identidad fuerte
- formlabs.com — manufactura aditiva con diseño premium
- hasselblad.com — geometría angular, oscuridad+rojo
- studiothomson.com — animaciones suaves orquestadas

El feel objetivo: **industrial premium con personalidad**, no genérico tipo "Bootstrap startup".

---

## 11. Lista de verificación final visual

Antes de declarar la sección hecha, verifica:

- [ ] ¿La sección tiene al menos UN elemento decorativo de marca (barra, clip-path, número grande, geometría)?
- [ ] ¿Las imágenes están cortadas con clip-path, no rectangulares simples?
- [ ] ¿Los textos clave están subrayados con barrita roja en lugar de underline?
- [ ] ¿Hay una animación de entrada cuando la sección llega al viewport?
- [ ] ¿Los hovers funcionan en todos los elementos interactivos?
- [ ] ¿Se ve igual de bien en mobile?
- [ ] ¿Respeta `prefers-reduced-motion`?
- [ ] ¿Los colores son los hex exactos de marca, no aproximaciones?
- [ ] ¿La jerarquía tipográfica es clara y dramática?
- [ ] ¿La sección "habla" — transmite el mensaje en <5 segundos de mirada?
