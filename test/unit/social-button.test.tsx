import { render, screen } from '@testing-library/react';
import { Github } from 'lucide-react';

import SocialButton from '@/shared/components/social-button';

describe('SocialButton', () => {
  it('renderiza link externo seguro com o ícone', () => {
    render(
      <SocialButton
        href="https://github.com/JoaoVittorL"
        icon={<Github data-testid="icone" />}
        label="GitHub"
      />,
    );

    const link = screen.getByRole('link', { name: 'GitHub' });
    expect(link).toHaveAttribute('href', 'https://github.com/JoaoVittorL');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByTestId('icone')).toBeInTheDocument();
  });
});
