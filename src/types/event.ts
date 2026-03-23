import { z } from "zod/v4";

export const eventSchema = z.object({
  id: z.string(),
  name: z.string(),
  theme: z.string(),
  dateTime: z.string(),
  venue: z.string(),
  livestreamInfo: z.string(),
  heroBannerUrl: z.string(),
});

export type Event = z.infer<typeof eventSchema>;
