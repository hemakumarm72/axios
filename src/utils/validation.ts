import { z } from 'zod';

export const validateResponse = <T>(
  response: unknown,
  schema: z.ZodType<T>
): T => {
  try {
    return schema.parse(response);
  } catch (err) {
    console.error('Validation error:', err);
    throw new Error('Invalid API response');
  }
};
