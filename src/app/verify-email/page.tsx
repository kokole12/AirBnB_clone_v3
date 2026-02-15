import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

// Force dynamic rendering for auth routes
export const dynamic = "force-dynamic";

export default async function VerifyEmailPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold">Verify Email</h1>
        <p className="text-slate-600">
          Please check your email to verify your account.
        </p>
      </div>
    </div>
  );
}
