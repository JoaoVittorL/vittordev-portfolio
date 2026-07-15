import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Header from '@/features/home/components/header';

describe('Header', () => {
  it('renderiza o logo com link para o hero', () => {
    render(<Header />);
    const logo = screen.getByRole('link', { name: /João Vittor/ });
    expect(logo).toHaveAttribute('href', '#hero');
  });

  it('não tem mais botão de alternar tema (dark-only)', () => {
    render(<Header />);
    expect(screen.queryByLabelText(/switch to/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/tema/i)).not.toBeInTheDocument();
  });

  it('abre e fecha o menu mobile', async () => {
    render(<Header />);

    await userEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));
    expect(screen.getByRole('button', { name: 'Fechar menu' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Fechar menu' }));
    expect(screen.getByRole('button', { name: 'Abrir menu' })).toBeInTheDocument();
  });

  it('trava o scroll do body enquanto o menu está aberto', async () => {
    render(<Header />);

    await userEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));
    expect(document.body.style.overflow).toBe('hidden');

    await userEvent.click(screen.getByRole('button', { name: 'Fechar menu' }));
    expect(document.body.style.overflow).toBe('');
  });

  it('aplica fundo com blur após rolar a página', async () => {
    const { container } = render(<Header />);
    const header = container.querySelector('header')!;

    expect(header.className).toContain('bg-transparent');

    Object.defineProperty(window, 'scrollY', { value: 120, configurable: true });
    window.dispatchEvent(new Event('scroll'));

    await waitFor(() => {
      expect(header.className).toContain('bg-slate-950/80');
    });
  });
});
