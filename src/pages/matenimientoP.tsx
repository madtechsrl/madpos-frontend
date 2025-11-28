// import { Header } from "../components/layout/header"
import { useAuth } from "../contexts/auth-context"
import { MaintenanceCenter } from "../components/mantenimiento/mantenimiento-center"
import Sidebar from "../components/layout/sidebar"
import { ROLES } from "../types/roles"

export default function MaintenancePage() {
   const { hasPermission } = useAuth()
    const isAdmin = hasPermission([ROLES.ADMIN, ROLES.MANAGER])
  return (
    
    <>
      {isAdmin && (
        <div className="d-flex flex-grow-1 overflow-hidden">
          <Sidebar />
          <div className="flex-grow-1  p-4" style={{transition: "margin-left 0.3s ease"}}>
            {/* <HomepageContent /> */}
             <MaintenanceCenter/>           
          </div>        
        </div>
        
  
      )}
      
      </>
   
  )
}
