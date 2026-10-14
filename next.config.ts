import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
  allowedDevOrigins: ['192.168.0.101'],
  async headers() {
    return [
      '/admin/:path*', '/carrinho', '/pedido/:path*', '/loja/carrinho',
      '/loja/checkout', '/loja/meus-pedidos', '/loja/pedido/:path*',
    ].map(source => ({ source, headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }));
  },
};

export default nextConfig;
