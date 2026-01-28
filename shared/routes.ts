import { z } from 'zod';
import { insertMessageSchema, projects, services, posts, messages, rooms } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  projects: {
    list: {
      method: 'GET' as const,
      path: '/api/projects',
      responses: {
        200: z.array(z.custom<typeof projects.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/projects/:slug',
      responses: {
        200: z.custom<typeof projects.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    getById: {
      method: 'GET' as const,
      path: '/api/projects/id/:id',
      responses: {
        200: z.custom<typeof projects.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  services: {
    list: {
      method: 'GET' as const,
      path: '/api/services',
      responses: {
        200: z.array(z.custom<typeof services.$inferSelect>()),
      },
    },
  },
  posts: {
    list: {
      method: 'GET' as const,
      path: '/api/posts',
      responses: {
        200: z.array(z.custom<typeof posts.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/posts/:slug',
      responses: {
        200: z.custom<typeof posts.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    getById: {
      method: 'GET' as const,
      path: '/api/posts/id/:id',
      responses: {
        200: z.custom<typeof posts.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  contact: {
    submit: {
      method: 'POST' as const,
      path: '/api/contact',
      input: insertMessageSchema,
      responses: {
        201: z.custom<typeof messages.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  rooms: {
    list: {
      method: 'GET' as const,
      path: '/api/admin/rooms',
      responses: {
        200: z.array(z.custom<typeof rooms.$inferSelect>()),
      },
    },
    getById: {
      method: 'GET' as const,
      path: '/api/admin/rooms/id/:id',
      responses: {
        200: z.custom<typeof rooms.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    save: {
      method: 'POST' as const,
      path: '/api/admin/rooms/save',
      input: z.object({
        id: z.number().optional(),
        name: z.string().min(1, 'Room name is required'),
        type: z.string().min(1, 'Room type is required'),
        price: z.number().min(0, 'Price must be positive'),
        status: z.string().optional(),
        projectId: z.number().optional(),
        description: z.string().optional(),
        amenities: z.array(z.string()).optional(),
        images: z.array(z.string()).optional(),
      }),
      responses: {
        200: z.custom<typeof rooms.$inferSelect>(),
        201: z.custom<typeof rooms.$inferSelect>(),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/admin/rooms/:id',
      responses: {
        200: z.object({ success: z.boolean(), message: z.string() }),
        404: errorSchemas.notFound,
        500: errorSchemas.internal,
      },
    },
  },
  admin: {
    dashboard: {
      method: 'GET' as const,
      path: '/api/admin/dashboard',
      responses: {
        200: z.object({
          stats: z.object({
            projects: z.object({
              total: z.number(),
              growth: z.number(), // Phần trăm tăng trưởng
            }),
            services: z.object({
              total: z.number(),
              growth: z.number(),
            }),
            posts: z.object({
              total: z.number(),
              growth: z.number(),
            }),
            messages: z.object({
              total: z.number(),
              growth: z.number(),
            }),
          }),
        }),
        500: errorSchemas.internal,
      },
    },
    projects: {
      list: {
        method: 'GET' as const,
        path: '/api/admin/projects',
        responses: {
          200: z.array(z.custom<typeof projects.$inferSelect>()),
        },
      },
    },
    posts: {
      list: {
        method: 'GET' as const,
        path: '/api/admin/posts',
        responses: {
          200: z.array(z.custom<typeof posts.$inferSelect>()),
        },
      },
    },
    services: {
      list: {
        method: 'GET' as const,
        path: '/api/admin/services',
        responses: {
          200: z.array(z.custom<typeof services.$inferSelect>()),
        },
      },
    },
    messages: {
      list: {
        method: 'GET' as const,
        path: '/api/admin/messages',
        responses: {
          200: z.array(z.custom<typeof messages.$inferSelect>()),
        },
      },
    },
  },
};

// ============================================
// REQUIRED: buildUrl helper
// ============================================
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
