import { render } from '@testing-library/react';

import DotGrid from '@/shared/components/dot-grid';
import { mockMatchMedia } from '../mocks/match-media';

describe('DotGrid', () => {
  it('renderiza um canvas decorativo e inerte a interações', () => {
    const { container } = render(<DotGrid />);
    const wrapper = container.firstElementChild!;

    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    expect(wrapper.className).toContain('pointer-events-none');
    expect(wrapper.querySelector('canvas')).toBeInTheDocument();
  });

  it('repassa a className para o wrapper (máscara/posicionamento ficam com quem usa)', () => {
    const { container } = render(<DotGrid className="absolute inset-0" />);

    expect(container.firstElementChild!.className).toContain('absolute inset-0');
  });

  /*
   * O modo interativo é observado pelos listeners, não pelo requestAnimationFrame:
   * o happy-dom não implementa Path2D, então o loop de pintura sai antes de
   * agendar o primeiro frame e um spy no RAF nunca dispararia.
   */
  it('escuta o cursor quando há um ponteiro fino disponível', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');

    render(<DotGrid />);

    const events = addSpy.mock.calls.map(([event]) => event);
    expect(events).toContain('mousemove');
    expect(events).toContain('click');
  });

  it('fica estático quando o usuário prefere movimento reduzido', () => {
    mockMatchMedia({ '(prefers-reduced-motion: reduce)': true });
    const addSpy = vi.spyOn(window, 'addEventListener');

    render(<DotGrid />);

    const events = addSpy.mock.calls.map(([event]) => event);
    expect(events).not.toContain('mousemove');
    expect(events).not.toContain('click');
  });

  it('fica estático em telas touch (pointer: coarse)', () => {
    mockMatchMedia({ '(pointer: coarse)': true });
    const addSpy = vi.spyOn(window, 'addEventListener');

    render(<DotGrid />);

    const events = addSpy.mock.calls.map(([event]) => event);
    expect(events).not.toContain('mousemove');
    expect(events).not.toContain('click');
  });

  it('remove os listeners ao desmontar', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = render(<DotGrid />);
    unmount();

    const events = removeSpy.mock.calls.map(([event]) => event);
    expect(events).toContain('mousemove');
    expect(events).toContain('click');
  });
});
