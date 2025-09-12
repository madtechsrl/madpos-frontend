import { useAuth } from "../contexts/auth-context"
import {ProductEditForm }from "../components/productos/product-edit-form"
import Sidebar from "../components/layout/sidebar"
import { ROLES } from "../types/roles"
import { Header } from "../components/layout/header"

export default function ProductosPage() {
  const { hasPermission } = useAuth()
  const isAdmin = hasPermission([ROLES.ADMIN, ROLES.MANAGER])

  return (
    <>   
      {isAdmin && ( 
        <div>          
                
          <div className="d-flex flex-grow-1 overflow-hidden">
            <Sidebar />
            <div className="flex-grow-1  p-4" style={{transition: "margin-left 0.3s ease"}}>
              <Header title="Editar Productos" />  
              <ProductEditForm />                     
            </div>
          </div>
        </div>
      )}
    
    </>
  )
}