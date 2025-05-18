import {z} from 'zod';

export const messageSchemas = z.object({
    content: z.string().min(1, {message: 'Message is required'}).max(500, {message: 'Message must be less than 500 characters'}),
})