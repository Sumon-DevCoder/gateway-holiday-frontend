import AdminLayout from "@/components/Layout/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ReactNode } from "react";

export default function AdminLayoutWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}
