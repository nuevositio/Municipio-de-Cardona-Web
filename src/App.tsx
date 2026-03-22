import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'

import { AdminRoute } from '@/components/admin/admin-route'
import { SiteLayout } from '@/layouts/site-layout'
import { AdminPage } from '@/pages/admin-page'
import { AdminLoginPage } from '@/pages/admin-login-page'
import { AtencionCiudadanaPage } from '@/pages/atencion-ciudadana-page'
import { CulturaPage } from '@/pages/cultura-page'
import { HomePage } from '@/pages/home-page'
import { NewsDetailPage } from '@/pages/news-detail-page'
import { NewsPage } from '@/pages/news-page'
import { NotFoundPage } from '@/pages/not-found-page'
import { TeatroPage } from '@/pages/teatro-page'
import { TramitesPage } from '@/pages/tramites-page'

const router = createBrowserRouter([
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminPage />
      </AdminRoute>
    ),
  },
  {
    path: '/',
    element: <SiteLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'noticias', element: <NewsPage /> },
      { path: 'noticias/:slug', element: <NewsDetailPage /> },
      { path: 'tramites', element: <TramitesPage /> },
      { path: 'cultura', element: <CulturaPage /> },
      { path: 'teatro', element: <TeatroPage /> },
      { path: 'atencion-ciudadana', element: <AtencionCiudadanaPage /> },
      { path: '404', element: <NotFoundPage /> },
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
