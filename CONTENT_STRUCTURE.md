# CONTENT_STRUCTURE — Schema completo de content.json

> Este es el modelo de datos que `/admin` debe poder editar y que `/api/save` valida. Todos los campos deben tener su editor en el panel admin.

---

## Estructura completa (TypeScript)

```ts
// types/content.ts

export interface SiteContent {
  _version: number;
  _updated: string; // ISO timestamp

  hero: HeroContent;
  stats: StatItem[];
  nosotros: NosotrosContent;
  historia: HistoriaContent;
  rd: ResearchContent;
  precision: PrecisionContent;
  soldadura: SoldaduraContent;
  procesoSoluciones: ProcesoContent;
  tecnologia: TecnologiaContent;
  servicios: ServiciosContent;
  comercializacion: ComercializacionContent;
  clientes: ClienteItem[];
  testimonios: TestimonioItem[];
  faq: FaqItem[];
  ctaBanner: CtaBannerContent;
  contacto: ContactoContent;
  footer: FooterContent;
}

// ---- HERO ----
export interface HeroContent {
  badge: string;
  headline_line1: string;
  headline_accent: string; // pintar en rojo
  headline_line3: string;
  subheading: string;
  cta_primary_text: string;
  cta_primary_href: string;
  cta_secondary_text: string;
  cta_secondary_href: string;
  inline_stats: string; // ej. "+10 AÑOS · +500 PROYECTOS · ±0.005 mm"
  bg_image_url: string; // imagen de fondo (si no usa Three.js)
  bg_video_url?: string; // opcional, mp4 loop
}

// ---- STATS ----
export interface StatItem {
  value: number;          // 10
  suffix: string;         // "+", "h", "%"
  label: string;          // "Años de experiencia"
}

// ---- ¿QUIÉNES SOMOS? ----
export interface NosotrosContent {
  label: string;
  headline: string;
  desc1: string;
  desc2: string;
  pilares: PilarItem[]; // 4 items
}

export interface PilarItem {
  icon: string;        // lucide icon name, ej. "Award", "ShieldCheck"
  title: string;
  description: string;
}

// ---- NUESTRA HISTORIA ----
export interface HistoriaContent {
  label: string;
  headline: string;
  subtitle: string;
  hitos: HitoItem[];
}

export interface HitoItem {
  id: string;          // uuid para drag-reorder
  year: string;        // "2014"
  title: string;
  description: string;
  image_url?: string;
}

// ---- I+D ----
export interface ResearchContent {
  label: string;
  headline: string;
  desc1: string;
  desc2: string;
  enfoque_title: string;
  enfoque_desc: string;
  image_url: string;
}

// ---- PRECISIÓN EN DISEÑO ----
export interface PrecisionContent {
  label: string;
  headline_line1: string;
  headline_line2: string;
  desc1: string;
  desc2: string;
  galeria: GaleriaItem[];
}

export interface GaleriaItem {
  id: string;
  caption: string;
  image_url: string;
  alt: string;
}

// ---- SOLDADURA ----
export interface SoldaduraContent {
  label: string;
  headline: string;
  display_lateral: string; // ej. "RESISTENCIA · CALIDAD"
  desc1: string;
  desc2: string;
  tecnicas: TecnicaItem[]; // 3 items
  aplicaciones: string[];
  galeria: GaleriaItem[];
}

export interface TecnicaItem {
  id: string;
  acronimo: string;  // "TIG"
  nombre_completo: string; // "Tungsten Inert Gas"
  descripcion: string;
}

// ---- PROCESO / SOLUCIONES PERSONALIZADAS ----
export interface ProcesoContent {
  label: string;
  headline: string;
  desc1: string;
  desc2: string;
  subtitle_pasos: string;
  pasos: PasoItem[]; // 5 items
}

export interface PasoItem {
  id: string;
  number: string;     // "01"
  title: string;
  description: string;
}

// ---- INNOVACIÓN Y TECNOLOGÍA ----
export interface TecnologiaContent {
  label: string;
  headline_line1: string;
  headline_line2: string;
  headline_line3: string;
  description: string;
  software: SoftwareItem[];
}

export interface SoftwareItem {
  id: string;
  name: string;
  logo_url: string;
  link?: string;
}

// ---- SERVICIOS COMPLETOS (3 columnas) ----
export interface ServiciosContent {
  label: string;
  headline: string;
  columnas: ColumnaServicio[]; // mínimo 3
}

export interface ColumnaServicio {
  id: string;
  titulo: string;            // "MANUFACTURA AVANZADA"
  icon: string;              // lucide
  servicios: string[];       // lista
  equipos: string[];         // lista (opcional para algunas columnas)
  equipo_label?: string;     // "EQUIPO:" o "SOFTWARE:"
}

// ---- COMERCIALIZACIÓN ----
export interface ComercializacionContent {
  label: string;
  headline: string;
  descripcion: string;
  categorias: string[];
  marcas: MarcaItem[];
}

export interface MarcaItem {
  id: string;
  nombre: string;
  logo_url: string;
}

// ---- CLIENTES ----
export interface ClienteItem {
  id: string;
  nombre: string;
  logo_url: string;
  link?: string;
}

// ---- TESTIMONIOS ----
export interface TestimonioItem {
  id: string;
  nombre: string;
  cargo: string;
  empresa: string;
  texto: string;
  foto_url?: string;
}

// ---- FAQ ----
export interface FaqItem {
  id: string;
  pregunta: string;
  respuesta: string;
}

// ---- CTA INTERMEDIO ----
export interface CtaBannerContent {
  headline: string;
  description: string;
  cta_primary_text: string;
  cta_primary_href: string;
  cta_secondary_text: string;
  cta_secondary_href: string;
}

// ---- CONTACTO ----
export interface ContactoContent {
  label: string;
  headline: string;
  subtitle: string;
  phone_display: string;
  phone_href: string;        // "tel:+528114883334"
  email: string;
  email_secondary?: string;  // gmail fallback
  address_line1: string;
  address_line2: string;
  hours_weekday: string;
  hours_saturday: string;
  whatsapp_href: string;
  whatsapp_message_default: string; // texto pre-armado
  maps_embed_src: string;
  facebook_page_name?: string;
  facebook_page_href?: string;
}

// ---- FOOTER ----
export interface FooterContent {
  tagline: string;
  nav_links: FooterLinkGroup;
  services_links: FooterLinkGroup;
  copyright: string;
  designer_text: string;
  social_facebook: string;
  social_instagram: string;
  social_linkedin: string;
}

export interface FooterLinkGroup {
  title: string;
  items: { label: string; href: string }[];
}
```

