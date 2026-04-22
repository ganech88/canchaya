/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // `@canchaya/ui` y `@canchaya/db` se consumen como source TS: hay que transpilar.
  transpilePackages: ['@canchaya/ui', '@canchaya/db'],
  experimental: {
    typedRoutes: true,
  },
}

export default nextConfig
