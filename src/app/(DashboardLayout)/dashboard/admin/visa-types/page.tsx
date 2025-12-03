import PageHeader from "@/components/admin/PageHeader";
import VisaTypesClient from "@/DashboardComponents/Dashboard/VisaTypes/VisaTypesClient";

export default function VisaTypesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Visa Types Management"
          description="Manage visa types for different countries"
        />
      </div>
      {/* Client-side logic */}
      <VisaTypesClient />
    </div>
  );
}
