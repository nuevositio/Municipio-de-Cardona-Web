# Sitio Oficial - Municipio de Cardona

Sitio institucional en React + Vite + TypeScript con un backend Node.js + Express + SQLite para administrar noticias mediante un panel privado.

## 1. Arquitectura

### Frontend

- SPA con React Router.
- Rutas publicas del sitio institucional.
- Rutas privadas:
  - `/admin/login`
  - `/admin` (protegida por token JWT)
- Estetica institucional reutilizando variables CSS existentes:
  - azul institucional
  - verde secundario
  - gris claro
  - blanco

### Backend

- API REST con Express.
- Autenticacion con JWT.
- Un unico usuario administrador configurable por variables de entorno.
- Base SQLite para persistencia.
- Multer para subida de imagenes con validacion de tipo y tamano.

### Persistencia

- Archivo SQLite en `server/data/news.sqlite`.
- Imagenes en `uploads/`.

## 2. Estructura de Carpetas

```text
server/
  data/
  middleware/
    auth.js
    upload.js
  routes/
    auth-routes.js
    news-routes.js
  utils/
    slugify.js
  db.js
  index.js

src/
  components/
    admin/
      admin-route.tsx
    ui/
  data/
    news.ts (fallback local)
  lib/
    auth-storage.ts
    news-api.ts
    utils.ts
  pages/
    admin-login-page.tsx
    admin-page.tsx
    news-page.tsx
    news-detail-page.tsx
  ...

uploads/
.env.example
```

## 3. Backend Completo

### Endpoints

- `GET /api/health`
- `POST /api/auth/login`
- `GET /api/auth/me` (protegida)
- `GET /api/news`
- `GET /api/news/:slug`
- `POST /api/news` (protegida + imagen)
- `PUT /api/news/:id` (protegida + imagen opcional)
- `DELETE /api/news/:id` (protegida)

### Tabla SQLite

Tabla `news` con campos:

- `id`
- `title`
- `slug`
- `excerpt`
- `content`
- `image`
- `date`
- `createdAt`
- `updatedAt`

## 4. Login Funcional

- Ruta ` /admin/login`.
- Credenciales validadas contra variables de entorno:
  - `ADMIN_USERNAME`
  - `ADMIN_PASSWORD`
- El login devuelve JWT.
- El token se guarda en `localStorage` y se envia como `Bearer`.

## 5. CRUD de Noticias

Panel `/admin` incluye:

- Listado de noticias
- Crear noticia
- Editar noticia
- Eliminar noticia con confirmacion

Campos gestionados:

- titulo
- slug automatico editable
- resumen
- contenido
- fecha
- imagen destacada

## 6. Subida de Imagenes

Reglas implementadas en frontend y backend:

- formatos permitidos: `jpg`, `jpeg`, `png`, `webp`
- maximo: `1 MB`
- recomendacion mostrada al usuario: entre `512 KB` y `1 MB`
- almacenamiento en `uploads/`
- vista previa antes de guardar

## 7. Proteccion de Rutas

- `AdminRoute` valida sesion via `GET /api/auth/me`.
- Si no hay token o el token no es valido:
  - redirige a `/admin/login`.

## 8. Instalacion y Uso

### Requisitos

- Node.js 20+
- npm

### Variables de entorno

1. Copiar `.env.example` a `.env`.
2. Completar valores seguros:

```env
PORT=4000
FRONTEND_ORIGIN=http://localhost:5173
ADMIN_USERNAME=admin
ADMIN_PASSWORD=tu_password_segura
JWT_SECRET=un_secreto_largo_y_unico
VITE_API_URL=http://localhost:4000
```

### Instalar dependencias

```bash
npm install
```

### Ejecutar en desarrollo (frontend + backend)

```bash
npm run dev:full
```

Tambien puedes ejecutarlos por separado:

```bash
npm run dev:server
npm run dev:client
```

### Compilar frontend

```bash
npm run build
```

### Levantar solo API

```bash
npm run start:server
```

## 9. Rutas Principales

- Publicas:
  - `/`
  - `/noticias`
  - `/noticias/:slug`
  - `/tramites`
  - `/cultura`
  - `/teatro`
  - `/atencion-ciudadana`
- Privadas:
  - `/admin/login`
  - `/admin`

## 10. Notas de Produccion

- El frontend usa proxy de Vite en desarrollo para `/api` y `/uploads`.
- Para produccion, configura `VITE_API_URL` apuntando al dominio de la API.
- `uploads/` y `server/data/*.sqlite` estan ignorados en Git para evitar subir datos locales.
