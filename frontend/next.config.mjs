/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: process.env.NODE_ENV === "production",
  experimental: {
    globalNotFound: true,
    turbopackFileSystemCacheForDev: false,
  },
};

export default nextConfig;
