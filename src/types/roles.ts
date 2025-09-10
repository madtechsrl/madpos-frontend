// types/roles.ts

// Enum lógico para usar en el frontend (tipo seguro)
export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  CASHIER = "CASHIER",
}

// UUIDs fijos como los define el backend/API
export const ROLES = {
  [UserRole.ADMIN]: "7c9e6679-7425-40de-944b-e07fc1f907cb",
  [UserRole.MANAGER]: "195dfc25-f5d9-49ed-bed7-82409fe2e7df",
  [UserRole.CASHIER]: "7c9e6679-7425-40de-944b-e07fc1f907c9",
} as const;

export type RoleUuid = typeof ROLES[UserRole];


// Mapea UUID → UserRole
export function mapUuidToRole(uuid: string): UserRole {
  const entry = Object.entries(ROLES).find(([, val]) => val === uuid);
  if (!entry) throw new Error(`UUID desconocido: ${uuid}`);
  return entry[0] as UserRole;
}

// Mapea UserRole → UUID
export function mapRoleToUuid(role: UserRole): RoleUuid {
  return ROLES[role];
}

// Configuración extendida de cada rol
export const roleConfig = {
  [UserRole.ADMIN]: {
    uuid: ROLES.ADMIN,
    code: "ADMIN",
    label: "Administrador",
    description:
      "Acceso a la mayoría de funciones administrativas, excepto configuraciones financieras sensibles.",
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
  [UserRole.MANAGER]: {
    uuid: ROLES.MANAGER,
    code: "PROPIETARIO",
    label: "Propietario",
    description:
      "Acceso completo al sistema, incluyendo configuraciones financieras y reportes avanzados.",
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
    canManage: [UserRole.MANAGER, UserRole.CASHIER, UserRole.ADMIN],
    priority: 4,
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
} as const;

export type RoleConfig = (typeof roleConfig)[UserRole];

// ==================== UTILIDADES ====================

// Mostrar nombre del rol
export function getRoleDisplayName(role: UserRole): string {
  return roleConfig[role]?.label ?? "Usuario";
}

// Color para badge Bootstrap
export function getRoleBadgeColor(role: UserRole): string {
  return roleConfig[role]?.badgeColor ?? "secondary";
}

// Descripción del rol
export function getRoleDescription(role: UserRole): string {
  return roleConfig[role]?.description ?? "Rol de usuario básico";
}

// Permisos del rol
export function getRolePermissions(role: UserRole): string[] {
  return [...(roleConfig[role]?.permissions ?? [])];
}

// Validar permiso específico
export function hasPermission(role: UserRole, permission: string): boolean {
  return getRolePermissions(role).includes(permission);
}

// Comparar prioridades de roles
export function isHigherRole(role1: UserRole, role2: UserRole): boolean {
  return roleConfig[role1].priority > roleConfig[role2].priority;
}

// Configuración general
export function getRoleConfig(role: UserRole): RoleConfig {
  return roleConfig[role];
}
