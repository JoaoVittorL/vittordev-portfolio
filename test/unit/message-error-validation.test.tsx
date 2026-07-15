import { render, screen } from '@testing-library/react';

import { ErrorValidationMessage } from '@/shared/components/message-error-validation';

describe('ErrorValidationMessage', () => {
  it('exibe a mensagem de erro em vermelho', () => {
    render(<ErrorValidationMessage message="Campo inválido" />);

    const message = screen.getByText('Campo inválido');
    expect(message).toBeInTheDocument();
    expect(message.className).toContain('text-red-400');
  });
});
