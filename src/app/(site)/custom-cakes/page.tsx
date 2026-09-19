import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CustomCakeForm } from "@/components/custom-cakes/CustomCakeForm";

export const metadata: Metadata = {
  title: "Custom Cakes",
  description:
    "Request a custom celebration cake from Cakoo for birthdays, weddings, anniversaries, and more.",
};

export default function CustomCakesPage() {
  return (
    <div className="pt-28 pb-20 sm:pt-32">
      <Container className="max-w-3xl">
        <SectionHeading
          level="h1"
          eyebrow="Custom Creations"
          title="Design Your Dream Cake"
          description="Share your vision and our bakers will get in touch to bring it to life."
        />
        <div className="mt-12">
          <CustomCakeForm />
        </div>
      </Container>
    </div>
  );
}
