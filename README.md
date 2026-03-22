# Sitio Oficial - Municipio de Cardona

Sitio institucional moderno, responsive y accesible construido para gestion manual de contenidos sin CMS ni backend.

## Stack Tecnologico

- Vite
- React
- TypeScript (estricto)
- Tailwind CSS
- shadcn/ui
- Framer Motion
- React Router
- React Helmet Async
- Lucide React

## Principios del Proyecto

- Sin WordPress
- Sin backend
- Sin base de datos
- Contenido 100% local y tipado
- Mantenimiento simple para una sola persona

## Instalacion

```bash
npm install
```

## Desarrollo Local

```bash
npm run dev
```

## Build de Produccion

```bash
npm run build
```

## Preview de Build

```bash
npm run preview
```

## Deploy en Netlify

El proyecto ya incluye:

- `netlify.toml` con comando de build y publish
- `public/_redirects` para enrutado SPA

Pasos:

1. Conectar repositorio en Netlify.
2. Confirmar build command: `npm run build`.
3. Confirmar publish directory: `dist`.
4. Deploy.

## Estructura de Carpetas

```text
src/
  components/
    ui/
  content/
    news/
    authorities/
    transparency/
  data/
  hooks/
  layouts/
  lib/
  pages/
  sections/
  types/
```

## Gestion Manual de Contenidos

### Noticias

Editar: `src/data/news.ts`

Cada noticia incluye:

- `id`
- `slug`
- `title`
- `excerpt`
- `content`
- `image`
- `date`
- `category`
- `featured`

### Autoridades

Editar: `src/data/authorities.ts`

Cada autoridad incluye:

- `id`
- `name`
- `role`
- `image`
- `order`

### Transparencia

Editar: `src/data/transparency.ts`

Cada acceso/documento incluye:

- `id`
- `title`
- `description`
- `type`
- `link`
- `date` (opcional)

## SEO y Accesibilidad

- SEO basico por pagina con `react-helmet-async`
- Estructura semantica con headings y secciones claras
- Estados de foco visibles
- Navegacion mobile y desktop accesible
- Imagenes con atributos `alt`

## Rutas Disponibles

- `/`
- `/noticias`
- `/noticias/:slug`
- `/tramites`
- `/cultura`
- `/teatro`
- `/atencion-ciudadana`
- `/404`

## Mantenimiento Recomendado

1. Actualizar contenidos en `src/data/*`.
2. Ejecutar `npm run build` antes de publicar.
3. Subir cambios al repositorio y redeploy en Netlify.
