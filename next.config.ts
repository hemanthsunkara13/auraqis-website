import type { NextConfig } from "next";

// Static export for GoDaddy (Apache) hosting; response headers live in public/.htaccess.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
