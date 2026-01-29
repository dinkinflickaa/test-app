import { render, screen } from '@testing-library/react'
import { BalanceChart } from '../components/BalanceChart'
import type { PaymentPlan } from '../types'

describe('BalanceChart', () => {
  const optimalPlan: PaymentPlan = {
    schedule: [
      { month: 1, cardId: '1', cardName: 'Chase', payment: 200, interest: 80, principal: 120, remainingBalance: 4880 },
      { month: 2, cardId: '1', cardName: 'Chase', payment: 200, interest: 78, principal: 122, remainingBalance: 4758 },
    ],
    totalInterest: 158,
    totalPaid: 400,
    months: 2,
  }

  const minOnlyPlan: PaymentPlan = {
    schedule: [
      { month: 1, cardId: '1', cardName: 'Chase', payment: 100, interest: 80, principal: 20, remainingBalance: 4980 },
      { month: 2, cardId: '1', cardName: 'Chase', payment: 100, interest: 79.6, principal: 20.4, remainingBalance: 4959.6 },
    ],
    totalInterest: 159.6,
    totalPaid: 200,
    months: 2,
  }

  it('renders without crashing', () => {
    render(<BalanceChart optimalPlan={optimalPlan} minOnlyPlan={minOnlyPlan} />)
    expect(screen.getByText('Balance Over Time')).toBeInTheDocument()
  })

  it('has a toggle for comparison view', () => {
    render(<BalanceChart optimalPlan={optimalPlan} minOnlyPlan={minOnlyPlan} />)
    expect(screen.getByText(/minimum/i)).toBeInTheDocument()
  })
})
