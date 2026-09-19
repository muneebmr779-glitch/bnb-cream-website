"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const HERO_VIDEO_SRC = "/videos/cakoo-hero.mp4";
const HERO_POSTER_SRC = "/images/cakoo-hero-poster.svg";

export function Hero({
  headline,
  subtext,
}: {
  headline: string;
  subtext: string;
}) {
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <section
      id="home"
      className="relative flex h-[100svh] min-h-[560px] w-full items-center justify-center overflow-hidden bg-chocolate-900"
    >
      {!videoFailed && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={HERO_POSTER_SRC}
          onError={() => setVideoFailed(true)}
          aria-hidden="true"
        >
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
      )}
      {videoFailed && (
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_POSTER_SRC})` }}
          aria-hidden="true"
        />
      )}

      <div
        className="absolute inset-0 bg-gradient-to-b from-chocolate-900/70 via-chocolate-900/55 to-chocolate-900/85"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-5 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5 text-xs font-semibold uppercase tracking-[0.4em] text-caramel-400"
        >
          Cakoo Bakery · Wah Cantt
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-4xl leading-[1.1] text-cream-50 sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {headline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-cream-100/85 sm:text-lg"
        >
          {subtext}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-9 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Link
            href="/menu"
            className="w-full rounded-full bg-accent-500 px-8 py-4 text-sm font-semibold tracking-wide text-cream-50 shadow-lg shadow-accent-500/20 transition-colors hover:bg-accent-600 sm:w-auto"
          >
            Explore Our Menu
          </Link>
          <Link
            href="/menu"
            className="w-full rounded-full border border-cream-50/40 px-8 py-4 text-sm font-semibold tracking-wide text-cream-50 backdrop-blur-sm transition-colors hover:border-cream-50 hover:bg-cream-50/10 sm:w-auto"
          >
            Order Now
          </Link>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-cream-100/70 transition-colors hover:text-cream-50"
      >
        Scroll to Discover
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={18} />
        </motion.span>
      </motion.a>
    </section>
  );
}
