import { MetadataRoute } from 'next';
import portfolioData from '../../portfolio-data.json';

import { client } from '@/lib/sanity/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://taberickson.com";

  // Fetch all blog posts to generate dynamic routes
  const posts = await client.fetch(`*[_type == "post"]{ "slug": slug.current, _updatedAt }`);

  // Base routes
  const routes = [
    '',
    '/projects',
    '/lets-work',
    '/blog',
    '/events',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Project routes from JSON
  const projectRoutes = portfolioData.projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic Blog Post routes from Sanity
  const blogRoutes = posts.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...projectRoutes, ...blogRoutes];
}
