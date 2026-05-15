import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ScrapedJobInput {
  externalId?: string | null;
  title: string;
  company: string;
  location: string;
  url: string;
  salary?: string | null;
  type?: string | null;
  source: string;
  layer: string;
  description?: string | null;
  postedAt?: Date | null;
}

// ─── Source definitions ───────────────────────────────────────────────────────

type Source =
  | { type: "greenhouse"; slug: string; company: string }
  | { type: "ashby"; slug: string; company: string }
  | { type: "rss"; url: string; company: string; layer?: string }
  | { type: "career-page"; url: string; company: string };

export const SOURCES: Source[] = [
  // Layer 1 – Visible: pulled from Greenhouse ATS (public JSON API)
  { type: "greenhouse", slug: "stripe", company: "Stripe" },
  { type: "greenhouse", slug: "figma", company: "Figma" },
  { type: "greenhouse", slug: "anthropic", company: "Anthropic" },
  { type: "greenhouse", slug: "notion", company: "Notion" },

  // Layer 2 – Early: RSS feeds indexed before LinkedIn syncs
  { type: "rss", url: "https://weworkremotely.com/remote-jobs.rss", company: "We Work Remotely", layer: "early" },

  // Layer 3 – Hidden: Ashby ATS (direct API — not syndicated to LinkedIn in real time)
  // and Puppeteer for sites without a public API.
  { type: "ashby", slug: "linear", company: "Linear" },
  { type: "ashby", slug: "mercury", company: "Mercury" },
  { type: "ashby", slug: "retool", company: "Retool" },
  // SA career pages (requires Puppeteer; selectors tuned per-site)
  { type: "career-page", url: "https://stitch.money/careers", company: "Stitch" },
  { type: "career-page", url: "https://www.yoco.com/za/careers/", company: "Yoco" },
];

// ─── Greenhouse (JSON API) ────────────────────────────────────────────────────

async function fromGreenhouse(slug: string, company: string): Promise<ScrapedJobInput[]> {
  try {
    const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`, {
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { jobs?: Record<string, unknown>[] };
    return (data.jobs ?? []).slice(0, 25).map((j) => ({
      externalId: String(j["id"]),
      title: String(j["title"]),
      company,
      location: (j["location"] as { name?: string })?.name ?? "Remote",
      url: String(j["absolute_url"] ?? `https://boards.greenhouse.io/${slug}/jobs/${j["id"]}`),
      source: "greenhouse",
      layer: "visible",
      postedAt: j["updated_at"] ? new Date(String(j["updated_at"])) : null,
    }));
  } catch {
    console.warn(`[scraper] greenhouse failed: ${slug}`);
    return [];
  }
}

// ─── Lever (JSON API) ─────────────────────────────────────────────────────────