---

## REQUIRED_KEYS para validación en /api/save

```ts
const REQUIRED_KEYS = [
  'hero',
  'stats',
  'nosotros',
  'historia',
  'rd',
  'precision',
  'soldadura',
  'procesoSoluciones',
  'tecnologia',
  'servicios',
  'comercializacion',
  'clientes',
  'testimonios',
  'faq',
  'ctaBanner',
  'contacto',
  'footer',
];
```

---

## Comportamiento del editor admin

### Editores por tipo de campo

| Tipo TS | Editor admin |
|---|---|
| `string` (corto) | `<input type="text">` |
| `string` (largo) | `<textarea rows={4}>` |
| `string` (rich text) | Editor markdown ligero (TipTap o textarea + preview) |
| `string` URL imagen | `<ImageUpload>` — drag&drop + preview + botón "Subir" → `/api/upload` |
| `string` link (`href`) | `<input type="url">` |
| `number` | `<input type="number">` |
| `string[]` | Lista editable: `<input>` por item, botones `+ Agregar` y `🗑` |
| `Array<Item>` | Lista de cards expandibles, drag-handle (`@dnd-kit`), `+ Agregar Item`, `🗑 Eliminar` |
| `select` (servicio tipo) | `<select>` con opciones predefinidas |

### Layout del admin

