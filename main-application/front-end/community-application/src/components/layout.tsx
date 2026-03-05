import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { MagnifyingGlass, Bell, ChatTeardrop } from "@phosphor-icons/react" 
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden">
        {/* HEADER */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 font-mono bg-background/80 backdrop-blur-md sticky top-0 z-10">
          
          {/* LEFT: Sidebar Toggle & Section Title */}
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mx-2 h-4 hidden xs:block" />
            <span className="text-xs font-bold uppercase tracking-tighter text-muted-foreground hidden md:inline">
              root / lounge
            </span>
          </div>

          {/* CENTER: Responsive Search */}
          {/* On mobile, we shrink the search bar or hide the keyboard shortcut */}
          <div className="flex-1 max-w-sm px-2 sm:px-4">
            <Button 
              variant="outline" 
              className="relative w-full justify-start bg-muted/20 text-xs text-muted-foreground rounded-none border-dashed border-muted-foreground/30 hover:bg-muted/50 transition-all h-9 px-3"
            >
              <MagnifyingGlass className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline truncate">Search community...</span>
              <span className="sm:hidden">Search...</span>
              <kbd className="pointer-events-none absolute right-2 hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 lg:flex">
                ⌘K
              </kbd>
            </Button>
          </div>

          {/* RIGHT: Status & Tools */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Hidden on very small screens to save space */}
            <Button variant="ghost" size="icon" className="relative rounded-none hidden xs:flex">
              <ChatTeardrop size={20} />
            </Button>
            
            <Button variant="ghost" size="icon" className="relative rounded-none">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-primary rounded-full" />
            </Button>
            
            <ModeToggle />
          </div>
          
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-muted/5">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}