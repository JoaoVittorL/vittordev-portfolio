import { render, screen } from '@testing-library/react';

import { Input } from '@/shared/components/ui/input';

describe('Input', () => {
  it('renderiza um input', () => {
    render(<Input placeholder="Digite seu nome" />);
    expect(screen.getByPlaceholderText('Digite seu nome')).toBeInTheDocument();
  });

  it('sem erro, não mostra mensagem de validação', () => {
    render(<Input placeholder="Nome" />);
    expect(screen.queryByText(/obrigatório/)).not.toBeInTheDocument();
  });

  it('com erro, mostra a mensagem e aplica borda vermelha', () => {
    render(<Input placeholder="Nome" error="O nome é obrigatório" />);

    expect(screen.getByText('O nome é obrigatório')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nome').className).toContain('border-red-500');
  });

  it('usa o estilo dark slate do design system', () => {
    render(<Input placeholder="Nome" />);
    const input = screen.getByPlaceholderText('Nome');
    expect(input.className).toContain('bg-slate-900/60');
    expect(input.className).toContain('text-slate-200');
  });
});
