import { UserRole, type RoleUuid } from "./roles";

export type User = {
  id: string;
  fullname: string;
  email: string; 
  password?: string;
  role?: string;
  enabled: boolean;
  createdAt: string;
  token?: string;
  permissions?: string[];
  accessToken?: string;
}

export interface CreateUserRequest {
 fullname: string
  email: string
  password: string
  role: UserRole
  roleId: RoleUuid
  enabled: boolean
  createdAt: string
}

export interface UpdateUserRequest {
  fullname?: string
  email?: string
  role?: UserRole
  roleId?: RoleUuid
  status?: "active" | "inactive"
}

export interface RolePermissions {
  role: UserRole
  roleId: RoleUuid
  fullname: string
  description: string
  permissions: string[]
  canManage: UserRole[]
}

export const getRoleName = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return "Administrador"
    case UserRole.MANAGER:
      return "Propietario"
    case UserRole.CASHIER:
      return "Cajero"
  
    default:
      return role
  }
}
