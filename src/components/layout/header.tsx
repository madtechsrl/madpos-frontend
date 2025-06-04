"use client"

import { useAuth } from "../../contexts/auth-context"
import { useState } from "react"
import { ROLES} from "../../types/roles"

type HeaderProps = {
  title: string
}
const roleDisplayNames = {
  [ROLES.ADMIN]: "Administrador",
  [ROLES.USER]: "Usuario",
  [ROLES.PROPIETARIO]: "Propietario",
  [ROLES.CAJERO]: "Cajero",
  [ROLES.ALMACENISTA]: "Almacenista",
}

const badgeClasses = {
  [ROLES.ADMIN]: "bg-success",
  [ROLES.USER]: "bg-secondary",
  [ROLES.CAJERO]: "bg-info",
  [ROLES.ALMACENISTA]: "bg-danger",
  [ROLES.PROPIETARIO]: "bg-primary",
}

const isValidRole = (role: unknown): role is keyof typeof roleDisplayNames =>
  typeof role === "string" && role in roleDisplayNames;

export function Header({ title }: HeaderProps) {
  const { logout, user } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  // Generate initials from user name
  const getInitials = (fullname: string | undefined) => {
    if (!fullname) return "??"

    return fullname
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }
  const displayRole = isValidRole(user?.role) ? roleDisplayNames[user.role] : "Administrador"
  const displaybadgeClass = isValidRole(user?.role) ? badgeClasses[user.role] : "bg-secondary"
  if(user?.role && !isValidRole(user.role)){
    console.warn(`Invalid role: ${user.role}`)
  }
  
  return (
    <header className="bg-white shadow-sm p-3 d-flex justify-content-between align-items-center">
      <h1 className="fs-4 fw-bold text-dark mb-0">{title}</h1>
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-link text-decoration-none text-secondary">
          <span className="small">Ayuda</span>
        </button>
        <div className="dropdown">
          <div
            className="d-flex align-items-center gap-2 cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="avatar">{getInitials(user?.fullname)}</div>
            <div className="small">
              <div className="fw-medium">{user?.fullname}</div>
              <div className="text-secondary small">
                {user?.email}
                {user && user.role && (
                  <span
                    className={`badge ms-1 ${displaybadgeClass}`}>
                    {displayRole}
                  </span>

                )}
              </div>
            </div>
            <i className="fas fa-chevron-down text-secondary small"></i>
          </div>

          <div className={`dropdown-menu dropdown-menu-end ${showDropdown ? "show" : ""}`}>
            <button className="dropdown-item d-flex align-items-center" onClick={logout}>
              <i className="fas fa-sign-out-alt me-2"></i>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
