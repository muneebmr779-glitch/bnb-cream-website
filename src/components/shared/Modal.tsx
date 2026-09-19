"use client";

import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import clsx from "clsx";

export function Modal({
  open,
  onClose,
  children,
  labelledBy,
  maxWidthClass = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledBy: string;
  maxWidthClass?: string;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-chocolate-900/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2 }}
            className={clsx(
              "relative z-10 w-full rounded-2xl bg-cream-50 shadow-2xl max-h-[90vh] overflow-y-auto",
              maxWidthClass
            )}
          >
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute right-4 top-4 z-10 rounded-full bg-chocolate-900/5 p-2 text-chocolate-700 hover:bg-chocolate-900/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-500"
            >
              <X size={18} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
