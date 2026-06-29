"use client"

import { ProductCard } from "./product-card"
import { useProducts } from "../../contexts/product-context"

export function ProductGrid() {
  const { filteredProducts, loading, error } = useProducts()

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


  if(filteredProducts.length === 0){
    return(
      <div className="alert alert-info" role="alert">
        <strong>Info: </strong>
        <span>Los productos no se encontraron</span>
      </div>
    )
  }

  return (
    <div className="d-flex flex-wrap gap-3">
      {filteredProducts.map((product) => (
        <div className="col-md" key={product.id} style={{ minWidth: "200px", flex: "1 1 2000px", maxWidth: "calc(20% - 1rem)" }}>
          <ProductCard product={product} />
        </div>
      ))}
      <div style={{ minWidth: "150px", flex: "1 1 150px", maxWidth: "calc(15% - 1rem)" }}>
        <button
          className="btn btn-success product-card d-flex align-items-center justify-content-center w-75 h-100"
          style={{height:"100%"}}
          onClick={() => {
            // This would typically open a modal to add a new product
            alert("Añadir nuevo producto")
          }}
        >
          <i className="fas fa-plus fa-2x"></i>
        </button>
      </div>
    </div>
  )
}
