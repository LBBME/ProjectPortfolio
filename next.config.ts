import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/portfolio": ["./assets/**/*"],
    "/api/robotech-image/[image]": ["./assets/**/*"],
  },
};

export default nextConfig;
