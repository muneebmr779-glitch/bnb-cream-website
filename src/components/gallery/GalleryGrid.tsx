"use client";

import { useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";

type GalleryItem = {
  id: string;
  url: string;
  caption: string | null;
  category: string;
};

export function GalleryGrid({ images }: { images: GalleryItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {images.map((image, i) => (
          <Reveal key={image.id} delay={(i % 6) * 0.05} className="break-inside-avoid">
            <button
              onClick={() => setActiveIndex(i)}
              className="group relative block w-full overflow-hidden rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-500"
              aria-label={`View ${image.caption ?? "gallery image"} full size`}
            >
              <Image
                src={image.url}
                alt={image.caption ?? "Cakoo bakery gallery photo"}
                width={800}
                height={800}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-chocolate-900/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {image.caption && (
                  <p className="p-4 text-left text-sm font-medium text-cream-50">{image.caption}</p>
                )}
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      <Lightbox
        images={images}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </>
  );
}

function Lightbox({
  images,
  activeIndex,
  onClose,
  onNavigate,
}: {
  images: GalleryItem[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  if (typeof document === "undefined") return null;
  const open = activeIndex !== null;
  const image = open ? images[activeIndex] : null;

  function go(direction: 1 | -1) {
    if (activeIndex === null) return;
    const next = (activeIndex + direction + images.length) % images.length;
    onNavigate(next);
  }

  return createPortal(
    <AnimatePresence>
      {open && image && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft") go(-1);
          }}
          tabIndex={-1}
          ref={(el) => el?.focus()}
        >
          <div className="absolute inset-0 bg-chocolate-900/90" onClick={onClose} aria-hidden="true" />
          <button
            onClick={onClose}
            aria-label="Close image viewer"
            className="absolute right-5 top-5 z-10 rounded-full bg-cream-50/10 p-2.5 text-cream-50 hover:bg-cream-50/20"
          >
            <X size={20} />
          </button>
          <button
            onClick={() => go(-1)}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-cream-50/10 p-2.5 text-cream-50 hover:bg-cream-50/20 sm:left-6"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next image"
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-cream-50/10 p-2.5 text-cream-50 hover:bg-cream-50/20 sm:right-6"
          >
            <ChevronRight size={22} />
          </button>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative z-[1] max-h-[85vh] max-w-4xl"
          >
            <Image
              src={image.url}
              alt={image.caption ?? "Cakoo bakery gallery photo"}
              width={1200}
              height={1200}
              className="max-h-[85vh] w-auto rounded-xl object-contain"
            />
            {image.caption && (
              <p className="mt-3 text-center text-sm text-cream-100/80">{image.caption}</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
