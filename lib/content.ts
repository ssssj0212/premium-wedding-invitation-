import { z } from "zod";

export function validateContent<T extends z.ZodTypeAny>(schema: T, data: unknown): z.infer<T> {
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    console.warn("Content validation failed.", parsed.error.flatten().fieldErrors);
    return data as z.infer<T>;
  }

  return parsed.data;
}
