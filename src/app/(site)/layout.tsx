import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { getSiteSettings } from "@/lib/data";
import { DEFAULT_SETTINGS } from "@/lib/constants";

// Content here (products, prices, availability, offers, reviews, settings)
// comes from the database and is managed from /admin. Revalidate frequently
// so admin edits show up on the live site without a full rebuild/redeploy.
export const revalidate = 30;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = (await getSiteSettings()) ?? DEFAULT_SETTINGS;

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <CartDrawer />
    </>
  );
}
