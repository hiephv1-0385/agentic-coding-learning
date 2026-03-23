import { z } from "zod/v4";

export const awardCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  shortDescription: z.string(),
  description: z.string(),
  thumbnailUrl: z.string(),
  order: z.number(),
  quantity: z.number(),
  unitType: z.string(),
  prizeValue: z.number(),
  prizeSubLabel: z.string(),
  prizeValueTeam: z.number().nullable(),
  prizeSubLabelTeam: z.string().nullable(),
});

export type AwardCategory = z.infer<typeof awardCategorySchema>;
