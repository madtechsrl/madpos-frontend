"use client"

import React from "react"
import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faBox,
  faUser,
  faCog,
  faBarChart,
  faDollarSign,
  faShield,
  faSave,
  faRotateCcw,
  faCheck,
  faX,
  faLock,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons"
import {
  fetchRolePermissions,
  updateRolePermissions,
  resetRolePermissions,
  Permission,
  PermissionCategory,
  permissionMetadata,
  categoryMetadata,
  getPermissionsByCategory,
  type RolePermissions,
} from "../../services/persmission-service"
import { ROLES, type RoleUuid } from "../../types/roles"

// Icon mapping for categories
const categoryIcons: Record<PermissionCategory, React.ReactNode> = {
  [PermissionCategory.VENTAS]: <FontAwesomeIcon icon={faShoppingCart} className="h-5 w-5"/>,
  [PermissionCategory.PRODUCTOS]: <FontAwesomeIcon icon={faBox} className="h-5 w-5" />,
  [PermissionCategory.CLIENTES]: <FontAwesomeIcon icon= {faUser} className="h-5 w-5" />,
  [PermissionCategory.USUARIOS]: <FontAwesomeIcon icon= {faBox} className="h-5 w-5" />,
  [PermissionCategory.REPORTES]: <FontAwesomeIcon icon= {faBarChart} className="h-5 w-5" />,
  [PermissionCategory.CONFIGURACION]: <FontAwesomeIcon icon={faCog}  className="h-5 w-5" />,
  [PermissionCategory.FINANZAS]: <FontAwesomeIcon icon= {faTriangleExclamation} className="h-5 w-5" />,
}

