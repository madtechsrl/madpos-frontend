import { useAuth } from "../contexts/auth-context"
import ProductManagement from "../components/productos/Product-Management"
import Sidebar from "../components/layout/sidebar"
import { UserRole } from "../types/roles"
import { Header } from "../components/layout/header"

export default function ProductosPage() {
  const { hasPermission } = useAuth()
  const isAdmin = hasPermission([UserRole.ADMIN, UserRole.PROPIETARIO])

  return (
    <>   
      {isAdmin && ( 
       
        <div>                       
          <div className="d-flex flex-grow-1 overflow-hidden">        
            <Sidebar />
            <div className="flex-grow-1  p-4" style={{transition: "margin-left 0.3s ease"}}>
               <Header title=""  /> 
              <ProductManagement/>                     
            </div>
          </div>
        </div>
      )}
    
    </>
  )
}