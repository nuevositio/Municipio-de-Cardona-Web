import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'

import { AuthProvider }           from '@/admin/hooks/use-auth'
import { ProtectedRoute }         from '@/admin/components/protected-route'
import { AdminLayout }            from '@/admin/layouts/admin-layout'
import { AdminLoginPage }         from '@/admin/pages/login-page'
import { DashboardPage }          from '@/admin/pages/dashboard-page'
import { NewsAdminPage }          from '@/admin/pages/news-admin-page'
import { MinutesAdminPage }       from '@/admin/pages/minutes-admin-page'
import { ResolutionsAdminPage }   from '@/admin/pages/resolutions-admin-page'

import { SiteLayout }             from '@/layouts/site-layout'
import { AtencionCiudadanaPage }  from '@/pages/atencion-ciudadana-page'
import { CulturaPage }            from '@/pages/cultura-page'
import { HomePage }               from '@/pages/home-page'
import { NewsDetailPage }         from '@/pages/news-detail-page'
import { NewsPage }               from '@/pages/news-page'
import { NotFoundPage }           from '@/pages/not-found-page'
import { TeatroPage }             from '@/pages/teatro-page'
import { TramitesPage }           from '@/pages/tramites-page'
import { CouncilMinutesPage }     from '@/pages/council-minutes-page'
import { ResolutionsPage }        from '@/pages/resolutions-page'

const router = createBrowserRouter([
  // ── Rutas del panel administrativo ───────────────────────────────────────
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      // Redirigir /admin → /admin/dashboard
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard',    element: <DashboardPage /> },
      { path: 'noticias',     element: <NewsAdminPage /> },
      { path: 'actas',        element: <MinutesAdminPage /> },
      { path: 'resoluciones', element: <ResolutionsAdminPage /> },
    ],
  },

  // ── Rutas públicas del sitio ──────────────────────────────────────────────
  {
    path: '/',
    element: <SiteLayout />,
    children: [
      { index: true,             element: <HomePage /> },
      { path: 'noticias',        element: <NewsPage /> },
      { path: 'noticias/:slug',  element: <NewsDetailPage /> },
      { path: 'tramites',        element: <TramitesPage /> },
      { path: 'actas',           element: <CouncilMinutesPage /> },
      { path: 'resoluciones',    element: <ResolutionsPage /> },
      { path: 'cultura',         element: <CulturaPage /> },
      { path: 'teatro',          element: <TeatroPage /> },
      { path: 'atencion-ciudadana', element: <AtencionCiudadanaPage /> },
      { path: '404',             element: <NotFoundPage /> },
      { path: '*',               element: <Navigate to="/404" replace /> },
    ],
  },
])

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
