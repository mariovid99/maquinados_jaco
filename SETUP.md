# Guía de Configuración — CMS Maquinados Jaco

## Resumen del sistema

El cliente accede a `tudominio.com/admin/` → ingresa su contraseña → edita texto e imágenes → presiona "Guardar Cambios".

Todos los datos se guardan en un archivo `content.json` en AWS S3. Las imágenes subidas también van a S3. Las credenciales de AWS **nunca** se exponen al navegador.

---

## PASO 1 — Crear el bucket en AWS S3

1. Inicia sesión en [https://console.aws.amazon.com/s3](https://console.aws.amazon.com/s3)
2. Haz clic en **"Create bucket"**
3. Configura:
   - **Bucket name:** `maquinados-jaco-content` (o el nombre que prefieras)
   - **AWS Region:** `us-east-1` (o la más cercana a tus usuarios)
   - **Block Public Access:** desactiva "Block all public access" (necesario para que las imágenes sean visibles en el sitio). Confirma el aviso.
4. Haz clic en **"Create bucket"**

### 1a. Política del bucket (solo imágenes son públicas)

En tu bucket → **Permissions** → **Bucket Policy** → pega esto:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadImages",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::maquinados-jaco-content/images/*"
    }
  ]
}
```

> `content.json` **NO** es público. Solo las imágenes lo son. El JSON se sirve a través de la función serverless `/api/content`.

### 1b. CORS del bucket

En tu bucket → **Permissions** → **Cross-origin resource sharing (CORS)** → pega esto:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET"],
    "AllowedOrigins": ["https://tudominio.com", "https://www.tudominio.com"],
    "ExposeHeaders": [],
    "MaxAgeSeconds": 3000
  }
]
```

Reemplaza `tudominio.com` con tu dominio real.

### 1c. Subir el content.json inicial

1. Ve a tu bucket en S3
2. Haz clic en **"Upload"**
3. Sube el archivo `content.json` que está en la raíz del proyecto
4. En las opciones de permisos, déjalo en **privado** (no marques ningún acceso público)

---

## PASO 2 — Crear usuario IAM (con mínimos privilegios)

1. Ve a [https://console.aws.amazon.com/iam](https://console.aws.amazon.com/iam)
2. **Users** → **Create user**
3. Nombre: `maquinados-jaco-cms`
4. **No** marques "AWS Management Console access" (solo programmatic)
5. En permisos, selecciona **"Attach policies directly"** → **"Create inline policy"**
6. En el editor JSON, pega esto (reemplaza el nombre del bucket si cambiaste):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": [
        "arn:aws:s3:::maquinados-jaco-content/content.json",
        "arn:aws:s3:::maquinados-jaco-content/images/*"
      ]
    }
  ]
}
```

7. Guarda la política con el nombre `maquinados-jaco-cms-policy`
8. Finaliza la creación del usuario

### 2a. Generar Access Key

1. Entra al usuario recién creado
2. Pestaña **"Security credentials"** → **"Create access key"**
3. Selecciona **"Application running outside AWS"**
4. **GUARDA** el `Access Key ID` y el `Secret Access Key`. Solo se muestran una vez.

---

## PASO 3 — Configurar variables de entorno en Vercel

1. Ve a tu proyecto en [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. **Settings** → **Environment Variables**
3. Agrega estas 6 variables (tipo: **Production + Preview**):

| Variable | Valor |
|---|---|
| `ADMIN_PASSWORD` | La contraseña del panel admin (mínimo 20 caracteres, usa letras, números y símbolos) |
| `JWT_SECRET` | Una cadena aleatoria de 64 caracteres hex (ver nota abajo) |
| `AWS_ACCESS_KEY_ID` | El Access Key ID del paso 2a |
| `AWS_SECRET_ACCESS_KEY` | El Secret Access Key del paso 2a |
| `AWS_REGION` | `us-east-1` (o la región que elegiste) |
| `S3_BUCKET_NAME` | `maquinados-jaco-content` (o el nombre de tu bucket) |

### Cómo generar el JWT_SECRET

En tu terminal, ejecuta:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copia el resultado (64 caracteres) y úsalo como valor de `JWT_SECRET`.

---

## PASO 4 — Desplegar en Vercel

1. Asegúrate de que todos los archivos estén en tu repositorio de GitHub
2. Si ya tienes el proyecto vinculado: `vercel --prod` o simplemente haz push a main
3. Si es la primera vez: `vercel link` y sigue las instrucciones

---

## PASO 5 — Probar el sistema

1. Visita `https://tudominio.com/admin/`
2. Ingresa la contraseña que configuraste en `ADMIN_PASSWORD`
3. Edita cualquier texto y haz clic en **"Guardar Cambios"**
4. Visita `https://tudominio.com/` — los cambios aparecerán en ~1 minuto (el caché se renueva cada 60 segundos)

---

## Estructura de archivos creados

```
maquinados_jaco/
├── index.html          ← Sitio modificado para cargar contenido dinámicamente
├── admin/
│   └── index.html      ← Panel de administración completo
├── api/
│   ├── login.js        ← Autenticación (POST /api/login)
│   ├── content.js      ← Leer contenido de S3 (GET /api/content)
│   ├── save.js         ← Guardar contenido en S3 (POST /api/save)
│   └── upload.js       ← Subir imágenes a S3 (POST /api/upload)
├── content.json        ← Contenido inicial (sube este archivo a S3)
├── package.json        ← Dependencias: aws-sdk, jsonwebtoken, busboy
├── vercel.json         ← Configuración de Vercel
└── SETUP.md            ← Esta guía
```

---

## Seguridad — Resumen

| Qué está protegido | Cómo |
|---|---|
| Credenciales AWS | Solo en variables de entorno de Vercel, nunca en el código |
| Panel admin | Contraseña en `ADMIN_PASSWORD` env var + JWT con expiración de 8h |
| Escritura en S3 | Solo a través de `/api/save` y `/api/upload` con JWT válido |
| content.json | Privado en S3, solo accesible a través de `/api/content` |
| Imágenes | Públicas en S3 (solo carpeta `images/*`) |
| Subida de archivos | Solo JPG, PNG, WebP, GIF. Máximo 4 MB. Nombre aleatorio generado por servidor |

---

## Preguntas frecuentes

**¿Cuánto tardan los cambios en verse en el sitio?**
Máximo 1 minuto. El caché de Vercel Edge se renueva cada 60 segundos.

**¿Puedo agregar más imágenes a la galería?**
Por ahora el número de fotos es fijo (5). Para agregar más, edita el `content.json` directamente en S3 y agrega más objetos al array `galeria`. Se puede hacer programable desde el panel en el futuro.

**¿Qué pasa si olvido la contraseña?**
Actualiza el valor de `ADMIN_PASSWORD` en Vercel → Settings → Environment Variables → Redeploy.

**¿Puedo tener múltiples admins?**
El sistema tiene un solo usuario admin. Para múltiples usuarios se requeriría una base de datos, lo cual está fuera del alcance de esta implementación serverless.

**¿Mis imágenes antiguas de Unsplash se pierden?**
No. Mientras no cambies las imágenes desde el panel, el `content.json` mantiene las URLs originales de Unsplash.
