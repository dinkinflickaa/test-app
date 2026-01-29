import { useState } from 'react'
import type { MonthlyEntry } from '../types'
import './PaymentSchedule.css'

interface Props {
  schedule: MonthlyEntry[]
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function PaymentSchedule({ schedule }: Props) {
  const [collapsedMonths, setCollapsedMonths] = useState<Set<number>>(new Set())

  const months = [...new Set(schedule.map(e => e.month))].sort((a, b) => a - b)

  const toggleMonth = (month: number) => {
    setCollapsedMonths(prev => {
      const next = new Set(prev)
      if (next.has(month)) {
        next.delete(month)
      } else {
        next.add(month)
      }
      return next
    })
  }

  return (
    <div className="payment-schedule">
      <h2>Payment Schedule</h2>
      {months.map(month => {
        const entries = schedule.filter(e => e.month === month)
        const isCollapsed = collapsedMonths.has(month)

        return (
          <div key={month} className="month-group">
            <div className="month-header" onClick={() => toggleMonth(month)}>
              <span>Month {month}</span>
              <span>{isCollapsed ? '▶' : '▼'}</span>
            </div>
            {!isCollapsed && (
              <table className="month-table">
                <thead>
                  <tr>
                    <th>Card</th>
                    <th>Payment</th>
                    <th>Interest</th>
                    <th>Principal</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map(entry => (
                    <tr key={entry.cardId}>
                      <td>{entry.cardName}</td>
                      <td>{formatCurrency(entry.payment)}</td>
                      <td>{formatCurrency(entry.interest)}</td>
                      <td>{formatCurrency(entry.principal)}</td>
                      <td>
                        {entry.remainingBalance === 0 ? (
                          <span className="paid-off">PAID OFF</span>
                        ) : (
                          formatCurrency(entry.remainingBalance)
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )
      })}
    </div>
  )
}
