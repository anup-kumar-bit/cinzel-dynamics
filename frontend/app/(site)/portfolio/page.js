import PortfolioHero from "./PortfolioHero";
import ProjectGrid from "./ProjectGrid";
import CtaSection from "../Global-Compoents/CtaSection";
import Footer from "../Global-Compoents/Footer";

export const metadata = {
  title: "Portfolio",
  description:
    "Platforms, mobile apps and backends we designed, built and shipped — and still keep running in production.",
  alternates: {
    canonical: "/portfolio",
  },
};

export default function PortfolioPage() {
  return <>
    <PortfolioHero />
    <ProjectGrid />
    <CtaSection />
    <Footer />
  </>;
}
