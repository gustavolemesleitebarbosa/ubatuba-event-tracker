import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import Home from '../pages/Home'

// Mock the useAuth hook with default values
vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn().mockReturnValue({
    isAuthenticated: false,
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const mockEvents = [
  {
    id: '1',
    title: 'Test Event 1',
    description: 'Description 1',
    location: 'Location 1',
    date: '2024-12-31T23:59',
    image: '',
    category: 'MUSIC',
  },
  {
    id: '2',
    title: 'Test Event 2',
    description: 'Description 2',
    location: 'Location 2',
    date: '2025-01-01T00:00',
    image: '',
    category: 'SPORTS',
  },
]

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
    // Reset useAuth mock to default state
    ;(useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
    })
  })

  const renderWithProviders = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Home />
        </AuthProvider>
      </BrowserRouter>
    )
  }

  it('renders loading state initially', () => {
    ;(global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    )

    renderWithProviders()
    expect(screen.getByText('Carregando eventos em Ubatuba!')).toBeInTheDocument()
  })

  it('renders events after loading', async () => {
    ;(global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEvents),
      })
    )

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('Test Event 1')).toBeInTheDocument()
      expect(screen.getByText('Test Event 2')).toBeInTheDocument()
    })
  })

  it('filters events based on search input', async () => {
    ;(global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEvents),
      })
    )

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('Test Event 1')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Pesquisar Evento ou Local')
    fireEvent.change(searchInput, { target: { value: 'Event 1' } })

    expect(screen.getByText('Test Event 1')).toBeInTheDocument()
    expect(screen.queryByText('Test Event 2')).not.toBeInTheDocument()
  })


  it('shows empty state message when no events', async () => {
    ;(global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    )

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('Nenhum evento encontrado, seja o primeiro a criar um evento!')).toBeInTheDocument()
    })
  })

  it('shows edit and delete buttons when authenticated', async () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    })

    ;(global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEvents),
      })
    )

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getAllByTestId('edit-button')).toHaveLength(2)
      expect(screen.getAllByTestId('delete-button')).toHaveLength(2)
    })
  })

  it('hides edit and delete buttons when not authenticated', async () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
    })

    ;(global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEvents),
      })
    )

    renderWithProviders()

    await waitFor(() => {
      expect(screen.queryByTestId('edit-button')).not.toBeInTheDocument()
      expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument()
    })
  })

  it('shows no results message when search has no matches', async () => {
    ;(global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEvents),
      })
    )

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('Test Event 1')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Pesquisar Evento ou Local')
    fireEvent.change(searchInput, { target: { value: 'No Match' } })

    expect(screen.getByText('Nenhum evento encontrado para esta busca 😢')).toBeInTheDocument()
  })
}) 