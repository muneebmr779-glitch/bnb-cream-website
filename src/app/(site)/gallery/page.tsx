import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { getGalleryImages } from "@/lib/data";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A look inside Cakoo — our cakes, pastries, decorating process, and celebrations.",
};

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className="pt-28 pb-20 sm:pt-32">
      <Container>
        <SectionHeading
          level="h1"
          eyebrow="Gallery"
          title="Sweet Moments, Captured"
          description="A behind-the-scenes look at our cakes, pastries, decorating process, and the celebrations we get to be part of."
        />
        <div className="mt-12">
          {images.length === 0 ? (
            <p className="text-center text-chocolate-700/60">Gallery coming soon.</p>
          ) : (
            <GalleryGrid images={images} />
          )}
        </div>
      </Container>
    </div>
  );
}
