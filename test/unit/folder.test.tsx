import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Folder from '@/shared/components/folder';

const items = [<span key="a">A</span>, <span key="b">B</span>, <span key="c">C</span>];

describe('Folder', () => {
  it('expõe um botão com estado e rótulo em português', () => {
    render(<Folder label="projeto Orbit" open={false} onToggle={vi.fn()} items={items} />);

    const button = screen.getByRole('button', { name: 'Abrir projeto Orbit' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('troca o rótulo quando está aberta', () => {
    render(<Folder label="projeto Orbit" open onToggle={vi.fn()} items={items} />);

    expect(screen.getByRole('button', { name: 'Fechar projeto Orbit' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('avisa o pai no clique — quem controla a abertura é ele', async () => {
    const onToggle = vi.fn();
    render(<Folder label="projeto Orbit" open={false} onToggle={onToggle} items={items} />);

    await userEvent.click(screen.getByRole('button'));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('abre pelo teclado (Enter e Espaço)', async () => {
    const onToggle = vi.fn();
    render(<Folder label="projeto Orbit" open={false} onToggle={onToggle} items={items} />);

    const button = screen.getByRole('button');
    button.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');

    expect(onToggle).toHaveBeenCalledTimes(2);
  });

  it('renderiza no máximo três papéis, completando quando vêm menos', () => {
    const { container } = render(
      <Folder label="projeto Orbit" open onToggle={vi.fn()} items={[items[0]]} />,
    );

    expect(screen.getByText('A')).toBeInTheDocument();
    // 3 papéis + 2 metades da frente + aba
    expect(container.querySelectorAll('.absolute').length).toBeGreaterThanOrEqual(6);
  });

  it('reserva a caixa de layout no tamanho já escalado', () => {
    const { container } = render(
      <Folder label="projeto Orbit" size={2} open={false} onToggle={vi.fn()} items={items} />,
    );

    expect(container.firstElementChild).toHaveStyle({ width: '200px', height: '160px' });
  });
});
