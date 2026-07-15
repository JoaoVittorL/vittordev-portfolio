import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Footer from '@/features/home/components/footer';

describe('Footer', () => {
  it('renderiza o nome', () => {
    render(<Footer />);

    // Regex sem acento (forma Unicode do fonte pode variar)
    expect(screen.getByRole('heading', { name: /Vittor/ })).toBeInTheDocument();
  });

  it('botão de voltar ao topo rola a página suavemente', async () => {
    render(<Footer />);

    await userEvent.click(screen.getByRole('button', { name: 'Voltar ao topo' }));

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
