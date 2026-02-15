"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Inbox
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

export function DashboardLayout({ children, currentPage }: DashboardLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useClerk();

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/dashboard/overview" },
    { id: "properties", label: "My Properties", icon: Home, href: "/dashboard/properties" },
    { id: "inquiries", label: "Inquiries", icon: Inbox, href: "/dashboard/inquiries" },
    { id: "notifications", label: "Notifications", icon: Bell, href: "/dashboard/notifications" },
    { id: "settings", label: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  React.useEffect(() => {
    // Fetch unread notifications count
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch("/api/notifications");
        if (response.ok) {
          const notifications = await response.json();
          const unread = notifications.filter((n: any) => !n.isRead).length;
          setUnreadCount(unread);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Failed to fetch notifications count", error);
        return false;
      }
    };

    // Poll every 5 minutes, but only if initial fetch was successful
    // This prevents spamming the server if there's a database connection issue
    fetchUnreadCount().then((success) => {
      if (success) {
        const interval = setInterval(fetchUnreadCount, 300000);
        return () => clearInterval(interval);
      }
    });
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar for Desktop */}
      <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="flex h-16 items-center px-6 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-900 text-white">
              <Home className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-blue-900">Prop<span className="text-emerald-500">Estate</span></span>
          </Link>
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          <div className="mb-4 px-2 text-xs font-semibold uppercase text-slate-400">Menu</div>
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                currentPage === item.id
                  ? "bg-blue-50 text-blue-900"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.id === "notifications" && unreadCount > 0 && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-900">
                  {unreadCount}
                </span>
              )}
            </Link>
          ))}
        </div>
        <div className="border-t border-slate-100 p-4">
          <Button
            onClick={async () => {
              await signOut();
              router.push("/");
            }}
            variant="ghost"
            className="flex w-full items-center gap-3 justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform duration-200 ease-in-out md:hidden",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-900 text-white">
              <Home className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-blue-900">PropEstate</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)}><X className="h-5 w-5 text-slate-500" /></button>
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                currentPage === item.id
                  ? "bg-blue-50 text-blue-900"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.id === "notifications" && unreadCount > 0 && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-900">
                  {unreadCount}
                </span>
              )}
            </Link>
          ))}
          <Button
            onClick={async () => {
              await signOut();
              setSidebarOpen(false);
              router.push("/");
            }}
            variant="ghost"
            className="mt-4 flex w-full items-center gap-3 justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Dashboard Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-8">
          <div className="flex items-center gap-4">
            <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6 text-slate-600" />
            </button>
            <h2 className="text-lg font-semibold text-slate-800">
              {navItems.find(i => i.id === currentPage)?.label || "Dashboard"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/notifications">
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="hidden text-right md:block">
                <div className="text-sm font-medium text-slate-900">Owner Dashboard</div>
                <div className="text-xs text-slate-500">Property Owner</div>
              </div>
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>PO</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Dashboard Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
