"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Supplier } from "../../types/products"

interface SupplierFormModalProps {
  supplier: Supplier | null
  onSave: (data: Omit<Supplier, "id" | "createdAt" | "updatedAt">) => void
  onClose: () => void
}

export function SupplierFormModal({ supplier, onSave, onClose }: SupplierFormModalProps) {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    companyName: "",
    taxId: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "República Dominicana",
    contactPerson: "",
    paymentTerms: "",
    notes: "",
    status: "Activo" as "Activo" | "Inactivo",
  })

  useEffect(() => {
    if (supplier) {
      setFormData({
        code: supplier.code,
        name: supplier.name,
        companyName: supplier.companyName,
        taxId: supplier.taxId,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        city: supplier.city,
        country: supplier.country,
        contactPerson: supplier.contactPerson || "",
        paymentTerms: supplier.paymentTerms || "",
        notes: supplier.notes || "",
        status: supplier.status,
      })
    } else {
      // Auto-generate code for new supplier
      const code = `SUP${Date.now().toString().slice(-6)}`
      setFormData((prev) => ({ ...prev, code }))
    }
  }, [supplier])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      contactPerson: formData.contactPerson || undefined,
      paymentTerms: formData.paymentTerms || undefined,
      notes: formData.notes || undefined,
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <>
      <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{supplier ? "Editar Suplidor" : "Nuevo Suplidor"}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* Información Básica */}
                <h6 className="border-bottom pb-2 mb-3">Información Básica</h6>
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label htmlFor="code" className="form-label">
                      Código <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      required
                      readOnly={!!supplier}
                    />
                  </div>

                  <div className="col-md-9 mb-3">
                    <label htmlFor="name" className="form-label">
                      Nombre Comercial <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="companyName" className="form-label">
                      Razón Social <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="taxId" className="form-label">
                      RNC / Cédula <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="taxId"
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Información de Contacto */}
                <h6 className="border-bottom pb-2 mb-3 mt-4">Información de Contacto</h6>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="phone" className="form-label">
                      Teléfono <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="contactPerson" className="form-label">
                    Persona de Contacto
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                  />
                </div>

                {/* Ubicación */}
                <h6 className="border-bottom pb-2 mb-3 mt-4">Ubicación</h6>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                    Dirección <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="city" className="form-label">
                      Ciudad <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="country" className="form-label">
                      País <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Información Comercial */}
                <h6 className="border-bottom pb-2 mb-3 mt-4">Información Comercial</h6>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="paymentTerms" className="form-label">
                      Términos de Pago
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="paymentTerms"
                      name="paymentTerms"
                      value={formData.paymentTerms}
                      onChange={handleChange}
                      placeholder="Ej: 30 días, Contado, etc."
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="status" className="form-label">
                      Estado
                    </label>
                    <select
                      className="form-select"
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="notes" className="form-label">
                    Notas
                  </label>
                  <textarea
                    className="form-control"
                    id="notes"
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {supplier ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
