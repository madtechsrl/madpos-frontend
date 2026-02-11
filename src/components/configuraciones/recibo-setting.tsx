import { useState } from "react"
import { formatCurrency } from "../../lib/utils"

export function ReceiptSettings() {
  const [storeData, setStoreData] = useState({
    name: "MADTECH",
    logo: "",
    phone: "",
    whatsapp: "",
    address: "",
  })

  const [receiptSettings, setReceiptSettings] = useState({
    addClientData: true,
    showProductCode: true,
    headerText: "",
    footerText: "",
  })

  // Mock receipt data for preview
  const mockReceiptData = {
    clientName: "Nombre del cliente",
    clientPhone: "+551199999-9999 - Dirección completa",
    observations: "Observaciones del recibo",
    items: [
      { id: "1", name: "Holdlamis", code: "275402785", quantity: 1, price: 123.0 },
      { id: "2", name: "Rank", code: "543789287", quantity: 1, price: 200.0 },
      { id: "3", name: "Cardify", code: "718250178", quantity: 1, price: 4123.0 },
      { id: "4", name: "Alphazap", code: "374162027", quantity: 1, price: 12341.0 },
      { id: "5", name: "Regrant", code: "118486009", quantity: 1, price: 231.0 },
      { id: "6", name: "Stim", code: "906850763", quantity: 1, price: 1231.0 },
      { id: "7", name: "Stringtough", code: "131613541", quantity: 1, price: 234.0 },
      { id: "8", name: "Fix San", code: "VQM004481", quantity: 1, price: 123124.0 },
    ],
  }

  const total = mockReceiptData.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleStoreDataChange = (field: string, value: string) => {
    setStoreData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSettingChange = (field: string, value: boolean | string) => {
    setReceiptSettings((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12">
        {/* Header Section */}
        <div className="text-center mb-4">
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
              <i className="fas fa-receipt fa-2x"></i>
            </div>
          </div>
          <h2 className="h4 fw-semibold mb-2">Mi Recibo</h2>
          <p className="text-muted">Personaliza los datos impresos en el recibo</p>
        </div>

        <div className="row">
          {/* Left Column - Configuration */}
          <div className="col-12 col-lg-6">
            {/* Store Data Section */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="card-title mb-4">Datos de la tienda</h5>
                <p className="text-muted small mb-4">
                  ¡Completa los datos de tu tienda y deja tu catálogo profesional!
                </p>

                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-check-circle text-success me-2"></i>
                    <span className="small text-muted">NOMBRE DEL COMERCIO</span>
                    <i className="fas fa-times text-danger ms-auto"></i>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-times text-danger me-2"></i>
                    <span className="small text-muted">LOGO</span>
                    <i className="fas fa-times text-danger ms-auto"></i>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-times text-danger me-2"></i>
                    <span className="small text-muted">TELÉFONO</span>
                    <i className="fas fa-times text-danger ms-auto"></i>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-times text-danger me-2"></i>
                    <span className="small text-muted">WHATSAPP</span>
                    <i className="fas fa-times text-danger ms-auto"></i>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-times text-danger me-2"></i>
                    <span className="small text-muted">DIRECCIÓN</span>
                    <i className="fas fa-times text-danger ms-auto"></i>
                  </div>
                </div>

                <button className="btn btn-success w-100">Completar datos de la tienda</button>
              </div>
            </div>

            {/* Client Data Toggle */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="fw-semibold mb-1">Añadir datos del cliente</h6>
                    <p className="text-muted small mb-0">Nombre, dirección y teléfono</p>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={receiptSettings.addClientData}
                      onChange={(e) => handleSettingChange("addClientData", e.target.checked)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Product Code Toggle */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="fw-semibold mb-1">Exhibir código del producto</h6>
                    <p className="text-muted small mb-0">Abajo del nombre del artículo</p>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={receiptSettings.showProductCode}
                      onChange={(e) => handleSettingChange("showProductCode", e.target.checked)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Header and Footer Section */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="card-title mb-4">Encabezado y pié de página</h5>

                <div className="mb-3">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Texto del encabezado"
                      value={receiptSettings.headerText}
                      onChange={(e) => handleSettingChange("headerText", e.target.value)}
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
                      placeholder="Texto al pié de página"
                      value={receiptSettings.footerText}
                      onChange={(e) => handleSettingChange("footerText", e.target.value)}
                    />
                    <span className="input-group-text">
                      <i className="fas fa-info-circle text-muted"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Receipt Preview */}
          <div className="col-12 col-lg-6">
            <div className="position-sticky" style={{ top: "20px" }}>
              <div className="d-flex align-items-center mb-3">
                <i className="fas fa-eye me-2 text-muted"></i>
                <span className="text-muted small">Vista previa del recibo</span>
              </div>

              <div className="card border shadow-sm">
                <div className="card-body p-4" style={{ backgroundColor: "#f8f9fa" }}>
                  {/* Receipt Header */}
                  <div className="text-center mb-4">
                    <h4 className="fw-bold mb-0">RECIBO</h4>
                  </div>

                  {/* Store Name */}
                  <div className="text-center mb-4">
                    <h5 className="fw-bold">{storeData.name}</h5>
                  </div>

                  {/* Client Information */}
                  {receiptSettings.addClientData && (
                    <div className="mb-4">
                      <div className="d-flex align-items-center mb-2">
                        <i className="fas fa-user me-2"></i>
                        <span className="fw-medium">{mockReceiptData.clientName}</span>
                      </div>
                      <div className="small text-muted">{mockReceiptData.clientPhone}</div>
                    </div>
                  )}

                  {/* Observations */}
                  <div className="mb-4">
                    <div className="border rounded p-3">
                      <div className="small text-muted">{mockReceiptData.observations}</div>
                    </div>
                  </div>

                  {/* Items Header */}
                  <div className="mb-3">
                    <div className="fw-bold small">
                      {mockReceiptData.items.length} artículos (Cant.: {mockReceiptData.items.length})
                    </div>
                    <hr className="my-2" />
                  </div>

                  {/* Items List */}
                  <div className="mb-4">
                    {mockReceiptData.items.map((item) => (
                      <div key={item.id} className="d-flex justify-content-between align-items-start mb-3">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center">
                            <span className="me-2 small">{item.quantity}x</span>
                            <span className="fw-medium">{item.name}</span>
                          </div>
                          {receiptSettings.showProductCode && <div className="small text-muted">{item.code}</div>}
                        </div>
                        <div className="fw-medium">{formatCurrency(item.price)}</div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <hr />
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">Total:</span>
                    <span className="fw-bold fs-5">{formatCurrency(total)}</span>
                  </div>

                  {/* Footer Text */}
                  {receiptSettings.footerText && (
                    <div className="text-center mt-4">
                      <div className="small text-muted">{receiptSettings.footerText}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
