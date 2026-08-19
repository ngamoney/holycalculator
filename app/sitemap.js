import calculators from "@/data/calculators.json";

export default function sitemap() {
  const baseUrl = "https://holycalculator.com";
  const lastDeployDate = new Date("2026-08-19");

  // Core static trust and hub pages
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: lastDeployDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: lastDeployDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: lastDeployDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: lastDeployDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: lastDeployDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: lastDeployDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Unique canonical calculator pages (filters out any sub-category query-param URLs like ?cat=length)
  const seenUrls = new Set();
  const calculatorPages = [];

  for (const calc of calculators) {
    if (calc.url && !calc.url.includes("?")) {
      const cleanUrl = calc.url.startsWith("/") ? calc.url : `/${calc.url}`;
      if (!seenUrls.has(cleanUrl)) {
        seenUrls.add(cleanUrl);
        calculatorPages.push({
          url: `${baseUrl}${cleanUrl}`,
          lastModified: lastDeployDate,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }
  }

  return [...staticPages, ...calculatorPages];
}
