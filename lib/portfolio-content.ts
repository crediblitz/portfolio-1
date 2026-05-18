import { readFile } from "node:fs/promises";
import path from "node:path";

import type { PortfolioContent } from "@/lib/portfolio-types";

const CONTENT_FILE = path.join(process.cwd(), "public", "portfolio-data.json");

export async function getPortfolioContent(): Promise<PortfolioContent> {
  const remoteUrl = process.env.PORTFOLIO_DATA_URL;

  if (remoteUrl) {
    const response = await fetch(remoteUrl, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Unable to load portfolio data from ${remoteUrl}`);
    }

    return response.json() as Promise<PortfolioContent>;
  }

  const file = await readFile(CONTENT_FILE, "utf8");

  return JSON.parse(file) as PortfolioContent;
}
