import BlogDetail from "@/components/Blog/BlogDetail";
import { Blog as BlogType } from "@/types/blog";
import { Metadata } from "next";
import { notFound } from "next/navigation";

async function fetchBlogDetails(id: string): Promise<BlogType | null> {
  try {
    const apiUrl = process.env["NEXT_PUBLIC_API_URL"]!;
    const response = await fetch(`${apiUrl}/blogs/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await fetchBlogDetails(slug);

  if (!blog) {
    return {
      title: "Blog Not Found | Our Blog",
      description: "The blog post you're looking for doesn't exist.",
    };
  }

  return {
    title: `${blog.title} | Our Blog`,
    description:
      blog.content.replace(/<[^>]*>/g, "").slice(0, 160) ||
      "Discover amazing places and experiences in Bangladesh through our travel stories and guides.",
  };
}

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const blogDetails = await fetchBlogDetails(slug);

  if (!blogDetails) {
    notFound();
  }

  return <BlogDetail blog={blogDetails} />;
};

export default Page;

// export async function generateStaticParams() {
//   return blogs.map((blog) => ({
//     slug: blog.slug,
//   }));
// }
