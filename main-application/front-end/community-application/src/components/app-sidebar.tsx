import * as React from "react"
import { House, UsersThree, Hash, TrendUp, SignOut } from "@phosphor-icons/react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "./auth-context" // 1. Import Auth Context

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { User } from "lucide-react"

const data = {
  navMain: [
    { title: "Home", url: "/", icon: House },
    { title: "Trending", url: "/trending", icon: TrendUp },
    { title: "Members", url: "/members", icon: UsersThree },
  ],
  spaces: [
    { name: "announcements", url: "/spaces/announcements" },
    { name: "general-chat", url: "/spaces/general-chat" },
    { name: "developer-talk", url: "/spaces/developer-talk" },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const { logout, login, user } = useAuth(); // 2. Grab logout and user

  return (
    <Sidebar variant="inset" {...props} className="font-mono border-r-2 border-primary/10">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-none bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Hash size={20} weight="bold" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                  <span className="truncate font-black uppercase tracking-tighter">Urbantrends Org</span>
                  <span className="truncate text-[10px] opacity-60 font-bold uppercase tracking-widest text-primary">Collective_v1</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-[10px] font-black px-4 mb-2">Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title} isActive={location.pathname === item.url}>
                  <Link to={item.url} className="font-bold uppercase text-xs tracking-tight">
                    <item.icon size={20} weight={location.pathname === item.url ? "fill" : "regular"} />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-[10px] font-black px-4 mb-2">Channels</SidebarGroupLabel>
          <SidebarMenu>
            {data.spaces.map((space) => (
              <SidebarMenuItem key={space.name}>
                <SidebarMenuButton asChild isActive={location.pathname === space.url}>
                  <Link to={space.url} className="font-bold text-xs">
                    <Hash size={18} className={location.pathname === space.url ? "text-primary" : "opacity-30"} />
                    <span>{space.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t-2 border-primary/5 p-4">
  <SidebarMenu>
    {user ? (
      // SHOW LOGOUT IF AUTHENTICATED
      <SidebarMenuItem>
        <SidebarMenuButton 
          onClick={logout}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-none border-2 border-transparent hover:border-destructive transition-all"
        >
          <SignOut size={20} weight="bold" />
          <span className="font-black uppercase text-xs">Terminate_Session</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ) : (
      // SHOW LOGIN IF GUEST
      <SidebarMenuItem>
        <SidebarMenuButton 
          asChild
          className="text-primary hover:bg-primary/10 hover:text-primary rounded-none border-2 border-transparent hover:border-primary transition-all"
        >
          <Link to="/login">
            <User size={20} weight="bold" />
            <span className="font-black uppercase text-xs">Initialize_Login</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )}
  </SidebarMenu>
</SidebarFooter>
    </Sidebar>
  )
}