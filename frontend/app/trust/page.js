import TrustHero from "./TrustHero";
import TrustCharter from "./TrustCharter";
import TrustContact from "./TrustContact";
import FaqSection from "../Global-Compoents/FaqSection";

const SITE_URL = "https://cinzeldynamics.com";

export const metadata = {
  title: "Trust",
  description:
    "How we work, in writing — what an engagement costs at each step, who owns the code and the accounts, what happens to your data, and what happens on the day something breaks.",
  alternates: {
    canonical: "/trust",
  },
};

// Only claims already published elsewhere on the site are asserted here.
const TRUST_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${SITE_URL}/trust/#about`,
  url: `${SITE_URL}/trust`,
  name: "How we work",
  about: {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Cinzel Dynamics",
    url: SITE_URL,
    email: "hello@cinzeldynamics.com",
  },
};

export default function TrustPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(TRUST_SCHEMA) }}
      />
      <TrustHero />
      <TrustCharter />
      <TrustContact />
      <FaqSection /></>
  );
}
