import type React from "react"

interface CartDiscountControlsProps {
  discountInput: string
  onDiscountChange: (value: string) => void
  applyTax: boolean
  onTaxChange: (apply: boolean) => void
}

export function CartDiscountControls({
  discountInput,
  onDiscountChange,
  applyTax,
  onTaxChange,
}: CartDiscountControlsProps) {
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow empty string or valid numbers
    if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 100)) {
      onDiscountChange(value)
    }
  }

  return (
    <div className="border-top p-3">
      {/* Discount Input */}
      <div className="mb-3">
        <label htmlFor="discount-input" className="form-label small mb-1">
          Descuento (%)
        </label>
        <input
          id="discount-input"
          className="form-control form-control-sm"
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={discountInput}
          onChange={handleDiscountChange}
          placeholder="0"
        />
        <small className="text-muted">Ingresa un valor entre 0 y 100</small>
      </div>

      {/* Tax Checkbox */}
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="apply-tax"
          checked={applyTax}
          onChange={(e) => onTaxChange(e.target.checked)}
        />
        <label className="form-check-label small" htmlFor="apply-tax">
          Aplicar ITBIS (18%)
        </label>
      </div>
    </div>
  )
}
