"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import AppSidebarMenu from "@/components/layouts/AppSidebarMenu";
import { signOut } from "@/app/actions/auth";
import Image from "next/image";
import { ICONS } from "@/constants/icons";
import { Loader2 } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { useSummaryStore } from "@/store/summaryStore";

const AppSidebar = () => {
  const router = useRouter();
  const { clearSummaryStore } = useSummaryStore.getState();
  const { user, clearUserStore } = useUserStore.getState();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogout = async () => {
    setIsLoading(true);

    await signOut();
    clearSummaryStore();
    clearUserStore();

    setIsLoading(false);
    setIsDialogOpen(false);
  };

  const handleSummarizeClick = () => {
    router.push("/");
  };

  return (
    <>
      <Sidebar className="w-72">
        <SidebarHeader className="bg-ud-black text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar>
                {user?.first_name && user?.last_name && (
                  <AvatarFallback className="bg-violet-700">
                    {user?.first_name?.[0] || ""}
                    {user?.last_name?.[0] || ""}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="flex flex-col">
                {user?.first_name && user?.last_name && (
                  <span className="font-semibold">
                    {user.first_name} {user.last_name}
                  </span>
                )}
                {user?.email ? (
                  <span className="text-xs text-white/60">{user.email}</span>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="ml-4 flex items-center">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <button className="w-full">
                    <Image
                      src={ICONS.LOGOUT_ICON}
                      alt="Logout Icon"
                      width={20}
                      height={20}
                      className="h-5 w-5"
                    />
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you sure you want to logout?</DialogTitle>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="ml-2"
                      onClick={handleLogout}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin mr-2 h-4 w-4" />
                          <span>Loging out...</span>
                        </>
                      ) : (
                        "Logout"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="bg-ud-black text-white p-4">
          <SidebarGroup className="p-0">
            <SidebarGroupContent>
              <Button
                onClick={handleSummarizeClick}
                className="w-full mt-2 px-4 py-2 bg-white text-black rounded-md shadow hover:bg-primary-dark"
              >
                + Summarize Text
              </Button>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup className="p-0">
            <SidebarGroupContent>
              <AppSidebarMenu />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
};

export default AppSidebar;
