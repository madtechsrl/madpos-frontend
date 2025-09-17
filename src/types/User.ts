import { type RoleUuid, ROLES } from "./roles";

export type User = {
  id: string;
  fullname: string;
  email: string; 
  password?: string;
  role?: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  token?: string;
  permissions?: string[];
  accessToken?: string;
}

export interface CreateUserRequest {
 fullname: string
  email: string
  password?: string
  role: string
  enabled: boolean
 
}

export interface UpdateUserRequest {
  fullname?: string
  email?: string
  role?: string
  status?: "active" | "inactive"
}

export interface RolePermissions {
  role: string  
  fullname: string
  description: string
  permissions: string[]
  canManage: string[]
}

export const getRoleName = (role: RoleUuid): string => {
  switch (role) {
    case ROLES.ADMIN:
      return "Administrador"
    case ROLES.MANAGER:
      return "Propietario"
    case ROLES.CASHIER:
      return "Cajero"
  
    default:
      return role
  }
}
