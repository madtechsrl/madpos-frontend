
import { useAuth } from "../contexts/auth-context"
import { Header } from "../components/layout/header"
import UserManagement from "../components/usuarios/user-management"
import Sidebar from "../components/layout/sidebar"
import { ROLES } from "../types/roles"

export default function UserPage() {
  const { hasPermission } = useAuth()
  const isAdmin = hasPermission(ROLES.ADMIN)

  return (
    <>   
      {isAdmin && ( 
        <div>
          {/* <Header title="Usuarios" />         */}
          <div className="d-flex flex-grow-1 overflow-hidden">
            <Sidebar />
            <div className="flex-grow-1  p-4" style={{transition: "margin-left 0.3s ease"}}>
              <UserManagement/>                     
            </div>
          </div>
        </div>
      )}
    
    </>
  )
}