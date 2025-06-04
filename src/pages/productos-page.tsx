import { useAuth } from "../contexts/auth-context"
import { Header } from "../components/layout/header"
import ProductManagement from "../components/productos/product-management"
import Sidebar from "../components/layout/sidebar"
import { ROLES } from "../types/roles"

export default function ProductosPage() {
  const { hasPermission } = useAuth()
  const isAdmin = hasPermission([ROLES.ADMIN, ROLES.PROPIETARIO])

  return (
    <>   
      {isAdmin && ( 
        <div>
          {/* <Header title="Productos" />         */}
          <div className="d-flex flex-grow-1 overflow-hidden">
            <Sidebar />
            <div className="flex-grow-1  p-4" style={{transition: "margin-left 0.3s ease"}}>
              <ProductManagement/>                     
            </div>
          </div>
        </div>
      )}
    
    </>
  )
}