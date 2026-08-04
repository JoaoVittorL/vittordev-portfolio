import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import NavLinks from '@/shared/components/nav-link';

describe('NavLinks', () => {
  it('renderiza os links de navegação com os anchors corretos', () => {
    render(<NavLinks />);

    expect(screen.getByRole('link', { name: /Início/ })).toHaveAttribute('href', '#hero');
    expect(screen.getByRole('link', { name: /Sobre/ })).toHaveAttribute('href', '#about');
    expect(screen.getByRole('link', { name: /Habilidades/ })).toHaveAttribute('href', '#skills');
    expect(screen.getByRole('link', { name: /Projetos/ })).toHaveAttribute('href', '#projects');
    expect(screen.getByRole('link', { name: /Contato/ })).toHaveAttribute('href', '#contact');
  });

  it('avisa o destino ao pai em vez de navegar direto (menu mobile)', async () => {
    const onNavigate = vi.fn();
    render(<NavLinks mobile onNavigate={onNavigate} />);

    const link = screen.getByRole('link', { name: /Sobre/ });
    const clicked = userEvent.click(link);
    await clicked;

    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onNavigate).toHaveBeenCalledWith('#about');
  });

  it('mantém a navegação nativa no desktop', async () => {
    const onNavigate = vi.fn();
    render(<NavLinks onNavigate={onNavigate} />);

    await userEvent.click(screen.getByRole('link', { name: /Sobre/ }));
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('links mobile respeitam o alvo mínimo de toque', () => {
    render(<NavLinks mobile onNavigate={vi.fn()} />);

    expect(screen.getByRole('link', { name: /Sobre/ }).className).toContain('min-h-[56px]');
  });

  it('numera os links do menu sem sujar o nome acessível', () => {
    render(<NavLinks mobile onNavigate={vi.fn()} />);

    // O número é decorativo: `getByRole` exato tem de continuar funcionando
    const link = screen.getByRole('link', { name: 'Habilidades' });
    expect(link).toHaveTextContent('03');
    expect(link).toHaveTextContent('Habilidades');
  });
});
