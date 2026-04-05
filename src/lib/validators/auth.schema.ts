import { z } from 'zod'

export const signupSchema = z.object({
  fullName: z.string().min(2).max(80).trim(),
  email: z.string().email().toLowerCase().trim(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
})

export const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
})

export const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
})

export type SignupDTO = z.infer<typeof signupSchema>
export type LoginDTO = z.infer<typeof loginSchema>
