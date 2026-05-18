import portfolioData from "@/public/portfolio-data.json";
import type { PortfolioContent } from "@/lib/portfolio-types";

export async function getPortfolioContent(): Promise<PortfolioContent> {
  const remoteUrl = process.env.PORTFOLIO_DATA_URL;

  if (remoteUrl) {
    const response = await fetch(remoteUrl, { cache: "force-cache" });

    if (!response.ok) {
      throw new Error(`Unable to load portfolio data from ${remoteUrl}`);
    }

    return response.json() as Promise<PortfolioContent>;
  }

  return portfolioData as PortfolioContent;
}
