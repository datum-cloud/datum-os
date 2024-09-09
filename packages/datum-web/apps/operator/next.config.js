/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: [
    '@repo/dally',
    '@repo/codegen',
    '@repo/constants',
    '@repo/common',
    '@repo/types',
    '@repo/ui',
  ],
  experimental: {
    missingSuspenseWithCSRBailout: false,
    serverComponents: true,
  },
}
