"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faShoppingCart,
  faBox,
  faUser,
  faCog,
  faChartBar,
  faDollarSign,
  faShieldHalved,
  faFloppyDisk,
  faRotateLeft,
  faCheck,
  faXmark,
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

// Category icon map
const categoryIcons: Record<PermissionCategory, React.ReactNode> = {
  [PermissionCategory.VENTAS]: <FontAwesomeIcon icon={faShoppingCart} className="me-1" />,
  [PermissionCategory.PRODUCTOS]: <FontAwesomeIcon icon={faBox} className="me-1" />,
  [PermissionCategory.CLIENTES]: <FontAwesomeIcon icon={faUser} className="me-1" />,
  [PermissionCategory.USUARIOS]: <FontAwesomeIcon icon={faUser} className="me-1" />,
  [PermissionCategory.REPORTES]: <FontAwesomeIcon icon={faChartBar} className="me-1" />,
  [PermissionCategory.CONFIGURACION]: <FontAwesomeIcon icon={faCog} className="me-1" />,
  [PermissionCategory.FINANZAS]: <FontAwesomeIcon icon={faDollarSign} className="me-1" />,
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

  const currentRole = useMemo(
    () => rolePermissions.find((r) => r.roleId === selectedRole),
    [rolePermissions, selectedRole]
  )

  useEffect(() => {
    loadPermissions()
  }, [])

  useEffect(() => {
    if (currentRole) {
      setEditedPermissions([...currentRole.permissions])
      setHasChanges(false)
    }
  }, [selectedRole, currentRole])

  const loadPermissions = async () => {
    setIsLoading(true)
    try {
      const permissions = await fetchRolePermissions()
      setRolePermissions(permissions)
      const r = permissions.find((rp) => rp.roleId === selectedRole)
      if (r) setEditedPermissions([...r.permissions])
    } catch (error) {
      console.error("Error loading permissions:", error)
    } finally {
      setIsLoading(false)
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

  const getRoleBadgeClass = (roleId: RoleUuid): string => {
    switch (roleId) {
      case ROLES.ADMIN:
        return "bg-danger"
      case ROLES.MANAGER:
        return "bg-primary"
      case ROLES.CASHIER:
        return "bg-secondary"
      default:
        return "bg-secondary"
    }
  }

  const handlePermissionToggle = (permission: Permission) => {
    if (!currentRole?.isEditable) return

    setEditedPermissions((prev) => {
      const next = prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]

      const original = currentRole?.permissions || []
      const changed =
        next.length !== original.length || next.some((p) => !original.includes(p))
      setHasChanges(changed)

      return next
    })
  }

  const handleCategoryToggle = (category: PermissionCategory, checked: boolean) => {
    if (!currentRole?.isEditable) return

    const categoryPermissions = getPermissionsByCategory(category)
    setEditedPermissions((prev) => {
      const next = checked
        ? Array.from(new Set([...prev, ...categoryPermissions]))
        : prev.filter((p) => !categoryPermissions.includes(p))

      const original = currentRole?.permissions || []
      const changed =
        next.length !== original.length || next.some((p) => !original.includes(p))
      setHasChanges(changed)

      return next
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const success = await updateRolePermissions(selectedRole, editedPermissions)
      if (success) {
        await loadPermissions()
        setHasChanges(false)
        setSuccessMessage(
          `Permisos del rol "${getRoleName(selectedRole)}" guardados correctamente`
        )
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
    if (currentRole) {
      setEditedPermissions([...currentRole.permissions])
      setHasChanges(false)
    }
  }

  if (isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-50" style={{ minHeight: 400 }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" aria-label="Cargando" />
          <p className="text-muted">Cargando permisos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="d-grid gap-3">
      {/* ✅ Success Alert */}
      {showSuccessAlert && (
        <div className="alert alert-success position-relative" role="alert">
          <div className="d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faCheck} />
            <div>
              <h6 className="mb-1 fw-semibold">Operación exitosa</h6>
              <div>{successMessage}</div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-link position-absolute top-0 end-0 mt-2 me-2 text-success text-decoration-none"
            onClick={() => setShowSuccessAlert(false)}
            aria-label="Cerrar alerta"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <h2 className="h4 mb-1 d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faShieldHalved} />
            Gestión de Permisos
          </h2>
          <p className="text-muted mb-0">Configura los permisos de acceso para cada rol del sistema</p>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        {rolePermissions.map((role) => (
          <li className="nav-item" key={role.roleId}>
            <button
              className={`nav-link d-flex align-items-center gap-2 ${selectedRole === role.roleId ? "active" : ""}`}
              onClick={() => {
                if (!hasChanges || role.roleId === selectedRole) setSelectedRole(role.roleId)
              }}
              disabled={hasChanges && role.roleId !== selectedRole}
            >
              {!role.isEditable && <FontAwesomeIcon icon={faLock} className="small" />}
              <span>{role.roleName}</span>
              <span className={`badge ${getRoleBadgeClass(role.roleId)}`}>
                {role.permissions.length}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* Selected Role Card */}
      {currentRole && (
        <div className="card">
          <div className="card-header">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h5 className="card-title mb-0">{currentRole.roleName}</h5>
                  <span className={`badge ${getRoleBadgeClass(currentRole.roleId)}`}>
                    {currentRole.permissions.length} permisos
                  </span>
                  {!currentRole.isEditable && (
                    <span className="badge text-bg-light border d-flex align-items-center gap-1">
                      <FontAwesomeIcon icon={faLock} className="small" />
                      Solo lectura
                    </span>
                  )}
                </div>
                <p className="card-subtitle text-muted mt-1">
                  {currentRole.isEditable
                    ? "Selecciona los permisos que deseas asignar a este rol"
                    : "El rol de Administrador tiene todos los permisos y no puede ser modificado"}
                </p>
              </div>

              {currentRole.isEditable && (
                <div className="d-flex align-items-center gap-2">
                  {hasChanges && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={handleCancelChanges}
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={handleReset}
                    disabled={isSaving}
                  >
                    <FontAwesomeIcon icon={faRotateLeft} className="me-1" />
                    Restablecer
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleSave}
                    disabled={!hasChanges || isSaving}
                  >
                    <FontAwesomeIcon icon={faFloppyDisk} className="me-1" />
                    {isSaving ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {hasChanges && (
            <div className="alert alert-warning mb-0">
              <FontAwesomeIcon icon={faTriangleExclamation} className="me-2" />
              <strong>Cambios sin guardar:</strong> Recuerda guardar antes de cambiar de rol.
            </div>
          )}

          <div className="card-body">
            <div className="row g-3">
              {Object.values(PermissionCategory).map((category) => (
                <div className="col-12 col-md-6" key={category}>
                  <CategoryCard
                    category={category}
                    roleEditable={currentRole.isEditable}
                    editedPermissions={editedPermissions}
                    onPermissionToggle={handlePermissionToggle}
                    onCategoryToggle={handleCategoryToggle}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ✅ Extracted Subcomponent (can safely use hooks)
function CategoryCard({
  category,
  roleEditable,
  editedPermissions,
  onPermissionToggle,
  onCategoryToggle,
}: {
  category: PermissionCategory
  roleEditable: boolean
  editedPermissions: Permission[]
  onPermissionToggle: (p: Permission) => void
  onCategoryToggle: (c: PermissionCategory, checked: boolean) => void
}) {
  const categoryPermissions = getPermissionsByCategory(category)
  const meta = categoryMetadata[category]
  const fullySelected = categoryPermissions.every((p) => editedPermissions.includes(p))
  const selectedCount = categoryPermissions.filter((p) =>
    editedPermissions.includes(p)
  ).length
  const partiallySelected =
    selectedCount > 0 && selectedCount < categoryPermissions.length

  const checkboxRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = partiallySelected && !fullySelected
    }
  }, [partiallySelected, fullySelected])

  return (
    <div className={`card h-100 ${!roleEditable ? "opacity-75" : ""}`}>
      <div className="card-header py-2 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          {categoryIcons[category]}
          <h6 className="mb-0">{meta.label}</h6>
          <span className="badge text-bg-light border">
            {selectedCount}/{categoryPermissions.length}
          </span>
        </div>
        {roleEditable && (
          <div className="form-check m-0">
            <input
              ref={checkboxRef}
              className="form-check-input"
              type="checkbox"
              checked={fullySelected}
              onChange={(e) => onCategoryToggle(category, e.currentTarget.checked)}
            />
          </div>
        )}
      </div>
      <div className="card-body">
        <div className="d-grid gap-2">
          {categoryPermissions.map((perm) => {
            const permMeta = permissionMetadata[perm]
            const isChecked = editedPermissions.includes(perm)
            return (
              <div
                key={perm}
                className={`d-flex justify-content-between align-items-center p-2 rounded border ${
                  isChecked ? "bg-primary-subtle border-primary-subtle" : "bg-light border-0"
                } ${roleEditable ? "cursor-pointer" : ""}`}
                onClick={() => roleEditable && onPermissionToggle(perm)}
              >
                <div>
                  <div className="fw-semibold small">{permMeta.label}</div>
                  <div className="text-muted small">{permMeta.description}</div>
                </div>
                <div className="form-check m-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={isChecked}
                    disabled={!roleEditable}
                    onChange={() => onPermissionToggle(perm)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
