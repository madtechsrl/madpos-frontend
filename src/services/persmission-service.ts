// Permissions Service - Define and manage role-based permissions
import { ROLES, type RoleUuid } from "../types/roles";

// Permission categories and their specific permissions
export enum PermissionCategory {
  VENTAS = "ventas",
  PRODUCTOS = "productos",
  CLIENTES = "clientes",
  USUARIOS = "usuarios",
  REPORTES = "reportes",
  CONFIGURACION = "configuracion",
  FINANZAS = "finanzas",
}

export enum Permission {
  // Ventas
  VENTAS_VER = "ventas.ver",
  VENTAS_CREAR = "ventas.crear",
  VENTAS_EDITAR = "ventas.editar",
  VENTAS_ELIMINAR = "ventas.eliminar",
  VENTAS_DESCUENTO = "ventas.descuento",
  VENTAS_ANULAR = "ventas.anular",
  
  // Productos
  PRODUCTOS_VER = "productos.ver",
  PRODUCTOS_CREAR = "productos.crear",
  PRODUCTOS_EDITAR = "productos.editar",
  PRODUCTOS_ELIMINAR = "productos.eliminar",
  PRODUCTOS_PRECIO = "productos.precio",
  PRODUCTOS_STOCK = "productos.stock",
  
  // Clientes
  CLIENTES_VER = "clientes.ver",
  CLIENTES_CREAR = "clientes.crear",
  CLIENTES_EDITAR = "clientes.editar",
  CLIENTES_ELIMINAR = "clientes.eliminar",
  CLIENTES_CREDITO = "clientes.credito",
  
  // Usuarios
  USUARIOS_VER = "usuarios.ver",
  USUARIOS_CREAR = "usuarios.crear",
  USUARIOS_EDITAR = "usuarios.editar",
  USUARIOS_ELIMINAR = "usuarios.eliminar",
  USUARIOS_PERMISOS = "usuarios.permisos",
  
  // Reportes
  REPORTES_VENTAS = "reportes.ventas",
  REPORTES_INVENTARIO = "reportes.inventario",
  REPORTES_CLIENTES = "reportes.clientes",
  REPORTES_FINANZAS = "reportes.finanzas",
  REPORTES_EXPORTAR = "reportes.exportar",
  
  // Configuracion
  CONFIG_TIENDA = "config.tienda",
  CONFIG_IMPUESTOS = "config.impuestos",
  CONFIG_RECIBOS = "config.recibos",
  CONFIG_BACKUP = "config.backup",
  
  // Finanzas
  FINANZAS_VER = "finanzas.ver",
  FINANZAS_CAJA = "finanzas.caja",
  FINANZAS_GASTOS = "finanzas.gastos",
  FINANZAS_CIERRE = "finanzas.cierre",
}

