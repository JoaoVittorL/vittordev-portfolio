import { fireEvent, render, waitFor } from '@testing-library/react';

import CursorSpotlight from '@/shared/components/cursor-spotlight';
import { mockMatchMedia } from '../mocks/match-media';

describe('CursorSpotlight', () => {
  it('renderiza um overlay invisível a interações', () => {
    const { container } = render(<CursorSpotlight />);
    const overlay = container.firstElementChild!;

    expect(overlay).toHaveAttribute('aria-hidden', 'true');
    expect(overlay.className).toContain('pointer-events-none');
  });

  it('agenda um frame de animação ao mover o mouse', () => {
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame');
    render(<CursorSpotlight />);

    fireEvent.mouseMove(window, { clientX: 200, clientY: 150 });

    expect(rafSpy).toHaveBeenCalled();
  });

  it('fica inerte quando o usuário prefere movimento reduzido', () => {
    mockMatchMedia({ '(prefers-reduced-motion: reduce)': true });
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame');

    render(<CursorSpotlight />);
    fireEvent.mouseMove(window, { clientX: 200, clientY: 150 });

    expect(rafSpy).not.toHaveBeenCalled();
  });

  it('fica inerte em telas touch (pointer: coarse)', () => {
    mockMatchMedia({ '(pointer: coarse)': true });
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame');

    render(<CursorSpotlight />);
    fireEvent.mouseMove(window, { clientX: 200, clientY: 150 });

    expect(rafSpy).not.toHaveBeenCalled();
  });
});
