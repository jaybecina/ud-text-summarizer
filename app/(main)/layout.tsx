"use client";

import { useEffect } from "react";
import AppSidebar from "@/components/layouts/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useSummaryStore } from "@/store/summaryStore";
import { useUserStore } from "@/store/userStore";
import { getSummaries } from "@/app/actions/summary";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUserStore.getState();
  const { setSummaries, setIsLoading } = useSummaryStore();

  useEffect(() => {
    const fetchSummaries = async () => {
      if (user?.id) {
        setIsLoading(true);
        const { success, data } = await getSummaries(user.id);
        console.log("fetchSummaries in mainLayout: ", data);
        setSummaries(data ?? [], user.id);
        setIsLoading(false);
      }
    };

    fetchSummaries();
  }, [user?.id, setSummaries, setIsLoading]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="p-5 w-full h-full">
        <div className="lg:hidden">
          <SidebarTrigger />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
