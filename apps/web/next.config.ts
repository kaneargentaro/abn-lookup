import { resolve } from 'path';
import type { NextConfig } from 'next';
import { config } from 'dotenv';

config({ path: resolve(__dirname, '../../.env.local') });

const nextConfig: NextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    compress: true,
};

export default nextConfig;
