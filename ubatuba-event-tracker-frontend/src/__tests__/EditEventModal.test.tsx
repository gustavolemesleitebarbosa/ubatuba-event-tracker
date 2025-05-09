import { render, screen, fireEvent } from '@testing-library/react'
import { EditEventModal } from '../components/EditEventModal'
import { vi } from 'vitest'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { BrowserRouter } from 'react-router-dom'

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('EditEventModal', () => {
  const mockOnSave = vi.fn()
  const mockEvent = {
    id: '1',
    title: 'Test Event',
    description: 'Test Description',
    location: 'Test Location',
    date: '2024-12-31T23:59',
    image: '',
    category: null,
  }

  beforeEach(() => {
    mockOnSave.mockClear()
    vi.clearAllMocks()
  })

  const renderWithProviders = (component: React.ReactNode) => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          {component}
        </AuthProvider>
      </BrowserRouter>
    )
  }

  it('renders edit button', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    })

    renderWithProviders(<EditEventModal event={mockEvent} onSave={mockOnSave} />)
    
    expect(screen.getByTestId('edit-button')).toBeInTheDocument()
  })

  it('shows loading state when updating', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    })

    renderWithProviders(
      <EditEventModal event={mockEvent} onSave={mockOnSave} updating={true} />
    )
    
    const button = screen.getByTestId('edit-button')
    expect(button).toBeDisabled()
  })

  it.only('opens modal with pre-filled event data', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    })

    renderWithProviders(<EditEventModal event={mockEvent} onSave={mockOnSave} />)
    
    const editButton = screen.getByTestId('edit-button')
    fireEvent.click(editButton)

    expect(screen.getByTestId('edit-title-input')).toHaveValue(mockEvent.title)
    expect(screen.getByTestId('edit-description-input')).toHaveValue(mockEvent.description)
    expect(screen.getByTestId('edit-location-input')).toHaveValue(mockEvent.location)
    // the date is in UTC, so we need to convert it to the local timezone
    expect(screen.getByTestId('edit-date-input')).toHaveValue('2025-01-01T02:59')
  })

  it('enables save button when form is valid', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    })

    renderWithProviders(<EditEventModal event={mockEvent} onSave={mockOnSave} />)
    
    const editButton = screen.getByTestId('edit-button')
    fireEvent.click(editButton)

    const saveButton = screen.getByTestId('save-event-button')
    expect(saveButton).toBeEnabled()
  })

  it('calls onSave with updated event data', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    })

    renderWithProviders(<EditEventModal event={mockEvent} onSave={mockOnSave} />)
    
    const editButton = screen.getByTestId('edit-button')
    fireEvent.click(editButton)

    const titleInput = screen.getByTestId('edit-title-input')
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } })

    const saveButton = screen.getByTestId('save-event-button')
    fireEvent.click(saveButton)

    expect(mockOnSave).toHaveBeenCalledWith({
      ...mockEvent,
      title: 'Updated Title',
    })
  })

  it('disables save button when required fields are empty', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    })

    renderWithProviders(<EditEventModal event={mockEvent} onSave={mockOnSave} />)
    
    const editButton = screen.getByTestId('edit-button')
    fireEvent.click(editButton)

    const titleInput = screen.getByTestId('edit-title-input')
    fireEvent.change(titleInput, { target: { value: '' } })

    const saveButton = screen.getByTestId('save-event-button')
    expect(saveButton).toBeDisabled()
  })
}) 