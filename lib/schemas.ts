import { z } from "zod";

export const ALLOWED_MATERIAL_ICONS = [
  "bolt",
  "psychology",
  "trophy",
  "school",
  "star",
  "military_tech",
  "workspace_premium",
  "shield",
  "sports_esports",
  "timer",
  "verified",
  "local_library",
  "smart_toy",
  "emoji_events",
  "calculate",
  "insights",
  "auto_awesome",
] as const;

export const HeroTagSchema = z.object({
  id: z.string().min(1, "Tag ID is required"),
  icon: z.enum(ALLOWED_MATERIAL_ICONS, {
    error: "Icon must be from the allowed list of chess/academic symbols",
  }),
  label: z.string().min(1, "Label is required").max(50, "Label max 50 chars"),
  tone: z.enum(["primary", "secondary"]),
});

export const HeroContentSchema = z.object({
  tags: z.array(HeroTagSchema).min(1, "At least one hero tag is required"),
});

export const ClassesSectionContentSchema = z.object({
  pillLabel: z.string().min(1, "Pill label is required").max(40),
  heading: z.string().min(1, "Heading is required").max(100),
  description: z.string().min(1, "Description is required").max(400),
});

export const ClassTrackSchema = z.object({
  id: z.string().min(1, "ID is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  title: z.string().min(1, "Title is required").max(100),
  level: z.string().min(1, "Level is required").max(50),
  levelTone: z.enum(["primary", "secondary"]).default("primary"),
  mode: z.literal("Online", {
    error: "Mode must always be 'Online'",
  }),
  ratingLabel: z.string().min(1, "Rating label is required").max(50),
  description: z.string().min(1, "Description is required").max(500),
  duration: z.string().min(1, "Duration is required").max(50),
  sessionLength: z.string().min(1, "Session length is required").max(50),
  batchSize: z.string().min(1, "Batch size is required").max(50),
  schedule: z.string().min(1, "Schedule is required").max(100),
  modules: z.array(z.string().min(1)).min(1, "At least one module required"),
  badge: z.string().max(50).optional().or(z.literal("")),
  perks: z.string().max(150).optional().or(z.literal("")),
  order: z.number().default(0),
  visible: z.boolean().default(true),
});

export const CoachProfileSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required").max(100),
  imageUrl: z.string().min(1, "Image URL is required"),
  imagePublicId: z.string().min(1, "Image Public ID is required"),
  imageAlt: z.string().min(1, "Image Alt text is required").max(150),
  roleLine: z.string().min(1, "Role line is required").max(100),
  peakRating: z.string().min(1, "Peak rating is required").max(50),
  badge: z.string().max(50).optional().or(z.literal("")),
  bio: z.string().min(1, "Bio is required").max(600),
  specialties: z.array(z.string().min(1)).min(1, "At least one specialty required"),
  order: z.number().default(0),
  visible: z.boolean().default(true),
});

export const TournamentEventSchema = z.object({
  id: z.string().min(1, "ID is required"),
  statusLabel: z.string().min(1, "Status label is required").max(50),
  statusTone: z.enum(["live", "upcoming", "monthly"]),
  platform: z.string().min(1, "Platform is required").max(50),
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required").max(400),
  format: z.string().min(1, "Format is required").max(100),
  timeControl: z.string().min(1, "Time control is required").max(50),
  dayTime: z.string().min(1, "Day and time is required").max(100),
  ctaType: z.enum(["link", "register"]),
  ctaLabel: z.string().min(1, "CTA label is required").max(50),
  ctaUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  order: z.number().default(0),
  visible: z.boolean().default(true),
});

export const GalleryItemSchema = z.object({
  id: z.string().min(1, "ID is required"),
  category: z.enum(["classes", "tournaments", "events"]),
  imageUrl: z.string().min(1, "Image URL is required"),
  imagePublicId: z.string().min(1, "Image Public ID is required"),
  imageAlt: z.string().min(1, "Image Alt text is required").max(150),
  dateLabel: z.string().min(1, "Date is required").max(50),
  kicker: z.string().min(1, "Kicker is required").max(50),
  title: z.string().min(1, "Title is required").max(120),
  excerpt: z.string().min(1, "Excerpt is required").max(400),
  linkUrl: z.string().max(300).optional().or(z.literal("")),
  order: z.number().default(0),
  visible: z.boolean().default(true),
});

export const TestimonialItemSchema = z.object({
  id: z.string().min(1, "ID is required"),
  rating: z.number().min(1).max(5),
  quote: z.string().min(1, "Quote is required").max(600),
  name: z.string().min(1, "Name is required").max(80),
  relation: z.string().min(1, "Relation is required").max(100),
  classLabel: z.string().min(1, "Class label is required").max(60),
  consentConfirmed: z.boolean().default(true),
  order: z.number().default(0),
  visible: z.boolean().default(true),
});
