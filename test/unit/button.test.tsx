import { render, screen } from '@testing-library/react';
import { Send } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

describe('Button', () => {
  it('renderiza children', () => {
    render(<Button>Enviar</Button>);
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeInTheDocument();
  });

  it('variante default usa acento teal com texto escuro (contraste)', () => {
    render(<Button>Ok</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-accent-400');
    expect(button.className).toContain('text-slate-950');
  });

  it('variante outline usa borda teal', () => {
    render(<Button variant="outline">Ok</Button>);
    expect(screen.getByRole('button').className).toContain('border-accent-400/50');
  });

  it('variante ghost usa texto slate', () => {
    render(<Button variant="ghost">Ok</Button>);
    expect(screen.getByRole('button').className).toContain('text-slate-300');
  });

  it('size full ocupa toda a largura', () => {
    render(<Button size="full">Ok</Button>);
    expect(screen.getByRole('button').className).toContain('w-full');
  });

  it('prop label substitui children', () => {
    render(<Button label="Rótulo" />);
    expect(screen.getByRole('button', { name: 'Rótulo' })).toBeInTheDocument();
  });

  it('redimensiona o ícone passado para h-4 w-4', () => {
    render(<Button icon={<Send data-testid="icone" />}>Enviar</Button>);
    const icon = screen.getByTestId('icone');
    expect(icon).toHaveClass('h-4', 'w-4');
  });

  it('fica desabilitado com disabled', () => {
    render(<Button disabled>Ok</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('asChild renderiza o elemento filho no lugar de <button>', () => {
    render(
      <Button asChild>
        <a href="#contato">Link</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Link' });
    expect(link).toHaveAttribute('href', '#contato');
    expect(link.className).toContain('bg-accent-400');
  });
});
