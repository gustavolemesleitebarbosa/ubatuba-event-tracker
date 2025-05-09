import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { BrowserRouter, useParams, useNavigate } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
import EventDetail from '../pages/EventDetail'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
  }
})

const mockEvent = {
  id: '1',
  title: 'Test Event',
  description: 'Test Description',
  location: 'Test Location',
  date: '2024-12-31T13:59',
  image: 'test-image.jpg',
  category: 'MUSIC',
}

describe('EventDetail', () => {
  const mockNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
    ;(useNavigate as jest.Mock).mockReturnValue(mockNavigate)
    ;(useParams as jest.Mock).mockReturnValue({ id: '1' })
  })

  const renderWithProviders = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <EventDetail />
        </AuthProvider>
      </BrowserRouter>
    )
  }

  it('renders loading state initially', () => {
    ;(global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEvent),
      })
    )

    renderWithProviders()
    expect(screen.getByText('Carregando evento...')).toBeInTheDocument()
    expect(screen.getByAltText('logo')).toBeInTheDocument()
  })

  it('renders event details after loading', async () => {
    ;(global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEvent),
      })
    )

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText(mockEvent.title)).toBeInTheDocument()
      expect(screen.getByText(mockEvent.description)).toBeInTheDocument()
      expect(screen.getByText(mockEvent.location)).toBeInTheDocument()
      expect(screen.getByText(/31 de dezembro de 2024/)).toBeInTheDocument()
      expect(screen.getByText('Local')).toBeInTheDocument()
      expect(screen.getByText('Descrição')).toBeInTheDocument()
    })
  })

  it('shows error message when fetch fails', async () => {
    ;(global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('Falha ao buscar o evento'))
    )

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText(/Falha ao buscar o evento/)).toBeInTheDocument()
    })
  })

  it('navigates back when clicking back button', async () => {
    ;(global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEvent),
      })
    )

    renderWithProviders()

    await waitFor(() => {
      const backButton = screen.getByText('Voltar para os eventos')
      backButton.click()
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('shows placeholder image when event has no image', async () => {
    const eventWithoutImage = { ...mockEvent, image: '' }
    ;(global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(eventWithoutImage),
      })
    )

    renderWithProviders()

    await waitFor(() => {
      const placeholderImage = screen.getByAltText('Event placeholder')
      expect(placeholderImage).toBeInTheDocument()
      expect(placeholderImage).toHaveAttribute('src', '/images/placeholder.png')
    })
  })

  it('shows event image when available', async () => {
    ;(global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEvent),
      })
    )

    renderWithProviders()

    await waitFor(() => {
      const eventImage = screen.getByAltText(mockEvent.title)
      expect(eventImage).toBeInTheDocument()
      expect(eventImage).toHaveAttribute('src', mockEvent.image)
    })
  })

}) 