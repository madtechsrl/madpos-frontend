import { useAuth } from "../contexts/auth-context"
import { Header } from "../components/layout/header"
import { CartSidebar } from "../components/ventas/cart-sidebar"
import { SearchBar } from "../components/layout/search-bar"
import { ProductGrid } from "../components/productos/product-grid"
import { ROLES } from "../types/roles"
import Sidebar from "../components/layout/sidebar"

export default function HomePage() {
  const { hasPermission } = useAuth()
  const isAdmin = hasPermission([ROLES.ADMIN, ROLES.MANAGER, ROLES.CASHIER])

  return (
    <>
    {isAdmin && (
          
      <div className="d-flex flex-grow-1 overflow-hidden">
        <Sidebar />
        <div className="flex-grow-1  p-4" style={{transition: "margin-left 0.3s ease"}}>
          {/* <HomepageContent /> */}
           <Header title="Vender" />
          <SearchBar />
          <ProductGrid />
        </div>
        <CartSidebar />
      </div>
      


    )}
    
    </>
  )
}
