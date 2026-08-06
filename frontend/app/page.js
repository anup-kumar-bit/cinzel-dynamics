import HeroSection from "./Landing-Page/HeroSection";
import ServicesSection from "./Landing-Page/ServicesSection";
import DemoVideoSection from "./Landing-Page/DemoVideoSection";
import TrustSection from "./Landing-Page/TrustSection";
import PortfolioTeaser from "./Landing-Page/PortfolioTeaser";
import DomainSection from "./Landing-Page/DomainSection";
import SeoSection from "./Landing-Page/SeoSection";
import AiAutomationSection from "./Landing-Page/AiAutomationSection";
import DigitalMarketingSection from "./Landing-Page/DigitalMarketingSection";
import ClientWorkCorridor from "./Landing-Page/ClientWorkCorridor";
import CtaSection from "./Global-Compoents/CtaSection";
import Footer from "./Global-Compoents/Footer";

const SITE_URL = "https://cinzeldynamics.com";

export const metadata = {
  alternates: {
    canonical: "/",
  },
};

const HOME_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Cinzel Dynamics",
      url: SITE_URL,
      logo: `${SITE_URL}/svgs/logoA.svg`,
      email: "hello@cinzeldynamics.com",
      description:
        "Cinzel Dynamics designs and builds the backends, web apps and mobile products startups scale on — then keeps them running, found, and ranking long after launch.",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Cinzel Dynamics",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#service`,
      name: "Cinzel Dynamics",
      url: SITE_URL,
      image: `${SITE_URL}/svgs/logoA.svg`,
      description:
        "Custom backend, web application and mobile app development, plus the SEO and App Store Optimization to get the result found.",
      areaServed: "Worldwide",
      priceRange: "$$",
      parentOrganization: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_SCHEMA) }}
      />
      <HeroSection />
      <TrustSection />
      <DomainSection />
      <ServicesSection />
      <DemoVideoSection />
      <PortfolioTeaser />
      <SeoSection />
      <AiAutomationSection />
      <PortfolioTeaser />
      <DigitalMarketingSection />
      <ClientWorkCorridor />
      <CtaSection />
      <Footer /></>
  );
}
