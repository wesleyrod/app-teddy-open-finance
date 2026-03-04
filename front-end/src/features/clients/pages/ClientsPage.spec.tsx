import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ClientsPage from '@/features/clients/pages/ClientsPage';
import { useClients } from '@/features/clients/contexts/ClientsContext';
import type { Client } from '@/services/api';

vi.mock('@/features/clients/contexts/ClientsContext', () => ({
  useClients: vi.fn(),
}));

const mockClients: Client[] = [
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
  clients: mockClients,
  selectedClients: [],
  total: 2,
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

beforeEach(() => {
  vi.mocked(useClients).mockReturnValue({ ...defaultContextValue });
});

describe('ClientsPage', () => {
  it('deve exibir o spinner de loading', () => {
    vi.mocked(useClients).mockReturnValue({
      ...defaultContextValue,
      clients: [],
      loading: true,
    });

    const { container } = render(<ClientsPage />);
    expect(container.querySelector('.animate-spin') as Element).toBeInTheDocument();
  });

  it('deve exibir a contagem total de clientes', () => {
    render(<ClientsPage />);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText(/clientes encontrados/)).toBeInTheDocument();
  });

  it('deve renderizar os cards de clientes', () => {
    render(<ClientsPage />);
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Maria Souza')).toBeInTheDocument();
  });

  it('deve chamar selectClient ao clicar no botão +', async () => {
    const selectClient = vi.fn();
    vi.mocked(useClients).mockReturnValue({
      ...defaultContextValue,
      selectClient,
    });

    const user = userEvent.setup();
    render(<ClientsPage />);

    // Encontra os botões com ícone Plus (são botões com classe text-gray-900)
    const plusButtons = screen.getAllByRole('button').filter(
      (btn) => btn.querySelector('.lucide-plus')
    );

    expect(plusButtons.length).toBeGreaterThan(0);
    await user.click(plusButtons[0]);

    expect(selectClient).toHaveBeenCalledWith('1');
  });

  it('deve exibir o botão "Criar cliente"', () => {
    render(<ClientsPage />);
    expect(screen.getByText('Criar cliente')).toBeInTheDocument();
  });

  it('não deve exibir o spinner quando não está carregando', () => {
    const { container } = render(<ClientsPage />);
    expect(container.querySelector('.animate-spin') as Element).not.toBeInTheDocument();
  });
});
