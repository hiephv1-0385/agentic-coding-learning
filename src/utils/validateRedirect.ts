import { z } from "zod";

const redirectSchema = z
  .string()
  .startsWith("/")
  .refine((val) => !val.includes("://"), {
    message: "Redirect must not contain protocol",
  })
  .refine((val) => !val.startsWith("//"), {
    message: "Redirect must not start with //",
  });

export function validateRedirect(
  redirect: string | null | undefined,
  fallback = "/"
): string {
  if (!redirect) return fallback;

  const result = redirectSchema.safeParse(redirect);
  return result.success ? result.data : fallback;
}
