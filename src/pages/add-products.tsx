import { useAuth } from "../contexts/auth-context"
import NewProductPage from "../components/productos/addProduct"
import Sidebar from "../components/layout/sidebar"
import { ROLES } from "../types/roles"
import { Header } from "../components/layout/header"

export default function ProductosPage() {
  const { hasPermission } = useAuth()
  const isAdmin = hasPermission([ROLES.ADMIN, ROLES.PROPIETARIO])

  return (
    <>   
      {isAdmin && ( 
        <div>                        
          <div className="d-flex flex-grow-1 overflow-hidden">
            <Sidebar />
            <div className="flex-grow-1  p-4" style={{transition: "margin-left 0.3s ease"}}>
              <Header title="Añadir Productos" />  
              <NewProductPage/>                     
            </div>
          </div>
        </div>
      )}
    
    </>
  )
}