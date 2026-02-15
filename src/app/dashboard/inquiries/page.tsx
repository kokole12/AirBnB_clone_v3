import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Inquiries } from "@/components/pages/dashboard/Inquiries";

export default async function InquiriesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <DashboardLayout currentPage="inquiries">
      <Inquiries />
    </DashboardLayout>
  );
}
