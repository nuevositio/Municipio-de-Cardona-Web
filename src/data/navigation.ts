import {
  Building2,
  Drama,
  FileBadge2,
  FileText,
  HandHelping,
  Home,
  Landmark,
  Newspaper,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  path: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { label: 'Inicio', path: '/', icon: Home },
  { label: 'Noticias', path: '/noticias', icon: Newspaper },
  { label: 'Tramites', path: '/tramites', icon: Building2 },
  { label: 'Actas', path: '/actas', icon: FileBadge2 },
  { label: 'Resoluciones', path: '/resoluciones', icon: FileText },
  { label: 'Cultura', path: '/cultura', icon: Landmark },
  { label: 'Teatro', path: '/teatro', icon: Drama },
  { label: 'Atencion Ciudadana', path: '/atencion-ciudadana', icon: HandHelping },
]
