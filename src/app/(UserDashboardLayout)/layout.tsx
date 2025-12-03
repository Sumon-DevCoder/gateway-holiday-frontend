import UserLayout from "@/components/Layout/UserLayout";
import { ReactNode } from "react";

export default function UserDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <UserLayout>{children}</UserLayout>;
}
