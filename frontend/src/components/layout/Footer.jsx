import { Link } from 'react-router-dom';
import { Wrench, Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { NAV_LINKS, WORKSHOP_INFO } from '../../utils/constants';

const Footer = () => (
  <footer className="border-t border-charcoal-800 bg-charcoal-950 text-charcoal-300">
    <div className="container-page grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <Link to="/" className="flex items-center gap-2.5 font-display text-xl font-extrabold text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-accent-600">
            <Wrench className="h-5 w-5" />
          </span>
          Auto<span className="text-accent-500">Care</span> Pro
        </Link>
        <p className="mt-4 text-sm leading-relaxed text-charcoal-400">
          Professional car repair and auto service you can trust. Transparent pricing, expert
          mechanics, and reliable repairs since day one.
        </p>
        <div className="mt-5 flex gap-3">
          {[Facebook, Instagram, Twitter].map((Icon, idx) => (
            <a
              key={idx}
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-charcoal-800 text-charcoal-300 transition hover:bg-accent-600 hover:text-white"
              aria-label="Social link"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">Quick Links</h4>
        <ul className="mt-4 space-y-2.5 text-sm">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className="transition hover:text-accent-500">
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/booking" className="transition hover:text-accent-500">
              Book a Service
            </Link>
          </li>
        </ul>
      </div>

      <div>
        <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">Popular Services</h4>
        <ul className="mt-4 space-y-2.5 text-sm">
          {['Oil Change', 'Brake Repair', 'Engine Diagnostics', 'Tire Service', 'AC Service'].map((s) => (
            <li key={s}>
              <Link to="/services" className="transition hover:text-accent-500">
                {s}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">Contact Us</h4>
        <ul className="mt-4 space-y-3 text-sm">
          <li className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
            {WORKSHOP_INFO.address}
          </li>
          <li className="flex items-center gap-2.5">
            <Phone className="h-4 w-4 shrink-0 text-accent-500" />
            <a href={`tel:${WORKSHOP_INFO.phone}`} className="hover:text-accent-500">
              {WORKSHOP_INFO.phone}
            </a>
          </li>
          <li className="flex items-center gap-2.5">
            <Mail className="h-4 w-4 shrink-0 text-accent-500" />
            <a href={`mailto:${WORKSHOP_INFO.email}`} className="hover:text-accent-500">
              {WORKSHOP_INFO.email}
            </a>
          </li>
          <li className="flex items-start gap-2.5">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
            <span>
              {WORKSHOP_INFO.hours[0].day}: {WORKSHOP_INFO.hours[0].time}
            </span>
          </li>
        </ul>
      </div>
    </div>

    <div className="border-t border-charcoal-800 py-6">
      <div className="container-page flex flex-col items-center justify-between gap-3 text-xs text-charcoal-500 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} AutoCare Pro. All rights reserved.</p>
        <div className="flex gap-5">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
