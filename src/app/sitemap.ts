import { MetadataRoute } from 'next';
import portfolioData from '../../portfolio-data.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://taberickson.com";

  // Base routes
  const routes = [
    '',
    '/projects',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Project routes
  const projectRoutes = portfolioData.projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...projectRoutes];
}
