import { z } from 'zod';

export const createGuestSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome muito longo'),
  email: z
    .email('E-mail inválido')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .min(10, 'Telefone inválido')
    .max(20, 'Telefone muito longo')
    .optional()
    .or(z.literal('')),
  eventId: z
    .uuid('EventId inválido'),
});

export const updateGuestSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome muito longo')
    .optional(),
  email: z
    .email('E-mail inválido')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .min(10, 'Telefone inválido')
    .max(20, 'Telefone muito longo')
    .optional()
    .or(z.literal('')),
  status: z
    .enum(['PENDING', 'CONFIRMED', 'DECLINED'])
    .optional(),
});

export type CreateGuestInput = z.infer<typeof createGuestSchema>;
export type UpdateGuestInput = z.infer<typeof updateGuestSchema>;