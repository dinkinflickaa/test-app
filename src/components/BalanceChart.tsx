import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { PaymentPlan, MonthlyEntry } from '../types'

interface Props {
  optimalPlan: PaymentPlan
  minOnlyPlan: PaymentPlan
}

const COLORS = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c']

function buildChartData(schedule: MonthlyEntry[], cardNames: string[]) {
  const months = [...new Set(schedule.map(e => e.month))].sort((a, b) => a - b)

  return months.map(month => {
    const entries = schedule.filter(e => e.month === month)
    const point: Record<string, number> = { month }
    let total = 0
    for (const name of cardNames) {
      const entry = entries.find(e => e.cardName === name)
      const balance = entry?.remainingBalance ?? 0
      point[name] = balance
      total += balance
    }
    point['Total'] = total
    return point
  })
}

export function BalanceChart({ optimalPlan, minOnlyPlan }: Props) {
  const [showMinOnly, setShowMinOnly] = useState(false)

  const plan = showMinOnly ? minOnlyPlan : optimalPlan
  const cardNames = [...new Set(plan.schedule.map(e => e.cardName))]
  const data = buildChartData(plan.schedule, cardNames)

  return (
    <div style={{ margin: '1.5rem 0' }}>
      <h2>Balance Over Time</h2>
      <label style={{ display: 'block', marginBottom: '1rem' }}>
        <input
          type="checkbox"
          checked={showMinOnly}
          onChange={e => setShowMinOnly(e.target.checked)}
        />{' '}
        Show minimum payments only
      </label>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Balance ($)', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
          <Legend />
          {cardNames.map((name, i) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              dot={false}
            />
          ))}
          <Line
            type="monotone"
            dataKey="Total"
            stroke="#2c3e50"
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
