
import { SearchBar } from "./search-bar"
import { ProductGrid } from "./productos/product-grid"
import { useAuth } from "../contexts/auth-context"

export function HomepageContent() {
  const { hasPermission } = useAuth()
  const isAdmin = hasPermission("administrador")

  return (
    <>
      {isAdmin && (
        <div className="mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Gestión de Usuarios</h5>
              <span className="badge bg-primary">Solo Administradores</span>
            </div>
            {/* <div className="card-body p-0">
              <UserManagement compact={true} />
            </div> */}
          </div>
        </div>
      )}

      <SearchBar />
      <ProductGrid />
    </>
  )
}
