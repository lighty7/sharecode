
import { z } from 'zod';
import { insertRoomSchema, rooms } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  forbidden: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  rooms: {
    get: {
      method: 'GET' as const,
      path: '/api/rooms/:slug',
      responses: {
        200: z.custom<typeof rooms.$inferSelect>(),
        403: z.object({ isPrivate: z.literal(true), message: z.string() }), // Password required
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/rooms',
      input: z.object({
        slug: z.string().optional(),
        content: z.string().optional(),
        password: z.string().optional(),
        expiresIn: z.number().optional(), // hours
      }),
      responses: {
        201: z.custom<typeof rooms.$inferSelect>(),
        400: errorSchemas.validation,
        409: z.object({ message: z.string() }), // Slug taken
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/rooms/:slug',
      input: z.object({
        content: z.string().optional(),
        password: z.string().optional(), // For verification
        lockPassword: z.string().optional(), // For setting a new lock
        isPrivate: z.boolean().optional(),
      }),
      responses: {
        200: z.custom<typeof rooms.$inferSelect>(),
        403: errorSchemas.forbidden,
        404: errorSchemas.notFound,
      },
    },
    verify: {
      method: 'POST' as const,
      path: '/api/rooms/:slug/verify',
      input: z.object({
        password: z.string(),
      }),
      responses: {
        200: z.object({ success: z.boolean() }),
        403: errorSchemas.forbidden,
      },
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
