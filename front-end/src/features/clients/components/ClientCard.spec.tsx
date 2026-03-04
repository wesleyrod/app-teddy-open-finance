import { render, screen } from '@testing-library/react';
import { ClientCard } from './ClientCard';

describe('ClientCard', () => {
  const defaultProps = {
    name: 'João Silva',
    salary: 5000,
    companyValue: 100000,
  };

  it('deve renderizar o nome do cliente', () => {
    render(<ClientCard {...defaultProps} />);
    expect(screen.getByText('João Silva')).toBeInTheDocument();
  });

  it('deve renderizar o salário formatado em BRL', () => {
    render(<ClientCard {...defaultProps} />);
    expect(screen.getByText(/Salário:.*R\$\s*5\.000,00/)).toBeInTheDocument();
  });

  it('deve renderizar o valor da empresa formatado em BRL', () => {
    render(<ClientCard {...defaultProps} />);
    expect(screen.getByText(/Empresa:.*R\$\s*100\.000,00/)).toBeInTheDocument();
  });

  it('deve renderizar ações quando fornecidas', () => {
    render(
      <ClientCard
        {...defaultProps}
        actions={<button data-testid="action-btn">Ação</button>}
      />
    );
    expect(screen.getByTestId('action-btn')).toBeInTheDocument();
  });

  it('não deve renderizar bloco de ações quando não fornecidas', () => {
    const { container } = render(<ClientCard {...defaultProps} />);
    // O wrapper de ações possui border-t; se não houver ações, ele não deve existir
    expect(container.querySelector('.border-t') as Element).not.toBeInTheDocument();
  });
});
