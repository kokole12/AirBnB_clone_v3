"use client";

import * as React from "react";
import { Link } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useSignIn, useSignUp } from "@clerk/clerk-react";

interface AuthProps {
  onNavigate: (page: string) => void;
  onLoginSuccess: (role: "tenant" | "landlord", email?: string) => void;
}

export function LoginPage({ onNavigate, onLoginSuccess }: AuthProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  
  const { isLoaded, signIn, setActive } = useSignIn();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setError(null);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        // Retrieve role from unsafeMetadata
        const role = (result.userData.unsafeMetadata.role as "tenant" | "landlord") || "tenant";
        onLoginSuccess(role, email);
      } else {
        setError("Login incomplete. Please verify your account.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Failed to sign in");
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Panel - Form */}
      <div className="flex w-full flex-col justify-center bg-white px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="mb-10 cursor-pointer" onClick={() => onNavigate("landing")}>
                 <span className="text-2xl font-bold tracking-tight text-blue-900">Prop<span className="text-emerald-500">Estate</span></span>
            </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-600">
              Please sign in to your account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm font-medium text-blue-900 hover:text-blue-800">Forgot password?</a>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800" disabled={!isLoaded}>
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-600">Don't have an account? </span>
            <button onClick={() => onNavigate("register")} className="font-medium text-blue-900 hover:text-blue-800">
              Sign up
            </button>
          </div>
          
           <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-sm text-slate-500">Or continue with</span>
            </div>
          </div>
          
           <div className="mt-6 grid grid-cols-2 gap-3">
             <Button variant="outline" type="button">Google</Button>
             <Button variant="outline" type="button">Microsoft</Button>
           </div>
        </div>
      </div>

      {/* Right Panel - Image */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2000&auto=format&fit=crop"
          alt="Modern Architecture"
        />
        <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply" />
      </div>
    </div>
  );
}

export function RegisterPage({ onNavigate, onLoginSuccess }: AuthProps) {
    const [role, setRole] = React.useState<"tenant" | "landlord">("tenant");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [error, setError] = React.useState<string | null>(null);
    
    const { isLoaded, signUp } = useSignUp();
    
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;
        setError(null);

        try {
            await signUp.create({
                emailAddress: email,
                password,
                unsafeMetadata: {
                    role,
                    firstName,
                    lastName,
                },
            });

            // Prepare verification
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

            // Navigate to verification page
            onLoginSuccess(role, email);

        } catch (err: any) {
            setError(err.errors?.[0]?.message || "Failed to create account");
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-slate-50 flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-10 shadow-xl rounded-2xl">
                <div className="text-center">
                    <div className="cursor-pointer mb-6" onClick={() => onNavigate("landing")}>
                         <span className="text-2xl font-bold tracking-tight text-blue-900">Prop<span className="text-emerald-500">Estate</span></span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create your account</h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Join our community of owners and renters
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-100 p-1">
                    <button
                        className={`rounded-md py-2 text-sm font-medium transition-all ${role === "tenant" ? "bg-white text-slate-900 shadow" : "text-slate-500 hover:text-slate-900"}`}
                        onClick={() => setRole("tenant")}
                    >
                        I'm a Tenant
                    </button>
                    <button
                        className={`rounded-md py-2 text-sm font-medium transition-all ${role === "landlord" ? "bg-white text-slate-900 shadow" : "text-slate-500 hover:text-slate-900"}`}
                        onClick={() => setRole("landlord")}
                    >
                        I'm a Landlord
                    </button>
                </div>

                <form className="space-y-4" onSubmit={handleRegister}>
                    {error && (
                        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                             <Label htmlFor="firstName">First name</Label>
                             <Input 
                                id="firstName" 
                                required 
                                placeholder="John" 
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="lastName">Last name</Label>
                             <Input 
                                id="lastName" 
                                required 
                                placeholder="Doe" 
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                            id="email" 
                            type="email" 
                            required 
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                            id="password" 
                            type="password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <input type="checkbox" id="terms" className="rounded border-slate-300 text-blue-900 focus:ring-blue-900" required />
                        <label htmlFor="terms" className="text-sm text-slate-600">I agree to the <a href="#" className="text-blue-900 hover:underline">Terms</a> and <a href="#" className="text-blue-900 hover:underline">Privacy Policy</a></label>
                    </div>

                    <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800" disabled={!isLoaded}>
                        Create Account
                    </Button>
                </form>

                 <div className="text-center text-sm">
                    <span className="text-slate-600">Already have an account? </span>
                    <button onClick={() => onNavigate("login")} className="font-medium text-blue-900 hover:text-blue-800">
                    Sign in
                    </button>
                </div>
            </div>
        </div>
    )
}
