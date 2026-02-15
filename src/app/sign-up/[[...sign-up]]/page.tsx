import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { SignUpForm } from "@/components/auth/SignUpForm";

// Force dynamic rendering for auth routes
export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  const user = await currentUser();

  if (user) {
    redirect("/");
  }

  return <SignUpForm />;
}
