# Conectar Dominio de Squarespace a Vercel

> **Requisitos previos:** Proyecto ya desplegado en Vercel · Dominio comprado en Squarespace

---

## PASO 1 — Agregar el dominio en Vercel

1. Ir a [vercel.com](https://vercel.com) e iniciar sesión.
2. Seleccionar el proyecto (ej. `maquinados-jaco`).
3. Ir a **Settings** → **Domains**.
4. En el campo de texto escribir el dominio:
   ```
   tudominio.com
   ```
5. Hacer clic en **Add**.
6. Vercel preguntará cómo quieres configurarlo — elegir:
   - **Add `tudominio.com` and redirect `www.tudominio.com`** ← recomendado
7. Vercel mostrará los registros DNS que necesitas configurar. Tendrá este aspecto:

   | Tipo | Nombre | Valor |
   |------|--------|-------|
   | A    | @      | `76.76.21.21` |
   | CNAME | www   | `cname.vercel-dns.com` |

   > Deja esta pantalla abierta o anota estos valores, los necesitarás en el siguiente paso.

---

## PASO 2 — Configurar DNS en Squarespace

1. Ir a [squarespace.com](https://squarespace.com) e iniciar sesión con la cuenta del cliente.
2. En el panel lateral ir a **Configuración** (Settings) → **Dominios** (Domains).
3. Hacer clic en el dominio que se usará.
4. Seleccionar **Configuración de DNS** (DNS Settings).
5. Buscar y **eliminar** cualquier registro A o CNAME que ya exista apuntando a Squarespace (generalmente apuntan a sus servidores, hay que limpiar antes de agregar los nuevos).

### Agregar registro A

6. Hacer clic en **Agregar registro** (Add Record).
7. Llenar los campos:
   - **Tipo:** `A`
   - **Host / Nombre:** `@`
   - **Valor / Apunta a:** `76.76.21.21`
   - **TTL:** `3600` (o dejar el predeterminado)
8. Guardar.

### Agregar registro CNAME (para www)

9. Hacer clic de nuevo en **Agregar registro**.
10. Llenar los campos:
    - **Tipo:** `CNAME`
    - **Host / Nombre:** `www`
    - **Valor / Apunta a:** `cname.vercel-dns.com`
    - **TTL:** `3600` (o dejar el predeterminado)
11. Guardar.

---

## PASO 3 — Verificar en Vercel

1. Regresar a Vercel → **Settings** → **Domains**.
2. El dominio mostrará el estado **"Verifying…"** mientras los DNS se propagan.
3. Esperar entre **10 minutos y 48 horas** (normalmente menos de 1 hora).
4. Cuando esté listo, el estado cambia a **"Valid Configuration"** con una palomita verde ✓.

---

## PASO 4 — SSL (certificado HTTPS)

> **No se necesita hacer nada.** Vercel genera y renueva el certificado SSL automáticamente usando Let's Encrypt una vez que los DNS están verificados.

- El candado verde / HTTPS aparecerá solo.
- No hay costo adicional.
- Se renueva automáticamente antes de vencer.

---

## Verificación final

Una vez que Vercel marque el dominio como válido, abrir en el navegador:

```
https://tudominio.com
```

Debe cargar el sitio **con candado** y sin advertencias de seguridad.

Si también quieres verificar la propagación DNS antes, puedes usar:
- [whatsmydns.net](https://www.whatsmydns.net) — busca tu dominio tipo A y deberías ver `76.76.21.21` en la mayoría de los servidores del mundo.

---

## Problemas comunes

| Problema | Solución |
|----------|----------|
| Sigue mostrando la página de Squarespace | Los DNS aún no propagaron, esperar más tiempo |
| Error "Invalid Configuration" en Vercel | Verificar que el registro A tiene exactamente `76.76.21.21` |
| HTTPS no activa | Esperar a que Vercel termine de generar el certificado (puede tardar ~10 min después de que los DNS propaguen) |
| `www` no funciona | Verificar que el CNAME apunta a `cname.vercel-dns.com` sin punto al final |
