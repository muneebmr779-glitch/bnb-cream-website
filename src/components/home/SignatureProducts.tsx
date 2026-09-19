import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProductCard } from "@/components/shared/ProductCard";
import { Reveal } from "@/components/shared/Reveal";
import { ProductDTO } from "@/types";

export function SignatureProducts({ products }: { products: ProductDTO[] }) {
  return (
    <section id="menu" className="bg-cream-100/60 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Handpicked Favorites"
          title="Our Signature Creations"
          description="A taste of what makes Cakoo special — each one baked fresh, decorated by hand, and made to be shared."
        />

        {products.length === 0 ? (
          <p className="mt-12 text-center text-chocolate-700/60">
            Our signature menu is being freshly prepared — check back soon.
          </p>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        <Reveal className="mt-14 flex justify-center">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-full border border-chocolate-900/20 px-6 py-3 text-sm font-semibold text-chocolate-900 transition-colors hover:border-chocolate-900 hover:bg-chocolate-900 hover:text-cream-50"
          >
            View Full Menu
            <ArrowRight size={16} />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
