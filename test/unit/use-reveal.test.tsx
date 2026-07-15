import { renderHook, render, waitFor } from '@testing-library/react';

import { useReveal } from '@/shared/hooks/use-reveal';
import { MockIntersectionObserver } from '../mocks/intersection-observer';
import { mockMatchMedia } from '../mocks/match-media';

function TestComponent() {
  const { ref, isRevealed } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} data-testid="alvo" data-revealed={isRevealed}>
      conteúdo
    </div>
  );
}

describe('useReveal', () => {
  it('começa não-revelado', () => {
    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId('alvo').dataset.revealed).toBe('false');
  });

  it('revela quando o elemento entra na viewport', async () => {
    const { getByTestId } = render(<TestComponent />);

    const observer = MockIntersectionObserver.instances.at(-1)!;
    observer.trigger(true);

    await waitFor(() => {
      expect(getByTestId('alvo').dataset.revealed).toBe('true');
    });
  });

  it('com once=true (padrão), para de observar após revelar', async () => {
    const { getByTestId } = render(<TestComponent />);

    const observer = MockIntersectionObserver.instances.at(-1)!;
    expect(observer.elements.size).toBe(1);

    observer.trigger(true);

    await waitFor(() => {
      expect(getByTestId('alvo').dataset.revealed).toBe('true');
    });
    expect(observer.elements.size).toBe(0);
  });

  it('revela imediatamente quando o usuário prefere movimento reduzido', () => {
    mockMatchMedia({ '(prefers-reduced-motion: reduce)': true });

    const { getByTestId } = render(<TestComponent />);

    expect(getByTestId('alvo').dataset.revealed).toBe('true');
    // Nenhum observer deve ter sido criado
    expect(MockIntersectionObserver.instances).toHaveLength(0);
  });

  it('retorna ref e isRevealed', () => {
    const { result } = renderHook(() => useReveal());
    expect(result.current).toHaveProperty('ref');
    expect(result.current).toHaveProperty('isRevealed', false);
  });
});
