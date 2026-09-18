import PageMeta from '../components/ui/PageMeta';
import SectionHeading from '../components/ui/SectionHeading';
import PricingCards from '../components/home/PricingCards';
import CTASection from '../components/home/CTASection';

const Pricing = () => (
  <>
    <PageMeta
      title="Pricing"
      description="Transparent, upfront pricing for car repair and auto maintenance services. No hidden fees, ever."
    />
    <section className="bg-charcoal-950 py-16 text-white sm:py-20">
      <div className="container-page text-center">
        <SectionHeading
          eyebrow="Pricing"
          title="Transparent, Upfront Pricing"
          description="Know exactly what you'll pay before you book. All prices are starting estimates — final quotes are confirmed before any work begins."
        />
      </div>
    </section>

    <section className="section">
      <div className="container-page">
        <PricingCards />
      </div>
    </section>
    <CTASection />
  </>
);

export default Pricing;
