import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const categorySchema = z.object({
  name: z.string().trim().min(1).max(60),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  order: z.number().int().default(0),
});

export const productVariantSchema = z.object({
  name: z.string().trim().min(1).max(60),
  priceModifier: z.number().default(0),
});

export const productSchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(140)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  description: z.string().trim().min(1).max(2000),
  price: z.number().nonnegative(),
  images: z.array(z.string()).default([]),
  variants: z.array(productVariantSchema).default([]),
  available: z.boolean().default(true),
  featured: z.boolean().default(false),
  categoryId: z.string().min(1),
});

export const orderItemInputSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(50),
  variant: z.string().trim().max(60).optional().nullable(),
  specialInstructions: z.string().trim().max(500).optional().nullable(),
});

export const createOrderSchema = z.object({
  customerName: z.string().trim().min(1).max(120),
  customerPhone: z.string().trim().min(6).max(30),
  customerEmail: z.string().trim().email().optional().or(z.literal("")).nullable(),
  deliveryType: z.enum(["PICKUP", "DELIVERY"]),
  address: z.string().trim().max(300).optional().nullable(),
  city: z.string().trim().max(100).optional().nullable(),
  scheduledDate: z.string().min(1),
  scheduledTime: z.string().trim().min(1).max(30),
  paymentMethod: z.enum(["CASH", "CARD_ON_DELIVERY", "ONLINE"]),
  notes: z.string().trim().max(1000).optional().nullable(),
  items: z.array(orderItemInputSchema).min(1),
});

export const orderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "READY",
    "OUT_FOR_DELIVERY",
    "COMPLETED",
    "CANCELLED",
  ]),
});

export const reviewCreateSchema = z.object({
  customerName: z.string().trim().min(1).max(120),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(1).max(1000),
  imageUrl: z.string().trim().max(500).optional().nullable(),
});

export const reviewUpdateSchema = z.object({
  customerName: z.string().trim().min(1).max(120).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().trim().min(1).max(1000).optional(),
  imageUrl: z.string().trim().max(500).optional().nullable(),
  approved: z.boolean().optional(),
});

export const galleryImageSchema = z.object({
  url: z.string().trim().min(1),
  caption: z.string().trim().max(200).optional().nullable(),
  category: z.string().trim().max(60).default("General"),
  order: z.number().int().default(0),
});

export const offerSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(500),
  imageUrl: z.string().trim().max(500).optional().nullable(),
  active: z.boolean().default(true),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
});

export const contactMessageSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().max(30).optional().nullable(),
  message: z.string().trim().min(1).max(2000),
});

export const customCakeRequestSchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(6).max(30),
  email: z.string().trim().email().optional().or(z.literal("")).nullable(),
  occasion: z.string().trim().min(1).max(120),
  servings: z.string().trim().max(60).optional().nullable(),
  budget: z.string().trim().max(60).optional().nullable(),
  dateNeeded: z.string().min(1),
  details: z.string().trim().min(1).max(2000),
});

export const newsletterSchema = z.object({
  email: z.string().trim().email(),
});

export const siteSettingsSchema = z.object({
  heroHeadline: z.string().trim().min(1).max(200),
  heroSubtext: z.string().trim().min(1).max(500),
  aboutHeading: z.string().trim().min(1).max(200),
  aboutText: z.string().trim().min(1).max(3000),
  address: z.string().trim().min(1).max(300),
  phone: z.string().trim().min(1).max(40),
  email: z.string().trim().email(),
  hours: z.array(
    z.object({ day: z.string().min(1), hours: z.string().min(1) })
  ),
  socialLinks: z.object({
    facebook: z.string().trim().max(300).optional().default(""),
    instagram: z.string().trim().max(300).optional().default(""),
    tiktok: z.string().trim().max(300).optional().default(""),
  }),
  instagramHandle: z.string().trim().max(60),
});
