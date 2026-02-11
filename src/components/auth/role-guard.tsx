

import { useAuth } from "../../contexts/auth-context"
import { useNavigate } from "react-router-dom"
import { useEffect,  type ReactNode } from "react"
import { type RoleUuid } from "../../types/roles"

type RoleGuardProps = {
  children: ReactNode
  allowedRoles: RoleUuid | RoleUuid[];
  fallback?: ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { hasPermission, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
 

  useEffect(() => {
    if (!isLoading && !isAuthenticated ) {
      navigate("/",{replace: true})
    }
  }, [isLoading, isAuthenticated, navigate])

  // Convierte RoleKey -> RoleUuid para cumplir el tipo que espera hasPermission
  // const toUuid = (k: RoleKey): RoleUuid => ROLES[k]

  // const allowedUuids: RoleUuid | RoleUuid[] = Array.isArray(allowedRoles)
  //   ? allowedRoles.map(toUuid)
  //   : toUuid(allowedRoles)


  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  if (!hasPermission(allowedRoles)) {
    if (fallback) return <>{fallback}</>

    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <h2 className="mb-3">Acceso Denegado</h2>
          <p className="text-secondary">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
