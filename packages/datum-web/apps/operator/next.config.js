/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: [
    '@repo/dally',
    '@repo/codegen',
    '@repo/constants',
    '@repo/service-api',
    '@repo/types',
    '@repo/ui',
  ],
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}
