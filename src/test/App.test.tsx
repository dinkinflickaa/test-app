import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('App', () => {
  it('renders the app title', () => {
    render(<App />)
    expect(screen.getByText('Debt Repayment Calculator')).toBeInTheDocument()
  })

  it('starts with one empty card', () => {
    render(<App />)
    expect(screen.getByText('Credit Cards')).toBeInTheDocument()
    expect(screen.getByText('Remove')).toBeInTheDocument()
  })

  it('shows results after clicking Calculate', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Fill in card data
    const nameInput = screen.getByPlaceholderText('e.g. Chase Sapphire')
    await user.clear(nameInput)
    await user.type(nameInput, 'Test Card')

    const balanceInputs = screen.getAllByRole('spinbutton')
    // balanceInputs[0] = balance, [1] = apr, [2] = min payment, [3] = extra payment
    await user.clear(balanceInputs[0])
    await user.type(balanceInputs[0], '5000')

    await user.clear(balanceInputs[1])
    await user.type(balanceInputs[1], '20')

    await user.clear(balanceInputs[3]) // extra payment
    await user.type(balanceInputs[3], '200')

    await user.click(screen.getByText('Calculate'))

    // Results should appear
    expect(screen.getByText(/Interest Saved/)).toBeInTheDocument()
    expect(screen.getByText(/Payment Schedule/)).toBeInTheDocument()
    expect(screen.getByText(/Balance Over Time/)).toBeInTheDocument()
  })

  it('shows validation error when no cards have balance', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByText('Calculate'))

    expect(screen.getByText(/at least one card with a balance/i)).toBeInTheDocument()
  })
})
