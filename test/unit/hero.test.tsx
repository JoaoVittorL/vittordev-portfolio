import { render, screen, waitFor } from '@testing-library/react';

import Hero from '@/features/home/components/hero';
import { MockIntersectionObserver } from '../mocks/intersection-observer';

describe('Hero', () => {
  it('renderiza o nome e o badge de disponibilidade', () => {
    render(<Hero />);

    expect(screen.getByRole('heading', { name: /João Vittor/ })).toBeInTheDocument();
    expect(screen.getByText('Disponível para novas oportunidades')).toBeInTheDocument();
  });

  it('CTA aponta para a seção de contato', () => {
    render(<Hero />);
    expect(screen.getByRole('link', { name: 'Vamos conversar' })).toHaveAttribute(
      'href',
      '#contact',
    );
  });

  it('tem links para GitHub e LinkedIn', () => {
    render(<Hero />);
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      expect.stringContaining('github.com'),
    );
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      expect.stringContaining('linkedin.com'),
    );
  });

  it('revela o conteúdo quando a seção entra na viewport', async () => {
    render(<Hero />);

    const heading = screen.getByRole('heading', { name: /João Vittor/ });
    expect(heading.className).toContain('reveal');
    expect(heading.className).not.toContain('is-revealed');

    MockIntersectionObserver.instances.at(-1)!.trigger(true);

    await waitFor(() => {
      expect(heading.className).toContain('is-revealed');
    });
  });

  it('indicador de scroll aponta para a seção sobre', () => {
    render(<Hero />);
    expect(screen.getByRole('link', { name: 'Ir para a seção sobre' })).toHaveAttribute(
      'href',
      '#about',
    );
  });
});
