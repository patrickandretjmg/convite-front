import { z } from 'zod';

export const createEventSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome muito longo'),
  description: z
    .string()
    .max(500, 'Descrição muito longa')
    .optional()
    .or(z.literal('')),
  date: z
    .string()
    .min(1, 'Data é obrigatória'),
  time: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido (HH:MM)')
    .min(1, 'Horário é obrigatório'),
  location: z
    .string()
    .min(3, 'Local deve ter no mínimo 3 caracteres')
    .max(200, 'Local muito longo'),
  slug: z
    .string()
    .min(3, 'Slug deve ter no mínimo 3 caracteres')
    .max(100, 'Slug muito longo')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido (use apenas letras minúsculas, números e hífens)'),
  confirmationDeadline: z
    .string()
    .optional()
    .or(z.literal('')),
  idadeLimiteCriancaSemCodigo: z
    .number()
    .int('Idade deve ser um número inteiro')
    .min(0, 'Idade deve ser no mínimo 0')
    .max(18, 'Idade deve ser no máximo 18')
    .optional()
    .nullable(),
});

export const updateEventSchema = createEventSchema.partial();

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;