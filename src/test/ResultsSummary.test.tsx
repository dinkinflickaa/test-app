import { render, screen } from '@testing-library/react'
import { ResultsSummary } from '../components/ResultsSummary'
import type { PaymentPlan } from '../types'

describe('ResultsSummary', () => {
  const optimalPlan: PaymentPlan = {
    schedule: [],
    totalInterest: 1500.50,
    totalPaid: 11500.50,
    months: 24,
  }

  const minOnlyPlan: PaymentPlan = {
    schedule: [],
    totalInterest: 4200.75,
    totalPaid: 14200.75,
    months: 60,
  }

  it('displays total interest for optimal plan', () => {
    render(<ResultsSummary optimalPlan={optimalPlan} minOnlyPlan={minOnlyPlan} />)
    expect(screen.getByText(/\$1,500\.50/)).toBeInTheDocument()
  })

  it('displays interest saved', () => {
    render(<ResultsSummary optimalPlan={optimalPlan} minOnlyPlan={minOnlyPlan} />)
    expect(screen.getByText(/\$2,700\.25/)).toBeInTheDocument()
  })

  it('displays payoff timeline', () => {
    render(<ResultsSummary optimalPlan={optimalPlan} minOnlyPlan={minOnlyPlan} />)
    expect(screen.getByText(/24 months/)).toBeInTheDocument()
  })

  it('displays months saved', () => {
    render(<ResultsSummary optimalPlan={optimalPlan} minOnlyPlan={minOnlyPlan} />)
    expect(screen.getByText(/36 months faster/)).toBeInTheDocument()
  })
})
