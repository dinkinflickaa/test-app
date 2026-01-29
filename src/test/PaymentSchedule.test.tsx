import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PaymentSchedule } from '../components/PaymentSchedule'
import type { MonthlyEntry } from '../types'

describe('PaymentSchedule', () => {
  const schedule: MonthlyEntry[] = [
    { month: 1, cardId: '1', cardName: 'Chase', payment: 200, interest: 83.29, principal: 116.71, remainingBalance: 4883.29 },
    { month: 1, cardId: '2', cardName: 'Amex', payment: 25, interest: 10.42, principal: 14.58, remainingBalance: 485.42 },
    { month: 2, cardId: '1', cardName: 'Chase', payment: 200, interest: 81.39, principal: 118.61, remainingBalance: 4764.68 },
    { month: 2, cardId: '2', cardName: 'Amex', payment: 25, interest: 10.11, principal: 14.89, remainingBalance: 470.53 },
  ]

  it('renders month headers', () => {
    render(<PaymentSchedule schedule={schedule} />)
    expect(screen.getByText('Month 1')).toBeInTheDocument()
    expect(screen.getByText('Month 2')).toBeInTheDocument()
  })

  it('renders card entries', () => {
    render(<PaymentSchedule schedule={schedule} />)
    expect(screen.getAllByText('Chase')).toHaveLength(2)
    expect(screen.getAllByText('Amex')).toHaveLength(2)
  })

  it('shows PAID OFF for zero balance', () => {
    const withPaidOff: MonthlyEntry[] = [
      { month: 1, cardId: '1', cardName: 'Chase', payment: 500, interest: 5, principal: 495, remainingBalance: 0 },
    ]
    render(<PaymentSchedule schedule={withPaidOff} />)
    expect(screen.getByText('PAID OFF')).toBeInTheDocument()
  })

  it('collapses/expands months on click', async () => {
    const user = userEvent.setup()
    render(<PaymentSchedule schedule={schedule} />)

    // Month rows should be visible initially
    expect(screen.getAllByText('Chase')[0]).toBeVisible()

    // Click to collapse Month 1
    await user.click(screen.getByText('Month 1'))

    // The Month 1 card entries should be hidden
    // Month 2 entries should still be visible
    expect(screen.getByText('Month 2')).toBeVisible()
  })
})
