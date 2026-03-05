import * as React from "react"
import { 
  House, 
  UsersThree, 
  Hash, 
  TrendUp, 
  SignOut, 
  UserGear, 
  IdentificationCard 
} from "@phosphor-icons/react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "./auth-context"

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
  const { logout, user } = useAuth();

  // Helper to get the display initial
  const userInitial = (user?.display_name || user?.username || "U").charAt(0).toUpperCase();

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
                  <span className="truncate font-black uppercase tracking-tighter text-foreground">Urbantrends Org</span>
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
                  <Link to={space.url} className="font-bold text-xs uppercase tracking-tighter">
                    <Hash size={18} className={location.pathname === space.url ? "text-primary" : "opacity-30"} />
                    <span>{space.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t-2 border-primary/5 p-4 bg-muted/5">
        <SidebarMenu className="gap-2">
          {user ? (
            <>
              {/* PROFILE CONTROL NODE */}
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  isActive={location.pathname === "/profile"}
                  className="h-14 hover:bg-primary/10 rounded-none border-2 border-transparent hover:border-primary transition-all group px-3"
                >
                  <Link to="/profile" className="flex items-center gap-3">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-none bg-primary text-primary-foreground font-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none group-hover:translate-x-[1px] group-hover:translate-y-[1px] transition-all">
                      {userInitial}
                    </div>
                    <div className="flex flex-col items-start overflow-hidden">
                      <span className="truncate font-black uppercase text-[10px] tracking-tighter leading-none">
                        {user.display_name || "Access_Profile"}
                      </span>
                      <span className="truncate text-[9px] opacity-40 font-bold uppercase tracking-widest mt-1">
                        ID_{user.username || "AUTH_USER"}
                      </span>
                    </div>
                    <UserGear size={16} className="ml-auto opacity-20 group-hover:opacity-100 transition-opacity" weight="bold" />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* TERMINATE SESSION */}
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={logout}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-none border-2 border-transparent hover:border-destructive transition-all group h-10"
                >
                  <SignOut size={18} weight="bold" />
                  <span className="font-black uppercase text-[10px] tracking-tight">Terminate_Session</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          ) : (
            /* GUEST ACCESS */
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild
                className="h-12 text-primary hover:bg-primary/10 hover:text-primary rounded-none border-2 border-transparent hover:border-primary transition-all"
              >
                <Link to="/login" className="flex items-center gap-3">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-none bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <IdentificationCard size={20} weight="bold" />
                  </div>
                  <span className="font-black uppercase text-xs tracking-tight">Initialize_Login</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}