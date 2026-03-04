import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef } from 'react';
import { ClientForm, type ClientFormData } from './ClientForm';

// Wrapper to test the submitRef imperative handle
function FormWithSubmit({
  onFormDataChange,
  onSubmitResult,
  initialData,
}: {
  onFormDataChange: (data: ClientFormData) => void;
  onSubmitResult: (result: boolean) => void;
  initialData?: Parameters<typeof ClientForm>[0]['initialData'];
}) {
  const submitRef = useRef<(() => Promise<boolean>) | null>(null);
  return (
    <>
      <ClientForm
        onFormDataChange={onFormDataChange}
        submitRef={submitRef}
        initialData={initialData}
      />
      <button
        data-testid="submit-btn"
        onClick={async () => {
          const result = await submitRef.current?.();
          onSubmitResult(result ?? false);
        }}
      >
        Submeter
      </button>
    </>
  );
}

describe('ClientForm', () => {
  it('deve renderizar os placeholders dos campos', () => {
    render(<ClientForm onFormDataChange={vi.fn()} />);

    expect(screen.getByPlaceholderText('Digite o nome:')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite o salário:')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite o valor da empresa:')).toBeInTheDocument();
  });

  it('deve preencher os campos com dados iniciais', () => {
    const initialData = {
      id: '1',
      name: 'Maria',
      salary: 3000,
      companyValue: 50000,
      viewCount: 0,
      createdAt: '',
      updatedAt: '',
    };

    render(<ClientForm onFormDataChange={vi.fn()} initialData={initialData} />);

    const nameInput = screen.getByPlaceholderText('Digite o nome:') as HTMLInputElement;
    expect(nameInput.value).toBe('Maria');
  });

  it('deve mostrar erro de validação para nome muito curto via submitRef', async () => {
    const user = userEvent.setup();
    const onSubmitResult = vi.fn();

    render(
      <FormWithSubmit
        onFormDataChange={vi.fn()}
        onSubmitResult={onSubmitResult}
      />
    );

    // Nome vazio — clicar submit
    await user.click(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      expect(onSubmitResult).toHaveBeenCalledWith(false);
    });
  });

  it('deve chamar onFormDataChange ao digitar nome', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<ClientForm onFormDataChange={onChange} />);

    const nameInput = screen.getByPlaceholderText('Digite o nome:');
    await user.type(nameInput, 'A');

    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
  });

  it('submitRef deve retornar true quando formulário é válido', async () => {
    const user = userEvent.setup();
    const onSubmitResult = vi.fn();
    const onChange = vi.fn();

    const initialData = {
      id: '1',
      name: 'João Silva',
      salary: 5000,
      companyValue: 100000,
      viewCount: 0,
      createdAt: '',
      updatedAt: '',
    };

    render(
      <FormWithSubmit
        onFormDataChange={onChange}
        onSubmitResult={onSubmitResult}
        initialData={initialData}
      />
    );

    await user.click(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      expect(onSubmitResult).toHaveBeenCalledWith(true);
    });
  });
});
