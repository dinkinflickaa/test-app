import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CardInputForm } from '../components/CardInputForm'
import type { CreditCard } from '../types'

describe('CardInputForm', () => {
  const mockOnChange = vi.fn()

  const sampleCards: CreditCard[] = [
    { id: '1', name: 'Chase', balance: 5000, apr: 19.99, minPaymentOverride: null },
  ]

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it('renders existing cards', () => {
    render(<CardInputForm cards={sampleCards} onChange={mockOnChange} />)
    expect(screen.getByDisplayValue('Chase')).toBeInTheDocument()
    expect(screen.getByDisplayValue('5000')).toBeInTheDocument()
    expect(screen.getByDisplayValue('19.99')).toBeInTheDocument()
  })

  it('adds a new card when Add Card is clicked', async () => {
    const user = userEvent.setup()
    render(<CardInputForm cards={sampleCards} onChange={mockOnChange} />)

    await user.click(screen.getByText('Add Card'))

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Chase' }),
        expect.objectContaining({ name: '', balance: 0, apr: 0, minPaymentOverride: null }),
      ])
    )
  })

  it('removes a card when Remove is clicked', async () => {
    const user = userEvent.setup()
    render(<CardInputForm cards={sampleCards} onChange={mockOnChange} />)

    await user.click(screen.getByText('Remove'))

    expect(mockOnChange).toHaveBeenCalledWith([])
  })

  it('updates card name on input change', async () => {
    const user = userEvent.setup()
    render(<CardInputForm cards={sampleCards} onChange={mockOnChange} />)

    const nameInput = screen.getByDisplayValue('Chase')
    await user.clear(nameInput)
    await user.type(nameInput, 'Amex')

    const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0]
    expect(lastCall[0].name).toBe('Amex')
  })
})
