import ProductsHero from "./ProductsHero";
import ProductsCatalog from "./ProductsCatalog";
import FaqSection from "../Global-Compoents/FaqSection";
import CtaSection from "../Global-Compoents/CtaSection";
import Footer from "../Global-Compoents/Footer";

const SITE_URL = "https://cinzeldynamics.com";

export const metadata = {
  title: "Products",
  description:
    "WhatsApp automation, personalised healthcare apps, your own teaching platform, booking systems, AI support and more — fifteen outcomes we build, each shipping with the website that goes alongside it.",
  alternates: {
    canonical: "/products",
  },
};

const SERVICES_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${SITE_URL}/products/#catalog`,
  name: "Cinzel Dynamics services",
  itemListElement: [
    "Business WhatsApp automation",
    "Personalised healthcare apps",
    "Own-brand teaching platforms",
    "Appointment and booking systems",
    "Commission-free food ordering",
    "AI support agents trained on your documents",
    "Delivery tracking and driver apps",
    "Membership and billing apps",
    "Inventory with automatic reordering",
    "Offline-first field team apps",
    "Loyalty and referral programmes",
    "Property listings with virtual tours",
    "Multi-vendor marketplaces with automatic payouts",
    "Event ticketing with offline QR entry",
    "Quote to invoice to payment automation",
  ].map((name, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Service",
      name,
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: "Worldwide",
    },
  })),
};

export default function ProductsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICES_SCHEMA) }}
      />
      <ProductsHero />
      <ProductsCatalog />
      <FaqSection />
      <CtaSection />
      <Footer /></>
  );
}
