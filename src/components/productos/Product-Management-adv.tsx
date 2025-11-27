"use client"

import { useState, useEffect } from "react"
import type { Product } from "../../types/products"
import { fetchAdvancedProducts, 
         createAdvancedProduct, 
         updateAdvancedProduct, 
         deleteAdvancedProduct } from "../../services/advance-product-service"
import { createPackaging } from "../../services/packaging-service"
import { ProductFormModal } from "../productos/ProductFormModal"
import { PackagingManagement } from "../productos/packaging-managment"
import { PaginationReactPaginate } from "../layout/paginationReac"
import { usePagination } from "../../hooks/usePagination"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBoxesPacking, faCube, faEdit, faPlus, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons"
export interface PackagingFormData {
  packagingName: string
  barcode: string
  quantityPerPack: number
  unitMeasure: string
  costPrice: number
  salePrice: number
  minStock: number
  maxStock: number
  reorderPoint: number
}

export function ProductManagementAdvanced() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showPackagingModal, setShowPackagingModal] = useState(false)
  const [packagingProduct, setPackagingProduct] = useState<{ id: string; name: string } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const { currentPage, itemsPerPage, setCurrentPage, setItemsPerPage, paginatedData, totalPages } = 
  usePagination<Product>({data:filteredProducts, initialItemsPerPage:10,})

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const data = await fetchAdvancedProducts()
      setProducts(data)
    } catch (error) {
      console.error("Error loading products:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = [...products]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.code.toLowerCase().includes(term) ||
          product.description?.toLowerCase().includes(term),
      )
    }

    setFilteredProducts(filtered)
    setCurrentPage(1)
  }

  const handleCreate = () => {
    setSelectedProduct(null)
    setShowModal(true)
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setShowModal(true)
  }

  const handleSave = async (productData: Omit<Product, "id" | "createdAt" | "updatedAt">, 
                            packagingData?: PackagingFormData
    ) => {
    try {
      if (selectedProduct) {
        // Actualizar producto existente
        await updateAdvancedProduct(selectedProduct.id, productData)
      } else {
        // Crear nuevo producto con su presentación
        const newProduct = await createAdvancedProduct(productData)
        if (packagingData && newProduct.id) {
          // Crear la presentación inicial
          await createPackaging({
            productId: newProduct.id,
            ...packagingData,
            status: "Activo",
          })
        }
      }

      await loadProducts()
      setShowModal(false)
      setSelectedProduct(null)
    } catch (error) {
      console.error("Error saving product:", error)
      alert("Error al guardar el producto")
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar el producto "${name}"?`)) {
      try {
        await deleteAdvancedProduct(id)
        await loadProducts()
      } catch (error) {
        console.error("Error deleting product:", error)
        alert("Error al eliminar el producto")
      }
    }
  }

  const handleManagePackaging = (product: Product) => {
    setPackagingProduct({ id: product.id, name: product.name })
    setShowPackagingModal(true)
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1">Gestión de Productos</h4>
              <p className="text-muted mb-0">Administra el catálogo completo de productos</p>
            </div>
            <button className="btn btn-primary" onClick={handleCreate}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Nuevo Producto
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faSearch} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por nombre, código o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 text-end">
              <span className="text-muted">{filteredProducts.length} producto(s) encontrado(s)</span>
            </div>
          </div>
        </div>

        <div className="card-body">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-5">
              <FontAwesomeIcon icon={faBoxesPacking} className="text-muted mb-3" />
              <h5>No hay productos</h5>
              <p className="text-muted">
                {searchTerm ? "No se encontraron productos con ese criterio" : "Comienza agregando tu primer producto"}
              </p>
              {!searchTerm && (
                <button className="btn btn-primary" onClick={handleCreate}>
                  <FontAwesomeIcon icon={faPlus}className="me-2" />
                  Crear Producto
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Código</th>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Marca</th>
                      <th className="text-center">Estado</th>
                      <th className="text-center">Almacenes</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <code>{product.code}</code>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            {product.imageUrl && (
                              <img
                                src={product.imageUrl || "/placeholder.svg"}
                                alt={product.name}
                                className="me-2"
                                style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }}
                              />
                            )}
                            <div>
                              <strong>{product.name}</strong>
                              {product.description && (
                                <div>
                                  <small className="text-muted">{product.description}</small>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>{product.categoryId}</td>
                        <td>{product.brandId || "-"}</td>
                        <td className="text-center">
                          <span className={`badge ${product.status === "Activo" ? "bg-success" : "bg-secondary"}`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-info">{product.warehouseIds.length}</span>
                        </td>
                        <td className="text-center">
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-info"
                              onClick={() => handleManagePackaging(product)}
                              title="Gestionar Presentaciones"
                            >
                              <FontAwesomeIcon icon={faCube} />
                            </button>
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => handleEdit(product)}
                              title="Editar"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(product.id, product.name)}
                              title="Eliminar"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <PaginationReactPaginate
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
                totalItems={filteredProducts.length}
              />
            </>
          )}
        </div>
      </div>

      {showModal && (
        <ProductFormModal product={selectedProduct} onSave={handleSave} onClose={() => setShowModal(false)} />
      )}

      {showPackagingModal && packagingProduct && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-xl modal-dialog-scrollable" style={{ maxWidth: "90%" }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Gestión de Presentaciones</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowPackagingModal(false)
                    setPackagingProduct(null)
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <PackagingManagement productId={packagingProduct.id} productName={packagingProduct.name} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
