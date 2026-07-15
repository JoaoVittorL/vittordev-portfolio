import { render, screen } from '@testing-library/react';

import Contact from '@/features/home/components/contact';

describe('Contact', () => {
  it('renderiza o título e as informações de contato', () => {
    render(<Contact />);

    expect(screen.getByRole('heading', { name: 'Entre em Contato' })).toBeInTheDocument();
    expect(screen.getByText('+55 (77) 98131-4622')).toBeInTheDocument();
    expect(screen.getByText('Bahia - BR')).toBeInTheDocument();
  });

  it('tem link mailto para o email', () => {
    render(<Contact />);
    expect(screen.getByRole('link', { name: 'vittorsantos234@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:vittorsantos234@gmail.com',
    );
  });

  it('tem link do WhatsApp apontando para o número correto', () => {
    render(<Contact />);
    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute(
      'href',
      expect.stringContaining('wa.me/5577981314622'),
    );
  });

  it('tem links de GitHub e LinkedIn nas redes sociais', () => {
    render(<Contact />);
    expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument();
  });

  it('renderiza o formulário de mensagem', () => {
    render(<Contact />);
    expect(screen.getByRole('heading', { name: 'Envie uma Mensagem' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite seu nome')).toBeInTheDocument();
  });
});
