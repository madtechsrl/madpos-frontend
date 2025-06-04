"use client"

import type React from "react"
import  { type UserRole, getRoleName } from "../../types/User"




interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  currentUserRole: UserRole
  fallbackMessage?: string
}

export function RoleGuard({
  children,
  allowedRoles,
  currentUserRole,
  fallbackMessage,
}: RoleGuardProps) 

{
  const hasAccess = allowedRoles.includes(currentUserRole)
 

  if (!hasAccess) {
    return (
      <div className="d-flex flex-column vh-100">
        <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4">
          <div className="text-center" style={{ maxWidth: "500px" }}>
            <div
              className="bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
              style={{ width: "64px", height: "64px" }}
            >
              <i className="fas fa-shield-alt text-danger fs-4"></i>
            </div>
            <h2 className="h4 fw-bold text-dark mb-3">Acceso Restringido</h2>
            <div className="alert alert-danger mb-4" role="alert">
              {fallbackMessage ||
                "No tienes permisos para acceder a esta sección. Solo usuarios con roles específicos pueden ver esta información."}
            </div>
            <p className="text-muted mb-2">
              Tu rol actual: <strong>{getRoleName(currentUserRole)}</strong>
            </p>
            <p className="text-muted mb-4">
              Roles permitidos: {allowedRoles.map((role) => getRoleName(role)).join(", ")}
            </p>
            <a href="/dashboard" className="btn btn-primary">
              <i className="fas fa-arrow-left me-2"></i>
              Volver al punto de venta
            </a>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
