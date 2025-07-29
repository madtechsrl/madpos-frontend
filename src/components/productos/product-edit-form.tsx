"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useProducts } from "../../contexts/product-context"
import { formatCurrency } from "../../lib/utils"
// import Image from "next/image"

type Props = {
  productId: string
}

export function ProductEditForm({ productId }: Props) {
  const navigate = useNavigate()
  const { products } = useProducts()

  // Form state
  const [productData, setProductData] = useState({
    id: "",
    name: "",
    price: 0,
    category: "",
    description: "",
    sku: "",
    stock: 0,
    minStock: 0,
    cost: 0,
    barcode: "",
    image: "",
    bgColor: "bg-white",
    textColor: "text-dark",
    isActive: true,
    taxable: true,
  })

  const [imagePreview, setImagePreview] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  // Categories for dropdown
  const categories = [
    "Electrónicos",
    "Software",
    "Automotriz",
    "Servicios",
    "Materiales",
    "Hogar",
    "Embalaje",
    "Alimentación",
    "Ropa",
    "Otros",
  ]

  // Color options
  const colorOptions = [
    { bg: "bg-white", text: "text-dark", label: "Blanco" },
    { bg: "bg-slate-600", text: "text-white", label: "Gris Oscuro" },
    { bg: "bg-yellow-100", text: "text-dark", label: "Amarillo Claro" },
    { bg: "bg-gray-100", text: "text-dark", label: "Gris Claro" },
    { bg: "bg-blue-100", text: "text-dark", label: "Azul Claro" },
    { bg: "bg-green-100", text: "text-dark", label: "Verde Claro" },
  ]

  // Load product data
  useEffect(() => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      setProductData({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: "",
        sku: product.id,
        stock: 100, // Mock data
        minStock: 10, // Mock data
        cost: product.price * 0.7, // Mock data
        barcode: "",
        image: product.image || "",
        bgColor: product.bgColor || "bg-white",
        textColor: product.textColor || "text-dark",
        isActive: true,
        taxable: true,
      })
      setImagePreview(product.image || "")
    }
    setIsLoading(false)
  }, [productId, products])

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setProductData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleColorChange = (bgColor: string, textColor: string) => {
    setProductData((prev) => ({
      ...prev,
      bgColor,
      textColor,
    }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setProductData((prev) => ({
          ...prev,
          image: result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    // Here you would typically save the product data
    console.log("Saving product:", productData)
    // Navigate back to products list
    navigate("/productos")
  }

  const handleDelete = () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      // Here you would typically delete the product
      console.log("Deleting product:", productId)
      navigate("/productos")
    }
  }

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <div className="bg-white border-bottom">
        <div className="container-fluid px-4 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <button className="btn btn-link text-dark p-0 me-3" onClick={() => navigate(-1)}>
                <i className="fas fa-arrow-left"></i>
              </button>
              {/* <h1 className="h4 mb-0 fw-semibold">Editar producto</h1> */}
            </div>

            {/* <div className="d-flex align-items-center gap-3">
              <button className="btn btn-link text-secondary">
                <i className="fas fa-question-circle me-1"></i>
                Ayuda
              </button>

              <div className="d-flex align-items-center gap-2">
                <div
                  className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px" }}
                >
                  MS
                </div>
                <div className="d-none d-md-block">
                  <div className="fw-medium">Msantana</div>
                  <div className="small text-muted">ing.santana40@hotmai...</div>
                </div>
                <i className="fas fa-chevron-down text-muted"></i>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Sub Header */}
      <div className="bg-white border-bottom">
        <div className="container-fluid px-4 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">Producto activo</span>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={productData.isActive}
                  onChange={(e) => handleInputChange("isActive", e.target.checked)}
                />
              </div>
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-outline-danger" onClick={handleDelete}>
                <i className="fas fa-trash me-1"></i>
                Eliminar
              </button>
              <button className="btn btn-success" onClick={handleSave}>
                <i className="fas fa-save me-1"></i>
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-fluid px-4 py-4">
        <div className="row">
          {/* Left Column - Product Form */}
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                {/* Basic Information */}
                <div className="mb-4">
                  <h6 className="fw-semibold mb-3">Información básica</h6>

                  <div className="row">
                    <div className="col-12 col-md-8">
                      <div className="mb-3">
                        <label className="form-label">Nombre del producto</label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          value={productData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="mb-3">
                        <label className="form-label">SKU/Código</label>
                        <input
                          type="text"
                          className="form-control"
                          value={productData.sku}
                          onChange={(e) => handleInputChange("sku", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={productData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      style={{ resize: "none" }}
                    ></textarea>
                  </div>

                  <div className="row">
                    <div className="col-12 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Categoría</label>
                        <select
                          className="form-select"
                          value={productData.category}
                          onChange={(e) => handleInputChange("category", e.target.value)}
                        >
                          <option value="">Seleccionar categoría</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Código de barras</label>
                        <input
                          type="text"
                          className="form-control"
                          value={productData.barcode}
                          onChange={(e) => handleInputChange("barcode", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="mb-4">
                  <h6 className="fw-semibold mb-3">Precios</h6>

                  <div className="row">
                    <div className="col-12 col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Costo</label>
                        <div className="input-group">
                          <span className="input-group-text">RD$</span>
                          <input
                            type="number"
                            className="form-control"
                            value={productData.cost}
                            onChange={(e) => handleInputChange("cost", Number.parseFloat(e.target.value) || 0)}
                            step="0.01"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Precio de venta</label>
                        <div className="input-group">
                          <span className="input-group-text">RD$</span>
                          <input
                            type="number"
                            className="form-control"
                            value={productData.price}
                            onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                            step="0.01"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Margen</label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            value={
                              productData.cost > 0
                                ? `${(((productData.price - productData.cost) / productData.cost) * 100).toFixed(1)}%`
                                : "0%"
                            }
                            readOnly
                          />
                          <span className="input-group-text">
                            <i className="fas fa-calculator"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inventory */}
                <div className="mb-4">
                  <h6 className="fw-semibold mb-3">Inventario</h6>

                  <div className="row">
                    <div className="col-12 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Stock actual</label>
                        <input
                          type="number"
                          className="form-control"
                          value={productData.stock}
                          onChange={(e) => handleInputChange("stock", Number.parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Stock mínimo</label>
                        <input
                          type="number"
                          className="form-control"
                          value={productData.minStock}
                          onChange={(e) => handleInputChange("minStock", Number.parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appearance */}
                <div className="mb-4">
                  <h6 className="fw-semibold mb-3">Apariencia</h6>

                  <div className="mb-3">
                    <label className="form-label">Color de fondo</label>
                    <div className="d-flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.bg}
                          type="button"
                          className={`btn border ${
                            productData.bgColor === color.bg ? "border-primary border-2" : "border-secondary"
                          }`}
                          style={{
                            backgroundColor:
                              color.bg === "bg-white"
                                ? "white"
                                : color.bg === "bg-slate-600"
                                  ? "#475569"
                                  : color.bg === "bg-yellow-100"
                                    ? "#fef9c3"
                                    : color.bg === "bg-gray-100"
                                      ? "#f3f4f6"
                                      : color.bg === "bg-blue-100"
                                        ? "#dbeafe"
                                        : "#dcfce7",
                            width: "60px",
                            height: "40px",
                          }}
                          onClick={() => handleColorChange(color.bg, color.text)}
                        >
                          <span className="small">{color.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <div className="mb-4">
                  <h6 className="fw-semibold mb-3">Configuración</h6>

                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={productData.taxable}
                      onChange={(e) => handleInputChange("taxable", e.target.checked)}
                    />
                    <label className="form-check-label">Producto gravable (aplica impuestos)</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image and Preview */}
          <div className="col-12 col-lg-4 mt-4 mt-lg-0">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h6 className="fw-semibold mb-3">Imagen del producto</h6>

                <div className="text-center mb-3">
                  <div
                    className="border border-2 border-dashed rounded-3 p-4 mb-3"
                    style={{ minHeight: "200px", position: "relative" }}
                  >
                    {imagePreview ? (
                      <div className="position-relative">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Product preview"
                          width={150}
                          height={150}
                          className="img-fluid rounded"
                          style={{ objectFit: "cover" }}
                        />
                        <button
                          className="btn btn-sm btn-danger position-absolute top-0 end-0"
                          style={{ transform: "translate(50%, -50%)" }}
                          onClick={() => {
                            setImagePreview("")
                            setProductData((prev) => ({ ...prev, image: "" }))
                          }}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="d-flex flex-column align-items-center justify-content-center h-100">
                        <i className="fas fa-image fa-3x text-muted mb-3"></i>
                        <p className="text-muted">Sin imagen</p>
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    className="d-none"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="imageUpload" className="btn btn-outline-primary">
                    <i className="fas fa-upload me-1"></i>
                    Subir imagen
                  </label>
                </div>
              </div>
            </div>

            {/* Product Preview */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h6 className="fw-semibold mb-3">Vista previa</h6>

                <div className="text-center">
                  <div
                    className="card product-preview-card border-0 mx-auto"
                    style={{
                      width: "150px",
                      aspectRatio: "1",
                      backgroundColor:
                        productData.bgColor === "bg-white"
                          ? "white"
                          : productData.bgColor === "bg-slate-600"
                            ? "#475569"
                            : productData.bgColor === "bg-yellow-100"
                              ? "#fef9c3"
                              : productData.bgColor === "bg-gray-100"
                                ? "#f3f4f6"
                                : productData.bgColor === "bg-blue-100"
                                  ? "#dbeafe"
                                  : "#dcfce7",
                      color: productData.textColor === "text-white" ? "white" : "#1e293b",
                    }}
                  >
                    <div className="card-body d-flex flex-column justify-content-between h-100 p-2">
                      {imagePreview && (
                        <div className="d-flex align-items-center justify-content-center flex-grow-1">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            width={60}
                            height={60}
                            alt={productData.name}
                            className="img-fluid"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      )}
                      <div className="text-start">
                        <div className="fw-medium small">{productData.name || "Nombre del producto"}</div>
                        <div className="small">{formatCurrency(productData.price)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
