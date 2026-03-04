import * as React from "react"
import { 
  House, 
  UsersThree, 
  Hash, 
  TrendUp,
  SignOut
} from "@phosphor-icons/react"
import { Link, useLocation } from "react-router-dom"

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

// Sample Data Structure
const data = {
  user: {
    name: "Alex Rivera",
    email: "alex@community.io",
    avatar: "/avatars/user.jpg",
  },
  navMain: [
    { title: "Home", url: "/", icon: House, isActive: true },
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
  return (
    <Sidebar variant="inset" {...props} className="font-mono">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-none bg-primary text-primary-foreground">
                  <Hash size={20} weight="bold" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold uppercase">Urbantrends Org</span>
                  <span className="truncate text-xs opacity-60">Community</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                {/* Use 'asChild' so we can use the Link component */}
                <SidebarMenuButton 
                  asChild 
                  tooltip={item.title} 
                  isActive={location.pathname === item.url}
                >
                  <Link to={item.url}>
                    <item.icon size={20} />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Spaces</SidebarGroupLabel>
          <SidebarMenu>
            {data.spaces.map((space) => (
              <SidebarMenuItem key={space.name}>
                <SidebarMenuButton asChild isActive={location.pathname === space.url}>
                  <Link to={space.url}>
                    <Hash size={18} className="opacity-50" />
                    <span>{space.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-destructive hover:text-destructive">
              <SignOut size={20} />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}