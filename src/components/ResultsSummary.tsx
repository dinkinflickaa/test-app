import type { PaymentPlan } from '../types'
import './ResultsSummary.css'

interface Props {
  optimalPlan: PaymentPlan
  minOnlyPlan: PaymentPlan
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function ResultsSummary({ optimalPlan, minOnlyPlan }: Props) {
  const interestSaved = minOnlyPlan.totalInterest - optimalPlan.totalInterest
  const monthsSaved = minOnlyPlan.months - optimalPlan.months

  return (
    <div className="results-summary">
      <div className="summary-card">
        <div className="label">Total Interest (Optimal)</div>
        <div className="value">{formatCurrency(optimalPlan.totalInterest)}</div>
      </div>
      <div className="summary-card">
        <div className="label">Total Interest (Minimums Only)</div>
        <div className="value">{formatCurrency(minOnlyPlan.totalInterest)}</div>
      </div>
      <div className="summary-card">
        <div className="label">Interest Saved</div>
        <div className="value saved">{formatCurrency(interestSaved)}</div>
      </div>
      <div className="summary-card">
        <div className="label">Debt-Free In</div>
        <div className="value">{optimalPlan.months} months</div>
      </div>
      <div className="summary-card">
        <div className="label">Time Saved</div>
        <div className="value saved">{monthsSaved} months faster</div>
      </div>
      <div className="summary-card">
        <div className="label">Total Paid</div>
        <div className="value">{formatCurrency(optimalPlan.totalPaid)}</div>
      </div>
    </div>
  )
}
