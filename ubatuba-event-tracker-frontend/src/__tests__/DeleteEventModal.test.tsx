import { render, screen, fireEvent } from "@testing-library/react";
import { DeleteEventModal } from "../components/DeleteEventModal";
import { vi } from "vitest";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";

vi.mock("../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("DeleteEventModal", () => {
  const mockEvent = {
    id: "1",
    title: "Test Event",
    description: "Test Description",
    location: "Test Location",
    date: "2024-12-31T23:59",
    image: "",
    category: null,
  };

  const mockOnDelete = vi.fn();

  beforeEach(() => {
    mockOnDelete.mockClear();
    vi.clearAllMocks();
  });

  const renderWithProviders = (component: React.ReactNode) => {
    return render(
      <BrowserRouter>
        <AuthProvider>{component}</AuthProvider>
      </BrowserRouter>
    );
  };

  it("renders delete button", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    });

    renderWithProviders(
      <DeleteEventModal event={mockEvent} onDelete={mockOnDelete} />
    );

    expect(screen.getByTestId("delete-button")).toBeInTheDocument();
  });

  it("shows loading state when deleting", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    });

    renderWithProviders(
      <DeleteEventModal
        event={mockEvent}
        onDelete={mockOnDelete}
        deleting={true}
      />
    );

    const button = screen.getByTestId("delete-button");
    expect(button).toBeDisabled();
  });

  it("shows confirmation dialog with event title", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    });

    renderWithProviders(
      <DeleteEventModal event={mockEvent} onDelete={mockOnDelete} />
    );

    const deleteButton = screen.getByTestId("delete-button");
    fireEvent.click(deleteButton);

    expect(
      screen.getByText(`Você tem certeza que gostaria de deletar "${mockEvent.title}"? Essa ação não pode ser desfeita.`)
    ).toBeInTheDocument();
  });

  it("calls onDelete when confirming deletion", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    });

    renderWithProviders(
      <DeleteEventModal event={mockEvent} onDelete={mockOnDelete} />
    );

    const deleteButton = screen.getByTestId("delete-button");
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByTestId("confirm-delete-button");
    fireEvent.click(confirmButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it("does not call onDelete when canceling deletion", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    });

    renderWithProviders(
      <DeleteEventModal event={mockEvent} onDelete={mockOnDelete} />
    );

    const deleteButton = screen.getByTestId("delete-button");
    fireEvent.click(deleteButton);

    const cancelButton = screen.getByText("Cancelar");
    fireEvent.click(cancelButton);

    expect(mockOnDelete).not.toHaveBeenCalled();
  });
});
