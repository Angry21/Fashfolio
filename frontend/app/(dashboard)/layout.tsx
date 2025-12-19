import AppShell from "@/components/layout/AppShell";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <AppShell>
            {children}
        </AppShell>
    );
};
export default DashboardLayout;
