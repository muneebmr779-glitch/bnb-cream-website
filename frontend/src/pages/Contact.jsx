import { useSearchParams } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import PageMeta from '../components/ui/PageMeta';
import SectionHeading from '../components/ui/SectionHeading';
import ContactForm from '../components/contact/ContactForm';
import { WORKSHOP_INFO } from '../utils/constants';

const Contact = () => {
  const [searchParams] = useSearchParams();
  const isEmergency = searchParams.get('emergency') === 'true';

  return (
    <>
      <PageMeta
        title="Contact Us"
        description="Get in touch with AutoCare Pro. Visit our workshop, call us, or send a message — we're here to help with all your car repair needs."
      />
      <section className="bg-charcoal-950 py-16 text-white sm:py-20">
        <div className="container-page text-center">
          <SectionHeading
            eyebrow="Get In Touch"
            title="We'd Love to Hear From You"
            description="Questions about a service, need a quote, or facing a car emergency? Reach out any time."
          />
        </div>
      </section>

      <section className="section">
        <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="space-y-5">
              <div className="card flex items-start gap-4 p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-600/10 text-accent-600 dark:text-accent-400">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Workshop Address</p>
                  <p className="mt-1 text-sm text-charcoal-500 dark:text-charcoal-400">{WORKSHOP_INFO.address}</p>
                </div>
              </div>
              <div className="card flex items-start gap-4 p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-600/10 text-accent-600 dark:text-accent-400">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Phone</p>
                  <a href={`tel:${WORKSHOP_INFO.phone}`} className="mt-1 block text-sm text-charcoal-500 hover:text-accent-600 dark:text-charcoal-400">
                    {WORKSHOP_INFO.phone}
                  </a>
                  <a href={`tel:${WORKSHOP_INFO.emergencyPhone}`} className="mt-0.5 block text-sm text-accent-600">
                    {WORKSHOP_INFO.emergencyPhone} (Emergency)
                  </a>
                </div>
              </div>
              <div className="card flex items-start gap-4 p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-600/10 text-accent-600 dark:text-accent-400">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Email</p>
                  <a href={`mailto:${WORKSHOP_INFO.email}`} className="mt-1 block text-sm text-charcoal-500 hover:text-accent-600 dark:text-charcoal-400">
                    {WORKSHOP_INFO.email}
                  </a>
                </div>
              </div>
              <div className="card flex items-start gap-4 p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-600/10 text-accent-600 dark:text-accent-400">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Opening Hours</p>
                  <ul className="mt-1 space-y-0.5 text-sm text-charcoal-500 dark:text-charcoal-400">
                    {WORKSHOP_INFO.hours.map((h) => (
                      <li key={h.day}>
                        {h.day}: {h.time}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="card mt-5 overflow-hidden">
              <iframe
                title="Workshop location map"
                src={WORKSHOP_INFO.mapEmbedUrl}
                width="100%"
                height="220"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <ContactForm isEmergency={isEmergency} />
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
