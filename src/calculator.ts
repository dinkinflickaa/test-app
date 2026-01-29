import type { CreditCard, MonthlyEntry, PaymentPlan } from './types'

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

const MAX_MONTHS = 360

export function calculateOptimalPlan(
  cards: CreditCard[],
  extraPayment: number
): PaymentPlan {
  if (cards.length === 0) {
    return { schedule: [], totalInterest: 0, totalPaid: 0, months: 0 }
  }

  const balances = new Map<string, number>()
  for (const card of cards) {
    balances.set(card.id, card.balance)
  }

  const schedule: MonthlyEntry[] = []
  let totalInterest = 0
  let totalPaid = 0
  let month = 0

  // Sort cards by APR descending (avalanche order)
  const sortedCards = [...cards].sort((a, b) => b.apr - a.apr)

  while (month < MAX_MONTHS) {
    // Check if all balances are zero
    const totalBalance = Array.from(balances.values()).reduce((sum, b) => sum + b, 0)
    if (totalBalance <= 0) break

    month++
    let extraRemaining = extraPayment

    // Step 1: Apply interest to all cards
    const interestMap = new Map<string, number>()
    for (const card of sortedCards) {
      const balance = balances.get(card.id)!
      if (balance <= 0) continue
      const interest = balance * (card.apr / 100 / 12)
      interestMap.set(card.id, interest)
      balances.set(card.id, balance + interest)
    }

    // Step 2: Pay minimums on all cards
    const minPaymentMap = new Map<string, number>()
    for (const card of sortedCards) {
      const balance = balances.get(card.id)!
      if (balance <= 0) continue
      const minPayment = computeMinPayment(balance, card.minPaymentOverride)
      const actualPayment = Math.min(minPayment, balance)
      minPaymentMap.set(card.id, actualPayment)
      balances.set(card.id, balance - actualPayment)
    }

    // Step 3: Allocate extra payment to highest APR card with remaining balance
    const extraPaymentMap = new Map<string, number>()
    for (const card of sortedCards) {
      if (extraRemaining <= 0) break
      const balance = balances.get(card.id)!
      if (balance <= 0) continue
      const extraForCard = Math.min(extraRemaining, balance)
      extraPaymentMap.set(card.id, extraForCard)
      balances.set(card.id, balance - extraForCard)
      extraRemaining -= extraForCard
    }

    // Step 4: Record entries for this month
    for (const card of sortedCards) {
      const interest = interestMap.get(card.id) ?? 0
      const minPaid = minPaymentMap.get(card.id) ?? 0
      const extraPaid = extraPaymentMap.get(card.id) ?? 0
      const totalPayment = minPaid + extraPaid

      if (interest === 0 && totalPayment === 0) continue

      const remaining = Math.max(0, balances.get(card.id)!)
      // Clean up floating point
      balances.set(card.id, remaining)

      const principal = totalPayment - interest
      totalInterest += interest
      totalPaid += totalPayment

      schedule.push({
        month,
        cardId: card.id,
        cardName: card.name,
        payment: Math.round(totalPayment * 100) / 100,
        interest: Math.round(interest * 100) / 100,
        principal: Math.round(principal * 100) / 100,
        remainingBalance: Math.round(remaining * 100) / 100,
      })
    }
  }

  return {
    schedule,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPaid: Math.round(totalPaid * 100) / 100,
    months: month,
  }
}

export function calculateMinimumOnlyPlan(cards: CreditCard[]): PaymentPlan {
  return calculateOptimalPlan(cards, 0)
}
