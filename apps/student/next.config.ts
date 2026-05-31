import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  basePath: process.env.NODE_ENV === 'production' ? '/student' : '',
  transpilePackages: ['@school/ui', '@school/types'],
}

export default nextConfig
