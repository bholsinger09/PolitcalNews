import { z } from 'zod';

export const newsQuerySchema = z.object({
    q: z.string().optional(),
    category: z.enum(['general', 'politics', 'business', 'technology', 'world']).optional(),
    country: z.string().length(2).optional(),
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(20),
});

export const createSavedNewsSchema = z.object({
    id: z.string(),
    source: z.object({
        id: z.string().nullable(),
        name: z.string(),
    }),
    author: z.string().nullable(),
    title: z.string(),
    description: z.string(),
    url: z.string().url(),
    urlToImage: z.string().url().nullable(),
    publishedAt: z.string(),
    content: z.string(),
    category: z.string().optional(),
    country: z.string().optional(),
    notes: z.string().optional(),
});

export const updateSavedNewsSchema = z.object({
    notes: z.string().optional(),
});

export type NewsQuery = z.infer<typeof newsQuerySchema>;
export type CreateSavedNews = z.infer<typeof createSavedNewsSchema>;
export type UpdateSavedNews = z.infer<typeof updateSavedNewsSchema>;
