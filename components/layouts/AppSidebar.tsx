import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppSidebarMenu from "@/components/layouts/AppSidebarMenu";

const AppSidebar = () => {
  return (
    <>
      <Sidebar>
        <SidebarHeader className="bg-ud-black text-white px-6 py-4">
          <div className="flex items-center">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-violet-700">JD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold">John Doe</span>
                <span className="text-xs text-white/60">
                  johndoe@example.com
                </span>
              </div>
            </div>
            <form action="/api/logout" method="POST">
              <Button variant="ghost" className="w-full justify-start">
                <LogOut className="mr-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </SidebarHeader>
        <SidebarContent className="bg-ud-black text-white">
          <SidebarGroup>
            <SidebarGroupContent>
              <Button className="w-full mt-2 px-4 py-2 bg-white text-black rounded-md shadow hover:bg-primary-dark">
                + Summarize Text
              </Button>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
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
