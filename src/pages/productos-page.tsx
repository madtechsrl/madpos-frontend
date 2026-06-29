import { useAuth } from "../contexts/auth-context"
import ProductManagement from "../components/productos/Product-Management"
import Sidebar from "../components/layout/sidebar"
import { ROLES } from "../types/roles"
import { Header } from "../components/layout/header"

export default function ProductosPage() {
  const { hasPermission } = useAuth()
  const canManageProducts = hasPermission([ROLES.ADMIN, ROLES.PROPIETARIO, ROLES.ALMACENISTA])

  return (
    <>   
      {canManageProducts && (
        <div>          
          <Header title="Productos" />        
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
