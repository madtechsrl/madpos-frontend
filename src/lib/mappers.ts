export const ROLE_IDS = {
  SUPER_ADMIN: "195dfc25-f5d9-49ed-bed7-82409fe2e7df",
  ADMIN: "7c9e6679-7425-40de-944b-e07fc1f907cb",
  CASHIER: "7c9e6679-7425-40de-944b-e07fc1f907c9",
}

export type LegacyUserRole = "propietario" | "administrador" | "cajero"

export function mapRoleIdToRole(roleId: string): LegacyUserRole {
  if (roleId === ROLE_IDS.SUPER_ADMIN) return "propietario"
  if (roleId === ROLE_IDS.ADMIN) return "administrador"
  return "cajero"
}

export function mapRoleToRoleId(role: LegacyUserRole): string {
  if (role === "propietario") return ROLE_IDS.SUPER_ADMIN
  if (role === "administrador") return ROLE_IDS.ADMIN
  return ROLE_IDS.CASHIER
}

export function getRoleDisplayName(role: LegacyUserRole): string {
  if (role === "propietario") return "Propietario"
  if (role === "administrador") return "Administrador"
  return "Cajero"
}

export function getRoleBadgeColor(role: LegacyUserRole): string {
  if (role === "propietario") return "danger"
  if (role === "administrador") return "primary"
  return "secondary"
}
