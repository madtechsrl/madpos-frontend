import { useAuth} from "../../contexts/auth-context"
import { useNavigate } from "react-router-dom"
import { useEffect, type ReactNode } from "react"
import type { RoleKey} from "../../types/roles"

type RoleGuardProps = {
  children: ReactNode
  allowedRoles: RoleKey[]
  fallback?: ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login")
    }
  }, [isLoading, isAuthenticated, navigate])

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in the useEffect
  }

  const userRole = user?.role as RoleKey | undefined

  if (!userRole || !allowedRoles.includes(userRole)) {
    if (fallback) {
      return <>{fallback}</>
    }

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
