import PageHeader from "@/components/admin/PageHeader";
import EditCategoryForm from "@/DashboardComponents/Dashboard/Blogs/EditCategoryForm";

interface EditCategoryPageProps {
  params: {
    id: string;
  };
}

export default function EditCategoryPage({ params }: EditCategoryPageProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Category"
        description="Update category information"
      />
      <EditCategoryForm categoryId={params.id} />
    </div>
  );
}
