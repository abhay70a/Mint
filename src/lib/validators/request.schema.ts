import { z } from 'zod'

export const createRequestSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be 100 characters or fewer')
    .trim(),
  description: z.string()
    .min(20, 'Please provide at least 20 characters of detail')
    .max(5000)
    .optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  category: z.string().max(50).optional(),
})

export const updateRequestSchema = z.object({
  title: z.string().min(5).max(100).optional(),
  description: z.string().min(20).max(5000).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  category: z.string().max(50).optional(),
})

export const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED']),
  note: z.string().max(500).optional(),
})

export type CreateRequestDTO = z.infer<typeof createRequestSchema>
export type UpdateRequestDTO = z.infer<typeof updateRequestSchema>
export type UpdateStatusDTO = z.infer<typeof updateStatusSchema>
