import { useState, useEffect } from "react"
// import { Plus, Search, Edit, Trash2, Tag } from "lucide-react"
import type { Category } from "../../types/products"
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "../../services/category-service"
import { CategoryFormModal } from "../mantenimiento/category-form-modal"
import { PaginationReactPaginate } from "../layout/paginationReac"
import {usePagination } from "../../hooks/usePagination"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faPlus, faSearch, faTag, faTrash } from "@fortawesome/free-solid-svg-icons"

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const { 
    currentPage, 
    itemsPerPage, 
    totalPages, 
    totalItems, 
    paginatedData, 
    setCurrentPage, 
    setItemsPerPage } =
    usePagination({
      data: filteredCategories,
      initialItemsPerPage: 10,
    })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await fetchCategories()
      setCategories(data)
    } catch (error) {
      console.error("Error loading categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingCategory(null)
    setShowModal(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar esta categoría?")) {
      try {
        await deleteCategory(id)
        loadCategories()
      } catch (error) {
        console.error("Error deleting category:", error)
        alert("Error al eliminar la categoría")
      }
    }
  }

  const handleSave = async (data: Omit<Category, "id" | "createdAt" | "updatedAt">) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data)
      } else {
        await createCategory(data)
      }
      loadCategories()
      setShowModal(false)
    } catch (error) {
      console.error("Error saving category:", error)
      alert("Error al guardar la categoría")
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
          <h3 className="h5 mb-1">Gestión de Categorías</h3>
          <p className="text-muted small mb-0">{categories.length} categorías registradas</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Nueva Categoría
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
                  placeholder="Buscar categoría..."
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
                <th>Nombre</th>
                <th>Descripción</th>
                <th className="text-center">Orden</th>
                <th className="text-center">Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-5">
                    <FontAwesomeIcon icon={faTag} className="text-muted mb-3" />
                    <p className="text-muted mb-0">No se encontraron categorías</p>
                  </td>
                </tr>
              ) : (
                paginatedData.map((category) => (
                  <tr key={category.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        {category.icon && <span>{category.icon}</span>}
                        <strong>{category.name}</strong>
                      </div>
                    </td>
                    <td>{category.description}</td>
                    <td className="text-center">
                      <span className="badge bg-light text-dark">{category.order}</span>
                    </td>
                    <td className="text-center">
                      <span className={`badge ${category.status === "Activo" ? "bg-success" : "bg-secondary"}`}>
                        {category.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary" onClick={() => handleEdit(category)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(category.id)}>
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
        <CategoryFormModal category={editingCategory} onSave={handleSave} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}
