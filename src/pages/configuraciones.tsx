import { useAuth } from "../contexts/auth-context"
import {ConfigurationTabs }from "../components/configuraciones/configuration-tabs"
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
          <Header title="Configuraciones" />        
          <div className="d-flex flex-grow-1 overflow-hidden">
            <Sidebar />
            <div className="flex-grow-1  p-4" style={{transition: "margin-left 0.3s ease"}}>
              <ConfigurationTabs/>                     
            </div>
          </div>
        </div>
      )}
    
    </>
  )
}