import { z } from 'zod';

// Define the schema for the login response
export const AuthResponseSchema = z.object({
  success: z.boolean(),
  result: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
});

// Infer the type from the schema
export type AuthResponse = z.infer<typeof AuthResponseSchema>;


