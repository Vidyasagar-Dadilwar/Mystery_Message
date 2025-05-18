import {z} from 'zod';

export const usernameValidationSchema = z.object({
  name: z
        .string()
        .min(2, 'Name is required')
        .max(20, 'Name must be less than 20 characters')
        .regex(/^[a-zA-Z0-9]+$/, 'Name must be alphanumeric'),
})


export const signUpSchema = z.object({
    username: usernameValidationSchema,
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, {message: 'Password must be at least 6 characters long'}),
})