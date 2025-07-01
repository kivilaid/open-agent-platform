/** @type {import('next').NextConfig} */
const nextConfig = {
  // Skip type checking during build (already done in lint step)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Skip ESLint during build (already done in lint step)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Output as standalone for Docker
  output: 'standalone',
  // Disable static generation for auth-required pages
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;