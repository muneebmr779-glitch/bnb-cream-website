"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { SiteSettingsDTO } from "@/types";

export function ContactSection({ settings }: { settings: SiteSettingsDTO }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    settings.address
  )}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.error("Message could not be sent. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="bg-cream-100/60 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Visit Or Reach Out"
          title="Come Say Hello"
          description="We'd love to welcome you into the Cakoo family — visit our bakery or send us a message."
        />

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div className="flex h-full flex-col justify-between rounded-2xl bg-white p-7 shadow-sm ring-1 ring-chocolate-900/5">
              <ul className="space-y-5">
                <li className="flex items-start gap-3">
                  <MapPin size={20} className="mt-0.5 shrink-0 text-caramel-600" />
                  <span className="text-sm leading-relaxed text-chocolate-800">
                    {settings.address}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={20} className="shrink-0 text-caramel-600" />
                  <a href={`tel:${settings.phone}`} className="text-sm text-chocolate-800 hover:text-accent-600">
                    {settings.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={20} className="shrink-0 text-caramel-600" />
                  <a href={`mailto:${settings.email}`} className="text-sm text-chocolate-800 hover:text-accent-600">
                    {settings.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock size={20} className="mt-0.5 shrink-0 text-caramel-600" />
                  <span className="text-sm leading-relaxed text-chocolate-800">
                    {settings.hours.map((h) => (
                      <span key={h.day} className="block">
                        {h.day}: {h.hours}
                      </span>
                    ))}
                  </span>
                </li>
              </ul>
              <a
                href={directionsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-chocolate-900 px-6 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-accent-600"
              >
                <Navigation size={16} />
                Get Directions
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-chocolate-900/5 lg:col-span-3 lg:row-span-2">
            <iframe
              title="Cakoo location map"
              src={mapSrc}
              className="h-72 w-full lg:h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>

          <Reveal delay={0.15} className="lg:col-span-2">
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-white p-7 text-center shadow-sm ring-1 ring-chocolate-900/5">
                <p className="font-display text-xl text-chocolate-900">Message Sent!</p>
                <p className="mt-2 text-sm text-chocolate-700/75">
                  Thanks for reaching out — our team will get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-sm font-medium text-accent-600 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex h-full flex-col gap-3 rounded-2xl bg-white p-7 shadow-sm ring-1 ring-chocolate-900/5"
              >
                <div>
                  <label htmlFor="contact-name" className="sr-only">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    required
                    placeholder="Your Name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-lg border border-chocolate-900/15 bg-white p-3 text-sm outline-none focus:border-caramel-500 focus:ring-1 focus:ring-caramel-500"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="Email Address"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full rounded-lg border border-chocolate-900/15 bg-white p-3 text-sm outline-none focus:border-caramel-500 focus:ring-1 focus:ring-caramel-500"
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="sr-only">
                    Phone
                  </label>
                  <input
                    id="contact-phone"
                    placeholder="Phone (optional)"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full rounded-lg border border-chocolate-900/15 bg-white p-3 text-sm outline-none focus:border-caramel-500 focus:ring-1 focus:ring-caramel-500"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="contact-message" className="sr-only">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    placeholder="Your Message"
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="h-full w-full resize-none rounded-lg border border-chocolate-900/15 bg-white p-3 text-sm outline-none focus:border-caramel-500 focus:ring-1 focus:ring-caramel-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-accent-500 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-accent-600 disabled:opacity-60"
                >
                  {submitting ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
