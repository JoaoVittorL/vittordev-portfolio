import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import NavLinks from '@/shared/components/nav-link';

describe('NavLinks', () => {
  it('renderiza os links de navegação com os anchors corretos', () => {
    render(<NavLinks />);

    expect(screen.getByRole('link', { name: /Início/ })).toHaveAttribute('href', '#hero');
    expect(screen.getByRole('link', { name: /Sobre/ })).toHaveAttribute('href', '#about');
    expect(screen.getByRole('link', { name: /Habilidades/ })).toHaveAttribute('href', '#skills');
    expect(screen.getByRole('link', { name: /Contato/ })).toHaveAttribute('href', '#contact');
  });

  it('não renderiza o link de Projetos (seção oculta)', () => {
    render(<NavLinks />);
    expect(screen.queryByRole('link', { name: /Projetos/ })).not.toBeInTheDocument();
  });

  it('chama onClose ao clicar em um link (menu mobile)', async () => {
    const onClose = vi.fn();
    render(<NavLinks mobile onClose={onClose} />);

    await userEvent.click(screen.getByRole('link', { name: /Sobre/ }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
