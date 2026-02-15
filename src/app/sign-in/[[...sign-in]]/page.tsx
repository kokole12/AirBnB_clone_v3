import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { SignInForm } from "@/components/auth/SignInForm";

// Force dynamic rendering for auth routes
export const dynamic = "force-dynamic";

export default async function SignInPage() {
  const user = await currentUser();

  if (user) {
    redirect("/");
  }

  return <SignInForm />;
}
