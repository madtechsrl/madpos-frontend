import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Suspense , lazy} from "react"
import { AppProvider } from "./contexts/app-provider"
import { AuthProvider} from "./contexts/auth-context"
import { UserProvider } from "./contexts/user-context"
import ProtectedRoute from "./components/proctect-route"
import Loading from "./loading"
import NotFoundPage from "./not-found"
import LoginPage  from "./pages/login"
import { ROLES } from "./types/roles"

// Lazy load pages
// const LoginPage = lazy(() => import("./pages/login"))
const DashboardLayout = lazy(() => import("./pages/dashboard-layout"))
const HomePage = lazy(() => import("./pages/home"))
const ProductsPage = lazy(() => import("./pages/productos-page"))
const Transaciones = lazy(() => import("./pages/transaciones-page"))
const AddProduct = lazy(() => import("./components/productos/addProduct"))
const UsersPage = lazy(() => import("./pages/user"))
const StatsPage = lazy(() => import("./pages/estadistica-page"))
const ClientesPage = lazy(() => import("./pages/clientes-page"))
const InventarioPage = lazy(() => import("./pages/inventario-page"))
const ProveedoresPage = lazy(() => import("./pages/proveedores-page"))
const ConfiguracionesPage = lazy(() => import("./pages/configuraciones-page"))
// const NotFoundPage = lazy(() => import("./pages/not-found"))

function App() {
 
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
        <AppProvider>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LoginPage />} />
              <Route path="/user" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
              <Route path="/transaciones" element={<ProtectedRoute><Transaciones /></ProtectedRoute>} />
              <Route path="/productos" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
              <Route path="/productos/nuevo" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
              <Route path="/productos/:id/editar" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
              <Route path="/stats" element={<ProtectedRoute><StatsPage /></ProtectedRoute>} />
              <Route path="/clientes" element={<ProtectedRoute><ClientesPage /></ProtectedRoute>} />
              <Route path="/inventario" element={<ProtectedRoute><InventarioPage /></ProtectedRoute>} />
              <Route path="/proveedores" element={<ProtectedRoute><ProveedoresPage /></ProtectedRoute>} />
              <Route
                path="/configuraciones"
                element={
                  <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.PROPIETARIO]}>
                    <ConfiguracionesPage />
                  </ProtectedRoute>
                }
              />
                {/* Protected routes */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<HomePage />} />
                {/* <Route path="productos" element={<ProductsPage />} />
                <Route path="pedidos" element={<OrdersPage />} />
                <Route path="usuarios" element={<UsersPage />} /> */}
              </Route> 

              {/* 404 route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </AppProvider>
        </UserProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
