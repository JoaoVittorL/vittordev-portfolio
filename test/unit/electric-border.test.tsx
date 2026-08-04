import { render, screen } from '@testing-library/react';

import ElectricBorder from '@/shared/components/electric-border';
import { mockMatchMedia } from '../mocks/match-media';

describe('ElectricBorder', () => {
  it('renderiza o conteúdo sem nenhum canvas quando está inativo', () => {
    const { container } = render(
      <ElectricBorder>
        <button type="button">Vamos conversar</button>
      </ElectricBorder>,
    );

    expect(screen.getByRole('button', { name: 'Vamos conversar' })).toBeInTheDocument();
    expect(container.querySelector('canvas')).not.toBeInTheDocument();
  });

  it('monta o canvas quando ativado', () => {
    const { container } = render(
      <ElectricBorder active>
        <button type="button">Vamos conversar</button>
      </ElectricBorder>,
    );

    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('não anima para quem prefere movimento reduzido, mesmo ativo', () => {
    mockMatchMedia({ '(prefers-reduced-motion: reduce)': true });

    const { container } = render(
      <ElectricBorder active>
        <button type="button">Vamos conversar</button>
      </ElectricBorder>,
    );

    expect(container.querySelector('canvas')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Vamos conversar' })).toBeInTheDocument();
  });

  /*
   * O que garante que o loop parou é o canvas sumir: o efeito que agenda os
   * frames é fechado por `running`, o mesmo estado que decide a montagem.
   * (Espiar cancelAnimationFrame não serviria aqui — o happy-dom não devolve
   * contexto 2D, então o efeito sai antes de agendar o primeiro frame.)
   */
  it('desmonta o canvas ao desativar', () => {
    const { rerender, container } = render(
      <ElectricBorder active>
        <span>alvo</span>
      </ElectricBorder>,
    );
    expect(container.querySelector('canvas')).toBeInTheDocument();

    rerender(
      <ElectricBorder active={false}>
        <span>alvo</span>
      </ElectricBorder>,
    );

    expect(container.querySelector('canvas')).not.toBeInTheDocument();
  });
});
