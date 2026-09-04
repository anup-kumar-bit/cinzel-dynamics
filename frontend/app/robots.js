export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/cinzel-panel",
    },
    sitemap: "https://cinzeldynamics.com/sitemap.xml",
  };
}
