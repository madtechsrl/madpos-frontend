import { useAuth } from "../contexts/auth-context"
import { Header } from "../components/layout/header"
import { CartSidebar } from "../components/ventas/cart-sidebar"
import { SearchBar } from "../components/layout/search-bar"
import { ProductGrid } from "../components/productos/product-grid"
import { ROLES } from "../types/User"
import Sidebar from "../components/layout/sidebar"

export default function HomePage() {
  const { hasPermission } = useAuth()
  const isAdmin = hasPermission([ROLES.ADMIN, ROLES.PROPIETARIO])

  return (
    <>
    {isAdmin && (
      <div>
      <Header title="Vender" />
      <div className="d-flex flex-grow-1 overflow-hidden">
        <Sidebar />
        <div className="flex-grow-1  p-4" style={{transition: "margin-left 0.3s ease"}}>
          {/* <HomepageContent /> */}
          <SearchBar />
          <ProductGrid />
        </div>
        <CartSidebar />
      </div>
      </div>


    )}
    
    </>
  )
}
