import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MyProperties } from "@/components/pages/dashboard/MyProperties";

export const dynamic = "force-dynamic";

export default async function MyPropertiesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <DashboardLayout currentPage="properties">
      <MyProperties />
    </DashboardLayout>
  );
}
