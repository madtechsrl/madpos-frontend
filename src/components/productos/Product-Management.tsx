"use client"

import { useState } from "react"
import { useProducts } from "../../contexts/product-context"
import{ formatCurrency}  from "../../lib/utils"

export function ProductManagement() {
  const { products, loading, error } = useProducts()
  const [searchTerm, setSearchTerm] = useState("")




 const totalValue = products.reduce((sum, p) => sum + (p.price || 0) * (p.stock || 0), 0);
  const totalCost = products.reduce((sum, p) => sum + (p.cost || 0) * (p.stock || 0), 0);
  const estimatedProfit = totalValue - totalCost;
  const lowStockCount = products.filter((p) => (p.stock || 0) <= (p.minStock || 5)).length;
  const outOfStockCount = products.filter((product) => product.stock === 0).length;
  const inStockSummary = products.reduce((sum, p)=> sum + ((p.stock || 0)> 0 ? p.stock! : 0), 0)
  const inStockItems = products.filter((p) => (p.stock || 0) > 0).length;






  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "250px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="ms-2 mb-0">Cargando productos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Error: </strong>
        <span>{error}</span>
      </div>
    )
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fs-4 fw-semibold">Gestión de Productos</h2>
        <button className="btn btn-success d-flex align-items-center gap-2">
          <i className="fas fa-plus"></i>
          <span>Añadir Producto</span>
        </button>
      </div>

      <div className="mb-4 position-relative">
        <div className="input-group">
          <span className="input-group-text bg-white">
            <i className="fas fa-search"></i>
          </span>
          <input
            type="text"
            placeholder="Buscar productos..."
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
       {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md">
          <div className="card p-3">
            <div className="h5 text-success">{formatCurrency(totalValue)}</div>
            <small>Valor en stock</small>
          </div>
        </div>
        <div className="col-md">
          <div className="card p-3">
            <div className="h5 text-primary">{formatCurrency(totalCost)}</div>
            <small>Costo de stock</small>
          </div>
        </div>
        <div className="col-md">
          <div className="card p-3">
            <div className="h5 text-purple">{formatCurrency(estimatedProfit)}</div>
            <small>Ganancia estimada</small>
          </div>
        </div>
        <div className="col-md">
          <div className="card p-3 d-flex align-items-center">
            <span className="badge bg-warning me-2">{lowStockCount}</span>
            <small>Stock bajo</small>
          </div>
        </div>
          <div className="col-md">
          <div className="card p-3 d-flex align-items-center">
            <span className="badge bg-warning me-2">{inStockItems}</span>
            <small>Cant de Productos</small>
          </div>
        </div>
        <div className="col-md">
          <div className="card p-3 d-flex justify-content-between">
            <div>
              <span className="badge bg-danger me-2">{outOfStockCount}</span>
              <span className="badge bg-success">{inStockSummary}</span>
            </div>
            <small>Sin stock / En stock</small>
          </div>
        </div>
      </div>



      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Producto</th>
                <th scope="col">Categoría</th>
                <th scope="col">Precio</th>
                <th scope="col" className="text-end">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="text-secondary">{product.id}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      {product.image && (
                        <div className="me-3" style={{ width: "40px", height: "40px" }}>
                          <img
                            className="img-fluid rounded"
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            style={{ width: "40px", height: "40px", objectFit: "cover" }}
                          />
                        </div>
                      )}
                      <div className="fw-medium">{product.name}</div>
                    </div>
                  </td>
                  <td className="text-secondary">{product.category}</td>
                  <td className="text-secondary">{formatCurrency(product.price)}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-primary me-2">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
