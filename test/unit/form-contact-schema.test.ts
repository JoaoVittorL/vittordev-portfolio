import { formContactSchema } from '@/shared/components/form-contact/form-contact.schema';

describe('formContactSchema', () => {
  it('aceita dados válidos', () => {
    const result = formContactSchema.safeParse({
      name: 'João Vittor',
      email: 'joao@exemplo.com',
      message: 'Olá, gostaria de conversar.',
    });

    expect(result.success).toBe(true);
  });

  it('rejeita nome vazio com a mensagem correta', () => {
    const result = formContactSchema.safeParse({
      name: '',
      email: 'joao@exemplo.com',
      message: 'mensagem',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      // Comparação sem acento: o arquivo-fonte usa forma Unicode NFD
      expect(result.error.issues[0].message).toMatch(/O nome .* obrigat/);
    }
  });

  it('rejeita email inválido com a mensagem correta', () => {
    const result = formContactSchema.safeParse({
      name: 'João',
      email: 'nao-e-um-email',
      message: 'mensagem',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/O email .* obrigat/);
    }
  });

  it('rejeita mensagem vazia com a mensagem correta', () => {
    const result = formContactSchema.safeParse({
      name: 'João',
      email: 'joao@exemplo.com',
      message: '',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/A messagem .* obrigat/);
    }
  });

  it('acumula todos os erros quando tudo está vazio', () => {
    const result = formContactSchema.safeParse({ name: '', email: '', message: '' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toHaveLength(3);
    }
  });
});
