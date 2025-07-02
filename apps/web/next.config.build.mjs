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
  // Optimize for Docker builds
  compress: false, // Disable compression during build
  productionBrowserSourceMaps: false, // Skip source maps
};

export default nextConfig;