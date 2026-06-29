import { useAuth } from "../contexts/auth-context"
import { Header } from "../components/layout/header"
import { CartSidebar } from "../components/productos/cart-sidebar"
import { SearchBar } from "../components/layout/search-bar"
import { ProductGrid } from "../components/productos/product-grid"
import { ROLES } from "../types/User"

export default function HomePage() {
  const { hasPermission } = useAuth()
  const canSell = hasPermission([ROLES.ADMIN, ROLES.PROPIETARIO, ROLES.CAJERO, ROLES.USER])

  return (
    <>
    {canSell && (
      <div>
      <Header title="Vender" />
      <div className="d-flex flex-grow-1 overflow-hidden">
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
