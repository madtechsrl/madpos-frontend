"use client"

import { useState, useEffect, useMemo } from "react"
import type { Product, Category, Brand, Supplier, Warehouse } from "../../types/products"
import {
  fetchAdvancedProducts,
  createAdvancedProduct,
  updateAdvancedProduct,
  deleteAdvancedProduct,
} from "../../services/advance-product-service"
import { fetchCategories } from "../../services/category-service"
import { fetchBrands } from "../../services/brand-service"
import { fetchSuppliers } from "../../services/supplier-service"
import { fetchWarehouses } from "../../services/warehouse-service"
import { ProductFormModal } from "../productos/ProductFormModal"
import { PackagingManagement } from "../mantenimiento/packaging"
import { PaginationReactPaginate } from "../mantenimiento/paginationReac"
import { usePagination } from "../../hooks/usePagination"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBox, faCubes, faPen, faPlus, faSearch, faTrash, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"

export function ProductManagementAdvanced() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showPackagingModal, setShowPackagingModal] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // Filtros
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [brandFilter, setBrandFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  // Productos filtrados
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.code.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = !categoryFilter || product.categoryId === categoryFilter
      const matchesBrand = !brandFilter || product.brandId === brandFilter
      const matchesStatus = !statusFilter || product.status === statusFilter

      const matchesTab =
        activeTab === "all" ||
        (activeTab === "low-stock" && product.totalStock < 100) ||
        (activeTab === "featured" && product.featured) ||
        (activeTab === "inactive" && product.status === "Inactivo")

      return matchesSearch && matchesCategory && matchesBrand && matchesStatus && matchesTab
    })
  }, [products, searchQuery, categoryFilter, brandFilter, statusFilter, activeTab])

  // Paginación
  const { currentPage, itemsPerPage, totalPages, totalItems, paginatedData, setCurrentPage, setItemsPerPage } =
    usePagination({
      data: filteredProducts,
      initialItemsPerPage: 10,
    })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, categoryFilter, brandFilter, statusFilter, activeTab, setCurrentPage])

  const loadData = async () => {
    try {
      setLoading(true)
      const [productsData, categoriesData, brandsData, suppliersData, warehousesData] = await Promise.all([
        fetchAdvancedProducts(),
        fetchCategories(),
        fetchBrands(),
        fetchSuppliers(),
        fetchWarehouses(),
      ])

      setProducts(productsData)
      setCategories(categoriesData)
      setBrands(brandsData)
      setSuppliers(suppliersData)
      setWarehouses(warehousesData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProduct = () => {
    setEditingProduct(null)
    setShowModal(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowModal(true)
  }

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      await deleteAdvancedProduct(id)
      loadData()
    }
  }

  const handleSaveProduct = async (productData: any) => {
    try {
      if (editingProduct) {
        await updateAdvancedProduct(editingProduct.id, productData)
      } else {
        await createAdvancedProduct(productData)
      }
      loadData()
      setShowModal(false)
    } catch (error) {
      console.error("Error saving product:", error)
    }
  }

  const handleManagePackagings = (product: Product) => {
    setSelectedProduct(product)
    setShowPackagingModal(true)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setCategoryFilter("")
    setBrandFilter("")
    setStatusFilter("")
  }

  const getLowStockCount = () => {
    return products.filter((p) => p.totalStock < 100).length
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
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 mb-1">Gestión de Productos</h2>
          <p className="text-muted small mb-0">
            {products.length} productos totales • {getLowStockCount()} con stock bajo
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleCreateProduct}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Nuevo Producto
        </button>
      </div>

      {/* Tabs y Filtros */}
      <div className="card mb-4">
        <div className="card-body">
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button className={`nav-link ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
                <FontAwesomeIcon icon={faCubes}className="me-1" />
                Todos
                <span className="badge bg-secondary ms-2">{products.length}</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "low-stock" ? "active" : ""}`}
                onClick={() => setActiveTab("low-stock")}
              >
                <FontAwesomeIcon icon={faTriangleExclamation}className="me-1" />
                Stock Bajo
                <span className="badge bg-warning ms-2">{getLowStockCount()}</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "featured" ? "active" : ""}`}
                onClick={() => setActiveTab("featured")}
              >
                Destacados
                <span className="badge bg-info ms-2">{products.filter((p) => p.featured).length}</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "inactive" ? "active" : ""}`}
                onClick={() => setActiveTab("inactive")}
              >
                Inactivos
                <span className="badge bg-secondary ms-2">
                  {products.filter((p) => p.status === "Inactivo").length}
                </span>
              </button>
            </li>
          </ul>

          {/* Filtros */}
          <div className="row g-2">
            <div className="col-md-3">
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faSearch} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar producto..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select className="form-select" value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
                <option value="">Todas las marcas</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">Todos los estados</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="Descontinuado">Descontinuado</option>
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-outline-secondary w-100" onClick={clearFilters}>
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="card">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: "80px" }}>Imagen</th>
                <th>Código</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Marca</th>
                <th className="text-center">Presentaciones</th>
                <th className="text-center">Stock Total</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-5">
                    <FontAwesomeIcon icon={faCubes}className="text-muted mb-3" />
                    <p className="text-muted mb-0">No se encontraron productos</p>
                  </td>
                </tr>
              ) : (
                paginatedData.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img
                        src={product.primaryImage || product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="rounded"
                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                      />
                    </td>
                    <td>
                      <code className="small">{product.code}</code>
                    </td>
                    <td>
                      <div className="fw-medium">{product.name}</div>
                      <div className="small text-muted">
                        {product.volume} {product.volumeUnit} • {product.container}
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark">
                        {categories.find((c) => c.id === product.categoryId)?.name}
                      </span>
                    </td>
                    <td>{brands.find((b) => b.id === product.brandId)?.name}</td>
                    <td className="text-center">
                      <span className="badge bg-info">{product.packagings.length}</span>
                    </td>
                    <td className="text-center">
                      <span
                        className={`badge ${
                          product.totalStock < 100
                            ? "bg-danger"
                            : product.totalStock < 500
                              ? "bg-warning"
                              : "bg-success"
                        }`}
                      >
                        {product.totalStock}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          product.status === "Activo"
                            ? "bg-success"
                            : product.status === "Inactivo"
                              ? "bg-secondary"
                              : "bg-danger"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-info"
                          onClick={() => handleManagePackagings(product)}
                          title="Gestionar presentaciones"
                        >
                          <FontAwesomeIcon icon={faBox} />
                        </button>
                        <button className="btn btn-outline-primary" onClick={() => handleEditProduct(product)}>
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                        <button className="btn btn-outline-danger" onClick={() => handleDeleteProduct(product.id)}>
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

        {/* Paginación */}
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

      {/* Modal de Formulario de Producto */}
      {showModal && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          brands={brands}
          suppliers={suppliers}
          warehouses={warehouses}
          onSave={handleSaveProduct}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Modal de Gestión de Packagings */}
      {showPackagingModal && selectedProduct && (
        <PackagingManagement
          product={selectedProduct}
          onClose={() => {
            setShowPackagingModal(false)
            loadData()
          }}
        />
      )}
    </div>
  )
}
