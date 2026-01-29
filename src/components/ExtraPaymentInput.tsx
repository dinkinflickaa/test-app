import { useEffect, useState } from 'react'

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
        <h2>Extra Monthly Payment ($)</h2>
        <input
          type="number"
          value={localValue}
          min={0}
          step={10}
          onChange={handleChange}
          style={{ padding: '0.5rem', fontSize: '1rem', width: '150px' }}
        />
      </label>
    </div>
  )
}
