import { Notifications } from "@/components/pages/dashboard/Notifications";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function NotificationsPage() {
    return (
        <DashboardLayout currentPage="notifications">
            <Notifications />
        </DashboardLayout>
    );
}
