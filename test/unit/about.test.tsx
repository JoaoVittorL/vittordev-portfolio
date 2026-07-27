import { render, screen } from '@testing-library/react';

import About from '@/features/home/components/about';

describe('About', () => {
  it('renderiza o título e os cards', () => {
    render(<About />);

    expect(screen.getByRole('heading', { name: 'Sobre mim' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Minha Jornada' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Minhas Competências' })).toBeInTheDocument();
  });

  it('lista as 4 competências', () => {
    render(<About />);

    expect(screen.getByText('Código que envelhece bem')).toBeInTheDocument();
    expect(screen.getByText('Do celular ao monitor')).toBeInTheDocument();
    expect(screen.getByText('React & Next no dia a dia')).toBeInTheDocument();
    expect(screen.getByText('Cuidado com quem usa')).toBeInTheDocument();
  });
});
