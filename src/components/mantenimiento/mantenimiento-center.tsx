"use client"

import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { Settings, Tag, Building2, Truck } from "lucide-react"
import { CategoryManagement } from "../mantenimiento/category-management"
import { BrandManagement } from "../mantenimiento/brand-managment"
import { SupplierManagement } from "../mantenimiento/supplier-managment"
import { faBuilding, faSearch, faTag, faTruck } from "@fortawesome/free-solid-svg-icons"

type TabType = "categories" | "brands" | "suppliers"

export function MaintenanceCenter() {
  const [activeTab, setActiveTab] = useState<TabType>("categories")

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex align-items-center gap-2 mb-2">
          <FontAwesomeIcon icon={faSearch}/>
          <h2 className="h3 mb-0">Centro de Mantenimiento</h2>
        </div>
        <p className="text-muted">Administra las categorías, marcas y suplidores de tu inventario</p>
      </div>

      {/* Navigation Tabs */}
      <div className="card mb-4">
        <div className="card-body p-0">
          <ul className="nav nav-tabs nav-fill border-0">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "categories" ? "active" : ""}`}
                onClick={() => setActiveTab("categories")}
              >
                <FontAwesomeIcon icon={faTag} />
                Categorías
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "brands" ? "active" : ""}`}
                onClick={() => setActiveTab("brands")}
              >
                <FontAwesomeIcon icon={faBuilding} className="me-2" />
                Marcas
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "suppliers" ? "active" : ""}`}
                onClick={() => setActiveTab("suppliers")}
              >
                <FontAwesomeIcon icon={faTruck} className="me-2" />
                Suplidores
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "categories" && <CategoryManagement />}
        {activeTab === "brands" && <BrandManagement />}
        {activeTab === "suppliers" && <SupplierManagement />}
      </div>
    </div>
  )
}
