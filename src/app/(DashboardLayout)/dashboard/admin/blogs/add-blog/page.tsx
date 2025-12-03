import PageHeader from "@/components/admin/PageHeader";
import CreateBlogForm from "@/DashboardComponents/Dashboard/Blogs/CreateBlogForm";

export default function AddBlogPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Write a New Blog"
        description="Create and publish a new blog post"
      />
      <CreateBlogForm />
    </div>
  );
}
