/**
 * Configuración del Municipio de Cardona
 *
 * Este archivo centraliza toda la información institucional del sitio.
 * Para adaptar el sistema a otro municipio: duplicar este archivo y
 * ajustar los valores correspondientes.
 *
 * Versión: Milocapp Cardona Cloud
 */
export const SITE = {
  /** Nombre completo del municipio */
  name: 'Municipio de Cardona',

  /** Nombre corto (aparece en títulos, sidebar, navbar, etc.) */
  shortName: 'Cardona',

  /** Departamento */
  department: 'Soriano',

  /** País */
  country: 'Uruguay',

  /** Ruta de la imagen del logo (relativa a /public) */
  logo: '/images/logo_municipio.webp',

  /** Logo versión horizontal (para header y footer) */
  logoHorizontal: '/images/logo-horizontal.png',

  /** Colores de la marca (deben coincidir con las variables CSS en index.css) */
  colors: {
    primary:   '#1E78A8',   // --brand-blue   (azul cielo del logo)
    secondary: '#4A8E22',   // --brand-green  (verde colinas del logo)
    accent:    '#D97B2A',   // --brand-orange (naranja del banner)
    dark:      '#1B5E82',   // --bg-dark      (header / footer)
  },

  /** Información de contacto */
  contact: {
    address:  'Florida 267, Cardona — Soriano, Uruguay',
    phone:    '+598 4534 2148',
    email:    'municipio@cardona.gub.uy',
    whatsapp: '59845342148',   // Sin +, sin espacios (para enlace wa.me)
  },

  /** Redes sociales (null = no mostrar) */
  social: {
    facebook:  'https://www.facebook.com/municipiodecardona' as string | null,
    instagram: null as string | null,
    twitter:   null as string | null,
    youtube:   null as string | null,
  },

  /** Horario de atención */
  schedule: {
    weekdays: 'Lunes a Viernes: 8:00 — 14:00 hs',
    note: 'La atención telefónica puede variar',
  },

  /** Meta SEO por defecto */
  seo: {
    title: 'Municipio de Cardona — Gobierno Municipal',
    description:
      'Sitio oficial del Municipio de Cardona, Soriano, Uruguay. Noticias, actas, resoluciones y servicios del gobierno local.',
    keywords:
      'Cardona, Municipio, Soriano, Uruguay, gobierno local, trámites, noticias, actas, resoluciones',
    ogImage: '/images/og-cardona.jpg',
  },

  /** URL pública del sitio (para sitemap, OpenGraph, etc.) */
  url: 'https://www.municipiodecardona.gub.uy',

  /** URL de la API (se puede sobreescribir con VITE_API_URL) */
  apiUrl: import.meta.env.VITE_API_URL ?? '/api',
} as const

export type SiteConfig = typeof SITE
