import "server-only";
import { prisma } from "./prisma";
import { serializeProduct } from "./serialize";
import type { SiteSettingsDTO, SiteHours } from "@/types";

export async function getSiteSettings(): Promise<SiteSettingsDTO | null> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "main" } });
  if (!settings) return null;
  return {
    heroHeadline: settings.heroHeadline,
    heroSubtext: settings.heroSubtext,
    aboutHeading: settings.aboutHeading,
    aboutText: settings.aboutText,
    address: settings.address,
    phone: settings.phone,
    email: settings.email,
    hours: settings.hours as SiteHours[],
    socialLinks: settings.socialLinks as SiteSettingsDTO["socialLinks"],
    instagramHandle: settings.instagramHandle,
  };
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] });
}

export async function getProducts(options?: { featuredOnly?: boolean; categorySlug?: string }) {
  const products = await prisma.product.findMany({
    where: {
      available: true,
      ...(options?.featuredOnly ? { featured: true } : {}),
      ...(options?.categorySlug && options.categorySlug !== "all"
        ? { category: { slug: options.categorySlug } }
        : {}),
    },
    include: { category: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
  return products.map(serializeProduct);
}

export async function getApprovedReviews(limit = 12) {
  return prisma.review.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getGalleryImages() {
  return prisma.galleryImage.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
}

export async function getActiveOffers() {
  const now = new Date();
  return prisma.offer.findMany({
    where: {
      active: true,
      OR: [{ startDate: null }, { startDate: { lte: now } }],
      AND: [{ OR: [{ endDate: null }, { endDate: { gte: now } }] }],
    },
    orderBy: { createdAt: "desc" },
  });
}
