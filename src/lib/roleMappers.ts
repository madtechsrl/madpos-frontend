// src/utils/roleMapper.ts

import { UserRole } from "../types/roles";

export enum RoleEnum {
  ADMIN = "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  USER = "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  CAJERO = "7c9e6679-7425-40de-944b-e07fc1f907c9",
  ALMACENISTA = "7c9e6679-7425-40de-944b-e07fc1f907ca",
  PROPIETARIO = "7c9e6679-7425-40de-944b-e07fc1f907cb",
}

// Convert backend UUID role to frontend enum
export function mapRoleFromUUID(uuid: string): UserRole | null {
  switch (uuid) {
    case RoleEnum.ADMIN:
      return UserRole.ADMIN;
    case RoleEnum.USER:
      return UserRole.USER;
    case RoleEnum.CAJERO:
      return UserRole.CAJERO;
    case RoleEnum.ALMACENISTA:
      return UserRole.ALMACENISTA;
    case RoleEnum.PROPIETARIO:
      return UserRole.PROPIETARIO;
    default:
      return null;
  }
}

// Optional: Convert frontend role to backend UUID (for saving to DB)
export function mapRoleToUUID(role: UserRole): string {
  return RoleEnum[role];
}

