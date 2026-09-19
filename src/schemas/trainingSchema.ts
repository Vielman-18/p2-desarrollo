// src/schemas/trainingSchema.ts
import { z } from 'zod';

export const trainingSchema = z
  .object({
    nombre: z
      .string({ error: 'El nombre es requerido' })
      .min(3, 'Mínimo 3 caracteres')
      .max(120, 'Máximo 120 caracteres'),

    categoria: z.enum(
      ['Tecnología', 'Liderazgo', 'Seguridad', 'Ventas', 'Habilidades Blandas', 'Cumplimiento'],
      { error: 'Selecciona una categoría' }
    ),

    instructor: z
      .string({ error: 'El instructor es requerido' })
      .min(2, 'Mínimo 2 caracteres')
      .max(100, 'Máximo 100 caracteres'),

    fechaInicio: z
      .string({ error: 'La fecha de inicio es requerida' })
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido (YYYY-MM-DD)'),

    fechaFin: z
      .string({ error: 'La fecha de fin es requerida' })
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido (YYYY-MM-DD)'),

    cupoMaximo: z.coerce
      .number({ error: 'El cupo máximo es requerido' })
      .int('Debe ser un número entero')
      .min(1, 'El cupo debe ser mayor a 0')
      .max(1000, 'Cupo fuera de rango'),

    inscritos: z.coerce
      .number({ error: 'Los inscritos son requeridos' })
      .int('Debe ser un número entero')
      .min(0, 'No puede ser negativo'),

    estado: z.enum(['programada', 'en_curso', 'finalizada', 'cancelada']).default('programada'),

    descripcion: z
      .string()
      .max(500, 'Máximo 500 caracteres')
      .optional()
      .or(z.literal('')),
  })
  // Regla cruzada: la fecha de fin no puede ser anterior a la de inicio
  .refine((data) => data.fechaFin >= data.fechaInicio, {
    message: 'La fecha de fin no puede ser anterior a la fecha de inicio',
    path: ['fechaFin'],
  })
  // Regla cruzada: los inscritos no pueden superar el cupo máximo
  .refine((data) => data.inscritos <= data.cupoMaximo, {
    message: 'Los inscritos no pueden superar el cupo máximo',
    path: ['inscritos'],
  });

export type TrainingFormData = z.infer<typeof trainingSchema>;

// Tipo de ENTRADA del schema (antes de que Zod corra z.coerce y los .default()) —
// react-hook-form necesita este tipo para el formulario en sí, distinto del tipo
// de SALIDA (TrainingFormData) que recibe onSubmit una vez que el resolver ya validó.
export type TrainingFormInput = z.input<typeof trainingSchema>;
