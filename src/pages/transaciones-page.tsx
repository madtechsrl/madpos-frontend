
// import { useAuth } from "../contexts/auth-context"
import Transaciones from "../components/transaciones/transaciones"
import Sidebar from "../components/layout/sidebar"
import { RoleGuard } from "../components/auth/role-guard"
// import { ROLES, } from "../types/roles"
import { Header } from "../components/layout/header"
import { ROLES } from "../types/roles"

export default function TransacionesPage() {
  // const { hasPermission } = useAuth()
  // const isAdmin = hasPermission([ROLES.ADMIN, ROLES.MANAGER, ROLES.CASHIER])

  return (
    <>   
     <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
        <div>             
          <div className="d-flex flex-grow-1 overflow-hidden">
            <Sidebar />
            <div className="flex-grow-1  p-4" style={{transition: "margin-left 0.3s ease"}}>
              <Header title="Transaciones" />  
              <Transaciones/>                     
            </div>
          </div>
        </div>
      </RoleGuard>
    
    </>
  )
}
