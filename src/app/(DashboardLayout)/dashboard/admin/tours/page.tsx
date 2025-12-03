import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import ToursClient from "@/DashboardComponents/Dashboard/Tours/ToursClient";
import Link from "next/link";

export default function ToursPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Tour Management"
          description="Manage tours, packages, and travel experiences"
        />
        <Link href={"/dashboard/admin/add-tour"}>
          <Button>Add new tour</Button>
        </Link>
      </div>
      {/* Client-side logic */}
      <ToursClient />
    </div>
  );
}
