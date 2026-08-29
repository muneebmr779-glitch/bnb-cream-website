import PageMeta from '../components/ui/PageMeta';
import Hero from '../components/home/Hero';
import QuickServices from '../components/home/QuickServices';
import WhyChooseUs from '../components/home/WhyChooseUs';
import EmergencySection from '../components/home/EmergencySection';
import SectionHeading from '../components/ui/SectionHeading';
import PricingCards from '../components/home/PricingCards';
import TestimonialsPreview from '../components/home/TestimonialsPreview';
import CTASection from '../components/home/CTASection';

const Home = () => (
  <>
    <PageMeta
      title="Professional Car Repair & Auto Service"
      description="Expert automotive service, transparent pricing, and reliable repairs. Book brake repair, oil changes, engine diagnostics and more online today."
    />
    <Hero />
    <QuickServices />
    <WhyChooseUs />
    <EmergencySection />
    <section className="section">
      <div className="container-page">
        <SectionHeading
          eyebrow="Simple Pricing"
          title="Transparent Service Packages"
          description="No surprises. Choose the package that fits your vehicle's needs, or get a custom quote."
        />
        <div className="mt-14">
          <PricingCards />
        </div>
      </div>
    </section>
    <TestimonialsPreview />
    <CTASection />
  </>
);

export default Home;
