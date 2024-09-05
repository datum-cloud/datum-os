/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: [
    '@repo/dally',
    '@repo/codegen',
    '@repo/constants',
    '@repo/types',
    '@repo/ui',
  ],
  experimental: {
    missingSuspenseWithCSRBailout: false,
    serverComponents: true,
  },
}
