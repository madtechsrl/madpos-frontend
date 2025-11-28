"use client"

import { formatCurrency } from "../../lib/utils"
import type { Invoice } from "../../types/invoice"

interface InvoicePreviewProps {
  invoice: Invoice
  onClose?: () => void
  onPrint?: () => void
}

export function InvoicePreview({ invoice, onClose, onPrint }: InvoicePreviewProps) {
  console.log("InvoicePreview rendering with invoice:", invoice.invoiceNumber)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const hasFiscalValitidy = !!(invoice.clientId && invoice.clientTaxId?.trim())

  return (
    <div className="invoice-preview bg-white">
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .invoice-preview {
            max-width: 80mm;
            margin: 0;
            padding: 10mm;
          }
        }
      `}</style>

      {/* Header Actions */}
      <div className="d-flex justify-content-end gap-2 mb-3 no-print">
        {onPrint && (
          <button className="btn btn-primary" onClick={onPrint}>
            <i className="fas fa-print me-2"></i>
            Imprimir
          </button>
        )}
        {onClose && (
          <button className="btn btn-secondary" onClick={onClose}>
            <i className="fas fa-times me-2"></i>
            Cerrar
          </button>
        )}
      </div>

      {/* Invoice Content */}
      <div className="invoice-content border rounded p-4" style={{ maxWidth: "400px", margin: "0 auto" }}>
        {/* Store Header */}
        <div className="text-center mb-3 pb-3 border-bottom">
          <h3 className="fw-bold mb-1">{hasFiscalValitidy ? "Factura Fiscal":"RECIBO3"}</h3>
          <h4 className="fw-bold mb-2">{invoice.storeName}</h4>
          {invoice.storeAddress && <div className="small text-muted">{invoice.storeAddress}</div>}
          {invoice.storePhone && <div className="small text-muted">Tel: {invoice.storePhone}</div>}
          {invoice.storeEmail && <div className="small text-muted">{invoice.storeEmail}</div>}
          {invoice.storeTaxId && <div className="small text-muted">{invoice.storeTaxId}</div>}
        </div>

        {/* Invoice Info */}
        <div className="mb-3 pb-3 border-bottom">
          <div className="d-flex justify-content-between mb-1">
            <span className="small fw-bold">No. {hasFiscalValitidy ? "Factura" : "Recibo"}:</span>
            <span className="small">{invoice.invoiceNumber}</span>
          </div>
          <div className="d-flex justify-content-between mb-1">
            <span className="small fw-bold">Fecha:</span>
            <span className="small">{formatDate(invoice.date)}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span className="small fw-bold">Cajero:</span>
            <span className="small">{invoice.cashierName}</span>
          </div>
        </div>

        {/* Client Info */}
        <div className="mb-3 pb-3 border-bottom">
          <div className="fw-bold small mb-1">
            <i className="fas fa-user me-2"></i>Cliente
          </div>
          <div className="small">{invoice.clientName}</div>
          {invoice.clientPhone && <div className="small text-muted">{invoice.clientPhone}</div>}
          {invoice.clientAddress && <div className="small text-muted">{invoice.clientAddress}</div>}
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mb-3 pb-3 border-bottom">
            <div className="small text-muted">
              <strong>Observaciones:</strong> {invoice.notes}
            </div>
          </div>
        )}

        {/* Items */}
        <div className="mb-3 pb-3 border-bottom">
          <div className="fw-bold small mb-2">
            {invoice.items.length} artículo{invoice.items.length !== 1 ? "s" : ""} (Cant.:{" "}
            {invoice.items.reduce((sum, item) => sum + item.quantity, 0)})
          </div>
          {invoice.items.map((item) => (
            <div key={item.id} className="mb-2">
              <div className="d-flex justify-content-between">
                <div className="flex-grow-1">
                  <div className="small">
                    {item.quantity}x {item.productName}
                  </div>
                  <div className="small text-muted">{item.productCode}</div>
                </div>
                <div className="text-end">
                  <div className="small fw-bold">{formatCurrency(item.total)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1">
            <span className="small">Subtotal:</span>
            <span className="small">{formatCurrency(invoice.subtotal)}</span>
          </div>

          {invoice.discountAmount > 0 && (
            <div className="d-flex justify-content-between mb-1 text-success">
              <span className="small">Descuento ({invoice.discountRate.toFixed(0)}%):</span>
              <span className="small">-{formatCurrency(invoice.discountAmount)}</span>
            </div>
          )}

          {invoice.taxAmount > 0 && (
            <div className="d-flex justify-content-between mb-1">
              <span className="small">ITBIS ({(invoice.taxRate * 100).toFixed(0)}%):</span>
              <span className="small">{formatCurrency(invoice.taxAmount)}</span>
            </div>
          )}

          <div className="d-flex justify-content-between pt-2 border-top">
            <span className="fw-bold">TOTAL:</span>
            <span className="fw-bold fs-5">{formatCurrency(invoice.total)}</span>
          </div>
        </div>

        {/* Payment Info */}
        <div className="mb-3 pb-3 border-bottom">
          <div className="d-flex justify-content-between mb-1">
            <span className="small">Método de pago:</span>
            <span className="small fw-bold">{invoice.paymentMethod}</span>
          </div>
          <div className="d-flex justify-content-between mb-1">
            <span className="small">Recibido:</span>
            <span className="small">{formatCurrency(invoice.amountPaid)}</span>
          </div>
          {invoice.change > 0 && (
            <div className="d-flex justify-content-between text-success">
              <span className="small">Cambio:</span>
              <span className="small fw-bold">{formatCurrency(invoice.change)}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="small text-muted mb-2">¡Gracias por su compra!</div>
          <div className={`small fw-bold ${hasFiscalValitidy  ? "text-success" : "text-muted"}`}>
            {hasFiscalValitidy  ? "✓ Documento con validez fiscal" : "Este documento no tiene validez fiscal"}
          </div>
        </div>
      </div>
    </div>
  )
}
