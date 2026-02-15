"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, User, Menu, X, Home, LogOut } from "lucide-react";
import { useAuth, useClerk, useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

  const userRole = (user?.unsafeMetadata?.role as "tenant" | "landlord") || "tenant";

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-900 text-white">
              <Home className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-blue-900">Prop<span className="text-emerald-500">Estate</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/search"
              className="text-slate-600 transition-colors hover:text-blue-900"
            >
              Properties
            </Link>
            <button className="text-slate-600 transition-colors hover:text-blue-900">
              How it Works
            </button>

            {/* Hide Owners link for Tenants */}
            {userRole === "landlord" || !isSignedIn ? (
              <button className="text-slate-600 transition-colors hover:text-blue-900">
                Owners
              </button>
            ) : null}

            <div className="ml-4 flex items-center gap-4">
              {isSignedIn ? (
                <>
                  {/* Only show Dashboard button for Landlords */}
                  {userRole === "landlord" && (
                    <Link
                      href="/dashboard"
                      className="font-medium text-slate-600 hover:text-blue-900"
                    >
                      Dashboard
                    </Link>
                  )}

                  <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="text-right hidden lg:block">
                      <div className="text-sm font-medium text-slate-900">
                        {user?.firstName || "User"}
                      </div>
                      <div className="text-xs text-slate-500 capitalize">{userRole}</div>
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.imageUrl || undefined} />
                      <AvatarFallback>
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={async () => {
                        await signOut();
                        router.push("/");
                      }}
                      title="Logout"
                    >
                      <LogOut className="h-4 w-4 text-slate-500 hover:text-red-500" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/sign-in">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white p-4">
            <nav className="flex flex-col gap-4">
              <Link href="/search" className="font-medium text-slate-600">
                Properties
              </Link>
              <button className="text-left font-medium text-slate-600">How it Works</button>

              {/* Hide Owners link for Tenants in Mobile */}
              {userRole === "landlord" || !isSignedIn ? (
                <button className="text-left font-medium text-slate-600">Owners</button>
              ) : null}

              {isSignedIn ? (
                <>
                  {userRole === "landlord" && (
                    <Link
                      href="/dashboard"
                      className="text-left font-medium text-blue-900"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Go to Dashboard
                    </Link>
                  )}
                  <div className="border-t border-slate-100 pt-4 mt-2">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.imageUrl || undefined} />
                        <AvatarFallback>
                          {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {user?.firstName || "User"}
                        </div>
                        <div className="text-xs text-slate-500 capitalize">{userRole}</div>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full justify-start"
                      onClick={async () => {
                        await signOut();
                        setIsMobileMenuOpen(false);
                        router.push("/");
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Log Out
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Link href="/sign-in">
                    <Button variant="outline">Sign In</Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button>Get Started</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 text-slate-300">
        <div className="container mx-auto grid gap-8 px-4 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white">
                <Home className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-white">PropEstate</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              The most trusted marketplace for property rentals and management. Find your dream home or manage your portfolio with ease.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Browse Properties</a></li>
              <li><a href="#" className="hover:text-white">List Your Property</a></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
              <li><a href="#" className="hover:text-white">Success Stories</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Safety</a></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto mt-12 border-t border-slate-800 px-4 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} PropEstate Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
