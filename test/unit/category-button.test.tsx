import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CategoryButton from '@/shared/components/category-button';

describe('CategoryButton', () => {
  it('chama onClick ao clicar', async () => {
    const onClick = vi.fn();
    render(
      <CategoryButton active={false} onClick={onClick}>
        Frontend
      </CategoryButton>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Frontend' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('ativo usa o estilo teal', () => {
    render(
      <CategoryButton active onClick={() => {}}>
        Frontend
      </CategoryButton>,
    );
    expect(screen.getByRole('button').className).toContain('text-accent-300');
  });

  it('inativo usa o estilo slate', () => {
    render(
      <CategoryButton active={false} onClick={() => {}}>
        Frontend
      </CategoryButton>,
    );
    expect(screen.getByRole('button').className).toContain('text-slate-400');
  });
});
