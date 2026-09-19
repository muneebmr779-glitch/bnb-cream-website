import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/menu`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/gallery`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteUrl}/custom-cakes`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/checkout`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteUrl}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const products = await prisma.product.findMany({
    where: { available: true },
    select: { slug: true, updatedAt: true },
  });

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteUrl}/menu#${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...productRoutes];
}
