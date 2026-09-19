import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Locally-authored placeholder art (public/images/**) is served as SVG.
    // Safe to allow since these are our own static files, not user uploads.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
