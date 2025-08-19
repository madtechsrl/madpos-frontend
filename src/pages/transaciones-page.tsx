
import { useAuth } from "../contexts/auth-context"
import Transaciones from "../components/transaciones/transaciones"
import Sidebar from "../components/layout/sidebar"
import { UserRole } from "../types/roles"
import { Header } from "../components/layout/header"

export default function TransacionesPage() {
  const { hasPermission } = useAuth()
  const isAdmin = hasPermission(UserRole.ADMIN)

  return (
    <>   
      {isAdmin && ( 
        <div>          
                
          <div className="d-flex flex-grow-1 overflow-hidden">
            <Sidebar />
            <div className="flex-grow-1  p-4" style={{transition: "margin-left 0.3s ease"}}>
              <Header title="Transaciones" />  
              <Transaciones/>                     
            </div>
          </div>
        </div>
      )}
    
    </>
  )
}
