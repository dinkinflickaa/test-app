import { useEffect, useState } from 'react'
import './ExtraPaymentInput.css'

interface Props {
  value: number
  onChange: (value: number) => void
}

export function ExtraPaymentInput({ value, onChange }: Props) {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(e.target.value) || 0
    setLocalValue(parsed)
    onChange(parsed)
  }

  return (
    <div className="extra-payment-input">
      <label>
        <h2>Extra Monthly Payment</h2>
        <div className="input-wrapper">
          <span className="input-prefix">$</span>
          <input
            type="number"
            value={localValue}
            min={0}
            step={10}
            onChange={handleChange}
          />
        </div>
      </label>
    </div>
  )
}
