import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { useClients } from '@/features/clients/contexts/ClientsContext';

// Mock do ClientsContext
vi.mock('@/features/clients/contexts/ClientsContext', () => ({
  useClients: vi.fn(),
}));

const mockRemoveClient = vi.fn();

beforeEach(() => {
  vi.mocked(useClients).mockReturnValue({
    clients: [],
    selectedClients: [],
    total: 0,
    page: 1,
    totalPages: 1,
    perPage: 16,
    loading: false,
    setPage: vi.fn(),
    setPerPage: vi.fn(),
    refreshClients: vi.fn(),
    addClient: vi.fn(),
    editClient: vi.fn(),
    removeClient: mockRemoveClient,
    selectClient: vi.fn(),
    removeSelectedClient: vi.fn(),
    clearSelectedClients: vi.fn(),
  });
  mockRemoveClient.mockReset();
});

describe('DeleteConfirmModal', () => {
  const renderModal = () => {
    return render(
      <DeleteConfirmModal
        trigger={<button>Excluir</button>}
        clientId="123"
        clientName="João Silva"
      />
    );
  };

  it('deve renderizar o trigger', () => {
    renderModal();
    expect(screen.getByText('Excluir')).toBeInTheDocument();
  });

  it('deve abrir o modal ao clicar no trigger', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByText('Excluir'));

    await waitFor(() => {
      expect(screen.getByText('Excluir cliente?')).toBeInTheDocument();
    });
  });

  it('deve exibir o nome do cliente na mensagem de confirmação', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByText('Excluir'));

    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
    });
  });

  it('deve chamar removeClient ao confirmar exclusão', async () => {
    const user = userEvent.setup();
    mockRemoveClient.mockResolvedValue(undefined);
    renderModal();

    await user.click(screen.getByText('Excluir'));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^Excluir$/ })).toBeInTheDocument();
    });

    // O botão dentro do modal (não o trigger)
    const deleteButtons = screen.getAllByRole('button', { name: /Excluir/i });
    // O último é o botão de confirmação dentro do modal
    const confirmButton = deleteButtons[deleteButtons.length - 1];
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockRemoveClient).toHaveBeenCalledWith('123');
    });
  });

  it('deve fechar o modal ao clicar em Cancelar', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByText('Excluir'));

    await waitFor(() => {
      expect(screen.getByText('Cancelar')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Cancelar'));

    await waitFor(() => {
      expect(screen.queryByText('Excluir cliente?')).not.toBeInTheDocument();
    });
  });
});
