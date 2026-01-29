import { computeMinPayment } from '../calculator'

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
