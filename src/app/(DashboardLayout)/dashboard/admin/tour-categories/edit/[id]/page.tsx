"use client";

import TourCategoryForm from "@/DashboardComponents/Dashboard/TourCategories/TourCategoryForm";
import {
  useGetTourCategoryByIdQuery,
  useUpdateTourCategoryWithImageMutation,
} from "@/redux/api/features/tourCategory/tourCategoryApi";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditTourCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.["id"] as string;

  const { data, isLoading: isFetching } = useGetTourCategoryByIdQuery(id);
  const [updateTourCategory, { isLoading }] =
    useUpdateTourCategoryWithImageMutation();

  const handleSubmit = async (formData: FormData) => {
    try {
      await updateTourCategory({ id, data: formData }).unwrap();
      toast.success("Tour category updated successfully");
      router.push("/dashboard/admin/tour-categories");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update tour category");
    }
  };

  if (isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Tour category not found</p>
      </div>
    );
  }

  return (
    <TourCategoryForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
      initialData={data.data}
      isEdit
    />
  );
}
