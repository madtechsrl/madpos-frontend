import { useAuth } from "../contexts/auth-context"
import { NewProductPage }from "../components/productos/addProduct"
import Sidebar from "../components/layout/sidebar"
import { ROLES } from "../types/roles"
import { Header } from "../components/layout/header"

export default function AddProduct() {
  const { hasPermission } = useAuth()
  const isAdmin = hasPermission([ROLES.ADMIN,ROLES.MANAGER])
  if(!isAdmin){
        return <p className="text-center mt-5 text-danger">No tienes permiso para acceder a esta página.</p>;
  }

  return (
    <>   
    
        <div>                        
          <div className="d-flex flex-grow-1 overflow-hidden">
            <Sidebar />
            <div className="flex-grow-1  p-4" style={{transition: "margin-left 0.3s ease"}}>
              <Header title="Añadir Productos" />  
              <NewProductPage/>                     
            </div>
          </div>
        </div>
      
    
    </>
  )
}