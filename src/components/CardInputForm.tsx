import { useEffect, useState } from 'react'
import type { CreditCard } from '../types'
import './CardInputForm.css'

interface Props {
  cards: CreditCard[]
  onChange: (cards: CreditCard[]) => void
}

export function CardInputForm({ cards, onChange }: Props) {
  const [localCards, setLocalCards] = useState(cards)

  useEffect(() => {
    setLocalCards(cards)
  }, [cards])

  const updateCard = (id: string, field: keyof CreditCard, value: string | number | null) => {
    const updated = localCards.map(c => (c.id === id ? { ...c, [field]: value } : c))
    setLocalCards(updated)
    onChange(updated)
  }

  const addCard = () => {
    const newCard: CreditCard = {
      id: crypto.randomUUID(),
      name: '',
      balance: 0,
      apr: 0,
      minPaymentOverride: null,
    }
    const updated = [...localCards, newCard]
    setLocalCards(updated)
    onChange(updated)
  }

  const removeCard = (id: string) => {
    const updated = localCards.filter(c => c.id !== id)
    setLocalCards(updated)
    onChange(updated)
  }

  return (
    <div className="card-input-form">
      <h2>Credit Cards</h2>
      {localCards.map(card => (
        <div key={card.id} className="card-row">
          <label>
            Name
            <input
              type="text"
              value={card.name}
              onChange={e => updateCard(card.id, 'name', e.target.value)}
              placeholder="e.g. Chase Sapphire"
            />
          </label>
          <label>
            Balance ($)
            <input
              type="number"
              value={card.balance}
              min={0}
              onChange={e => updateCard(card.id, 'balance', parseFloat(e.target.value) || 0)}
            />
          </label>
          <label>
            APR (%)
            <input
              type="number"
              value={card.apr}
              min={0}
              max={100}
              step={0.01}
              onChange={e => updateCard(card.id, 'apr', parseFloat(e.target.value) || 0)}
            />
          </label>
          <label>
            Min Payment ($)
            <input
              type="number"
              value={card.minPaymentOverride ?? ''}
              min={0}
              placeholder="Auto"
              onChange={e => {
                const val = e.target.value
                updateCard(card.id, 'minPaymentOverride', val === '' ? null : parseFloat(val) || 0)
              }}
            />
          </label>
          <button className="btn-remove" onClick={() => removeCard(card.id)}>
            Remove
          </button>
        </div>
      ))}
      <button className="btn-add" onClick={addCard}>
        Add Card
      </button>
    </div>
  )
}
