import { useAuth } from "../../contexts/auth-context"
import { useState } from "react"
import { ROLES} from "../../types/roles"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faSignOutAlt } from "@fortawesome/free-solid-svg-icons"

type HeaderProps = {
  title: string
}

const roleDisplayNames = {
  [ROLES.ADMIN]: "Administrador",
  [ROLES.CASHIER]: "Usuario",
  [ROLES.MANAGER]: "Propietario",
 
}

const badgeClasses = {
  [ROLES.ADMIN]: "bg-success",
  [ROLES.CASHIER]: "bg-secondary",
  [ROLES.MANAGER]: "bg-info",
 
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
    <header className="bg-white shadow-sm p-3 d-flex justify-content-between align-items-center"
     style={{position:"sticky", top: 0, zIndex: 1020}}
    >
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
            <i><FontAwesomeIcon icon={faChevronDown} /></i>
          </div>

          <div className={`dropdown-menu dropdown-menu-end ${showDropdown ? "show" : ""}`}>
            <button className="dropdown-item d-flex align-items-center" onClick={logout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
