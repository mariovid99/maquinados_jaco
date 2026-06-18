# SETUP — Maquinados JACO Next.js

## 1. Instalación

```bash
cd JACO_website
npm install
```

## 2. Variables de entorno

Copia `.env.example` a `.env.local` y llena todos los valores:

```bash
cp .env.example .env.local
```

Las variables del CMS (`ADMIN_PASSWORD`, `JWT_SECRET`, `AWS_*`, `S3_BUCKET_NAME`) son las **mismas que ya tienes en Vercel** del proyecto anterior — solo cópialas.

## 3. Configuración de Resend

El formulario de contacto envía los correos vía Resend desde una API route del servidor (`/api/contact`). La API key **nunca** se expone al navegador.

1. Crea cuenta en [resend.com](https://resend.com)
2. Crea una API key en el dashboard
3. Copia los valores al `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxx
   CONTACT_TO_EMAIL=contacto@maquinadosjaco.com
   CONTACT_FROM_EMAIL=Maquinados JACO <onboarding@resend.dev>
   ```
4. **Remitente (`CONTACT_FROM_EMAIL`):** mientras no verifiques tu dominio en
   Resend, usa `onboarding@resend.dev`. Una vez que verifiques `maquinadosjaco.com`
   (Domains → Add Domain → agrega los registros DNS), cámbialo a algo como
   `Maquinados JACO <contacto@maquinadosjaco.com>`.
5. Agrega estas 3 variables también en Vercel (Settings → Environment Variables).

## 4. Logos (⚠️ Acción requerida)

Los logos en `assets/` tienen fondo blanco (JPEG). Para usarlos óptimamente:

**TODO pendiente:** Generar versiones con fondo transparente (PNG).

Opciones:
- Usar [remove.bg](https://remove.bg) para quitar el fondo automáticamente
- Exportar desde el archivo original en formato PNG transparente
- Usar Adobe Express o Canva para quitar el fondo

**Mientras tanto:** El sitio usa los archivos JPEG originales con CSS `mix-blend-mode: multiply` y `brightness-0 invert` para adaptarlos a cada fondo.

Archivos a reemplazar en `public/logos/`:
- `jaco-full.png` — logo completo (texto + ícono) con fondo transparente
- `jaco-icon-light.png` — ícono solo, fondo transparente
- `jaco-icon-dark.png` — ícono solo, variante oscura

## 5. Contenido inicial (content.json)

El archivo `content.seed.json` tiene todo el contenido del brief listo para usar.

Para cargarlo en producción, súbelo a tu S3:
```bash
# Opción 1: AWS CLI
aws s3 cp content.seed.json s3://maquinados-jaco-content/content.json

# Opción 2: Desde el panel admin
# Ve a /admin → guarda cualquier cambio → el JSON se actualiza automáticamente
```

## 6. Despliegue en Vercel

El proyecto está listo para Vercel. Solo asegúrate de:

1. Conectar el repositorio en [vercel.com](https://vercel.com)
2. Configurar las variables de entorno (las mismas que `.env.local`)
3. Agregar `NEXT_PUBLIC_SITE_URL=https://tudominio.com`
4. Deploy → Vercel detecta automáticamente Next.js

**Nota:** Este proyecto reemplaza el `index.html` anterior. Asegúrate de que Vercel apunte al directorio `JACO_website/` como raíz del proyecto (configura "Root Directory" en Vercel).

## 7. Panel Admin

URL: `tudominio.com/admin`

- Contraseña: la misma que `ADMIN_PASSWORD` en tus variables de entorno
- Desde el panel puedes editar todo el contenido del sitio
- Los cambios se guardan en S3 y se reflejan en el sitio en ~60 segundos

## 8. Sitemap y robots.txt

Para generar el sitemap automáticamente, instala:
```bash
npm install next-sitemap
```

Y crea `next-sitemap.config.js`:
```js
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  generateRobotsTxt: true,
}
```

Agrega al `package.json`:
```json
"postbuild": "next-sitemap"
```

---

## Notas técnicas

- **Next.js 15** con App Router e ISR (revalidación cada 60s)
- **Tailwind CSS v4** — la paleta de colores está en `app/globals.css` bajo `@theme`
- **Framer Motion** (`motion/react`) para animaciones de entrada y microinteracciones
- **Lenis** para scroll suave
- **GSAP** disponible para animations scroll-driven (importar en componentes que lo requieran)
- **Resend** para formulario de contacto (vía API route `/api/contact`)
- **CMS Serverless** via AWS S3 + JWT — misma arquitectura del proyecto padre
