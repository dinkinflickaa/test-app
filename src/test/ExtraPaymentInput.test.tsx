import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExtraPaymentInput } from '../components/ExtraPaymentInput'

describe('ExtraPaymentInput', () => {
  it('renders with current value', () => {
    render(<ExtraPaymentInput value={200} onChange={vi.fn()} />)
    expect(screen.getByDisplayValue('200')).toBeInTheDocument()
  })

  it('calls onChange with new value', async () => {
    const mockOnChange = vi.fn()
    const user = userEvent.setup()
    render(<ExtraPaymentInput value={0} onChange={mockOnChange} />)

    const input = screen.getByRole('spinbutton')
    await user.clear(input)
    await user.type(input, '300')

    const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0]
    expect(lastCall).toBe(300)
  })
})
