import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardOverview } from "@/components/pages/dashboard/DashboardOverview";

export default async function DashboardOverviewPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <DashboardLayout currentPage="overview">
      <DashboardOverview />
    </DashboardLayout>
  );
}
