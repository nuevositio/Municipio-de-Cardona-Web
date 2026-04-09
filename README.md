# Milocapp Cardona Cloud — CMS Municipal

Sitio web y CMS para el **Municipio de Cardona, Uruguay**. Incluye sitio público con noticias, actas y resoluciones, y un panel administrativo protegido con roles.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + TypeScript + Vite 6 + Tailwind CSS 3 |
| Backend | Express 5 + TypeScript (ESM / NodeNext) |
| ORM | Drizzle ORM + `@neondatabase/serverless` |
| Base de datos | Neon PostgreSQL (serverless, región us-east-2) |
| Almacenamiento | Supabase Storage (buckets `news-images` y `official-docs`) |
| Auth | `express-session` + `connect-pg-simple` + Argon2id |
| Deploy | Frontend → **Vercel** · Backend → **Render** (Ohio) |

---

## Desarrollo local

### Prerequisitos

- Node.js ≥ 20
- npm ≥ 10
- Una base de datos Neon (o cualquier PostgreSQL)
- Un proyecto Supabase (para uploads)

### Instalación

```bash
npm install
```

### Variables de entorno

Copiar `.env.example` a `.env` y completar los valores:

```bash
cp .env.example .env
```

Variables requeridas:

| Variable | Descripción |
|----------|-------------|
| `SESSION_SECRET` | Cadena aleatoria ≥ 64 chars |
| `DATABASE_URL` | PostgreSQL connection string con pooling (Neon) |
| `DIRECT_URL` | PostgreSQL connection string directo (para migraciones) |
| `SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_SERVICE_KEY` | Service role key de Supabase |
| `CLOUDFLARE_TURNSTILE_SECRET` | Secret de Turnstile (en dev usa la clave de test) |
| `VITE_API_URL` | URL del backend (ej. `http://localhost:4000`) |
| `VITE_TURNSTILE_SITE_KEY` | Site key de Turnstile |

### Migraciones

Crear las tablas en la base de datos:

```bash
npm run db:migrate
```

### Crear el administrador inicial

Al arrancar, el servidor crea automáticamente el superadmin si las variables `SUPERADMIN_*` están definidas en `.env`. También se puede ejecutar manualmente:

```bash
npm run bootstrap
```

### Arrancar en modo desarrollo

```bash
npm run dev:full
```

Servidor Express en `http://localhost:4000` · Cliente Vite en `http://localhost:5173`.

---

## Configuración del municipio

Editar **`src/config/site.ts`** para personalizar nombre, logo, colores y datos de contacto.

Para cambiar el logo, reemplazar `/public/images/logo_municipio.webp`.

---

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev:full` | Servidor + cliente en paralelo |
| `npm run dev:server` | Solo Express (tsx watch) |
| `npm run dev:client` | Solo Vite |
| `npm run build` | Build completo (TypeScript + Vite) |
| `npm run build:server` | Build solo del servidor |
| `npm run db:generate` | Generar archivos de migración desde el schema |
| `npm run db:migrate` | Aplicar migraciones en la base de datos |
| `npm run db:studio` | Abrir Drizzle Studio |
| `npm run bootstrap` | Crear superadmin manualmente |
| `npm run hash` | Generar hash Argon2 para contraseña |

---

## Build y deploy

### Backend (Render)

El archivo `render.yaml` configura el servicio automáticamente. En el dashboard de Render completar las variables marcadas como `sync: false`:

| Variable | Dónde obtenerla |
|----------|----------------|
| `FRONTEND_ORIGIN` | URL de producción en Vercel |
| `DATABASE_URL` | Neon → Connection Details → Pooled |
| `DIRECT_URL` | Neon → Connection Details → Direct |
| `SUPABASE_URL` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_KEY` | Supabase → Project Settings → API → service_role |
| `CLOUDFLARE_TURNSTILE_SECRET` | Cloudflare → Turnstile |
| `SUPERADMIN_USERNAME/EMAIL/PASSWORD` | Credenciales del primer admin |

`SESSION_SECRET` se genera automáticamente por Render (`generateValue: true`).

Tras el primer deploy exitoso, ejecutar `npm run db:migrate` localmente apuntando a la base de producción (o usar `db:push` en Neon directamente).

### Frontend (Vercel)

```bash
npm run build
```

Conectar el repositorio en Vercel. Agregar las variables de entorno:

