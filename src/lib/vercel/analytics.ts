export async function getPageViews(slug: string): Promise<number | null> {
  const projectId = process.env.VERCEL_PROJECT_ID;
  const token = process.env.VERCEL_API_TOKEN;

  if (!projectId || !token) {
    console.warn("Missing VERCEL_PROJECT_ID or VERCEL_API_TOKEN. Cannot fetch pageviews.");
    return null;
  }

  // Constructing OData filter for the specific path
  const filter = encodeURIComponent(`requestPath eq '/blog/${slug}'`);
  const url = `https://api.vercel.com/v1/query/web-analytics/visits/count?projectId=${projectId}&filter=${filter}&environment=production`;

  try {
    console.log("Fetching Vercel API:", url);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 3600 }, // Cache the result for 1 hour
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      console.warn(`Failed to fetch page views for ${slug}: ${response.statusText}`);
      const errText = await response.text();
      console.log("Error body:", errText);
      return null;
    }

    const payload = await response.json();
    console.log("Payload:", payload);
    
    // The Vercel API returns { data: { pageviews: number, visitors: number } }
    if (payload.data && typeof payload.data.pageviews === "number") {
      return payload.data.pageviews;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching Vercel Analytics pageviews:", error);
    return null;
  }
}
