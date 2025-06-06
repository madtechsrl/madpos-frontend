"use client"

import { useAuth } from "../contexts/auth-context"
import { useNavigate } from "react-router-dom"
import { useEffect, useState, type ReactNode } from "react"
// import { isPreviewEnvironment } from "../services/auth-service"
import { type UserRole } from "../types/roles"

type RoleGuardProps = {
  children: ReactNode
  allowedRoles: UserRole | UserRole[]
  fallback?: ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { hasPermission, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const [isPreview, setIsPreview] = useState(false)

  // Check if we're in a preview environment
//   useEffect(() => {
//     setIsPreview(isPreviewEnvironment())
//   }, [])

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isPreview) {
      navigate("/")
    }
  }, [isLoading, isAuthenticated, navigate, isPreview])

  // In preview environment, always render children
  if (isPreview) {
    return <>{children}</>
  }

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

  if (!hasPermission(allowedRoles)) {
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
