import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Suspense , lazy} from "react"
import { AppProvider } from "./contexts/app-provider"
import { AuthProvider} from "./contexts/auth-context"
import { UserProvider } from "./contexts/user-context"
// import ProtectedRoute from "./components/proctect-route"
import Loading from "./loading"
import NotFoundPage from "./not-found"
import LoginPage  from "./pages/login"


// Lazy load pages
// const LoginPage = lazy(() => import("./pages/login"))
const DashboardLayout = lazy(() => import("./pages/dashboard-layout"))
const HomePage = lazy(() => import("./pages/home"))
const ProductsPage = lazy(() => import("./pages/productos-page"))
const Transaciones = lazy(() => import("./pages/transaciones-page"))
const AddProduct = lazy(() => import("./pages/add-products"))
const UsersPage = lazy(() => import("./pages/user"))
const StatsPage = lazy(() => import("./pages/estadistica-page"))

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
              <Route path="/user" element={<UsersPage />} />
              <Route path="/transaciones" element={<Transaciones />} />
              <Route path="/productos" element={<ProductsPage />} />
              <Route path="/pages/add-products" element={<AddProduct />} />
              <Route path="/stats" element={<StatsPage />} />
                {/* Protected routes */}
              <Route path="/dashboard" element={<DashboardLayout />}>
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
