import Image from "next/image";
import { InstagramIcon } from "@/components/shared/BrandIcons";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";

type GalleryItem = { id: string; url: string; caption: string | null };

export function InstagramSection({
  images,
  handle,
  link,
}: {
  images: GalleryItem[];
  handle: string;
  link: string;
}) {
  const featured = images.slice(0, 6);

  return (
    <section className="bg-cream-50 py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Social" title="Follow The Sweetness" />

        {featured.length > 0 && (
          <div className="mt-12 grid grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-6">
            {featured.map((image, i) => (
              <Reveal key={image.id} delay={i * 0.05} className="aspect-square overflow-hidden rounded-xl">
                <div className="group relative h-full w-full">
                  <Image
                    src={image.url}
                    alt={image.caption ?? "Cakoo bakery photo"}
                    fill
                    sizes="(min-width: 1024px) 16vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal className="mt-10 flex justify-center">
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-chocolate-900 px-6 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-accent-600"
            >
              <InstagramIcon size={16} />
              Follow {handle}
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full bg-chocolate-900/5 px-6 py-3 text-sm font-semibold text-chocolate-700">
              <InstagramIcon size={16} />
              Follow {handle}
            </span>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
