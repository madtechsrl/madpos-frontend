"use client"

import React, { useState, useRef } from "react"
import { useConfiguration } from "../../types/useConfiguration"

export default function ConfiguracionesPage() {
  const {
    configuration,
    loading,
    saving,
    uploading,
    error,
    success,
    currencies,
    updateConfiguration,
    uploadLogo,
    resetConfiguration,
    clearMessages,
  } = useConfiguration()

  const [activeTab, setActiveTab] = useState("GENERAL")
  const [formData, setFormData] = useState({
    businessName: "",
    responsiblePerson: "",
    idNumber: "",
    phone: "",
    whatsapp: "",
    instagram: "",
    email: "",
    address: "",
    complement: "",
    businessInfo: "",
    currency: "DO - RD$",
    decimalPlaces: true,
    showCancelledTransactions: false,
    hideTransactions: true,
  })
  const [logoPreview, setLogoPreview] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Update form data when configuration loads
  React.useEffect(() => {
    if (configuration) {
      setFormData({
        businessName: configuration.businessName || "",
        responsiblePerson: configuration.responsiblePerson || "",
        idNumber: configuration.idNumber || "",
        phone: configuration.phone || "",
        whatsapp: configuration.whatsapp || "",
        instagram: configuration.instagram || "",
        email: configuration.email || "",
        address: configuration.address || "",
        complement: configuration.complement || "",
        businessInfo: configuration.businessInfo || "",
        currency: configuration.currency || "DO - RD$",
        decimalPlaces: configuration.decimalPlaces ?? true,
        showCancelledTransactions: configuration.showCancelledTransactions ?? false,
        hideTransactions: configuration.hideTransactions ?? true,
      })
      setLogoPreview(configuration.logo || "")
    }
  }, [configuration])

  const tabs = [
    { id: "GENERAL", label: "GENERAL", active: true },
    { id: "PEDIDOS_VENTAS", label: "PEDIDOS Y VENTAS", active: false },
    { id: "RECIBO", label: "RECIBO", active: false },
    { id: "PAGOS", label: "PAGOS", active: false },
    { id: "ENTREGA_RETIRADA", label: "ENTREGA Y RETIRADA", active: false },
    { id: "INTEGRACIONES", label: "INTEGRACIONES", active: false },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const logoUrl = await uploadLogo(file)
      setLogoPreview(logoUrl)
    } catch (error) {
      console.error("Error uploading image:", error)
    }
  }

  const handleSave = async () => {
    await updateConfiguration(formData)
  }

  const handleReset = () => {
    resetConfiguration()
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Configuraciones</h2>
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-outline-secondary">
            <i className="bi bi-question-circle me-2"></i>
            Ayuda
          </button>
          <div className="d-flex align-items-center">
            <div
              className="bg-secondary rounded-circle d-flex align-items-center justify-content-center me-2"
              style={{ width: "32px", height: "32px" }}
            >
              <span className="text-white fw-bold">MI</span>
            </div>
            <div>
              <small className="text-muted d-block">Miguel Santana</small>
              <small className="text-muted">mg.santana36@gmail.com</small>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={clearMessages}></button>
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {success}
          <button type="button" className="btn-close" onClick={clearMessages}></button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="mb-4">
        <ul className="nav nav-pills">
          {tabs.map((tab) => (
            <li key={tab.id} className="nav-item">
              <button
                className={`nav-link ${activeTab === tab.id ? "active bg-success" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Tab Content */}
      {activeTab === "GENERAL" ? (
        <div className="row">
          {/* Store Icon and Title */}
          <div className="col-12 text-center mb-4">
            <div className="d-inline-flex align-items-center justify-content-center bg-success rounded-3 p-3 mb-3">
              <i className="bi bi-shop text-white" style={{ fontSize: "2rem" }}></i>
            </div>
            <h4>Informaciones generales</h4>
            <p className="text-muted">Ofrece detalles de tu negocio</p>
          </div>

          <div className="col-lg-8">
            {/* Identificación Section */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Identificación</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Nombre del comercio</label>
                  <input
                    type="text"
                    className="form-control"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="MADTECH"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nombre del responsable o de la Empresa</label>
                  <input
                    type="text"
                    className="form-control"
                    name="responsiblePerson"
                    value={formData.responsiblePerson}
                    onChange={handleInputChange}
                    placeholder="NCF-"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Cédula de identidad o de persona jurídica</label>
                  <input
                    type="text"
                    className="form-control"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    placeholder="RNC-110-273645"
                  />
                </div>
                <div className="alert alert-info">
                  <small>
                    Informar una identificación legal es una medida para validar su cuenta, preservar su privacidad y
                    garantizar la calidad de todos los catálogos de Kyte. Los datos de identificación no se mostrarán en
                    su catálogo en línea.
                  </small>
                </div>
              </div>
            </div>

            {/* Datos de contacto Section */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Datos de contacto</h5>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-3">
                    <select className="form-select">
                      <option>País</option>
                      <option>DO</option>
                      <option>US</option>
                    </select>
                  </div>
                  <div className="col-9">
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Teléfono"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-3">
                    <select className="form-select">
                      <option>País</option>
                      <option>DO</option>
                      <option>US</option>
                    </select>
                  </div>
                  <div className="col-9">
                    <input
                      type="tel"
                      className="form-control"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      placeholder="Celular/WhatsApp"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    placeholder="Instagram"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                  />
                </div>
              </div>
            </div>

            {/* Dirección Section */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Dirección</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Dirección"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    name="complement"
                    value={formData.complement}
                    onChange={handleInputChange}
                    placeholder="Complemento"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            {/* Logo Upload Section */}
            <div className="card mb-4">
              <div className="card-body text-center">
                <div className="border border-2 border-dashed rounded-3 p-4 mb-3" style={{ minHeight: "200px" }}>
                  {logoPreview ? (
                    <img
                      src={logoPreview || "/placeholder.svg"}
                      alt="Logo"
                      className="img-fluid"
                      style={{ maxHeight: "150px" }}
                    />
                  ) : (
                    <div className="d-flex flex-column align-items-center justify-content-center h-100">
                      <i className="bi bi-image text-muted mb-2" style={{ fontSize: "2rem" }}></i>
                      <p className="text-muted mb-0">Cargar su logomarca</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="d-none"
                />
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Subiendo...
                    </>
                  ) : (
                    "Elegir imagen"
                  )}
                </button>
              </div>
            </div>

            {/* Sobre el negocio Section */}
            <div className="card mb-4">
              <div className="card-header">
                <h6 className="mb-0">Sobre el negocio</h6>
              </div>
              <div className="card-body">
                <textarea
                  className="form-control"
                  name="businessInfo"
                  value={formData.businessInfo}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Informaciones extras"
                ></textarea>
                <small className="text-muted">
                  En este campo puede colocar la dirección de su negocio, horarios de funcionamiento y cualquier otra
                  información.
                </small>
              </div>
            </div>

            {/* Moneda Section */}
            <div className="card mb-4">
              <div className="card-header">
                <h6 className="mb-0">Moneda</h6>
              </div>
              <div className="card-body">
                <select className="form-select" name="currency" value={formData.currency} onChange={handleInputChange}>
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Casas Decimales Section */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <span>Casas Decimales</span>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="decimalPlaces"
                      checked={formData.decimalPlaces}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Opciones de exhibición Section */}
            <div className="card mb-4">
              <div className="card-header">
                <h6 className="mb-0">Opciones de exhibición</h6>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Transacciones canceladas</label>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="cancelledTransactions"
                      value="show"
                      checked={formData.showCancelledTransactions}
                      onChange={() => setFormData((prev) => ({ ...prev, showCancelledTransactions: true }))}
                    />
                    <label className="form-check-label">Mostrar tachadas</label>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span>Esconder</span>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="hideTransactions"
                      checked={formData.hideTransactions}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="col-12">
            <div className="d-flex gap-2 justify-content-end">
              <button type="button" className="btn btn-outline-secondary" onClick={handleReset} disabled={saving}>
                Cancelar
              </button>
              <button type="button" className="btn btn-success" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Guardando...
                  </>
                ) : (
                  "Guardar cambios"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-5">
          <h4>Sección en desarrollo</h4>
          <p className="text-muted">La pestaña {activeTab.replace("_", " ")} estará disponible próximamente.</p>
        </div>
      )}
    </div>
  )
}
