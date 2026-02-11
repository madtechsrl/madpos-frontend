import { formatCurrency } from "../../lib/utils"

interface CartSummaryProps {
  subtotal: number
  discountAmount: number
  discountRate: number
  taxAmount: number
  total: number
  applyTax: boolean
}

export function CartSummary({ subtotal, discountAmount, discountRate, taxAmount, total, applyTax }: CartSummaryProps) {
  return (
    <div className="border-top p-3">
      {/* Subtotal */}
      <div className="d-flex justify-content-between mb-2">
        <span className="text-secondary">Subtotal:</span>
        <span className="fw-medium">{formatCurrency(subtotal)}</span>
      </div>

      {/* Discount */}
      {discountAmount > 0 && (
        <div className="d-flex justify-content-between mb-2 text-success">
          <span className="text-secondary">Descuento ({discountRate.toFixed(0)}%):</span>
          <span className="fw-medium">-{formatCurrency(discountAmount)}</span>
        </div>
      )}

      {/* Tax */}
      {applyTax && (
        <div className="d-flex justify-content-between mb-2">
          <span className="text-secondary">ITBIS (18%):</span>
          <span className="fw-medium">{formatCurrency(taxAmount)}</span>
        </div>
      )}

      {/* Total */}
      <div className="d-flex justify-content-between mb-3 pt-2 border-top">
        <span className="fw-bold">Total:</span>
        <span className="fw-bold fs-5">{formatCurrency(total)}</span>
      </div>
    </div>
  )
}
