import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { SignatureProducts } from "@/components/home/SignatureProducts";
import { CustomCakeSection } from "@/components/home/CustomCakeSection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Testimonials } from "@/components/home/Testimonials";
import { OffersSection } from "@/components/home/OffersSection";
import { InstagramSection } from "@/components/home/InstagramSection";
import { ContactSection } from "@/components/home/ContactSection";
import {
  getActiveOffers,
  getApprovedReviews,
  getGalleryImages,
  getProducts,
  getSiteSettings,
} from "@/lib/data";
import { DEFAULT_SETTINGS } from "@/lib/constants";

export default async function HomePage() {
  const [settings, featuredProducts, reviews, offers, gallery] = await Promise.all([
    getSiteSettings(),
    getProducts({ featuredOnly: true }),
    getApprovedReviews(9),
    getActiveOffers(),
    getGalleryImages(),
  ]);

  const siteSettings = settings ?? DEFAULT_SETTINGS;

  return (
    <>
      <Hero headline={siteSettings.heroHeadline} subtext={siteSettings.heroSubtext} />
      <About heading={siteSettings.aboutHeading} text={siteSettings.aboutText} />
      <SignatureProducts products={featuredProducts} />
      <CustomCakeSection />
      <WhyChooseUs />
      <Testimonials reviews={reviews} />
      <OffersSection offers={offers} />
      <InstagramSection
        images={gallery}
        handle={siteSettings.instagramHandle}
        link={siteSettings.socialLinks.instagram}
      />
      <ContactSection settings={siteSettings} />
    </>
  );
}
