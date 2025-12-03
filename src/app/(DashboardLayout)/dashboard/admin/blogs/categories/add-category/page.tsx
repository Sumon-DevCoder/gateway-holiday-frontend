import PageHeader from "@/components/admin/PageHeader";
import CreateCategoryForm from "@/DashboardComponents/Dashboard/Blogs/CreateCategoryForm";

export default function AddCategoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create New Category"
        description="Add a new blog category to organize your content"
      />
      <CreateCategoryForm />
    </div>
  );
}
