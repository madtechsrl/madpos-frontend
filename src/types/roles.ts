

// Role UUIDs as provided by the API
export const ROLES = {
 CASHIER : "7c9e6679-7425-40de-944b-e07fc1f907c9",
 MANAGER : "195dfc25-f5d9-49ed-bed7-82409fe2e7df",
 ADMIN : "7c9e6679-7425-40de-944b-e07fc1f907cb",
} as const

export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  CASHIER = "CASHIER",
}

export enum RoleEnum {
  ADMIN = "7c9e6679-7425-40de-944b-e07fc1f907cb",
  MANAGER = "195dfc25-f5d9-49ed-bed7-82409fe2e7df",
  CASHIER = "7c9e6679-7425-40de-944b-e07fc1f907c9",
 
}


export type UserRoleId =
  | RoleEnum.ADMIN
  | RoleEnum.MANAGER
  | RoleEnum.CASHIER  



  export const getRoleById = (roleId: UserRoleId): UserRole => {
  const match = Object.entries(ROLES).find(([, value]) => value === roleId)
  if(!match) throw new Error (`Unknown role id: ${roleId}`);
  return  match[0] as UserRole;
}

export const getRoleIdByName = (role: UserRole): UserRoleId => {  
  return RoleEnum[role]
}

export function mapRoleToUUID(role: UserRole): string {
  return RoleEnum[role];
}

// Mapping from UUID to role code
export const roleUuidToCode = {
  "7c9e6679-7425-40de-944b-e07fc1f907cb": "ADMIN",
  "195dfc25-f5d9-49ed-bed7-82409fe2e7df": "MANAGER",
  "7c9e6679-7425-40de-944b-e07fc1f907c9": "CASHIER",  
} as const


export const roleConfig = {
  [UserRole.MANAGER]: {
    uuid: ROLES.MANAGER,
    code: "PROPIETARIO",
    label: "Propietario",
    description: "Acceso completo al sistema, incluyendo configuraciones financieras y reportes avanzados.",
    badgeColor: "danger",
    permissions: [
      "dashboard",
      "productos",
      "pedidos",
      "clientes",
      "transacciones",
      "finanzas",
      "estadisticas",    
      "catalogo",
      "almacen",
    ],
    canManage: [ UserRole.MANAGER, UserRole.CASHIER, UserRole.ADMIN],
    priority: 4, // Highest priority
  },
  [UserRole.ADMIN]: {
    uuid: ROLES.ADMIN,
    code: "ADMIN",
    label: "Administrador",
    description: "Acceso a la mayoría de funciones administrativas, excepto configuraciones financieras sensibles.",
    badgeColor: "primary",
    permissions: [
      "dashboard",
      "productos",
      "pedidos",
      "clientes",
      "transacciones",
      "estadisticas",
      "usuarios",
      "configuraciones",
      "catalogo",
      "almacen",
    ],
    canManage: [UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER],
    priority: 5,
  },

  [UserRole.CASHIER]: {
    uuid: ROLES.CASHIER,
    code: "CAJERO",
    label: "Cajero",
    description: "Acceso limitado a ventas, pedidos y clientes.",
    badgeColor: "success",
    permissions: ["dashboard", "pedidos", "clientes"],
    canManage: [],
    priority: 2,
  },
  
} as const

// Add a dedicated object for easy access to display names
export const roleDisplayNames = {
  [UserRole.MANAGER]: "Propietario",
  [UserRole.ADMIN]: "Administrador", 
  [UserRole.CASHIER]: "Cajero",
 
} as const
// Helper functions for role management
export const badgeClasses = {
  [ROLES.ADMIN]: "bg-success",
  [ROLES.MANAGER]: "bg-secondary",
  [ROLES.CASHIER]: "bg-info",
} as const
/**
 * Convert UUID from API to internal UserRole enum
 */
export function mapUuidToRole(uuid: string): UserRole {
  const roleCode = roleUuidToCode[uuid as keyof typeof roleUuidToCode];

  // if (!roleCode || !(roleCode in UserRole)) {
  //   console.warn(`Unknown role UUID: ${uuid}, defaulting to USER`);
  //   return UserRole.USER;
  // }

  return UserRole[roleCode as keyof typeof UserRole];
}


/**
 * Convert internal UserRole enum to UUID for API calls
 */
export function mapRoleToUuid(role: UserRole): string {
  const config = roleConfig[role]
  if (!config) {
    console.warn(`Unknown role: ${role}, defaulting to USER UUID`)
    return ROLES.CASHIER
  }
  return config.uuid
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  return roleConfig[role]?.label || "Usuario"
}

/**
 * Get role badge color for Bootstrap classes
 */
export function getRoleBadgeColor(role: UserRole): string {
  return roleConfig[role]?.badgeColor || "secondary"
}

/**
 * Get role description
 */
export function getRoleDescription(role: UserRole): string {
  return roleConfig[role]?.description || "Rol de usuario básico"
}

/**
 * Get permissions for a role
 */
export function getRolePermissions(role: UserRole): string[] {
  return [...(roleConfig[role]?.permissions ?? [])]
}

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: string): boolean {
  const permissions = getRolePermissions(role)
  return permissions.includes(permission)
}


export function isHigherRole(role1: UserRole, role2: UserRole): boolean {
  return roleConfig[role1].priority > roleConfig[role2].priority
}

/**
 * Get role configuration
 */
export function getRoleConfig(role: UserRole) {
  return roleConfig[role] ?? {
    uuid: "",
    code: "UNKNOWN",
    label: "Rol desconocido",
    description: "Rol no reconocido por el sistema.",
    badgeColor: "secondary",
    permissions: [],
    canManage: [],
    priority: 0,
  };
}

/**
 * Validate if UUID is a valid role
//  */
// export function isValidRoleUuid(uuid: string): boolean {
//   return uuid in roleUuidToCode
// }

/**
 * Get all role UUIDs
 */


/**
 * Get role statistics for display
 */


// Export types for TypeScript
// export type RoleCode = keyof typeof roleCodeToUuid
export type RoleUuid = (typeof ROLES)[keyof typeof ROLES]
export type RoleConfig = (typeof roleConfig)[UserRole]
 