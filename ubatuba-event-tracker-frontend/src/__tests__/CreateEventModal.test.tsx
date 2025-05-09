import { fireEvent, render, screen } from '@testing-library/react'
import { CreateEventModal } from '../components/CreateEventModal'
import { vi } from 'vitest'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { BrowserRouter } from 'react-router-dom'

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('CreateEventModal', () => {
  const mockOnCreate = vi.fn()

  beforeEach(() => {
    mockOnCreate.mockClear()
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

  it('renders create button when authenticated', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    })

    renderWithProviders(<CreateEventModal onCreate={mockOnCreate} />)
    
    expect(screen.getByText('Adicionar evento')).toBeInTheDocument()
  })

  it('renders login button when not authenticated', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
    })

    renderWithProviders(<CreateEventModal onCreate={mockOnCreate} />)
    
    expect(screen.getByText('Entrar')).toBeInTheDocument()
  })

  it('shows loading state when creating', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    })

    renderWithProviders(<CreateEventModal onCreate={mockOnCreate} creating={true} />)
    
    expect(screen.getByText('Criando...')).toBeInTheDocument()
  })

  it('should show Button as disabled when creating', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    })

    renderWithProviders(<CreateEventModal onCreate={mockOnCreate} creating={true} />)

    const button = screen.getByTestId('open-button')
    expect(button).toBeDisabled()
  })

  it('should show Button as enabled when not creating', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    })

    renderWithProviders(<CreateEventModal onCreate={mockOnCreate} creating={false} />)

    const button = screen.getByTestId('open-button')
    expect(button).toBeEnabled()
  })

  it('should enable create button when all required fields are filled', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    })

    renderWithProviders(<CreateEventModal onCreate={mockOnCreate} creating={false} />)
    const button = screen.getByTestId('open-button')
    fireEvent.click(button)

    const titleInput = screen.getByTestId('title-input')
    fireEvent.change(titleInput, { target: { value: 'title' } })

    const descriptionInput = screen.getByTestId('description-input')
    fireEvent.change(descriptionInput, { target: { value: 'description' } })

    const locationInput = screen.getByTestId('location-input')
    fireEvent.change(locationInput, { target: { value: 'location' } })

    const dateInput = screen.getByTestId('date-input')
    fireEvent.change(dateInput, { target: { value: '2025-01-01T00:00' } })

    const createButton = screen.getByTestId('create-event-button')

    expect(createButton).toBeEnabled()

    fireEvent.click(createButton)

    expect(mockOnCreate).toHaveBeenCalled()
  })

  it('should disable create button when title is empty', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    })

    renderWithProviders(<CreateEventModal onCreate={mockOnCreate} creating={false} />)
    const button = screen.getByTestId('open-button')
    fireEvent.click(button)

    const titleInput = screen.getByTestId('title-input')
    fireEvent.change(titleInput, { target: { value: '' } })

    const descriptionInput = screen.getByTestId('description-input')
    fireEvent.change(descriptionInput, { target: { value: 'description' } })

    const locationInput = screen.getByTestId('location-input')
    fireEvent.change(locationInput, { target: { value: 'location' } })

    const dateInput = screen.getByTestId('date-input')
    fireEvent.change(dateInput, { target: { value: '2025-01-01T00:00' } })

    const createButton = screen.getByTestId('create-event-button')

    expect(createButton).toBeDisabled()

  })

  it('should disable create button when description is empty', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    })

    renderWithProviders(<CreateEventModal onCreate={mockOnCreate} creating={false} />)
    const button = screen.getByTestId('open-button')
    fireEvent.click(button)

    const titleInput = screen.getByTestId('title-input')
    fireEvent.change(titleInput, { target: { value: 'title' } })

    const descriptionInput = screen.getByTestId('description-input')
    fireEvent.change(descriptionInput, { target: { value: '' } })

    const locationInput = screen.getByTestId('location-input')
    fireEvent.change(locationInput, { target: { value: 'location' } })

    const dateInput = screen.getByTestId('date-input')
    fireEvent.change(dateInput, { target: { value: '2025-01-01T00:00' } })

    const createButton = screen.getByTestId('create-event-button')

    expect(createButton).toBeDisabled()

  })

  it('should disable create button when location is empty', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    })

    renderWithProviders(<CreateEventModal onCreate={mockOnCreate} creating={false} />)
    const button = screen.getByTestId('open-button')
    fireEvent.click(button)

    const titleInput = screen.getByTestId('title-input')
    fireEvent.change(titleInput, { target: { value: 'title' } })

    const descriptionInput = screen.getByTestId('description-input')
    fireEvent.change(descriptionInput, { target: { value: 'description' } })

    const locationInput = screen.getByTestId('location-input')
    fireEvent.change(locationInput, { target: { value: '' } })

    const dateInput = screen.getByTestId('date-input')
    fireEvent.change(dateInput, { target: { value: '2025-01-01T00:00' } })

    const createButton = screen.getByTestId('create-event-button')

    expect(createButton).toBeDisabled()

  })

  it('should disable create button when date is empty', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    })

    renderWithProviders(<CreateEventModal onCreate={mockOnCreate} creating={false} />)
    const button = screen.getByTestId('open-button')
    fireEvent.click(button)

    const titleInput = screen.getByTestId('title-input')
    fireEvent.change(titleInput, { target: { value: 'title' } })

    const descriptionInput = screen.getByTestId('description-input')
    fireEvent.change(descriptionInput, { target: { value: 'description' } })

    const locationInput = screen.getByTestId('location-input')
    fireEvent.change(locationInput, { target: { value: 'location' } })

    const dateInput = screen.getByTestId('date-input')
    fireEvent.change(dateInput, { target: { value: '' } })

    const createButton = screen.getByTestId('create-event-button')

    expect(createButton).toBeDisabled()

  })


}) 