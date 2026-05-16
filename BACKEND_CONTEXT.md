# BACKEND CONTEXT — CMS Serverless ya construido

> El proyecto padre (`../`) tiene un CMS funcional. NO lo rediseñes. Reutilízalo adaptándolo a Next.js Route Handlers.

---

## 1. Arquitectura actual

```
Cliente (admin panel)
    ↓ POST /api/login {password}
    ← {token: JWT 8h}

    ↓ GET /api/content
    ← content.json (cacheado 60s edge)

    ↓ POST /api/save (Authorization: Bearer JWT) {content...}
    → escribe content.json en S3
    ← {ok, version, updated}

    ↓ POST /api/upload (Authorization: Bearer JWT, multipart/form-data)
    → sube imagen a S3, devuelve URL pública
    ← {url, key}
```

**Storage:** AWS S3 bucket `maquinados-jaco-content`
- `content.json` — privado, solo accesible vía `/api/content`
- `images/*` — públicas (read-only para mundo, write solo vía `/api/upload`)

**Auth:** JWT firmado con HS256, issuer `maquinados-jaco-cms`, expiración 8h.

**Cache:** Edge cache de Vercel 60s + stale-while-revalidate 30s.

---

## 2. Variables de entorno requeridas

Ya configuradas en Vercel (Production + Preview). NO las cambies; **úsalas tal cual**:

| Variable | Tipo | Notas |
|---|---|---|
| `ADMIN_PASSWORD` | secret | Contraseña del admin. Comparación timing-safe en `/api/login` |
| `JWT_SECRET` | secret | 64 hex chars. Firma de JWT |
| `AWS_ACCESS_KEY_ID` | secret | IAM user con permisos solo a este bucket |
| `AWS_SECRET_ACCESS_KEY` | secret | — |
| `AWS_REGION` | plain | ej. `us-east-1` |
| `S3_BUCKET_NAME` | plain | ej. `maquinados-jaco-content` |

**Variables NUEVAS a agregar (EmailJS):**

| Variable | Tipo | Notas |
|---|---|---|
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | public | El cliente configura después |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | public | — |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | public | — |

**Opcionales (analytics — comentar el código si están vacías):**

| Variable | Tipo |
|---|---|
| `NEXT_PUBLIC_GA_ID` | public |
| `NEXT_PUBLIC_META_PIXEL_ID` | public |

Genera un `.env.example` documentando todas. Agrega `.env.local` a `.gitignore`.

---

## 3. Conversión a Next.js App Router

El backend original usa CommonJS y la API de Vercel Functions clásica. Vas a portarlo a Route Handlers de Next.js 15 (app/api). Importantes:

- **Runtime:** `nodejs` (no `edge`) — el AWS SDK no funciona en Edge runtime
- **Body parser:** Next.js maneja JSON automáticamente; para multipart usa `request.formData()`
- **Headers:** Devuelve `NextResponse` con headers de CORS y Cache-Control

### Plantilla de Route Handler

```ts
// app/api/content/route.ts
import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // o usa revalidate

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.AWS_REGION!,
});

async function streamToBuffer(stream: any): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export async function GET() {
  try {
    const cmd = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: 'content.json',
    });
    const res = await s3.send(cmd);
    const buf = await streamToBuffer(res.Body);
    const content = JSON.parse(buf.toString('utf-8'));

    return NextResponse.json(content, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (err: any) {
    if (err.name === 'NoSuchKey') {
      return NextResponse.json({ error: 'content.json no encontrado' }, { status: 404 });
    }
    console.error(err);
    return NextResponse.json({ error: 'Error al cargar contenido' }, { status: 500 });
  }
}
```

### Login (`app/api/login/route.ts`)

Convierte el `login.js` del proyecto padre. Comparación timing-safe con `crypto.timingSafeEqual`. Devuelve `{token}` con `jwt.sign(...)`.

### Save (`app/api/save/route.ts`)

Verifica JWT con `verifyJwt(request)`. Valida que el body tenga todas las claves requeridas (ver `CONTENT_STRUCTURE.md`). Sube a S3 con `PutObjectCommand`. Estampa `_updated` y `_version`.