```
┌─────────────────────────────────────────────────┐
│ Sidebar       │   Editor                        │
│ ▶ Hero        │   ┌──────────────────────────┐  │
│   Stats       │   │ Editor de Hero            │  │
│   Nosotros    │   │ Badge: [_______________]  │  │
│   Historia    │   │ Línea 1: [_____________]  │  │
│   I+D         │   │ Acento (rojo): [_______]  │  │
│   Precisión   │   │ Línea 3: [_____________]  │  │
│   Soldadura   │   │ Subheading: [textarea]    │  │
│   Proceso     │   │ Imagen fondo: [Upload]    │  │
│   Tecnología  │   │ ...                       │  │
│   Servicios   │   └──────────────────────────┘  │
│   Comerc.     │                                 │
│   Clientes    │                                 │
│   Testimonios │                                 │
│   FAQ         │                                 │
│   CTA Banner  │                                 │
│   Contacto    │                                 │
│   Footer      │                                 │
└─────────────────────────────────────────────────┘
[ Cerrar sesión ]        [ Ver sitio ] [ GUARDAR ]
```

### Drag & Drop reorder

Para arrays (`historia.hitos`, `precision.galeria`, `clientes`, `testimonios`, `faq`, `servicios.columnas`, `comercializacion.marcas`, `procesoSoluciones.pasos`) usa `@dnd-kit/core` + `@dnd-kit/sortable` con un handle visible.

### Generación de IDs

Para items con `id: string`, genera con `crypto.randomUUID()` en cliente al crearlos. NUNCA los reutilices.

### Confirmaciones

- Al hacer "🗑 Eliminar" → mostrar `<AlertDialog>` de shadcn con "¿Eliminar este item? No se puede deshacer hasta guardar."
- Al hacer "GUARDAR" → loading state, luego toast verde "Cambios guardados (versión X)"
- Al salir con cambios sin guardar → `beforeunload` warning

### Carga inicial del JSON

Cuando el admin abre, si `content.json` tiene una estructura vieja (sin las nuevas claves como `historia`, `testimonios`, `faq`), el admin debe **migrar al vuelo** rellenando defaults. Genera una función `migrateContent(raw): SiteContent` en `lib/content-migration.ts` que tome cualquier JSON y devuelva uno válido contra el nuevo schema.

---

## Seed inicial — content.json

> Después de construir el sitio, escribe un `content.seed.json` con TODO el contenido del `CONTENT_BRIEF.md` ya volcado al schema. El usuario lo subirá manualmente a S3 reemplazando el actual (o vía script `npm run seed`).

Estructura esperada del seed:

```json
{
  "_version": 1,
  "_updated": "2026-05-16T00:00:00.000Z",
  "hero": { "badge": "MANUFACTURA CNC...", "headline_line1": "...", ... },
  "stats": [
    { "value": 10, "suffix": "+", "label": "Años de experiencia" },
    ...
  ],
  "nosotros": { ... },
  "historia": {
    "hitos": [
      { "id": "uuid-1", "year": "2014", "title": "EL ORIGEN", "description": "..." },
      ...
    ]
  },
  ...
}
```

Genera el seed completo siguiendo al pie de la letra el `CONTENT_BRIEF.md`.

---

## Notas finales

- **Compatibilidad con content.json viejo**: el actual (`reference/content_actual.json`) tiene un schema diferente (`servicios` es array de servicios completos, no de columnas; no tiene `historia`, `testimonios`, `faq`, etc.). El migrador debe poder leerlo y rellenar defaults para los campos faltantes — no romper al cliente.

- **Tamaño del JSON**: con todo el contenido lleno, el JSON puede pesar 30–80 KB. Está bien.

- **Tipado fuerte**: TODOS los componentes del front consumen `SiteContent` tipado. Si añades una nueva sección, agrega su tipo en `types/content.ts`, su validación en `REQUIRED_KEYS`, su editor en admin, y su default en el migrador. Cuatro lugares — no olvides ninguno.