async function fromLever(slug: string, company: string): Promise<ScrapedJobInput[]> {
  try {
    const res = await fetch(`https://api.lever.co/v0/postings/${slug}?mode=json`, {
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as Record<string, unknown>[];
    if (!Array.isArray(data)) return [];
    return data.slice(0, 25).map((j) => ({
      externalId: String(j["id"]),
      title: String(j["text"]),
      company,
      location:
        (j["categories"] as { location?: string } | undefined)?.location ??
        String(j["workplaceType"] ?? "Remote"),
      url: String(
        j["hostedUrl"] ?? j["applyUrl"] ?? `https://jobs.lever.co/${slug}/${j["id"]}`
      ),
      source: "lever",
      layer: "early",
      description: j["descriptionPlain"]
        ? String(j["descriptionPlain"]).slice(0, 500)
        : null,
      postedAt: j["createdAt"] ? new Date(Number(j["createdAt"])) : null,
    }));
  } catch {
    console.warn(`[scraper] lever failed: ${slug}`);
    return [];
  }
}

// ─── Ashby (JSON API) ─────────────────────────────────────────────────────────

async function fromAshby(slug: string, company: string): Promise<ScrapedJobInput[]> {
  try {
    const res = await fetch(
      `https://api.ashbyhq.com/posting-api/job-board/${slug}`,
      { signal: AbortSignal.timeout(10_000) }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { jobs?: Record<string, unknown>[] };
    return (data.jobs ?? []).slice(0, 25).map((j) => ({
      externalId: String(j["id"]),
      title: String(j["title"]),
      company,
      location: String(j["location"] ?? j["workplaceType"] ?? "Remote"),
      url: String(j["jobUrl"] ?? j["applyUrl"] ?? `https://jobs.ashbyhq.com/${slug}/${j["id"]}`),
      source: "ashby",
      layer: "hidden",
      description: j["descriptionPlain"]
        ? String(j["descriptionPlain"]).slice(0, 500)
        : null,
      postedAt: j["publishedAt"] ? new Date(String(j["publishedAt"])) : null,
    }));
  } catch {
    console.warn(`[scraper] ashby failed: ${slug}`);
    return [];
  }
}

// ─── RSS ─────────────────────────────────────────────────────────────────────

async function fromRSS(
  feedUrl: string,
  defaultCompany: string,
  layer = "early"
): Promise<ScrapedJobInput[]> {
  try {
    const res = await fetch(feedUrl, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return [];
    const xml = await res.text();
    const $ = cheerio.load(xml, { xmlMode: true });
    const jobs: ScrapedJobInput[] = [];
    $("item").each((_, el) => {
      const rawTitle = $(el).find("title").first().text().trim();
      const url =
        $(el).find("link").first().text().trim() ||
        $(el).find("guid").first().text().trim();
      if (!rawTitle || !url || !url.startsWith("http")) return;

      // WWR format: "Company: Job Title" — split out company if present
      const colonIdx = rawTitle.indexOf(": ");
      const company = colonIdx > 0 ? rawTitle.slice(0, colonIdx).trim() : defaultCompany;
      const title = colonIdx > 0 ? rawTitle.slice(colonIdx + 2).trim() : rawTitle;

      const location =
        $(el).find("region, location, country").first().text().trim() || "Remote";
      const pubDate = $(el).find("pubDate").first().text().trim();
      const desc = $(el)
        .find("description")
        .first()
        .text()
        .replace(/<[^>]*>/g, "")
        .trim()
        .slice(0, 500);
      jobs.push({
        title,
        company,
        location: location.slice(0, 100),
        url,
        source: "rss",
        layer,
        description: desc || null,
        postedAt: pubDate ? new Date(pubDate) : null,
      });
    });
    return jobs.slice(0, 30);
  } catch {
    console.warn(`[scraper] rss failed: ${feedUrl}`);
    return [];
  }
}

// ─── Puppeteer (career pages) ─────────────────────────────────────────────────

// Tried in order; first set that returns > 0 jobs wins.
const SELECTOR_SETS = [
  // Ashby (used by many modern startups like Stitch)
  {
    container: "a[href*='/roles/'],a[href*='/jobs/']",
    title: "h3,h4,[class*='title'],[class*='Title']",
    location: "[class*='location'],[class*='Location'],span",
  },
  // Greenhouse embed
  { container: ".opening", title: "h3", location: ".location" },
  // Lever embed
  {
    container: ".posting",
    title: ".posting-title h5,.posting-title",
    location: ".posting-categories .location",
  },
  // Workable
  {
    container: "[data-ui='job-item']",
    title: "[data-ui='job-title']",
    location: "[data-ui='job-location']",
  },
  // Generic class-name patterns
  {
    container: "[class*='job-card'],[class*='JobCard'],[class*='job_card']",
    title: "[class*='title'],[class*='Title'],h3,h4",
    location: "[class*='location'],[class*='Location'],span",
  },
  {
    container:
      "[class*='job-listing'],[class*='JobListing'],[class*='career-item'],[class*='CareerItem']",
    title: "[class*='title'],h3,h4,a",
    location: "[class*='location'],span",
  },
  // List items that link to job/role/position paths
  {
    container:
      "li:has(a[href*='/job']),li:has(a[href*='/role']),li:has(a[href*='/position']),li:has(a[href*='/career'])",
    title: "a,h3,h4",
    location: "[class*='loc'],span",
  },
];

async function fromPuppeteer(
  url: string,
  company: string
): Promise<ScrapedJobInput[]> {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });
    // domcontentloaded is faster and sufficient for server-rendered pages;
    // fall back gracefully if JS-heavy pages need more time.
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
    // Allow JS frameworks to finish hydrating
    await new Promise((r) => setTimeout(r, 3000));

    const html = await page.content();
    const $ = cheerio.load(html);
    const origin = new URL(url).origin;

    for (const sel of SELECTOR_SETS) {
      const containers = $(sel.container);
      if (containers.length === 0) continue;

      const jobs: ScrapedJobInput[] = [];
      containers.each((_, el) => {
        const titleText =
          $(el).find(sel.title).first().text().trim() ||
          $(el).text().trim().split("\n")[0].trim();
        const locationText =
          $(el).find(sel.location).first().text().trim() || "South Africa";
        const href: string =
          ($(el).is("a") ? $(el).attr("href") : $(el).find("a").first().attr("href")) ??
          "";
        if (!titleText || titleText.length < 4 || titleText.length > 120) return;
        const jobUrl = href
          ? href.startsWith("http")
            ? href
            : `${origin}${href.startsWith("/") ? "" : "/"}${href}`
          : url;
        jobs.push({
          title: titleText,
          company,
          location: locationText.slice(0, 100),
          url: jobUrl,
          source: "career-page",
          layer: "hidden",
        });
      });

      if (jobs.length > 0) {
        // Deduplicate by title within this batch
        const seen = new Set<string>();
        return jobs
          .filter((j) => (seen.has(j.title) ? false : (seen.add(j.title), true)))
          .slice(0, 20);
      }
    }

    console.warn(`[scraper] puppeteer found 0 jobs at ${url}`);
    return [];
  } catch (err) {
    console.warn(
      `[scraper] puppeteer failed for ${company}:`,
      err instanceof Error ? err.message : String(err)
    );
    return [];
  } finally {
    await browser?.close();
  }
}

// ─── Public entry point ───────────────────────────────────────────────────────

export async function fetchAllJobs(): Promise<ScrapedJobInput[]> {
  console.log(`[scraper] starting — ${SOURCES.length} sources`);
  const settled = await Promise.allSettled(
    SOURCES.map((src) => {
      switch (src.type) {
        case "greenhouse":
          return fromGreenhouse(src.slug, src.company);
        case "ashby":
          return fromAshby(src.slug, src.company);
        case "rss":
          return fromRSS(src.url, src.company, src.layer ?? "early");
        case "career-page":
          return fromPuppeteer(src.url, src.company);
      }
    })
  );
  const jobs = settled.flatMap((r) =>
    r.status === "fulfilled" ? r.value : []
  );
  console.log(`[scraper] done — ${jobs.length} jobs collected`);
  return jobs;
}
