"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { MapPin, Music2, Phone, Mail } from "lucide-react";
import { SiteSettingsDTO } from "@/types";
import { FacebookIcon, InstagramIcon } from "@/components/shared/BrandIcons";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/menu", label: "Menu" },
  { href: "/#cakes", label: "Cakes" },
  { href: "/gallery", label: "Gallery" },
  { href: "/#contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
];

export function Footer({ settings }: { settings: SiteSettingsDTO | null }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      toast.success("You're subscribed for sweet updates!");
      setEmail("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer className="bg-chocolate-900 text-cream-100">
      <div className="mx-auto max-w-7xl container-px py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-2xl tracking-[0.15em] text-cream-50">CAKOO</p>
            <p className="mt-3 max-w-xs text-sm text-cream-100/70">
              Freshly baked moments, made with love.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <SocialIcon href={settings?.socialLinks?.facebook} label="Facebook">
                <FacebookIcon size={16} />
              </SocialIcon>
              <SocialIcon href={settings?.socialLinks?.instagram} label="Instagram">
                <InstagramIcon size={16} />
              </SocialIcon>
              <SocialIcon href={settings?.socialLinks?.tiktok} label="TikTok">
                <Music2 size={16} />
              </SocialIcon>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-caramel-400">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-cream-100/75 hover:text-cream-50">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-caramel-400">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-cream-100/75">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-caramel-400" />
                <span>{settings?.address ?? "Lala Rukh, B-180 Minar Road, Wah Cantt, 47010"}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="shrink-0 text-caramel-400" />
                <a href={`tel:${settings?.phone ?? "03295115550"}`} className="hover:text-cream-50">
                  {settings?.phone ?? "0329 5115550"}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="shrink-0 text-caramel-400" />
                <a href={`mailto:${settings?.email ?? "hello@cakoo.com"}`} className="hover:text-cream-50">
                  {settings?.email ?? "hello@cakoo.com"}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-caramel-400">
              Get Sweet Updates
            </h3>
            <p className="mt-4 text-sm text-cream-100/70">
              Subscribe for new flavors, seasonal specials, and offers.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full min-w-0 rounded-full bg-cream-50/10 px-4 py-2.5 text-sm text-cream-50 placeholder:text-cream-100/40 outline-none ring-1 ring-cream-50/15 focus:ring-caramel-400"
              />
              <button
                type="submit"
                disabled={loading}
                className="shrink-0 rounded-full bg-accent-500 px-4 py-2.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-accent-600 disabled:opacity-60"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream-50/10 pt-8 text-xs text-cream-100/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Cakoo Bakery. All rights reserved.</p>
          <p>Designed with love for everyone who loves dessert.</p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href?: string;
  label: string;
  children: React.ReactNode;
}) {
  if (!href) {
    return (
      <span
        className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-50/10 text-cream-100/40"
        aria-hidden="true"
      >
        {children}
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-50/10 text-cream-50 transition-colors hover:bg-accent-500"
    >
      {children}
    </a>
  );
}
