import type { CreditCard, MonthlyEntry, PaymentPlan } from '../types'

describe('types', () => {
  it('CreditCard has required fields', () => {
    const card: CreditCard = {
      id: '1',
      name: 'Chase',
      balance: 5000,
      apr: 19.99,
      minPaymentOverride: null,
    }
    expect(card.balance).toBe(5000)
    expect(card.minPaymentOverride).toBeNull()
  })

  it('MonthlyEntry tracks payment breakdown', () => {
    const entry: MonthlyEntry = {
      month: 1,
      cardId: '1',
      cardName: 'Chase',
      payment: 200,
      interest: 83.29,
      principal: 116.71,
      remainingBalance: 4883.29,
    }
    expect(entry.principal).toBeCloseTo(entry.payment - entry.interest)
  })

  it('PaymentPlan has summary and schedule', () => {
    const plan: PaymentPlan = {
      schedule: [],
      totalInterest: 0,
      totalPaid: 0,
      months: 0,
    }
    expect(plan.schedule).toEqual([])
  })
})