| Variable | Valor |
|----------|-------|
| `VITE_API_URL` | URL pública del servicio Render (ej. `https://mi-api.onrender.com`) |
| `VITE_TURNSTILE_SITE_KEY` | Site key de Cloudflare Turnstile |

El `vercel.json` ya configura el rewrite SPA y las cabeceras de seguridad.

---

## Almacenamiento de archivos (Supabase)

Los archivos se suben a Supabase Storage. El servidor usa la service role key para subir directamente desde el backend (no expone credenciales al navegador).

| Tipo | Bucket | Formatos | Tamaño máx |
|------|--------|----------|-----------|
| Imágenes (noticias) | `news-images` | JPG, PNG, WEBP | 2 MB |
| PDFs (actas/resoluciones) | `official-docs` | PDF | 5 MB |

Crear los buckets manualmente en: Supabase → Storage → New bucket (marcar como **Public**).

---

## API — Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/admin/auth/login` | Login |
| `POST` | `/api/admin/auth/logout` | Logout |
| `GET` | `/api/admin/auth/me` | Usuario actual |
| `POST` | `/api/admin/upload/image` | Subir imagen (multipart) |
| `POST` | `/api/admin/upload/pdf` | Subir PDF (multipart) |
| `GET/POST` | `/api/admin/news` | Listar / crear noticias |
| `GET/PATCH/DELETE` | `/api/admin/news/:id` | Detalle / editar / eliminar |
| `GET/POST` | `/api/admin/minutes` | Actas |
| `GET/POST` | `/api/admin/resolutions` | Resoluciones |
| `GET/POST/PATCH/DELETE` | `/api/admin/users/:id` | Gestión de usuarios |
| `GET` | `/api/news` | Noticias publicadas (público) |
| `GET` | `/api/news/:slug` | Detalle noticia (público) |
| `GET` | `/api/council-minutes` | Actas publicadas (público) |
| `GET` | `/api/resolutions` | Resoluciones publicadas (público) |

---

## Estructura del proyecto

```
src/                          Frontend (React)
  config/site.ts             ← CONFIGURAR PARA CADA MUNICIPIO
  admin/
    api/                     Clientes fetch (admin)
    components/              Componentes del panel
    hooks/use-auth.tsx       Context de autenticación
    layouts/                 AdminLayout con sidebar
    pages/                   Páginas del panel
    schemas/                 Validación Zod de formularios
    types/                   Tipos TypeScript del panel
  pages/                     Páginas públicas
  sections/                  Secciones de la home
  layouts/                   Header y footer público
  lib/
    api-base.ts              VITE_API_URL resuelto
    news-api.ts              API pública de noticias
    council-minutes-api.ts   API pública de actas
    resolutions-api.ts       API pública de resoluciones

server/src/                   Backend (Express + TypeScript)
  config/env.ts              Validación de variables (Zod)
  controllers/               Lógica de negocio
  db/
    schema.ts                Schema Drizzle (PostgreSQL)
    connection.ts            Instancia Neon (singleton)
    migrate.ts               Runner de migraciones
  middlewares/               Auth, upload (multer memoryStorage), sesión
  models/                    Queries Drizzle (5 modelos)
  routes/                    Rutas de la API
  utils/
    content-helpers.ts       parseUuidParam, buildUniqueSlug, parsePagination
  scripts/
    bootstrap-superadmin.ts  Creación del primer admin

server/drizzle/               Migraciones SQL generadas
```

---

## Roles de usuario

| Rol | Acceso |
|-----|--------|
| `superadmin` | Todo, incluida gestión de usuarios |
| `admin` | CRUD completo de contenido |
| `editor` | Crear y editar, sin eliminar |
| `prensa` | Crear noticias, solo lectura en actas/resoluciones |
| `consulta` | Solo lectura del panel |

---

## Panel administrativo

Acceder en `/admin/login`. Módulos:

- **Noticias** — CRUD con imagen de portada (upload a Supabase)
- **Actas** — CRUD con adjunto PDF (upload a Supabase)
- **Resoluciones** — CRUD con adjunto PDF (upload a Supabase)
- **Usuarios** — Gestión de usuarios y roles (solo superadmin/admin)

Los items pueden ser borradores (sin `publishedAt`) o publicados (con fecha).

---

## Licencia

Uso privado — Municipio de Cardona, Uruguay.
