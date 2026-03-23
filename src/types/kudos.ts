import { z } from "zod";

// PostgreSQL accepts any hex-formatted UUID, but Zod v4's .uuid() enforces
// strict RFC 4122 version/variant bits. Use a loose pattern so seed data
// and non-v4 UUIDs (common in Supabase local dev) pass validation.
const uuidish = z.string().regex(
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
  "Invalid UUID format"
);

// --- Base schemas ---

export const profileSchema = z.object({
  id: uuidish,
  display_name: z.string(),
  email: z.string().email().nullable(),
  department: z.string().nullable(),
  avatar_url: z.string().url().nullable(),
  kudos_received_count: z.number().int().min(0),
  kudos_sent_count: z.number().int().min(0),
  hearts_received: z.number().int().min(0),
});

export type Profile = z.infer<typeof profileSchema>;

export const kudosSchema = z.object({
  id: uuidish,
  sender_id: uuidish,
  receiver_id: uuidish,
  content: z.string(),
  hashtags: z.array(z.string()),
  images: z.array(z.string()),
  video_url: z.string().url().nullable(),
  category: z.string().nullable(),
  heart_count: z.number().int().min(0),
  created_at: z.string(),
  danh_hieu: z.string().default(""),
  is_anonymous: z.boolean().default(false),
  anonymous_name: z.string().nullable().default(null),
  sender: profileSchema.optional(),
  receiver: profileSchema.optional(),
  is_liked_by_me: z.boolean().optional(),
});

export type Kudos = z.infer<typeof kudosSchema>;

export const hashtagSchema = z.object({
  id: uuidish,
  name: z.string(),
});

export type Hashtag = z.infer<typeof hashtagSchema>;

export const departmentSchema = z.object({
  id: uuidish,
  name: z.string(),
});

export type Department = z.infer<typeof departmentSchema>;

export const userStatsSchema = z.object({
  kudos_received: z.number().int().min(0),
  kudos_sent: z.number().int().min(0),
  hearts_received: z.number().int().min(0),
  secret_boxes_opened: z.number().int().min(0),
  secret_boxes_remaining: z.number().int().min(0),
});

export type UserStats = z.infer<typeof userStatsSchema>;

export const spotlightEntrySchema = z.object({
  user_id: uuidish,
  display_name: z.string(),
  kudos_count: z.number().int().min(0),
});

export type SpotlightEntry = z.infer<typeof spotlightEntrySchema>;

export interface LiveKudosEntry {
  receiver_name: string;
  created_at: string;
}

export const leaderboardEntrySchema = z.object({
  user_id: uuidish,
  display_name: z.string(),
  avatar_url: z.string().url().nullable(),
  department: z.string().nullable(),
  gift_description: z.string(),
  awarded_at: z.string(),
});

export type LeaderboardEntry = z.infer<typeof leaderboardEntrySchema>;

export const profilePreviewSchema = z.object({
  id: uuidish,
  display_name: z.string(),
  department: z.string().nullable(),
  avatar_url: z.string().url().nullable(),
  kudos_received_count: z.number().int().min(0),
});

export type ProfilePreview = z.infer<typeof profilePreviewSchema>;

// --- Create Kudos schema ---

export const createKudosSchema = z.object({
  receiver_id: uuidish,
  danh_hieu: z.string().min(1).max(100),
  content: z.string().min(1).max(15000), // HTML string — 3000 text chars ≈ up to 15000 with markup
  hashtags: z.array(z.string()).min(1).max(5),
  images: z.array(z.string().url()).max(5).default([]),
  is_anonymous: z.boolean().default(false),
  anonymous_name: z.string().max(50).nullable().default(null),
});

export type CreateKudosInput = z.infer<typeof createKudosSchema>;

// --- Request/Response schemas ---

export const cursorPaginationParamsSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  hashtag: z.string().optional(),
  department: z.string().optional(),
});

export type CursorPaginationParams = z.infer<typeof cursorPaginationParamsSchema>;

export const kudosFeedResponseSchema = z.object({
  data: z.array(kudosSchema),
  next_cursor: z.string().nullable(),
  has_more: z.boolean(),
});

export type KudosFeedResponse = z.infer<typeof kudosFeedResponseSchema>;

export const highlightsResponseSchema = z.object({
  data: z.array(kudosSchema),
});

export type HighlightsResponse = z.infer<typeof highlightsResponseSchema>;

export const toggleLikeResponseSchema = z.object({
  action: z.enum(["liked", "unliked"]),
  heart_count: z.number().int().min(0),
  hearts_awarded: z.number().int().min(0),
});

export type ToggleLikeResponse = z.infer<typeof toggleLikeResponseSchema>;

export const spotlightResponseSchema = z.object({
  data: z.array(spotlightEntrySchema),
  total_kudos: z.number().int().min(0),
});

export type SpotlightResponse = z.infer<typeof spotlightResponseSchema>;

export const searchUsersParamsSchema = z.object({
  q: z.string().min(1).max(100),
});

export type SearchUsersParams = z.infer<typeof searchUsersParamsSchema>;

export const searchUsersResponseSchema = z.object({
  data: z.array(profilePreviewSchema),
});

export type SearchUsersResponse = z.infer<typeof searchUsersResponseSchema>;