### Upload (`app/api/upload/route.ts`)

```ts
const formData = await request.formData();
const file = formData.get('file') as File;
// Validar MIME, tamaño 4MB max
// Generar key aleatorio: images/{timestamp}-{hex}.{ext}
// PutObjectCommand a S3
// Devolver {url, key}
```

---

## 4. Helper de JWT (compartido)

Crea `lib/jwt.ts`:

```ts
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export function signToken(payload: object): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '8h',
    issuer: 'maquinados-jaco-cms',
  });
}

export function verifyToken(req: NextRequest): jwt.JwtPayload | string {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) throw new Error('Token ausente');
  return jwt.verify(token, process.env.JWT_SECRET!, {
    issuer: 'maquinados-jaco-cms',
  });
}
```

---

## 5. Helper S3 (compartido)

Crea `lib/s3.ts` con un cliente singleton para reutilizar en los 3 endpoints.

---

## 6. Estrategia de fetching en el front

### Página pública (landing)

Usa **ISR** con revalidación de 60s — coincide con el cache de S3.

```ts
// app/page.tsx
export const revalidate = 60;

export default async function HomePage() {
  const content = await fetchContent();
  return <Landing content={content} />;
}

async function fetchContent() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/content`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('Error cargando contenido');
  return res.json();
}
```

Alternativa más simple: lee directo de S3 desde Server Component (sin pasar por `/api/content`). Esto es más rápido y elimina un hop. Decide tú según el patrón que prefieras.

### Panel admin

Es un Client Component que:
1. Verifica JWT en localStorage. Si no hay → redirect a `/admin/login`
2. Fetch `GET /api/content?t=${Date.now()}` (busting cache)
3. Renderiza editor por sección
4. En "Guardar Cambios" → `POST /api/save` con Authorization header
5. Para subir imagen → `POST /api/upload` con formData

---

## 7. Dependencias a instalar

```bash
npm install @aws-sdk/client-s3 jsonwebtoken
npm install -D @types/jsonwebtoken
```

(`busboy` ya no es necesario en App Router — usa `request.formData()` nativo)

---

## 8. Reglas de oro

- ❌ NO expongas `AWS_ACCESS_KEY_ID` o `JWT_SECRET` al cliente. **Solo en server-side**.
- ❌ NO uses `NEXT_PUBLIC_*` para nada que no sea EmailJS o analytics
- ❌ NO crees nuevos endpoints sin razón. Los 4 actuales cubren todo.
- ✅ SÍ valida JWT en cada endpoint de escritura (`save`, `upload`)
- ✅ SÍ valida tipo MIME y tamaño en upload
- ✅ SÍ usa `runtime = 'nodejs'` en los routes que usan AWS SDK
- ✅ SÍ devuelve mensajes de error en español

---

## 9. Estructura del bucket S3 después de Next.js

```
maquinados-jaco-content/
├── content.json              ← editado por /api/save
└── images/
    ├── 1721400000-a3b8c2.jpg ← subidas por /api/upload (admin)
    ├── 1721400123-d9e1f4.png
    └── ...
```

NO cambies la estructura. El admin actual ya espera estas rutas.

---

## 10. EmailJS (formulario de contacto)

Es independiente del CMS. NO pasa por el backend de S3. El cliente integra `@emailjs/browser` y envía directo al servicio de EmailJS.

**Setup que dejarás listo en código:**

```ts
// lib/emailjs.ts
import emailjs from '@emailjs/browser';

export async function sendContactEmail(data: ContactFormData) {
  return emailjs.send(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
    {
      nombre: data.nombre,
      empresa: data.empresa || 'No especificada',
      email: data.email,
      telefono: data.telefono,
      servicio: data.servicio,
      mensaje: data.mensaje,
    },
    {
      publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
    }
  );
}
```

Documenta en `SETUP.md` final cómo crear cuenta EmailJS y configurar el template (campos esperados: `nombre`, `empresa`, `email`, `telefono`, `servicio`, `mensaje`).
