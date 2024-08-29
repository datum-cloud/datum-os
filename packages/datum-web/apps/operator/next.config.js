/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: [
    '@repo/dally',
    '@repo/ui',
    '@repo/types',
    '@repo/codegen',
  ],
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}
