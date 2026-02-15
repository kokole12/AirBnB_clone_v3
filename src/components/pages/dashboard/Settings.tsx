"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Switch } from "../../ui/switch";

export function Settings() {
    const { user, isLoaded } = useUser();
    const [isLoading, setIsLoading] = React.useState(false);

    // Form state
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [phone, setPhone] = React.useState("");

    // Notification state
    const [emailNotifications, setEmailNotifications] = React.useState(true);
    const [smsNotifications, setSmsNotifications] = React.useState(false);

    // Initialize form with user data when loaded
    React.useEffect(() => {
        if (user) {
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");

            // Load from metadata or fall back to primary phone
            const metadata = user.unsafeMetadata as any;
            setPhone(metadata.phone || user.primaryPhoneNumber?.phoneNumber || "");

            // Load notification preferences from metadata
            if (metadata.emailNotifications !== undefined) {
                setEmailNotifications(metadata.emailNotifications);
            }
            if (metadata.smsNotifications !== undefined) {
                setSmsNotifications(metadata.smsNotifications);
            }
        }
    }, [user]);

    const handleSaveProfile = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            // Update basic info
            await user.update({
                firstName,
                lastName,
                unsafeMetadata: {
                    ...user.unsafeMetadata,
                    phone, // Store phone in metadata as "Contact Phone"
                    emailNotifications,
                    smsNotifications
                }
            });
            toast.success("Settings updated successfully");
        } catch (error) {
            console.error("Error updating settings:", error);
            toast.error("Failed to update settings");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isLoaded) {
        return (
            <div className="flex h-40 items-center justify-center">
                <div className="text-slate-500">Loading settings...</div>
            </div>
        );
    }

    if (!user) {
        return <div>Please sign in to view settings.</div>;
    }

    return (
        <div className="max-w-4xl space-y-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h2>

            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            value={user.primaryEmailAddress?.emailAddress || ""}
                            disabled
                            className="bg-slate-50 text-slate-500"
                        />
                        <p className="text-xs text-slate-500">Email cannot be changed here.</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Contact Phone</Label>
                        <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 (555) 000-0000"
                        />
                        <p className="text-xs text-slate-500">This phone number will be used for contacting you.</p>
                    </div>
                    <Button onClick={handleSaveProfile} disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Email Notifications</Label>
                            <p className="text-sm text-slate-500">Receive emails about new inquiries and messages.</p>
                        </div>
                        <Switch
                            checked={emailNotifications}
                            onCheckedChange={setEmailNotifications}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">SMS Alerts</Label>
                            <p className="text-sm text-slate-500">Get text messages for urgent issues.</p>
                        </div>
                        <Switch
                            checked={smsNotifications}
                            onCheckedChange={setSmsNotifications}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive" onClick={() => toast.error("Please contact support to delete your account.")}>Delete Account</Button>
                </CardContent>
            </Card>
        </div>
    );
}
