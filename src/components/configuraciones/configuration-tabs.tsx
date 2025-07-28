"use client"

import { useState } from "react"
import { GeneralSettings } from "../configuraciones/general-settings"

const tabs = [
  { id: "general", label: "GENERAL", active: true },
  { id: "pedidos", label: "PEDIDOS Y VENTAS", active: false },
  { id: "recibo", label: "RECIBO", active: false },
  { id: "pagos", label: "PAGOS", active: false },
  { id: "entrega", label: "ENTREGA Y RETIRADA", active: false },
  { id: "integraciones", label: "INTEGRACIONES", active: false },
]

export function ConfigurationTabs() {
  const [activeTab, setActiveTab] = useState("general")

  return (
    <div className="container-fluid p-0">
      {/* Tab Navigation */}
      <div className="bg-white border-bottom">
        <div className="container-fluid px-4">
          <ul className="nav nav-tabs border-0" style={{ marginBottom: "-1px" }}>
            {tabs.map((tab) => (
              <li className="nav-item" key={tab.id}>
                <button
                  className={`nav-link border-0 px-3 py-3 fw-medium ${
                    activeTab === tab.id
                      ? "active text-success border-bottom border-success border-2"
                      : "text-secondary"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    backgroundColor: "transparent",
                    borderRadius: 0,
                  }}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-light min-vh-100">
        <div className="container-fluid px-4 py-4">
          {activeTab === "general" && <GeneralSettings />}
          {activeTab === "pedidos" && (
            <div className="text-center py-5">
              <h3>Pedidos y Ventas</h3>
              <p className="text-muted">Configuración de pedidos y ventas en desarrollo</p>
            </div>
          )}
          {activeTab === "recibo" && (
            <div className="text-center py-5">
              <h3>Recibo</h3>
              <p className="text-muted">Configuración de recibos en desarrollo</p>
            </div>
          )}
          {activeTab === "pagos" && (
            <div className="text-center py-5">
              <h3>Pagos</h3>
              <p className="text-muted">Configuración de pagos en desarrollo</p>
            </div>
          )}
          {activeTab === "entrega" && (
            <div className="text-center py-5">
              <h3>Entrega y Retirada</h3>
              <p className="text-muted">Configuración de entrega y retirada en desarrollo</p>
            </div>
          )}
          {activeTab === "integraciones" && (
            <div className="text-center py-5">
              <h3>Integraciones</h3>
              <p className="text-muted">Configuración de integraciones en desarrollo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
