import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import AppSidebarMenu from "@/components/layouts/AppSidebarMenu";
import { signOut } from "@/app/actions/auth";
import Image from "next/image";
import { ICONS } from "@/constants/icons";

const AppSidebar = () => {
  return (
    <>
      <Sidebar className="w-72">
        <SidebarHeader className="bg-ud-black text-white p-4">
          <div className="flex items-center justify-between">
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
            <div className="ml-4 flex items-center">
              <form action={signOut} method="POST">
                <button className="w-full">
                  <Image
                    src={ICONS.LOGOUT_ICON}
                    alt="Logout Icon"
                    width={20}
                    height={20}
                    className="h-5 w-5"
                  />
                </button>
              </form>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="bg-ud-black text-white p-4">
          <SidebarGroup className="p-0">
            <SidebarGroupContent>
              <Button className="w-full mt-2 px-4 py-2 bg-white text-black rounded-md shadow hover:bg-primary-dark">
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
