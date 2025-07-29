// NewProductPage.tsx (Vite + Bootstrap + FontAwesome version)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoleGuard } from "../analitica/role-guard";
import { type UserRoleId, getRoleById } from "../../types/User";
import { useAuth } from "../../contexts/auth-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
interface FormData {
  // Basic Info
  productName: string
  description: string
  category: string
  brand: string
  sku: string
  barcode: string
  image: string 

  // Pricing
  costPrice: number
  salePrice: number
  discountPrice: number
  taxRate: number

  // Stock
  stockControl: boolean
  currentStock: number
  minStock: number

  // Physical
  unit: string
  dimensions: string
  color: string

  // Status
  status: string
  featured: boolean
}

export default function NewProductPage() {
  const { user } = useAuth(); // Assuming useAuth is defined in your context
  const currentUserRole = getRoleById(user?.role as UserRoleId); // Replace with actual role from context or props
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
   productName: "",
    description: "",
    category: "",
    brand: "",
    sku: "",
    barcode: "",
    image: "", // Add this line
    costPrice: 0,
    salePrice: 0,
    discountPrice: 0,
    taxRate: 0,
    stockControl: false,
    currentStock: 0,
    minStock: 0,
    unit: "",
    dimensions: "",
    color: "#000000",
    status: "active",
    featured: false,
  });

  const [showMovementHistory, setShowMovementHistory] = useState(false);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return


    if (!file.type.startsWith("image/")) {
      alert("Por favor, sube un archivo de imagen válido.");
      return;
    }

    if(file.size > 2 * 1024 * 1024) { // 2MB limit
      alert("El archivo es demasiado grande. Por favor, sube una imagen de menos de 2MB.");
      return;
    }
    setIsUploading(true);

    const reader = new FileReader();
    reader.onloadend = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          alert("Error al procesar la imagen. Por favor, inténtalo de nuevo.");
          setIsUploading(false);
          return;
        }

        canvas.width = 120;
        canvas.height = 120;

        const scale = Math.min(120 / img.width, 120 / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;

        const x = (120 - scaledWidth) / 2;
        const y = (120 - scaledHeight) / 2;

        ctx.fillStyle = "#f8f9fa"; // Light background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

        const resizedImage = canvas.toDataURL("image/png", 0.8); // 80% quality
        setSelectedImage(resizedImage);
        setFormData({ ...formData, image: resizedImage });
        setIsUploading(false);

      }
      img.onerror = () => {
        alert("Error al cargar la imagen. Por favor, inténtalo de nuevo.");
        setIsUploading(false);
      }
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      alert("Error al leer el archivo. Por favor, inténtalo de nuevo.");
      setIsUploading(false);
    }
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setFormData({ ...formData, image: "" });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };


  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
   const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];

      const fakeEvent = {
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleImageUpload(fakeEvent);

    }
   
  };

  // Handle input changes for text, number, and select fields 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({ ...formData, [name]: type === "number" ? parseFloat(value) : value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
    alert("Producto guardado exitosamente!");
  };

  const calculateProfit = () => {
    return formData.salePrice - formData.costPrice;
  };

  const calculateMargin = () => {
    return formData.costPrice > 0 ? (calculateProfit() / formData.costPrice) * 100 : 0;
  };

  return (
     <RoleGuard
          allowedRoles={["ADMIN", "PROPIETARIO", "ALMACENISTA"]}
          currentUserRole={currentUserRole}
        >

  <div className="d-flex" style={{ minHeight: "100vh" }}>           
     <div className="container py-4">
      <div className="mb-3">
        <button className="btn btn-outline-secondary" onClick={() => navigate("/productos")}> 
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Volver
        </button>
      </div> 
      

        <div className="flex-grow-1">
          {/* Header */}
          <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
            <div className="container-fluid">            
              <div className="d-flex align-items-center">
                
              
              </div>
            </div>
          </nav>

          {/* Content */}
           <div className="container-fluid p-4">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Left Column - Product Information */}
                <div className="col-md-8">
                  <div className="card h-100">
                    <div className="card-header">
                      <h6 className="mb-0">Información del Producto</h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label">Nombre del Producto *</label>
                          <input
                            type="text"
                            name="productName"
                            className="form-control"
                            value={formData.productName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="col-12">
                          <label className="form-label">Descripción</label>
                          <textarea
                            name="description"
                            className="form-control"
                            rows={3}
                            value={formData.description}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Categoría</label>
                          <select
                            name="category"
                            className="form-select"
                            value={formData.category}
                            onChange={handleInputChange}
                          >
                            <option value="">Seleccionar...</option>
                            <option value="electronics">Rones</option>
                            <option value="clothing">Cerveza</option>
                            <option value="food">Whisky</option>
                            <option value="books">Vinos</option>
                            <option value="furniture">Licores</option>
                            <option value="toys">Aguardiente</option>
                            <option value="accessories">Tequila</option>
                            <option value="beverages">Vodka</option>
                            <option value="other">Otros</option>
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Marca</label>
                          <input
                            type="text"
                            name="brand"
                            className="form-control"
                            value={formData.brand}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">SKU</label>
                          <input
                            type="text"
                            name="sku"
                            className="form-control"
                            value={formData.sku}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Código de Barras</label>
                          <div className="input-group">
                            <input
                              type="text"
                              name="barcode"
                              className="form-control"
                              value={formData.barcode}
                              onChange={handleInputChange}
                            />
                            <button type="button" className="btn btn-outline-secondary">
                              <i className="fa-solid fa-barcode"></i>
                            </button>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Precio de Costo</label>
                          <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input
                              type="number"
                              name="costPrice"
                              className="form-control"
                              step="0.01"
                              value={formData.costPrice}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Precio de Venta</label>
                          <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input
                              type="number"
                              name="salePrice"
                              className="form-control"
                              step="0.01"
                              value={formData.salePrice}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Unidad</label>
                          <select
                            name="unit"
                            className="form-select"
                            value={formData.unit}
                            onChange={handleInputChange}
                          >
                            <option value="">Seleccionar unidad...</option>
                            <option value="unidad">Unidad</option>
                            <option value="litro">Litro</option>
                            <option value="mililitro">Caja/12</option>
                            <option value="gramo">Caja/24</option>                            
                            <option value="paquete">Paquete</option>
                          </select>

                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Color</label>
                          <input
                            type="color"
                            name="color"
                            className="form-control form-control-color"
                            value={formData.color}
                            onChange={handleInputChange}
                          />
                        </div>

                        {/* Profit Calculation */}
                        <div className="col-12">
                          <div className="alert alert-info">
                            <small>
                              <strong>Ganancia:</strong> ${calculateProfit().toFixed(2)} |<strong> Margen:</strong>{" "}
                              {calculateMargin().toFixed(1)}%
                            </small>
                          </div>
                        </div>

                        {/* Compact Product Preview Section */}
                        <div className="col-12">
                          <div className="card bg-light">
                            <div className="card-header py-2">
                              <h6 className="mb-0 small">Vista Previa del Producto</h6>
                            </div>
                            <div className="card-body py-3">
                              <div className="row align-items-center">
                                <div className="col-md-4">
                                  <div
                                    className="border rounded d-flex align-items-center justify-content-center position-relative"
                                    style={{
                                      height: "120px",
                                      backgroundColor: "#ffffff",
                                      cursor: "pointer",
                                      border: "2px dashed #dee2e6",
                                    }}
                                    onDragOver={handleDragOver}
                                    onDragEnter={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => document.getElementById("imageInput")?.click()}
                                  >
                                    {selectedImage ? (
                                      <>
                                        <img
                                          src={selectedImage || "/placeholder.svg"}
                                          alt="Product preview"
                                          style={{
                                            width: "80px",
                                            height: "80px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                          }}
                                        />
                                        <button
                                          type="button"
                                          className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleRemoveImage()
                                          }}
                                          style={{ zIndex: 10, padding: "2px 6px" }}
                                        >
                                          <i className="fa-solid fa-trash"></i>
                                        </button>
                                      </>
                                    ) : (
                                      <div className="text-center">
                                        {isUploading ? (
                                          <div>
                                            <div
                                              className="spinner-border spinner-border-sm text-primary mb-1"
                                              role="status"
                                            >
                                              <span className="visually-hidden">Subiendo...</span>
                                            </div>
                                            <p className="text-muted small mb-0">Procesando...</p>
                                          </div>
                                        ) : (
                                          <>
                                            <i
                                              className="bi bi-cloud-upload"
                                              style={{ fontSize: "2rem", color: "#6c757d" }}
                                            ></i>
                                            <p className="text-muted small mt-1 mb-0">
                                              Imagen
                                              <br />
                                              <small>(120x120px)</small>
                                            </p>
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  {/* Hidden file input */}
                                  <input
                                    id="imageInput"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: "none" }}
                                  />

                                  <div className="d-flex gap-1 mt-2">
                                    <button
                                      type="button"
                                      className="btn btn-outline-primary btn-sm flex-fill"
                                      onClick={() => document.getElementById("imageInput")?.click()}
                                      disabled={isUploading}
                                    >
                                      <i className=""></i>
                                      {selectedImage ? "Cambiar" : "Subir"}
                                    </button>

                                    {selectedImage && (
                                      <button
                                        type="button"
                                        className="fa-trash btn btn-outline-danger btn-sm flex-fill"
                                        onClick={handleRemoveImage}
                                      >
                                        <FontAwesomeIcon icon={faTrash} />                                                                            
                                     
                                        Eliminar
                                      </button>
                                    )}
                                  </div>
                                </div>

                                <div className="col-md-8">
                                  {/* Product Label Preview */}
                                  <div
                                    className="border rounded p-3"
                                    style={{ backgroundColor: formData.color, color: "#fff", minHeight: "120px" }}
                                  >
                                    <h6 className="mb-1">{formData.productName || "Nombre del Producto"}</h6>
                                    <p className="mb-1 small">{formData.brand || "Marca"}</p>
                                    <p className="mb-1">${formData.salePrice.toFixed(2)}</p>
                                    <small>SKU: {formData.sku || "N/A"}</small>
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

                {/* Right Column - Stock and Status */}
                <div className="col-md-4">
                  {/* Stock Section */}
                  <div className="card mb-4">
                    <div className="card-header">
                      <h6 className="mb-0">Stock</h6>
                    </div>
                    <div className="card-body">
                      <div className="form-check form-switch mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="stockControl"
                          checked={formData.stockControl}
                          onChange={handleCheckboxChange}
                        />
                        <label className="form-check-label small">Controlar stock del producto</label>
                      </div>

                      {formData.stockControl && (
                        <>
                          <div className="row g-2 mb-3">
                            <div className="col-12">
                              <input
                                type="number"
                                name="currentStock"
                                className="form-control form-control-sm"
                                placeholder="Stock actual"
                                value={formData.currentStock}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="col-12">
                              <input
                                type="number"
                                name="minStock"
                                className="form-control form-control-sm"
                                placeholder="Stock Mínimo"
                                value={formData.minStock}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>

                          {formData.currentStock <= formData.minStock && formData.minStock > 0 && (
                            <div className="alert alert-warning alert-sm">
                              <small>⚠️ Stock bajo</small>
                            </div>
                          )}
                        </>
                      )}

                      <div className="mb-3">
                        <h6 className="text-muted mb-2 small">Historial de movimientos</h6>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm d-flex align-items-center w-100"
                          onClick={() => setShowMovementHistory(!showMovementHistory)}
                        >
                          <i className="bi bi-list me-2"></i>
                          {showMovementHistory ? "Ocultar" : "Mostrar"} resultados
                        </button>

                        {showMovementHistory && (
                          <div className="mt-2 p-2 bg-light rounded">
                            <small className="text-muted">No hay movimientos registrados</small>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Section */}
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">Estado</h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <select
                          name="status"
                          className="form-select form-select-sm"
                          value={formData.status}
                          onChange={handleInputChange}
                        >
                          <option value="active">Activo</option>
                          <option value="inactive">Inactivo</option>
                          <option value="draft">Borrador</option>
                        </select>
                      </div>

                      <div className="form-check mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleCheckboxChange}
                        />
                        <label className="form-check-label small">Producto destacado</label>
                      </div>

                      <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary btn-sm">
                          <i className="bi bi-check-lg me-1"></i>
                          Guardar Producto
                        </button>
                        <button type="button" className="btn btn-outline-secondary btn-sm">
                          <i className="bi bi-eye me-1"></i>
                          Vista Previa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>  
      </div>
    </div>
    </RoleGuard>
  );
}
