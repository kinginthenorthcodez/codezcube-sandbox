import { MetadataRoute } from 'next'
import { getBlogPosts, getCourses, getPortfolioProjects, getServices } from '@/lib/actions'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://codezcube.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic routes
  const posts = await getBlogPosts();
  const courses = await getCourses();
  const projects = await getPortfolioProjects();
  const services = await getServices();

  const postUrls = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(), // Ideally, you would use a 'updatedAt' field from your data
  }));

  const courseUrls = courses.map(course => ({
    url: `${baseUrl}/courses/${course.slug}`,
    lastModified: new Date(),
  }));

  const projectUrls = projects.map(project => ({
    url: `${baseUrl}/portfolio/${project.slug}`,
    lastModified: new Date(),
  }));

  const serviceUrls = services.map(service => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(),
  }));

  // Static routes
  const staticRoutes = [
    '/',
    '/services',
    '/portfolio',
    '/products',
    '/courses',
    '/pricing',
    '/blog',
    '/contact',
    '/booking',
    '/login',
    '/privacy-policy',
    '/terms-of-service',
    '/cookie-policy'
  ];
  
  const staticUrls = staticRoutes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  return [
    ...staticUrls,
    ...postUrls,
    ...courseUrls,
    ...projectUrls,
    ...serviceUrls
  ]
}