// Permission metadata for display
export const permissionMetadata: Record<Permission, { label: string; description: string; category: PermissionCategory }> = {
  // Ventas
  [Permission.VENTAS_VER]: { label: "Ver Ventas", description: "Ver historial de ventas", category: PermissionCategory.VENTAS },
  [Permission.VENTAS_CREAR]: { label: "Crear Ventas", description: "Realizar nuevas ventas", category: PermissionCategory.VENTAS },
  [Permission.VENTAS_EDITAR]: { label: "Editar Ventas", description: "Modificar ventas existentes", category: PermissionCategory.VENTAS },
  [Permission.VENTAS_ELIMINAR]: { label: "Eliminar Ventas", description: "Eliminar ventas del sistema", category: PermissionCategory.VENTAS },
  [Permission.VENTAS_DESCUENTO]: { label: "Aplicar Descuentos", description: "Aplicar descuentos en ventas", category: PermissionCategory.VENTAS },
  [Permission.VENTAS_ANULAR]: { label: "Anular Ventas", description: "Anular ventas completadas", category: PermissionCategory.VENTAS },
  
  // Productos
  [Permission.PRODUCTOS_VER]: { label: "Ver Productos", description: "Ver catalogo de productos", category: PermissionCategory.PRODUCTOS },
  [Permission.PRODUCTOS_CREAR]: { label: "Crear Productos", description: "Agregar nuevos productos", category: PermissionCategory.PRODUCTOS },
  [Permission.PRODUCTOS_EDITAR]: { label: "Editar Productos", description: "Modificar productos existentes", category: PermissionCategory.PRODUCTOS },
  [Permission.PRODUCTOS_ELIMINAR]: { label: "Eliminar Productos", description: "Eliminar productos del catalogo", category: PermissionCategory.PRODUCTOS },
  [Permission.PRODUCTOS_PRECIO]: { label: "Modificar Precios", description: "Cambiar precios de productos", category: PermissionCategory.PRODUCTOS },
  [Permission.PRODUCTOS_STOCK]: { label: "Gestionar Stock", description: "Ajustar inventario de productos", category: PermissionCategory.PRODUCTOS },
  
  // Clientes
  [Permission.CLIENTES_VER]: { label: "Ver Clientes", description: "Ver lista de clientes", category: PermissionCategory.CLIENTES },
  [Permission.CLIENTES_CREAR]: { label: "Crear Clientes", description: "Registrar nuevos clientes", category: PermissionCategory.CLIENTES },
  [Permission.CLIENTES_EDITAR]: { label: "Editar Clientes", description: "Modificar datos de clientes", category: PermissionCategory.CLIENTES },
  [Permission.CLIENTES_ELIMINAR]: { label: "Eliminar Clientes", description: "Eliminar clientes del sistema", category: PermissionCategory.CLIENTES },
  [Permission.CLIENTES_CREDITO]: { label: "Gestionar Credito", description: "Administrar credito de clientes", category: PermissionCategory.CLIENTES },
  
  // Usuarios
  [Permission.USUARIOS_VER]: { label: "Ver Usuarios", description: "Ver lista de usuarios", category: PermissionCategory.USUARIOS },
  [Permission.USUARIOS_CREAR]: { label: "Crear Usuarios", description: "Crear nuevos usuarios", category: PermissionCategory.USUARIOS },
  [Permission.USUARIOS_EDITAR]: { label: "Editar Usuarios", description: "Modificar datos de usuarios", category: PermissionCategory.USUARIOS },
  [Permission.USUARIOS_ELIMINAR]: { label: "Eliminar Usuarios", description: "Eliminar usuarios del sistema", category: PermissionCategory.USUARIOS },
  [Permission.USUARIOS_PERMISOS]: { label: "Gestionar Permisos", description: "Configurar permisos de roles", category: PermissionCategory.USUARIOS },
  
  // Reportes
  [Permission.REPORTES_VENTAS]: { label: "Reportes de Ventas", description: "Ver reportes de ventas", category: PermissionCategory.REPORTES },
  [Permission.REPORTES_INVENTARIO]: { label: "Reportes de Inventario", description: "Ver reportes de inventario", category: PermissionCategory.REPORTES },
  [Permission.REPORTES_CLIENTES]: { label: "Reportes de Clientes", description: "Ver reportes de clientes", category: PermissionCategory.REPORTES },
  [Permission.REPORTES_FINANZAS]: { label: "Reportes Financieros", description: "Ver reportes financieros", category: PermissionCategory.REPORTES },
  [Permission.REPORTES_EXPORTAR]: { label: "Exportar Reportes", description: "Exportar reportes a Excel/PDF", category: PermissionCategory.REPORTES },
  
  // Configuracion
  [Permission.CONFIG_TIENDA]: { label: "Configurar Tienda", description: "Modificar datos de la tienda", category: PermissionCategory.CONFIGURACION },
  [Permission.CONFIG_IMPUESTOS]: { label: "Configurar Impuestos", description: "Configurar tasas de impuestos", category: PermissionCategory.CONFIGURACION },
  [Permission.CONFIG_RECIBOS]: { label: "Configurar Recibos", description: "Personalizar formato de recibos", category: PermissionCategory.CONFIGURACION },
  [Permission.CONFIG_BACKUP]: { label: "Backup del Sistema", description: "Realizar copias de seguridad", category: PermissionCategory.CONFIGURACION },
  
  // Finanzas
  [Permission.FINANZAS_VER]: { label: "Ver Finanzas", description: "Ver informacion financiera", category: PermissionCategory.FINANZAS },
  [Permission.FINANZAS_CAJA]: { label: "Gestionar Caja", description: "Abrir/cerrar caja", category: PermissionCategory.FINANZAS },
  [Permission.FINANZAS_GASTOS]: { label: "Registrar Gastos", description: "Registrar gastos operativos", category: PermissionCategory.FINANZAS },
  [Permission.FINANZAS_CIERRE]: { label: "Cierre de Caja", description: "Realizar cierre de caja", category: PermissionCategory.FINANZAS },
}

// Category metadata for display
export const categoryMetadata: Record<PermissionCategory, { label: string; icon: string; description: string }> = {
  [PermissionCategory.VENTAS]: { label: "Ventas", icon: "ShoppingCart", description: "Permisos relacionados con el proceso de ventas" },
  [PermissionCategory.PRODUCTOS]: { label: "Productos", icon: "Package", description: "Permisos para gestion de productos e inventario" },
  [PermissionCategory.CLIENTES]: { label: "Clientes", icon: "Users", description: "Permisos para gestion de clientes" },
  [PermissionCategory.USUARIOS]: { label: "Usuarios", icon: "UserCog", description: "Permisos para administracion de usuarios" },
  [PermissionCategory.REPORTES]: { label: "Reportes", icon: "BarChart3", description: "Permisos para acceso a reportes" },
  [PermissionCategory.CONFIGURACION]: { label: "Configuracion", icon: "Settings", description: "Permisos de configuracion del sistema" },
  [PermissionCategory.FINANZAS]: { label: "Finanzas", icon: "DollarSign", description: "Permisos financieros y de caja" },
}

