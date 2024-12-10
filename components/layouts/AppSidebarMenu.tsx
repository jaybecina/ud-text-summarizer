"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { ICONS } from "@/constants/icons";
import { useSummaryStore } from "@/store/summaryStore";

const AppSidebarMenu = () => {
  const { summaries } = useSummaryStore();
  return (
    <SidebarMenu className="p-0 mt-4">
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          className="hover:bg-neutral-800 hover:text-white"
        >
          <Link href="/">
            <Image
              src={ICONS.HOME_ICON}
              alt="Home Icon"
              width={20}
              height={20}
              className="h-5 w-5"
            />
            <span>Home</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          className="hover:bg-neutral-800 hover:text-white"
        >
          <Link href="/history">
            <Image
              src={ICONS.HISTORY_ICON}
              alt="History Icon"
              width={20}
              height={20}
              className="h-5 w-5"
            />
            <span>History</span>
            <Badge className="bg-slate-800 text-white text-xs rounded-sm py-0 px-1 border-slate-700">
              {summaries?.length || 0}
            </Badge>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default AppSidebarMenu;
