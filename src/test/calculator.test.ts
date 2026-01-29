import { computeMinPayment, calculateOptimalPlan, calculateMinimumOnlyPlan } from '../calculator'
import type { CreditCard } from '../types'

describe('computeMinPayment', () => {
  it('returns 2% of balance when greater than $25', () => {
    expect(computeMinPayment(5000, null)).toBe(100) // 2% of 5000
  })

  it('returns $25 floor when 2% is less than $25', () => {
    expect(computeMinPayment(800, null)).toBe(25) // 2% of 800 = 16, floor is 25
  })

  it('returns balance when balance is less than $25', () => {
    expect(computeMinPayment(15, null)).toBe(15)
  })

  it('returns fixed override when provided', () => {
    expect(computeMinPayment(5000, 150)).toBe(150)
  })

  it('returns balance when override exceeds balance', () => {
    expect(computeMinPayment(50, 150)).toBe(50)
  })

  it('returns 0 for zero balance', () => {
    expect(computeMinPayment(0, null)).toBe(0)
  })
})

describe('calculateOptimalPlan', () => {
  it('pays off a single card correctly', () => {
    const cards: CreditCard[] = [
      { id: '1', name: 'Card A', balance: 1000, apr: 20, minPaymentOverride: null },
    ]
    const plan = calculateOptimalPlan(cards, 100)

    expect(plan.months).toBeGreaterThan(0)
    expect(plan.months).toBeLessThan(360)
    expect(plan.totalPaid).toBeGreaterThan(1000)
    expect(plan.totalInterest).toBeGreaterThan(0)
    // Last entry should have remaining balance of 0
    const lastEntries = plan.schedule.filter(e => e.month === plan.months)
    expect(lastEntries.every(e => e.remainingBalance === 0)).toBe(true)
  })

  it('prioritizes highest APR card with extra payment', () => {
    const cards: CreditCard[] = [
      { id: '1', name: 'Low APR', balance: 1000, apr: 10, minPaymentOverride: null },
      { id: '2', name: 'High APR', balance: 1000, apr: 25, minPaymentOverride: null },
    ]
    const plan = calculateOptimalPlan(cards, 200)

    // In month 1, High APR card should get a larger payment than Low APR
    const month1 = plan.schedule.filter(e => e.month === 1)
    const highAprPayment = month1.find(e => e.cardId === '2')!.payment
    const lowAprPayment = month1.find(e => e.cardId === '1')!.payment
    expect(highAprPayment).toBeGreaterThan(lowAprPayment)
  })

  it('handles zero extra payment (minimums only)', () => {
    const cards: CreditCard[] = [
      { id: '1', name: 'Card A', balance: 1000, apr: 20, minPaymentOverride: null },
    ]
    const plan = calculateOptimalPlan(cards, 0)

    expect(plan.months).toBeGreaterThan(0)
    expect(plan.totalPaid).toBeGreaterThan(1000)
  })

  it('caps simulation at 360 months', () => {
    const cards: CreditCard[] = [
      { id: '1', name: 'Card A', balance: 100000, apr: 30, minPaymentOverride: null },
    ]
    // Very small extra payment — will take extremely long
    const plan = calculateOptimalPlan(cards, 0)

    expect(plan.months).toBeLessThanOrEqual(360)
  })

  it('handles extra payment larger than total debt', () => {
    const cards: CreditCard[] = [
      { id: '1', name: 'Card A', balance: 500, apr: 15, minPaymentOverride: null },
    ]
    const plan = calculateOptimalPlan(cards, 10000)

    expect(plan.months).toBe(1)
    expect(plan.totalPaid).toBeCloseTo(500 + 500 * (0.15 / 12), 2)
  })

  it('returns empty plan for empty cards array', () => {
    const plan = calculateOptimalPlan([], 100)

    expect(plan.months).toBe(0)
    expect(plan.totalInterest).toBe(0)
    expect(plan.totalPaid).toBe(0)
    expect(plan.schedule).toEqual([])
  })
})

describe('calculateMinimumOnlyPlan', () => {
  it('is equivalent to optimal plan with zero extra payment', () => {
    const cards: CreditCard[] = [
      { id: '1', name: 'Card A', balance: 3000, apr: 18, minPaymentOverride: null },
      { id: '2', name: 'Card B', balance: 1500, apr: 22, minPaymentOverride: null },
    ]

    const minOnly = calculateMinimumOnlyPlan(cards)
    const optimalZero = calculateOptimalPlan(cards, 0)

    expect(minOnly.totalInterest).toBe(optimalZero.totalInterest)
    expect(minOnly.totalPaid).toBe(optimalZero.totalPaid)
    expect(minOnly.months).toBe(optimalZero.months)
  })

  it('pays more interest than optimal plan with extra payment', () => {
    const cards: CreditCard[] = [
      { id: '1', name: 'Card A', balance: 5000, apr: 20, minPaymentOverride: null },
    ]

    const minOnly = calculateMinimumOnlyPlan(cards)
    const optimal = calculateOptimalPlan(cards, 200)

    expect(minOnly.totalInterest).toBeGreaterThan(optimal.totalInterest)
    expect(minOnly.months).toBeGreaterThan(optimal.months)
  })
})
