import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FormContact } from '@/shared/components/form-contact';

const sendFormMock = vi.hoisted(() => vi.fn());
const toastMock = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }));

vi.mock('emailjs-com', () => ({
  default: { sendForm: sendFormMock },
}));

vi.mock('sonner', () => ({
  toast: toastMock,
}));

vi.mock('@/env', () => ({
  env: {
    MODE: 'test',
    VITE_API_URL: '',
    VITE_ENABLE_API_DELAY: false,
    VITE_SERVICE_EMAIL: 'service_test',
    VITE_TEMPLATE_ID_EMAIL: 'template_test',
    VITE_PUBLIC_KEY_EMAIL: 'public_key_test',
  },
}));

async function fillForm() {
  await userEvent.type(screen.getByPlaceholderText('Digite seu nome'), 'João');
  await userEvent.type(screen.getByPlaceholderText('Digite seu email'), 'joao@exemplo.com');
  await userEvent.type(screen.getByPlaceholderText('Digite sua mensagem'), 'Olá!');
}

describe('FormContact', () => {
  it('renderiza os três campos e o botão de enviar', () => {
    render(<FormContact />);

    expect(screen.getByPlaceholderText('Digite seu nome')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite seu email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite sua mensagem')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeInTheDocument();
  });

  it('mostra erros de validação ao enviar vazio e NÃO chama o emailjs', async () => {
    render(<FormContact />);

    await userEvent.click(screen.getByRole('button', { name: 'Enviar' }));

    // Regex sem acento (o arquivo-fonte usa forma Unicode NFD)
    expect(await screen.findByText(/O nome .* obrigat/)).toBeInTheDocument();
    expect(screen.getByText(/O email .* obrigat/)).toBeInTheDocument();
    expect(sendFormMock).not.toHaveBeenCalled();
  });

  it('valida formato de email inválido', async () => {
    render(<FormContact />);

    await userEvent.type(screen.getByPlaceholderText('Digite seu email'), 'invalido');
    await userEvent.click(screen.getByRole('button', { name: 'Enviar' }));

    expect(await screen.findByText(/O email .* obrigat/)).toBeInTheDocument();
    expect(sendFormMock).not.toHaveBeenCalled();
  });

  it('envia com sucesso: chama emailjs, mostra toast e limpa o formulário', async () => {
    sendFormMock.mockResolvedValueOnce({ status: 200, text: 'OK' });
    render(<FormContact />);

    await fillForm();
    await userEvent.click(screen.getByRole('button', { name: 'Enviar' }));

    await waitFor(() => {
      expect(sendFormMock).toHaveBeenCalledWith(
        'service_test',
        'template_test',
        expect.anything(),
        'public_key_test',
      );
      expect(toastMock.success).toHaveBeenCalledWith(
        'Email enviado com sucesso. Em breve entraremos em contato.',
      );
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Digite seu nome')).toHaveValue('');
    });
  });

  it('mostra toast de erro quando o emailjs falha e reabilita o botão', async () => {
    sendFormMock.mockRejectedValueOnce(new Error('network'));
    render(<FormContact />);

    await fillForm();
    await userEvent.click(screen.getByRole('button', { name: 'Enviar' }));

    await waitFor(() => {
      expect(toastMock.error).toHaveBeenCalledWith('Ocorreu um erro ao enviar a mensagem.');
    });

    // isLoading deve voltar a false (bug do botão travado corrigido)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Enviar' })).toBeEnabled();
    });
  });

  it('mostra toast de erro quando a resposta não é 200', async () => {
    sendFormMock.mockResolvedValueOnce({ status: 500, text: 'erro' });
    render(<FormContact />);

    await fillForm();
    await userEvent.click(screen.getByRole('button', { name: 'Enviar' }));

    await waitFor(() => {
      expect(toastMock.error).toHaveBeenCalledWith('Ocorreu um erro ao enviar a mensagem.');
    });
  });

  it('desabilita os campos durante o envio', async () => {
    let resolveSend: (value: unknown) => void;
    sendFormMock.mockImplementationOnce(
      () => new Promise((resolve) => { resolveSend = resolve; }),
    );
    render(<FormContact />);

    await fillForm();
    await userEvent.click(screen.getByRole('button', { name: 'Enviar' }));

    expect(await screen.findByRole('button', { name: 'Enviando...' })).toBeDisabled();
    expect(screen.getByPlaceholderText('Digite seu nome')).toBeDisabled();

    resolveSend!({ status: 200, text: 'OK' });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Enviar' })).toBeEnabled();
    });
  });
});
