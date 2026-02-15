import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AddProperty } from "@/components/pages/dashboard/AddProperty";

export const dynamic = "force-dynamic";

export default async function AddPropertyPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <DashboardLayout currentPage="add-property">
      <AddProperty />
    </DashboardLayout>
  );
}
