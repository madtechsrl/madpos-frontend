

export type User = {
  id: string;
  email: string;
  fullname: string;
  password?: string;
  role?: string;
  enabled: boolean;
  createdAt: string;
  token?: string;
  permissions?: string[];
  accessToken?: string;
}

export const ROLES = {
  ADMIN: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  USER: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  CAJERO: "7c9e6679-7425-40de-944b-e07fc1f907c9",
  ALMACENISTA: "7c9e6679-7425-40de-944b-e07fc1f907ca",
  PROPIETARIO: "7c9e6679-7425-40de-944b-e07fc1f907cb",
} as const

export type UserRoleId = (typeof ROLES)[keyof typeof ROLES]

export type UserRole = "ADMIN" | "USER" | "CAJERO" | "ALMACENISTA" | "PROPIETARIO"



export interface CreateUserRequest {
  name: string
  email: string
  password: string
  role: UserRole
  roleId: UserRoleId
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  role?: UserRole
  roleId?: UserRoleId
  status?: "active" | "inactive"
}

export interface RolePermissions {
  role: UserRole
  roleId: UserRoleId
  name: string
  description: string
  permissions: string[]
  canManage: UserRole[]
}

// Helper functions to work with roles
export const getRoleById = (roleId: UserRoleId): UserRole => {
  const roleEntry = Object.entries(ROLES).find(([_, id]) => id === roleId)
  return roleEntry ? (roleEntry[0].toUpperCase() as UserRole) : "USER"
}

export const getRoleIdByRole = (role: UserRole): UserRoleId => {
  const roleKey = role.toUpperCase() as keyof typeof ROLES
  return ROLES[roleKey] || ROLES.USER
}

export const getRoleName = (role: UserRole): string => {
  switch (role) {
    case "ADMIN":
      return "Administrador"
    case "PROPIETARIO":
      return "Propietario"
    case "CAJERO":
      return "Cajero"
    case "ALMACENISTA":
      return "Almacenista"
    case "USER":
      return "Usuario"
    default:
      return role
  }
}
