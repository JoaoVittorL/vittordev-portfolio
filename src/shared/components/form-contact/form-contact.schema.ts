import * as z from 'zod';

export const formContactSchema = z.object({
  name: z.string().min(1, { message: 'O nome é obrigatório' }),
  email: z.string().email({ message: 'O email é obrigatório' }),
  message: z.string().min(1, { message: 'A mensagem é obrigatória' }),
});
export type FormContactSchemaType = typeof formContactSchema;