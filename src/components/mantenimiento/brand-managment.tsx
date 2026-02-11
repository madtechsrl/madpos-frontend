import { useState, useEffect } from "react"
import type { Brand } from "../../types/products"
import { fetchBrands, createBrand, updateBrand, deleteBrand } from "../../services/brand-service"
import { BrandFormModal } from "../mantenimiento/brand-form-modal"
import { usePagination } from "../../hooks/usePagination"
import { PaginationReactPaginate } from "../layout/paginationReac"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBuilding, faEdit, faPlus, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons"

export function BrandManagement() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)

  const filteredBrands = brands.filter(
    (brand) =>
      brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (brand.description && brand.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (brand.country && brand.country.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const {
    currentPage,
    itemsPerPage,
    totalPages,
    totalItems,
    paginatedData,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination({
    data: filteredBrands,
    initialItemsPerPage: 10,
  })

  useEffect(() => {
    loadBrands()
  }, [])

  const loadBrands = async () => {
    try {
      setLoading(true)
      const data = await fetchBrands()
      setBrands(data)
    } catch (error) {
      console.error("Error loading brands:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingBrand(null)
    setShowModal(true)
  }

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar esta marca?")) {
      try {
        await deleteBrand(id)
        loadBrands()
      } catch (error) {
        console.error("Error deleting brand:", error)
        alert("Error al eliminar la marca")
      }
    }
  }

  const handleSave = async (data: Omit<Brand, "id" | "createdAt" | "updatedAt">) => {
    try {
      if (editingBrand) {
        await updateBrand(editingBrand.id, data)
      } else {
        await createBrand(data)
      }
      loadBrands()
      setShowModal(false)
    } catch (error) {
      console.error("Error saving brand:", error)
      alert("Error al guardar la marca")
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="h5 mb-1">Gestión de Marcas</h3>
          <p className="text-muted small mb-0">{brands.length} marcas registradas</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          <FontAwesomeIcon icon={faPlus}/>
          Nueva Marca
        </button>
      </div>

      {/* Search */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faSearch} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar marca..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Logo</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>País</th>
                <th className="text-center">Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5">
                    <FontAwesomeIcon icon={faBuilding}className="text-muted mb-3" />
                    <p className="text-muted mb-0">No se encontraron marcas</p>
                  </td>
                </tr>
              ) : (
                paginatedData.map((brand) => (
                  <tr key={brand.id}>
                    <td style={{ width: "80px" }}>
                      {brand.logo ? (
                        <img
                          src={brand.logo || "/placeholder.svg"}
                          alt={brand.name}
                          className="rounded"
                          style={{ width: "50px", height: "50px", objectFit: "contain" }}
                        />
                      ) : (
                        <div
                          className="rounded bg-light d-flex align-items-center justify-content-center"
                          style={{ width: "50px", height: "50px" }}
                        >
                          <FontAwesomeIcon icon={faBuilding} className="text-muted" />
                        </div>
                      )}
                    </td>
                    <td>
                      <strong>{brand.name}</strong>
                    </td>
                    <td>{brand.description || "-"}</td>
                    <td>{brand.country || "-"}</td>
                    <td className="text-center">
                      <span className={`badge ${brand.status === "Activo" ? "bg-success" : "bg-secondary"}`}>
                        {brand.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary" onClick={() => handleEdit(brand)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(brand.id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalItems > 0 && (
          <div className="card-footer">
            <PaginationReactPaginate
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        )}
      </div>

      {showModal && <BrandFormModal brand={editingBrand} onSave={handleSave} onClose={() => setShowModal(false)} />}
    </div>
  )
}
