"use client"
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Home, Users, Calendar, Settings, LogOut, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "../ui/button";

const SidebarAdmin = () => {
  const router = useRouter()
  const handleLogout = () => {
    Cookies.remove("authToken"); 
    router.push("/auth/signup"); 
  }
  const items = [
    {
      title: "Home",
      url: "/admin",
      icon: Home,
    },
    {
      title: "Create Group",
      url: "/admin/group",
      icon: UserPlus,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Session",
      url: "/admin/session",
      icon: Calendar,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent >
        <SidebarGroup>
          <SidebarHeader>Admin</SidebarHeader>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center space-x-2">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

       
          <SidebarFooter>
            <SidebarMenuItem>
            <Button
                className="flex items-center space-x-2 "
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </Button>
            </SidebarMenuItem>
          </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarAdmin;