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
import './BalanceChart.css'

interface Props {
  optimalPlan: PaymentPlan
  minOnlyPlan: PaymentPlan
}

const COLORS = ['#8B5CF6', '#6366F1', '#34D399', '#F59E0B', '#EC4899', '#06B6D4']

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
    <div className="balance-chart">
      <h2>Balance Over Time</h2>
      <label className="chart-toggle">
        <input
          type="checkbox"
          checked={showMinOnly}
          onChange={e => setShowMinOnly(e.target.checked)}
        />
        <span>Show minimum payments only</span>
      </label>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="month"
            stroke="rgba(255,255,255,0.1)"
            tick={{ fill: '#94A3B8', fontSize: 12, fontFamily: 'Inter' }}
            label={{ value: 'Month', position: 'insideBottom', offset: -5, fill: '#64748B' }}
          />
          <YAxis
            stroke="rgba(255,255,255,0.1)"
            tick={{ fill: '#94A3B8', fontSize: 12, fontFamily: 'Inter' }}
            label={{ value: 'Balance ($)', angle: -90, position: 'insideLeft', fill: '#64748B' }}
          />
          <Tooltip
            formatter={(value) => `$${Number(value).toFixed(2)}`}
            contentStyle={{
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '10px',
              color: '#F8FAFC',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.82rem',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
            labelStyle={{ color: '#94A3B8', fontFamily: 'Inter, sans-serif', marginBottom: '4px' }}
          />
          <Legend
            wrapperStyle={{ color: '#CBD5E1', fontFamily: 'Inter, sans-serif', fontSize: '0.82rem' }}
          />
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
            stroke="#F8FAFC"
            strokeWidth={2.5}
            strokeDasharray="6 4"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
