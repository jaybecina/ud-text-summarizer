import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Home, History } from "lucide-react";

const AppSidebarMenu = () => (
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href="/">
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href="/history">
          <History className="h-4 w-4" />
          <span>History</span>
          <Badge className="bg-blue-600 text-white text-xs rounded-sm py-0 px-1">
            15
          </Badge>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
);

export default AppSidebarMenu;
