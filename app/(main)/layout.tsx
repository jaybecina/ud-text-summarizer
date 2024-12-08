import AppSidebar from "@/components/layouts/AppSidebar";
import ToastContainer from "@/components/ToastContainer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="p-5 w-full h-full">
        <div className="lg:hidden">
          <SidebarTrigger />
        </div>
        {children}
      </main>
      <ToastContainer />
    </SidebarProvider>
  );
}
