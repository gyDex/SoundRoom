import { z } from 'zod'

export const signupSchema = z.object({
    username: z
        .string()
        .min(2, { message: 'Username is too short' })
        .max(20, 'Username is too long')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscore')
        .transform((v) => v.toLowerCase().replace(/\s+/g, '_')),
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters long')
        .max(32, 'Password must not exceed 32 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Password must contain at least one special character')
        .refine((password) => !/\s/.test(password), 'Password must not contain spaces')
        .refine((password) => !/(.)\1\1/.test(password), 'Password must not contain 3 identical characters in a row'),
    confirmPassword: z.string().min(1, 'Please confirm your password')
        }).refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match'
    })