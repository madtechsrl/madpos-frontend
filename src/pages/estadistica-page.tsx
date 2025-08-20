
import { useAuth } from "../contexts/auth-context"
import Estadistica from "../components/analitica/estadistica"
import Sidebar from "../components/layout/sidebar"
import { UserRole } from "../types/roles"
import { Header } from "../components/layout/header"

export default function EstadisticaPage() {
  const { hasPermission } = useAuth()
  const isAdmin = hasPermission(UserRole.ADMIN)

  return (
    <>   
      {isAdmin && ( 
        <div>          
                 
          <div className="d-flex flex-grow-1 overflow-hidden">
          <Sidebar />
            <div className="flex-grow-1  p-4" style={{transition: "margin-left 0.3s ease"}}>
              <Header title="Estadísticas" /> 
              <Estadistica />                     
            </div>
          </div>
        </div>
      )}
    
    </>
  )
}
