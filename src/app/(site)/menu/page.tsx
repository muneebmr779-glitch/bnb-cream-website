import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { MenuBrowser } from "@/components/menu/MenuBrowser";
import { getCategories, getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Browse Cakoo's full menu of cakes, pastries, cupcakes, cookies, brownies, donuts, cheesecakes, and fresh bread.",
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function MenuPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const productListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: `${siteUrl}${product.images[0] ?? "/images/products/placeholder.svg"}`,
        category: product.category.name,
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "PKR",
          availability: product.available
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        },
      },
    })),
  };

  return (
    <div className="pt-28 pb-20 sm:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productListSchema) }}
      />
      <Container>
        <SectionHeading
          level="h1"
          eyebrow="Full Menu"
          title="Everything We Bake"
          description="Fresh cakes, pastries, and desserts — browse by category or search for your favorite."
        />
        <div className="mt-12">
          <MenuBrowser products={products} categories={categories} />
        </div>
      </Container>
    </div>
  );
}
