import { render, screen, fireEvent } from '@testing-library/react'
import { PasswordInput } from '../components/ui/PasswordInput'
import { vi } from 'vitest'

describe('PasswordInput', () => {
  const mockOnChange = vi.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it('renders correctly', () => {
    render(
      <PasswordInput
        id="password"
        value=""
        onChange={mockOnChange}
        placeholder="Enter password"
      />
    )
    
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument()
  })

  it('toggles password visibility', () => {
    render(
      <PasswordInput
        id="password"
        value="test123"
        onChange={mockOnChange}
        placeholder="Enter password"
      />
    )

    const input = screen.getByPlaceholderText('Enter password')
    expect(input).toHaveAttribute('type', 'password')

    const toggleButton = screen.getByRole('button')
    fireEvent.click(toggleButton)
    expect(input).toHaveAttribute('type', 'text')

    fireEvent.click(toggleButton)
    expect(input).toHaveAttribute('type', 'password')
  })

  it('shows error state when error prop is provided', () => {
    render(
      <PasswordInput
        id="password"
        value=""
        onChange={mockOnChange}
        data-testid="password-input"
        error="Password is required"
      />
    )

    const input = screen.getByTestId('password-input')
    expect(input).toHaveClass('border-red-500')
  })
}) 