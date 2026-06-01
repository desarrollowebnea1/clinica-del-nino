# Clínica del Niño — Web institucional premium

Plataforma web autoadministrable para clínica pediátrica en Corrientes Capital.  
Atención 24/7, servicios institucionales, obras sociales, vacunatorio, solicitudes por WhatsApp.

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Prisma** + **Neon PostgreSQL**
- **Vercel** + **Vercel Blob**
- Auth admin: JWT en cookie httpOnly + bcrypt

## Inicio rápido

### 1. Variables de entorno

Copiá `.env.example` a `.env`:

```bash
# Runtime (pooler Neon) — ver .env.example
DATABASE_URL="postgresql://...@ep-xxx-pooler....neon.tech/neondb?sslmode=require&pgbouncer=true"
# Migraciones / push / seed (conexión directa)
DIRECT_URL="postgresql://...@ep-xxx....neon.tech/neondb?sslmode=require"
JWT_SECRET="una-clave-larga-y-segura-minimo-32-caracteres"
BLOB_READ_WRITE_TOKEN="vercel_blob_..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 2. Base de datos

```bash
npm install
npm run db:push
npm run db:seed
```

**Neon:** usá `DATABASE_URL` con el endpoint **pooler** para la app y `DIRECT_URL` sin pooler para `db:push` / `db:seed`. Si ves `prisma:error ... kind: Closed` en dev, suele ser idle timeout de Neon o hot reload; con pooler + singleton suele estabilizarse.

### 3. Desarrollo

```bash
npm run dev
```

- Web pública: http://localhost:3000
- Admin: http://localhost:3000/admin/login

**Credencial inicial:** `admin@clinicadelnino.com` / `admin123456`  
⚠️ Cambiá la contraseña antes de producción.

## Estructura

```
src/
  app/
    (site)/          # Web pública
    admin/             # Panel admin
    api/               # APIs públicas y admin
  components/
    home/              # Secciones de la landing
    admin/             # Shell del panel
    layout/            # Navbar, Footer
  lib/
    prisma.ts
    auth-jwt.ts
    data.ts
    whatsapp.ts
prisma/
  schema.prisma
  seed.ts
```

## Panel admin

| Módulo | Ruta |
|--------|------|
| Dashboard | `/admin` |
| Solicitudes | `/admin/inquiries` |
| Servicios | `/admin/services` |
| Obras sociales | `/admin/insurance` |
| Vacunatorio | `/admin/vaccine` |
| FAQ | `/admin/faqs` |
| Contenido | `/admin/content` |
| Imágenes | `/admin/images` |
| Configuración | `/admin/settings` |

## Deploy en Vercel

1. Conectá el repositorio en Vercel
2. Variables de entorno en Vercel:
   - `DATABASE_URL` → connection string **Pooled** de Neon (`-pooler` + `pgbouncer=true`)
   - `DIRECT_URL` → connection string **Direct** de Neon (solo para migraciones desde CI/local)
   - `JWT_SECRET`, `BLOB_READ_WRITE_TOKEN`, `NEXT_PUBLIC_APP_URL`
3. Creá store Blob en Vercel → copiá token
4. Tras el primer deploy, desde tu máquina (con `DIRECT_URL` en `.env`):

```bash
npm run db:push
npm run db:seed
```

En producción la app solo usa `DATABASE_URL` (pooler). No hace falta `DIRECT_URL` en runtime de Vercel salvo que ejecutes migraciones en build.

## Checklist pre-producción

- [ ] Cambiar contraseña admin
- [ ] Configurar `JWT_SECRET` seguro
- [ ] Neon: `DATABASE_URL` (pooler) + `DIRECT_URL` (directa) configuradas
- [ ] Configurar Vercel Blob
- [ ] Completar WhatsApp, dirección y mapas en `/admin/settings`
- [ ] Subir logo e imagen hero
- [ ] Cargar obras sociales (carga masiva en admin)
- [ ] Verificar formulario de solicitudes + WhatsApp

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo |
| `npm run build` | Build producción |
| `npm run db:push` | Sincronizar schema |
| `npm run db:seed` | Datos iniciales |
| `npm run db:studio` | Prisma Studio |

## Licencia

Proyecto privado — Clínica del Niño.
