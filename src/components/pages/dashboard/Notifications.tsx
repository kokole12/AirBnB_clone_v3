"use client";

import * as React from "react";
import { Bell, Check, Trash2, Info, AlertTriangle, CheckCircle, XCircle, Mail } from "lucide-react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { toast } from "sonner";
import Link from "next/link";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: "INFO" | "SUCCESS" | "WARNING" | "ERROR" | "INQUIRY";
    isRead: boolean;
    link?: string;
    createdAt: string;
}

export function Notifications() {
    const [notifications, setNotifications] = React.useState<Notification[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/notifications");
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
            toast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            const response = await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notificationId: id }),
            });

            if (response.ok) {
                setNotifications((prev) =>
                    prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
                );
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ markAllRead: true }),
            });

            if (response.ok) {
                setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
                toast.success("All notifications marked as read");
            }
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "SUCCESS":
                return <CheckCircle className="h-5 w-5 text-emerald-500" />;
            case "WARNING":
                return <AlertTriangle className="h-5 w-5 text-amber-500" />;
            case "ERROR":
                return <XCircle className="h-5 w-5 text-red-500" />;
            case "INQUIRY":
                return <Mail className="h-5 w-5 text-blue-500" />;
            default:
                return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    const formatTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-900" />
                    <p className="text-slate-500">Loading notifications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Stay updated with your property activity
                    </p>
                </div>
                {unreadCount > 0 && (
                    <Button variant="outline" size="sm" onClick={markAllAsRead}>
                        <Check className="mr-2 h-4 w-4" />
                        Mark all read
                    </Button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                    <Bell className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                    <h3 className="text-lg font-semibold text-slate-900">No notifications</h3>
                    <p className="text-sm text-slate-500 mt-1">
                        You're all caught up! New updates will appear here.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notification) => (
                        <Card
                            key={notification.id}
                            className={`p-4 transition-colors ${!notification.isRead ? "bg-blue-50/50 border-blue-100" : "bg-white"
                                }`}
                        >
                            <div className="flex gap-4">
                                <div className={`mt-1 shrink-0 ${!notification.isRead ? "opacity-100" : "opacity-70"}`}>
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className={`text-sm font-semibold ${!notification.isRead ? "text-slate-900" : "text-slate-700"}`}>
                                                {notification.title}
                                                {!notification.isRead && (
                                                    <span className="ml-2 inline-block h-2 w-2 rounded-full bg-blue-500" />
                                                )}
                                            </h3>
                                            <p className="text-sm text-slate-600 mt-1">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-xs text-slate-400">
                                                    {formatTimeAgo(notification.createdAt)}
                                                </span>
                                                {notification.link && (
                                                    <Link
                                                        href={notification.link}
                                                        className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                                        onClick={() => !notification.isRead && markAsRead(notification.id)}
                                                    >
                                                        View Details
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                        {!notification.isRead && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-slate-400 hover:text-blue-600"
                                                onClick={() => markAsRead(notification.id)}
                                                title="Mark as read"
                                            >
                                                <Check className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
