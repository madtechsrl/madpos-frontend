import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { Plus, Search, Edit, Trash2, Truck, Mail, Phone } from "lucide-react"
import type { Supplier } from "../../types/products"
import { fetchSuppliers, createSupplier, updateSupplier, deleteSupplier } from "../../services/supplier-service"
import { SupplierFormModal } from "../mantenimiento/supplier-form-modal"
import { PaginationReactPaginate } from "../layout/paginationReac"
import { usePagination } from "../../hooks/usePagination"
import { faEdit, faMailReply, faPhone, faPlus, faSearch, faTrash, faTruck } from "@fortawesome/free-solid-svg-icons"

export function SupplierManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = !statusFilter || supplier.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const { currentPage, itemsPerPage, totalPages, totalItems, paginatedData, setCurrentPage, setItemsPerPage } =
    usePagination({
      data: filteredSuppliers,
      initialItemsPerPage: 10,
    })

  useEffect(() => {
    loadSuppliers()
  }, [])

  const loadSuppliers = async () => {
    try {
      setLoading(true)
      const data = await fetchSuppliers()
      setSuppliers(data)
    } catch (error) {
      console.error("Error loading suppliers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingSupplier(null)
    setShowModal(true)
  }

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este suplidor?")) {
      try {
        await deleteSupplier(id)
        loadSuppliers()
      } catch (error) {
        console.error("Error deleting supplier:", error)
        alert("Error al eliminar el suplidor")
      }
    }
  }

  const handleSave = async (data: Omit<Supplier, "id" | "createdAt" | "updatedAt">) => {
    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, data)
      } else {
        await createSupplier(data)
      }
      loadSuppliers()
      setShowModal(false)
    } catch (error) {
      console.error("Error saving supplier:", error)
      alert("Error al guardar el suplidor")
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
          <h3 className="h5 mb-1">Gestión de Suplidores</h3>
          <p className="text-muted small mb-0">{suppliers.length} suplidores registrados</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          <FontAwesomeIcon icon={faPlus}className="me-2" />
          Nuevo Suplidor
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faSearch} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar suplidor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">Todos los estados</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
            <div className="col-md-3">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("")
                }}
              >
                Limpiar Filtros
              </button>
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
                <th>Código</th>
                <th>Nombre</th>
                <th>Empresa</th>
                <th>Contacto</th>
                <th>Ubicación</th>
                <th className="text-center">Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-5">
                    <FontAwesomeIcon icon={faTruck} className="text-muted mb-3" />
                    <p className="text-muted mb-0">No se encontraron suplidores</p>
                  </td>
                </tr>
              ) : (
                paginatedData.map((supplier) => (
                  <tr key={supplier.id}>
                    <td>
                      <code className="small">{supplier.code}</code>
                    </td>
                    <td>
                      <strong>{supplier.name}</strong>
                    </td>
                    <td>
                      <div>{supplier.companyName}</div>
                      <small className="text-muted">RNC: {supplier.taxId}</small>
                    </td>
                    <td>
                      <div className="small">
                        <div className="mb-1">
                          <FontAwesomeIcon icon={faMailReply} className="me-1" />
                          {supplier.email}
                        </div>
                        <div>
                          <FontAwesomeIcon icon={faPhone}className="me-1" />
                          {supplier.phone}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="small">
                        <div>{supplier.city}</div>
                        <div className="text-muted">{supplier.country}</div>
                      </div>
                    </td>
                    <td className="text-center">
                      <span className={`badge ${supplier.status === "Activo" ? "bg-success" : "bg-secondary"}`}>
                        {supplier.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary" onClick={() => handleEdit(supplier)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(supplier.id)}>
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

      {showModal && (
        <SupplierFormModal supplier={editingSupplier} onSave={handleSave} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}
