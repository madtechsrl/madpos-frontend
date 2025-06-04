import { UserRole } from "../types/User"

// Define role IDs based on your system
export const ROLE_IDS = {
  SUPER_ADMIN: "f47ac10b-58cc-4372-a567-0e02b2c3d479", // Propietario
  ADMIN: "7c9e6679-7425-40de-944b-e07fc1f90ae7", // Administrador
  CASHIER: "3c7e6679-7425-40de-944b-e07fc1f90ae8", // Cajero
}

// Map role IDs to role names
export function mapRoleIdToRole(roleId: string): UserRole {
  switch (roleId) {
    case ROLE_IDS.SUPER_ADMIN:
      return UserRole.propietario
    case ROLE_IDS.ADMIN:
      return UserRole.administrador
    default:
      return UserRole.cajero
  }
}

// Map role names to role IDs
export function mapRoleToRoleId(role: UserRole): string {
  switch (role) {
    case UserRole.propietario:
      return ROLE_IDS.SUPER_ADMIN
    case UserRole.administrador:
      return ROLE_IDS.ADMIN
    default:
      return ROLE_IDS.CASHIER
  }
}

// Get role display name
export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case UserRole.propietario:
      return "Propietario"
    case UserRole.administrador:
      return "Administrador"
    case UserRole.cajero:
      return "Cajero"
    default:
      return "Usuario"
  }
}

// Get role badge color
export function getRoleBadgeColor(role: UserRole): string {
  switch (role) {
    case UserRole.propietario:
      return "danger"
    case UserRole.administrador:
      return "primary"
    case UserRole.cajero:
      return "secondary"
    default:
      return "secondary"
  }
}
