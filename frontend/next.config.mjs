/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: process.env.NODE_ENV === "production",
  experimental: {
    globalNotFound: true,
    turbopackFileSystemCacheForDev: false,
  },
  // Any request that isn't one of our own pages is assumed to be a FastAPI
  // call and proxied there server-side. This keeps the admin session cookie
  // (set by FastAPI) first-party to this domain — the browser only ever
  // talks to cinzel-dynamic.vercel.app, so proxy.js can read the cookie too.
  async rewrites() {
    return {
      fallback: [{ source: "/:path*", destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*` }],
    };
  },
};

export default nextConfig;
