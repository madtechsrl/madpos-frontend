"use client"

import { useState } from "react"

export function GeneralSettings() {
  const [businessName, setBusinessName] = useState("MADTECH")
  const [responsibleName, setResponsibleName] = useState("NCF-")
  const [businessId, setBusinessId] = useState("RNC-110-273645")
  const [phone, setPhone] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [instagram, setInstagram] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [complement, setComplement] = useState("")
  const [currency, setCurrency] = useState("DO - RD$")
  const [decimalPlaces, setDecimalPlaces] = useState(true)
  const [showCanceled, setShowCanceled] = useState(false)
  const [hideTransactions, setHideTransactions] = useState(true)

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-10 col-xl-8">
        {/* Header Section */}
        <div className="text-center mb-5">
          <div className="mb-3">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#10b981",
                color: "white",
              }}
            >
              <i className="fas fa-store fa-2x"></i>
            </div>
          </div>
          <h2 className="h4 fw-semibold mb-2">Informaciones generales</h2>
          <p className="text-muted">Ofrece detalles de tu negocio</p>
        </div>

        <div className="row">
          {/* Left Column */}
          <div className="col-12 col-md-6">
            {/* Identificación Section */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="card-title mb-4">Identificación</h5>

                <div className="mb-3">
                  <label className="form-label text-muted small">Nombre del comercio</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                    />
                    <span className="input-group-text">
                      <i className="fas fa-info-circle text-muted"></i>
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted small">Nombre del responsable o de la Empresa</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={responsibleName}
                      onChange={(e) => setResponsibleName(e.target.value)}
                    />
                    <span className="input-group-text">
                      <i className="fas fa-lock text-muted"></i>
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted small">Cédula de identidad o de persona jurídica</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={businessId}
                      onChange={(e) => setBusinessId(e.target.value)}
                    />
                    <span className="input-group-text">
                      <i className="fas fa-lock text-muted"></i>
                    </span>
                  </div>
                </div>

                <div className="alert alert-info small">
                  <i className="fas fa-info-circle me-2"></i>
                  Informar una identificación legal es una medida para validar su cuenta, preservar su privacidad y
                  garantizar la calidad de todos los catálogos de Kyte.{" "}
                  <strong>Los datos de identificación no se mostrarán en su catálogo en línea.</strong>
                </div>
              </div>
            </div>

            {/* Datos de contacto Section */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="card-title mb-4">Datos de contacto</h5>

                <div className="mb-3">
                  <div className="input-group">
                    <select className="form-select" style={{ maxWidth: "100px" }}>
                      <option>País</option>
                    </select>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Teléfono"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <span className="input-group-text">
                      <i className="fas fa-info-circle text-muted"></i>
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="input-group">
                    <select className="form-select" style={{ maxWidth: "100px" }}>
                      <option>País</option>
                    </select>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Celular/WhatsApp"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                    />
                    <span className="input-group-text">
                      <i className="fas fa-info-circle text-muted"></i>
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Instagram"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                    />
                    <span className="input-group-text">
                      <i className="fas fa-info-circle text-muted"></i>
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="input-group">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <span className="input-group-text">
                      <i className="fas fa-info-circle text-muted"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dirección Section */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="card-title mb-4">Dirección</h5>

                <div className="mb-3">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Dirección"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    <span className="input-group-text">
                      <i className="fas fa-info-circle text-muted"></i>
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Complemento"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-12 col-md-6">
            {/* Logo Section */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4 text-center">
                <div className="mb-3">
                  <i className="fas fa-image fa-3x text-muted mb-3"></i>
                  <h6 className="fw-semibold">Cargar su logomarca</h6>
                </div>
                <button className="btn btn-success">Elegir imagen</button>
              </div>
            </div>

            {/* Sobre el negocio Section */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="card-title mb-4">Sobre el negocio</h5>

                <div className="mb-3">
                  <div className="input-group">
                    <textarea
                      className="form-control"
                      rows={4}
                      placeholder="Informaciones extras"
                      style={{ resize: "none" }}
                    ></textarea>
                    <span className="input-group-text align-items-start pt-3">
                      <i className="fas fa-info-circle text-muted"></i>
                    </span>
                  </div>
                  <div className="form-text">
                    En este campo puede colocar la dirección de su negocio, horarios de funcionamiento y cualquier otra
                    información.
                  </div>
                </div>
              </div>
            </div>

            {/* Moneda Section */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="card-title mb-4">Moneda</h5>

                <div className="mb-3">
                  <select className="form-select" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    <option value="DO - RD$">DO - RD$</option>
                    <option value="US - USD">US - USD</option>
                    <option value="EU - EUR">EU - EUR</option>
                  </select>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span>Casas Decimales</span>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={decimalPlaces}
                      onChange={(e) => setDecimalPlaces(e.target.checked)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Opciones de exhibición Section */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="card-title mb-4">Opciones de exhibición</h5>

                <div className="mb-3">
                  <h6 className="fw-medium mb-3">Transacciones canceladas</h6>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span>Mostrar tachadas</span>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={showCanceled}
                        onChange={(e) => setShowCanceled(e.target.checked)}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <span>Esconder</span>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={hideTransactions}
                        onChange={(e) => setHideTransactions(e.target.checked)}
                      />
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
