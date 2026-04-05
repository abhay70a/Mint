import { z } from 'zod'
import { AppError } from '@/lib/errors/AppError'

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    const firstError = result.error.issues[0]
    throw new AppError('VALIDATION_ERROR', firstError.message, 400, firstError.path[0] as string)
  }
  return result.data
}
