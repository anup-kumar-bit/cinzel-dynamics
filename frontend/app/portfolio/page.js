import PortfolioHero from "./PortfolioHero";
import ProjectGrid from "./ProjectGrid";

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
  </>;
}