export function PermissionsManagement() {
  const [rolePermissions, setRolePermissions] = useState<RolePermissions[]>([])
  const [selectedRole, setSelectedRole] = useState<RoleUuid>(ROLES.MANAGER)
  const [editedPermissions, setEditedPermissions] = useState<Permission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Load permissions on mount
  useEffect(() => {
    loadPermissions()
  }, [])

  // Update edited permissions when role changes
  useEffect(() => {
    const currentRole = rolePermissions.find((r) => r.roleId === selectedRole)
    if (currentRole) {
      setEditedPermissions([...currentRole.permissions])
      setHasChanges(false)
    }
  }, [selectedRole, rolePermissions])

  const loadPermissions = async () => {
    setIsLoading(true)
    try {
      const permissions = await fetchRolePermissions()
      setRolePermissions(permissions)
      
      const currentRole = permissions.find((r) => r.roleId === selectedRole)
      if (currentRole) {
        setEditedPermissions([...currentRole.permissions])
      }
    } catch (error) {
      console.error("Error loading permissions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePermissionToggle = (permission: Permission) => {
    const currentRole = rolePermissions.find((r) => r.roleId === selectedRole)
    if (!currentRole?.isEditable) return

    setEditedPermissions((prev) => {
      const newPermissions = prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
      
      // Check if there are changes
      const originalPermissions = currentRole?.permissions || []
      const hasChanges = 
        newPermissions.length !== originalPermissions.length ||
        newPermissions.some((p) => !originalPermissions.includes(p))
      setHasChanges(hasChanges)
      
      return newPermissions
    })
  }

  const handleCategoryToggle = (category: PermissionCategory, checked: boolean) => {
    const currentRole = rolePermissions.find((r) => r.roleId === selectedRole)
    if (!currentRole?.isEditable) return

    const categoryPermissions = getPermissionsByCategory(category)
    
    setEditedPermissions((prev) => {
      let newPermissions: Permission[]
      
      if (checked) {
        // Add all category permissions
        newPermissions = [...new Set([...prev, ...categoryPermissions])]
      } else {
        // Remove all category permissions
        newPermissions = prev.filter((p) => !categoryPermissions.includes(p))
      }
      
      const originalPermissions = currentRole?.permissions || []
      const hasChanges = 
        newPermissions.length !== originalPermissions.length ||
        newPermissions.some((p) => !originalPermissions.includes(p))
      setHasChanges(hasChanges)
      
      return newPermissions
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const success = await updateRolePermissions(selectedRole, editedPermissions)
      if (success) {
        await loadPermissions()
        setHasChanges(false)
        setSuccessMessage(`Permisos del rol "${getRoleName(selectedRole)}" guardados correctamente`)
        setShowSuccessAlert(true)
        setTimeout(() => setShowSuccessAlert(false), 4000)
      }
    } catch (error) {
      console.error("Error saving permissions:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = async () => {
    if (!confirm("¿Estas seguro de restablecer los permisos a los valores predeterminados?")) return
    
    setIsSaving(true)
    try {
      const success = await resetRolePermissions(selectedRole)
      if (success) {
        await loadPermissions()
        setHasChanges(false)
        setSuccessMessage(`Permisos del rol "${getRoleName(selectedRole)}" restablecidos`)
        setShowSuccessAlert(true)
        setTimeout(() => setShowSuccessAlert(false), 4000)
      }
    } catch (error) {
      console.error("Error resetting permissions:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelChanges = () => {
    const currentRole = rolePermissions.find((r) => r.roleId === selectedRole)
    if (currentRole) {
      setEditedPermissions([...currentRole.permissions])
      setHasChanges(false)
    }
  }

  const getRoleName = (roleId: RoleUuid): string => {
    switch (roleId) {
      case ROLES.ADMIN:
        return "Administrador"
      case ROLES.MANAGER:
        return "Gerente"
      case ROLES.CASHIER:
        return "Cajero"
      default:
        return "Desconocido"
    }
  }

  const getRoleBadgeVariant = (roleId: RoleUuid): "default" | "secondary" | "destructive" => {
    switch (roleId) {
      case ROLES.ADMIN:
        return "destructive"
      case ROLES.MANAGER:
        return "default"
      case ROLES.CASHIER:
        return "secondary"
      default:
        return "secondary"
    }
  }

  const isCategoryFullySelected = (category: PermissionCategory): boolean => {
    const categoryPermissions = getPermissionsByCategory(category)
    return categoryPermissions.every((p) => editedPermissions.includes(p))
  }

  const isCategoryPartiallySelected = (category: PermissionCategory): boolean => {
    const categoryPermissions = getPermissionsByCategory(category)
    const selectedCount = categoryPermissions.filter((p) => editedPermissions.includes(p)).length
    return selectedCount > 0 && selectedCount < categoryPermissions.length
  }

  const getCategorySelectedCount = (category: PermissionCategory): string => {
    const categoryPermissions = getPermissionsByCategory(category)
    const selectedCount = categoryPermissions.filter((p) => editedPermissions.includes(p)).length
    return `${selectedCount}/${categoryPermissions.length}`
  }

  const currentRole = rolePermissions.find((r) => r.roleId === selectedRole)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-muted-foreground">Cargando permisos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Success Alert */}
      {showSuccessAlert && (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-200">Operacion Exitosa</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">
            {successMessage}
          </AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-green-100 dark:hover:bg-green-800"
            onClick={() => setShowSuccessAlert(false)}
          >
            <FontAwesomeIcon icon= {faX} className="h-4 w-4" />
          </Button>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FontAwesomeIcon icon={faShield} className="h-6 w-6" />
            Gestion de Permisos
          </h2>
          <p className="text-muted-foreground mt-1">
            Configura los permisos de acceso para cada rol del sistema
          </p>
        </div>
      </div>

      {/* Role Selection Tabs */}
      <Tabs value={selectedRole} onValueChange={(value) => setSelectedRole(value as RoleUuid)}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          {rolePermissions.map((role) => (
            <TabsTrigger
              key={role.roleId}
              value={role.roleId}
              className="flex items-center gap-2"
              disabled={hasChanges && role.roleId !== selectedRole}
            >
              {!role.isEditable && <FontAwesomeIcon icon= {faLock} className="h-3 w-3" />}
              {role.roleName}
              <Badge variant={getRoleBadgeVariant(role.roleId)} className="ml-1 text-xs">
                {role.permissions.length}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {rolePermissions.map((role) => (
          <TabsContent key={role.roleId} value={role.roleId} className="space-y-4">
            {/* Role Info Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {role.roleName}
                      <Badge variant={getRoleBadgeVariant(role.roleId)}>
                        {role.permissions.length} permisos
                      </Badge>
                      {!role.isEditable && (
                        <Badge variant="outline" className="ml-2">
                          <Lock className="h-3 w-3 mr-1" />
                          Solo lectura
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {role.isEditable
                        ? "Selecciona los permisos que deseas asignar a este rol"
                        : "El rol de Administrador tiene todos los permisos y no puede ser modificado"}
                    </CardDescription>
                  </div>
                  
                  {role.isEditable && (
                    <div className="flex items-center gap-2">
                      {hasChanges && (
                        <Button variant="outline" size="sm" onClick={handleCancelChanges}>
                          Cancelar
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        disabled={isSaving}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Restablecer
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={!hasChanges || isSaving}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        {isSaving ? "Guardando..." : "Guardar Cambios"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Unsaved Changes Warning */}
            {hasChanges && (
              <Alert className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-800 dark:text-yellow-200">Cambios sin guardar</AlertTitle>
                <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                  Tienes cambios pendientes. Recuerda guardar antes de cambiar de rol.
                </AlertDescription>
              </Alert>
            )}

            {/* Permissions by Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(PermissionCategory).map((category) => {
                const categoryPermissions = getPermissionsByCategory(category)
                const meta = categoryMetadata[category]
                const isFullySelected = isCategoryFullySelected(category)
                const isPartiallySelected = isCategoryPartiallySelected(category)

                return (
                  <Card key={category} className={`${!role.isEditable ? "opacity-75" : ""}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {categoryIcons[category]}
                          <CardTitle className="text-base">{meta.label}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {getCategorySelectedCount(category)}
                          </Badge>
                        </div>
                        {role.isEditable && (
                          <Checkbox
                            checked={isFullySelected}
                            ref={(el) => {
                              if (el) {
                                (el as HTMLButtonElement & { indeterminate: boolean }).indeterminate =
                                  isPartiallySelected && !isFullySelected
                              }
                            }}
                            onCheckedChange={(checked) =>
                              handleCategoryToggle(category, checked as boolean)
                            }
                          />
                        )}
                      </div>
                      <CardDescription className="text-xs">{meta.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {categoryPermissions.map((permission) => {
                          const permMeta = permissionMetadata[permission]
                          const isChecked = editedPermissions.includes(permission)

                          return (
                            <div
                              key={permission}
                              className={`flex items-center justify-between p-2 rounded-md border ${
                                isChecked
                                  ? "bg-primary/5 border-primary/20"
                                  : "bg-muted/30 border-transparent"
                              } ${role.isEditable ? "cursor-pointer hover:bg-muted/50" : ""}`}
                              onClick={() => role.isEditable && handlePermissionToggle(permission)}
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium">{permMeta.label}</p>
                                <p className="text-xs text-muted-foreground">{permMeta.description}</p>
                              </div>
                              <Checkbox
                                checked={isChecked}
                                disabled={!role.isEditable}
                                onCheckedChange={() => handlePermissionToggle(permission)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
