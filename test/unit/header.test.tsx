import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Header from '@/features/home/components/header';

import { setMatchMedia } from '../mocks/match-media';

const openMenu = () => userEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));

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

    await openMenu();
    expect(screen.getByRole('button', { name: 'Fechar menu' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Fechar menu' }));
    expect(screen.getByRole('button', { name: 'Abrir menu' })).toBeInTheDocument();
  });

  it('descreve o estado do menu para leitores de tela', async () => {
    render(<Header />);

    const toggle = screen.getByRole('button', { name: 'Abrir menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-controls', 'mobile-menu');

    await openMenu();
    expect(screen.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('renderiza a gaveta fora do header, para o backdrop-filter não quebrar o overlay', async () => {
    const { container } = render(<Header />);
    await openMenu();

    const dialog = screen.getByRole('dialog', { name: 'Menu de navegação' });

    // O painel precisa viver em document.body: dentro do header (que ganha
    // backdrop-blur ao rolar) um `position: fixed` passa a se posicionar
    // relativo ao header, e o overlay encolhe para a altura da barra.
    expect(container.querySelector('header')?.contains(dialog)).toBe(false);
    expect(document.body.contains(dialog)).toBe(true);
  });

  it('trava o scroll do body enquanto o menu está aberto', async () => {
    render(<Header />);

    await openMenu();
    expect(document.body.style.overflow).toBe('hidden');
    // position: fixed é o que efetivamente segura o scroll no iOS Safari
    expect(document.body.style.position).toBe('fixed');

    await userEvent.click(screen.getByRole('button', { name: 'Fechar menu' }));
    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.position).toBe('');
  });

  it('fecha o menu com a tecla Escape', async () => {
    render(<Header />);

    await openMenu();
    await userEvent.keyboard('{Escape}');

    expect(screen.getByRole('button', { name: 'Abrir menu' })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
  });

  it('o menu ocupa a tela inteira, não uma gaveta lateral', async () => {
    render(<Header />);
    await openMenu();

    const dialog = screen.getByRole('dialog', { name: 'Menu de navegação' });
    expect(dialog.className).toContain('h-full');
    expect(dialog.className).toContain('w-full');
    expect(dialog.parentElement!.className).toContain('inset-0');
  });

  it('esconde a barra do header enquanto o menu está aberto', async () => {
    const { container } = render(<Header />);
    const header = container.querySelector('header')!;

    Object.defineProperty(window, 'scrollY', { value: 200, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    await waitFor(() => expect(header.className).toContain('border-b'));

    await openMenu();

    // A moldura da barra cortaria o painel de tela cheia ao meio
    expect(header.className).not.toContain('border-b');
    expect(header.className).toContain('bg-transparent');

    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  });

  it('devolve o foco para o botão ao fechar', async () => {
    render(<Header />);

    await openMenu();
    await userEvent.keyboard('{Escape}');

    expect(screen.getByRole('button', { name: 'Abrir menu' })).toHaveFocus();
  });

  it('fecha o menu ao cruzar o breakpoint de desktop (girar a tela)', async () => {
    render(<Header />);
    await openMenu();

    act(() => setMatchMedia('(min-width: 768px)', true));

    // Sem isso o menu ficaria aberto e escondido por CSS — com o scroll travado
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Abrir menu' })).toBeInTheDocument();
    });
    expect(document.body.style.overflow).toBe('');
  });

  it('rola até a seção depois de destravar o scroll', async () => {
    const section = document.createElement('section');
    section.id = 'about';
    section.scrollIntoView = vi.fn();
    document.body.appendChild(section);

    const frames: FrameRequestCallback[] = [];
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      frames.push(cb);
      return 0;
    });

    try {
      render(<Header />);
      await openMenu();

      const mobileLink = screen
        .getByRole('dialog', { name: 'Menu de navegação' })
        .querySelector<HTMLAnchorElement>('a[href="#about"]')!;

      await userEvent.click(mobileLink);

      // A trava já caiu quando o scroll é agendado
      expect(document.body.style.position).toBe('');

      act(() => frames.forEach((frame) => frame(0)));
      expect(section.scrollIntoView).toHaveBeenCalled();
    } finally {
      vi.mocked(window.requestAnimationFrame).mockRestore();
      section.remove();
    }
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
