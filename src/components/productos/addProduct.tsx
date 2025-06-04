// NewProductPage.tsx (Vite + Bootstrap + FontAwesome version)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faUpload, faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { mockCategories } from "../../lib/data";

interface Category {
  id: string;
  name: string;
}

export default function NewProductPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    promotionalPrice: "",
    category: "",
    labelName: "",
    description: "",
    code: "",
    cost: "",
    unit: "Unidad",
    currentStock: "",
    minStock: "",
    trackStock: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Product data:", formData);
    navigate("/products");
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container py-4">
      <div className="mb-3">
        <button className="btn btn-outline-secondary" onClick={() => navigate("/products")}> 
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Volver
        </button>
      </div>

      <form onSubmit={handleSubmit} className="row g-4">
        {/* Product Info */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body text-center">
              <div className="mb-3">
                <div className="border rounded p-4 bg-light">Imagen del producto</div>
              </div>
              <button className="btn btn-outline-secondary w-100 mb-2">
                <FontAwesomeIcon icon={faUpload} className="me-2" /> Subir Foto
              </button>
              <button className="btn btn-outline-secondary w-100">
                Color de la Etiqueta
              </button>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="col-lg-8">
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label">Nombre del producto</label>
              <input className="form-control" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Precio</label>
              <input type="number" className="form-control" value={formData.price} onChange={(e) => handleInputChange("price", e.target.value)} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Precio promocional</label>
              <input type="number" className="form-control" value={formData.promotionalPrice} onChange={(e) => handleInputChange("promotionalPrice", e.target.value)} />
              <small className="form-text text-muted">El precio original se tachará en la tienda</small>
            </div>

            <div className="col-md-6">
              <label className="form-label">Categoría</label>
              <select className="form-select" value={formData.category} onChange={(e) => handleInputChange("category", e.target.value)}>
                <option value="">Seleccionar categoría</option>
                {mockCategories.map((c: Category) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Nombre en etiqueta</label>
              <input className="form-control" value={formData.labelName} onChange={(e) => handleInputChange("labelName", e.target.value)} />
            </div>

            <div className="col-12">
              <label className="form-label">Descripción</label>
              <textarea className="form-control" rows={3} value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} />
              <button type="button" className="btn btn-link">
                <FontAwesomeIcon icon={faLightbulb} className="me-1" /> Sugerir descripción
              </button>
            </div>

            <div className="col-md-6">
              <label className="form-label">Código</label>
              <input className="form-control" value={formData.code} onChange={(e) => handleInputChange("code", e.target.value)} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Costo</label>
              <input type="number" className="form-control" value={formData.cost} onChange={(e) => handleInputChange("cost", e.target.value)} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Unidad de venta</label>
              <select className="form-select" value={formData.unit} onChange={(e) => handleInputChange("unit", e.target.value)}>
                <option value="Unidad">Unidad</option>
                <option value="Kilogramo">Kilogramo</option>
                <option value="Litro">Litro</option>
                <option value="Metro">Metro</option>
              </select>
            </div>

            <div className="col-12">
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" checked={formData.trackStock} onChange={(e) => handleInputChange("trackStock", e.target.checked)} />
                <label className="form-check-label">Controlar Stock</label>
              </div>
            </div>

            {formData.trackStock && (
              <>
                <div className="col-md-6">
                  <label className="form-label">Stock Actual</label>
                  <input type="number" className="form-control" value={formData.currentStock} onChange={(e) => handleInputChange("currentStock", e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Stock Mínimo</label>
                  <input type="number" className="form-control" value={formData.minStock} onChange={(e) => handleInputChange("minStock", e.target.value)} />
                </div>
              </>
            )}
          </div>

          <div className="mt-4 d-flex gap-3">
            <button type="submit" className="btn btn-primary">Guardar Producto</button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/products")}>Cancelar</button>
          </div>
        </div>
      </form>
    </div>
  );
}
