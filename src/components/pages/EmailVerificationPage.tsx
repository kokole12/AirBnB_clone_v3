"use client";

import * as React from "react";
import { Mail } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useSignUp } from "@clerk/clerk-react";

interface EmailVerificationProps {
  onVerify: () => void;
  email?: string;
}

export function EmailVerificationPage({ onVerify, email = "" }: EmailVerificationProps) {
  const [otp, setOtp] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [resendStatus, setResendStatus] = React.useState<string | null>(null);

  const { isLoaded, signUp, setActive } = useSignUp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: otp,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        onVerify();
      } else {
        setError("Verification failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Invalid code");
    }
  };

  const handleResend = async () => {
      if (!isLoaded) return;
      setResendStatus("Sending...");
      try {
          await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
          setResendStatus("Sent!");
      } catch (err: any) {
          setResendStatus("Failed to send");
          setError(err.errors?.[0]?.message);
      }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-10 shadow-xl rounded-2xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
           <Mail className="h-8 w-8 text-blue-900" />
        </div>
        
        <div>
           <h2 className="text-3xl font-bold tracking-tight text-slate-900">Check your email</h2>
           <p className="mt-2 text-sm text-slate-600">
              We sent a verification code to <strong>{email}</strong>. <br />
              Enter the code below to verify your account.
           </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
           {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 text-center">
                {error}
              </div>
           )}
           <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input 
                id="otp" 
                placeholder="Ex. 123456" 
                className="text-center text-lg tracking-widest" 
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
           </div>

           <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800" disabled={!isLoaded}>
              Verify Email
           </Button>
        </form>

        <div className="mt-6 text-center text-sm">
            <span className="text-slate-600">Didn't receive the email? </span>
            <button 
                onClick={handleResend}
                className="font-medium text-blue-900 hover:text-blue-800"
                disabled={resendStatus === "Sending..."}
            >
              {resendStatus || "Click to resend"}
            </button>
        </div>
      </div>
    </div>
  );
}