// Default permissions for each role
export type RolePermissions = {
  roleId: RoleUuid
  roleName: string
  permissions: Permission[]
  isEditable: boolean
}

// Default permissions configuration
const defaultRolePermissions: Record<RoleUuid, Permission[]> = {
  [ROLES.ADMIN]: Object.values(Permission), // Admin has all permissions
  [ROLES.MANAGER]: [
    // Ventas
    Permission.VENTAS_VER,
    Permission.VENTAS_CREAR,
    Permission.VENTAS_EDITAR,
    Permission.VENTAS_DESCUENTO,
    Permission.VENTAS_ANULAR,
    // Productos
    Permission.PRODUCTOS_VER,
    Permission.PRODUCTOS_CREAR,
    Permission.PRODUCTOS_EDITAR,
    Permission.PRODUCTOS_PRECIO,
    Permission.PRODUCTOS_STOCK,
    // Clientes
    Permission.CLIENTES_VER,
    Permission.CLIENTES_CREAR,
    Permission.CLIENTES_EDITAR,
    Permission.CLIENTES_CREDITO,
    // Reportes
    Permission.REPORTES_VENTAS,
    Permission.REPORTES_INVENTARIO,
    Permission.REPORTES_CLIENTES,
    Permission.REPORTES_EXPORTAR,
    // Finanzas
    Permission.FINANZAS_VER,
    Permission.FINANZAS_CAJA,
    Permission.FINANZAS_GASTOS,
    Permission.FINANZAS_CIERRE,
  ],
  [ROLES.CASHIER]: [
    // Ventas
    Permission.VENTAS_VER,
    Permission.VENTAS_CREAR,
    // Productos
    Permission.PRODUCTOS_VER,
    // Clientes
    Permission.CLIENTES_VER,
    Permission.CLIENTES_CREAR,
    // Finanzas
    Permission.FINANZAS_CAJA,
  ],
}

// Local storage key
const PERMISSIONS_STORAGE_KEY = "role_permissions"

// Get saved permissions from localStorage or use defaults
function getSavedPermissions(): Record<RoleUuid, Permission[]> {
  if (typeof window === "undefined") return defaultRolePermissions
  
  try {
    const saved = localStorage.getItem(PERMISSIONS_STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error("Error loading permissions:", error)
  }
  
  return defaultRolePermissions
}

// Save permissions to localStorage
function savePermissions(permissions: Record<RoleUuid, Permission[]>): void {
  if (typeof window === "undefined") return
  
  try {
    localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(permissions))
  } catch (error) {
    console.error("Error saving permissions:", error)
  }
}

// Get all role permissions
export async function fetchRolePermissions(): Promise<RolePermissions[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  
  const savedPermissions = getSavedPermissions()
  
  return [
    {
      roleId: ROLES.ADMIN,
      roleName: "Administrador",
      permissions: Object.values(Permission), // Always all permissions
      isEditable: false, // Admin permissions cannot be edited
    },
    {
      roleId: ROLES.MANAGER,
      roleName: "Gerente",
      permissions: savedPermissions[ROLES.MANAGER] || defaultRolePermissions[ROLES.MANAGER],
      isEditable: true,
    },
    {
      roleId: ROLES.CASHIER,
      roleName: "Cajero",
      permissions: savedPermissions[ROLES.CASHIER] || defaultRolePermissions[ROLES.CASHIER],
      isEditable: true,
    },
  ]
}

// Update permissions for a role
export async function updateRolePermissions(roleId: RoleUuid, permissions: Permission[]): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  
  if (roleId === ROLES.ADMIN) {
    console.log("Cannot modify admin permissions")
    return false
  }
  
  const currentPermissions = getSavedPermissions()
  currentPermissions[roleId] = permissions
  savePermissions(currentPermissions)
  
  console.log(`Updated permissions for role ${roleId}:`, permissions)
  return true
}

// Check if a role has a specific permission
export function roleHasPermission(roleId: RoleUuid, permission: Permission): boolean {
  if (roleId === ROLES.ADMIN) return true
  
  const savedPermissions = getSavedPermissions()
  return savedPermissions[roleId]?.includes(permission) || false
}

// Get permissions by category
export function getPermissionsByCategory(category: PermissionCategory): Permission[] {
  return Object.entries(permissionMetadata)
    .filter(([_, meta]) => meta.category === category)
    .map(([perm]) => perm as Permission)
}

// Reset permissions to defaults
export async function resetRolePermissions(roleId: RoleUuid): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  
  if (roleId === ROLES.ADMIN) return false
  
  const currentPermissions = getSavedPermissions()
  currentPermissions[roleId] = defaultRolePermissions[roleId]
  savePermissions(currentPermissions)
  
  console.log(`Reset permissions for role ${roleId} to defaults`)
  return true
}

// Reset all permissions to defaults
export async function resetAllPermissions(): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  
  if (typeof window !== "undefined") {
    localStorage.removeItem(PERMISSIONS_STORAGE_KEY)
  }
  
  console.log("Reset all permissions to defaults")
  return true
}
