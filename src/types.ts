export interface CreditCard {
  id: string
  name: string
  balance: number
  apr: number
  minPaymentOverride: number | null
}

export interface MonthlyEntry {
  month: number
  cardId: string
  cardName: string
  payment: number
  interest: number
  principal: number
  remainingBalance: number
}

export interface PaymentPlan {
  schedule: MonthlyEntry[]
  totalInterest: number
  totalPaid: number
  months: number
}
