import { render, screen } from '@testing-library/react';

import SocialLink from '@/shared/components/social-link';

describe('SocialLink', () => {
  it.each(['GitHub', 'LinkedIn', 'WhatsApp', 'Twitter'])(
    'renderiza o ícone de %s com aria-label e abre em nova aba',
    (label) => {
      render(<SocialLink href="https://exemplo.com" label={label} />);

      const link = screen.getByRole('link', { name: label });
      expect(link).toHaveAttribute('href', 'https://exemplo.com');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link.querySelector('svg')).not.toBeNull();
    },
  );

  it('não renderiza svg para label desconhecido', () => {
    render(<SocialLink href="https://exemplo.com" label="Desconhecido" />);
    const link = screen.getByRole('link', { name: 'Desconhecido' });
    expect(link.querySelector('svg')).toBeNull();
  });
});
