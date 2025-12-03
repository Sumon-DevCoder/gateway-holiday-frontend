import type {
  Blog,
  BlogsResponse,
  Tour,
  ToursResponse,
} from "@/types/sitemap.typs";
import { MetadataRoute } from "next";

// Get base URL for the site
function getBaseUrl(): string {
  const siteUrl = process.env["NEXT_PUBLIC_SITE_URL"];
  if (siteUrl) {
    return siteUrl;
  }
  // Only use localhost in development mode
  if (process.env["NODE_ENV"] === "development") {
    return "http://localhost:3000";
  }

  // In production, provide a fallback to prevent build failure
  // This should be set in production, but we'll use a placeholder to allow the build to complete
  console.warn("NEXT_PUBLIC_SITE_URL not set, using placeholder for sitemap");
  return "https://example.com";
}

// Fetch tours from API
async function getTours(): Promise<Tour[]> {
  try {
    const apiUrl = process.env["NEXT_PUBLIC_API_URL"];
    if (!apiUrl) {
      console.warn("NEXT_PUBLIC_API_URL not set, skipping tours in sitemap");
      return [];
    }

    const response = await fetch(
      `${apiUrl}/tours?status=PUBLISHED&limit=1000`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (!response.ok) {
      console.warn("Failed to fetch tours for sitemap");
      return [];
    }

    const data: ToursResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching tours for sitemap:", error);
    return [];
  }
}

// Fetch blogs from API
async function getBlogs(): Promise<Blog[]> {
  try {
    const apiUrl = process.env["NEXT_PUBLIC_API_URL"];
    if (!apiUrl) {
      console.warn("NEXT_PUBLIC_API_URL not set, skipping blogs in sitemap");
      return [];
    }

    const response = await fetch(
      `${apiUrl}/blogs?status=published&limit=1000`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (!response.ok) {
      console.warn("Failed to fetch blogs for sitemap");
      return [];
    }

    const data: BlogsResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching blogs for sitemap:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  // Static routes with their priorities and change frequencies
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/visa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/package-details`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/country-packages`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/offers`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-conditions`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // Fetch dynamic routes
  const [tours, blogs] = await Promise.all([getTours(), getBlogs()]);

  // Generate tour/package detail URLs
  const tourRoutes: MetadataRoute.Sitemap = tours.map((tour) => ({
    url: `${baseUrl}/booking-details?id=${tour._id}`,
    lastModified: tour.updatedAt
      ? new Date(tour.updatedAt)
      : tour.createdAt
        ? new Date(tour.createdAt)
        : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Generate blog post URLs
  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => {
    // Use slug if available, otherwise use _id
    const slug = blog.slug || blog._id;
    return {
      url: `${baseUrl}/blog/${slug}`,
      lastModified: blog.updatedAt
        ? new Date(blog.updatedAt)
        : blog.createdAt
          ? new Date(blog.createdAt)
          : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    };
  });

  // Combine all routes
  return [...staticRoutes, ...tourRoutes, ...blogRoutes];
}
