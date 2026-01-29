const MIN_PAYMENT_FLOOR = 25
const MIN_PAYMENT_PERCENT = 0.02

export function computeMinPayment(
  balance: number,
  fixedOverride: number | null
): number {
  if (balance <= 0) return 0

  if (fixedOverride !== null) {
    return Math.min(fixedOverride, balance)
  }

  const percentBased = balance * MIN_PAYMENT_PERCENT
  const minPayment = Math.max(percentBased, MIN_PAYMENT_FLOOR)
  return Math.min(minPayment, balance)
}
