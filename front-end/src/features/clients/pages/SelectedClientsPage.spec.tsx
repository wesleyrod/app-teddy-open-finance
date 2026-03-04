import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SelectedClientsPage from '@/features/clients/pages/SelectedClientsPage';
import { useClients } from '@/features/clients/contexts/ClientsContext';
import type { Client } from '@/services/api';

vi.mock('@/features/clients/contexts/ClientsContext', () => ({
  useClients: vi.fn(),
}));

const mockSelectedClients: Client[] = [
  {
    id: '1',
    name: 'João Silva',
    salary: 5000,
    companyValue: 100000,
    viewCount: 0,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Maria Souza',
    salary: 8000,
    companyValue: 200000,
    viewCount: 0,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

const defaultContextValue = {
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
  removeClient: vi.fn(),
  selectClient: vi.fn(),
  removeSelectedClient: vi.fn(),
  clearSelectedClients: vi.fn(),
};

describe('SelectedClientsPage', () => {
  beforeEach(() => {
    vi.mocked(useClients).mockReturnValue({ ...defaultContextValue });
  });

  it('deve exibir mensagem quando não há clientes selecionados', () => {
    render(<SelectedClientsPage />);
    expect(screen.getByText('Nenhum cliente selecionado ainda.')).toBeInTheDocument();
  });

  it('deve renderizar os clientes selecionados', () => {
    vi.mocked(useClients).mockReturnValue({
      ...defaultContextValue,
      selectedClients: mockSelectedClients,
    });

    render(<SelectedClientsPage />);
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Maria Souza')).toBeInTheDocument();
  });

  it('deve exibir a contagem de clientes selecionados', () => {
    vi.mocked(useClients).mockReturnValue({
      ...defaultContextValue,
      selectedClients: mockSelectedClients,
    });

    render(<SelectedClientsPage />);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText(/clientes selecionados:/)).toBeInTheDocument();
  });

  it('deve chamar removeSelectedClient ao clicar no botão −', async () => {
    const removeSelectedClient = vi.fn();
    vi.mocked(useClients).mockReturnValue({
      ...defaultContextValue,
      selectedClients: mockSelectedClients,
      removeSelectedClient,
    });

    const user = userEvent.setup();
    render(<SelectedClientsPage />);

    const minusButtons = screen.getAllByRole('button').filter(
      (btn) => btn.querySelector('.lucide-minus')
    );

    expect(minusButtons.length).toBeGreaterThan(0);
    await user.click(minusButtons[0]);

    expect(removeSelectedClient).toHaveBeenCalledWith('1');
  });

  it('deve exibir botão "Limpar clientes selecionados" quando há clientes', () => {
    vi.mocked(useClients).mockReturnValue({
      ...defaultContextValue,
      selectedClients: mockSelectedClients,
    });

    render(<SelectedClientsPage />);
    expect(screen.getByText('Limpar clientes selecionados')).toBeInTheDocument();
  });

  it('deve chamar clearSelectedClients ao clicar em limpar', async () => {
    const clearSelectedClients = vi.fn();
    vi.mocked(useClients).mockReturnValue({
      ...defaultContextValue,
      selectedClients: mockSelectedClients,
      clearSelectedClients,
    });

    const user = userEvent.setup();
    render(<SelectedClientsPage />);

    await user.click(screen.getByText('Limpar clientes selecionados'));
    expect(clearSelectedClients).toHaveBeenCalled();
  });

  it('não deve exibir botão "Limpar" quando não há clientes selecionados', () => {
    render(<SelectedClientsPage />);
    expect(screen.queryByText('Limpar clientes selecionados')).not.toBeInTheDocument();
  });
});
