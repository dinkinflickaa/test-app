import { useState } from 'react'
import type { CreditCard, PaymentPlan } from './types'
import { calculateOptimalPlan, calculateMinimumOnlyPlan } from './calculator'
import { CardInputForm } from './components/CardInputForm'
import { ExtraPaymentInput } from './components/ExtraPaymentInput'
import { ResultsSummary } from './components/ResultsSummary'
import { PaymentSchedule } from './components/PaymentSchedule'
import { BalanceChart } from './components/BalanceChart'
import './App.css'

function App() {
  const [cards, setCards] = useState<CreditCard[]>([
    { id: crypto.randomUUID(), name: '', balance: 0, apr: 0, minPaymentOverride: null },
  ])
  const [extraPayment, setExtraPayment] = useState(0)
  const [optimalPlan, setOptimalPlan] = useState<PaymentPlan | null>(null)
  const [minOnlyPlan, setMinOnlyPlan] = useState<PaymentPlan | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCalculate = () => {
    setError(null)

    const validCards = cards.filter(c => c.balance > 0)
    if (validCards.length === 0) {
      setError('Please enter at least one card with a balance greater than zero.')
      return
    }

    const invalidApr = validCards.find(c => c.apr < 0 || c.apr > 100)
    if (invalidApr) {
      setError(`APR for "${invalidApr.name || 'unnamed card'}" must be between 0% and 100%.`)
      return
    }

    const optimal = calculateOptimalPlan(validCards, extraPayment)
    const minOnly = calculateMinimumOnlyPlan(validCards)
    setOptimalPlan(optimal)
    setMinOnlyPlan(minOnly)
  }

  return (
    <div className="app">
      <h1>Debt Repayment Calculator</h1>
      <p className="app-subtitle">
        Optimize your payments with the avalanche method to minimize interest
      </p>

      <div className="section-card">
        <CardInputForm cards={cards} onChange={setCards} />
      </div>

      <div className="section-card">
        <ExtraPaymentInput value={extraPayment} onChange={setExtraPayment} />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button className="btn-calculate" onClick={handleCalculate}>
        Calculate Optimal Plan
      </button>

      {optimalPlan && minOnlyPlan && (
        <>
          <hr className="results-divider" />
          <ResultsSummary optimalPlan={optimalPlan} minOnlyPlan={minOnlyPlan} />
          <div className="section-card">
            <BalanceChart optimalPlan={optimalPlan} minOnlyPlan={minOnlyPlan} />
          </div>
          <div className="section-card">
            <PaymentSchedule schedule={optimalPlan.schedule} />
          </div>
        </>
      )}
    </div>
  )
}

export default App
