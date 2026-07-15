import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Skills from '@/features/home/components/skills';

describe('Skills', () => {
  it('renderiza o título da seção', () => {
    render(<Skills />);
    expect(screen.getByRole('heading', { name: 'Minhas Habilidades' })).toBeInTheDocument();
  });

  it('mostra todas as skills na categoria "Tudo"', () => {
    render(<Skills />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Git')).toBeInTheDocument();
    expect(screen.getByText('SQL')).toBeInTheDocument();
    expect(screen.getByText('UI/UX Design')).toBeInTheDocument();
  });

  it('filtra por Backend ao clicar na categoria', async () => {
    render(<Skills />);

    await userEvent.click(screen.getByRole('button', { name: 'Backend' }));

    expect(screen.getByText('SQL')).toBeInTheDocument();
    expect(screen.getByText('Node')).toBeInTheDocument();
    expect(screen.queryByText('Tailwind CSS')).not.toBeInTheDocument();
    expect(screen.queryByText('Figma')).not.toBeInTheDocument();
  });

  it('filtra por Frontend ao clicar na categoria', async () => {
    render(<Skills />);

    await userEvent.click(screen.getByRole('button', { name: 'Frontend' }));

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.queryByText('SQL')).not.toBeInTheDocument();
  });

  it('volta a mostrar tudo ao clicar em "Tudo"', async () => {
    render(<Skills />);

    await userEvent.click(screen.getByRole('button', { name: 'Backend' }));
    await userEvent.click(screen.getByRole('button', { name: 'Tudo' }));

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('SQL')).toBeInTheDocument();
  });

  it('não exibe barras de porcentagem (design de chips)', () => {
    render(<Skills />);
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });
});
