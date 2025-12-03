import EditTourForm from "@/DashboardComponents/Dashboard/Tours/EditTourForm";
import { notFound } from "next/navigation";

interface EditTourPageProps {
  params: {
    id: string;
  };
}

export default function EditTourPage({ params }: EditTourPageProps) {
  if (!params.id) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-4xl p-4 sm:p-6">
      <h1 className="mb-4 text-2xl font-bold sm:mb-6 sm:text-3xl">Edit Tour</h1>
      <EditTourForm tourId={params.id} />
    </div>
  );
}
