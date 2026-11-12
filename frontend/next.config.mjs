/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: process.env.NODE_ENV === "production",
  experimental: {
    globalNotFound: true,
    turbopackFileSystemCacheForDev: false,
  },
  // API calls are proxied to the FastAPI backend server-side. This keeps the
  // admin session cookie (set by FastAPI) first-party to this domain — the
  // browser only ever talks to cinzel-dynamic.vercel.app, so proxy.js can
  // read the cookie too.
  //
  // Only known API paths are proxied. Unknown URLs (e.g. a typo in the
  // address bar) stay a normal Next.js route and fall through to the 404
  // handler instead of hitting the API.
  async rewrites() {
    return {
      fallback: [
        {
          source: "/:path((?:auth|apps|websites|routes|categories|blog-posts|demo-requests|portfolio-stats|book-demo|health|public/(?:apps|websites|routes|categories|blog-posts|portfolio-stats)).*)",
          destination: `${process.env.NEXT_PUBLIC_API_URL}/:path`,
        },
      ],
    };
  },
};

export default nextConfig;
