"use client";

import TourCategoryForm from "@/DashboardComponents/Dashboard/TourCategories/TourCategoryForm";
import { useCreateTourCategoryWithImageMutation } from "@/redux/api/features/tourCategory/tourCategoryApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AddTourCategoryPage() {
  const router = useRouter();
  const [createTourCategory, { isLoading }] =
    useCreateTourCategoryWithImageMutation();

  const handleSubmit = async (formData: FormData) => {
    try {
      await createTourCategory(formData).unwrap();
      toast.success("Tour category created successfully");
      router.push("/dashboard/admin/tour-categories");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create tour category");
    }
  };

  return <TourCategoryForm onSubmit={handleSubmit} isLoading={isLoading} />;
}
