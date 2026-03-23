import { useEffect, useRef } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { MagnifyingGlass, Bell, ChatTeardrop } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    // 1. Constrain the provider to the viewport height
    <SidebarProvider className="h-screen overflow-hidden">
      <AppSidebar />
      
      {/* 2. SidebarInset becomes a flex container that fills remaining space */}
      <SidebarInset className="flex flex-col h-full overflow-hidden border-l-2 border-primary/5">
        
        {/* HEADER: Z-index ensures it stays above scrolling content */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b-2 border-primary/10 px-4 font-mono bg-background/95 backdrop-blur-md sticky top-0 z-20">
          
          <div className="flex items-center gap-2">
            <SidebarTrigger className="hover:bg-primary/10 rounded-none" />
            <Separator orientation="vertical" className="mx-2 h-4 hidden xs:block bg-primary/20" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 hidden md:inline">
              SYS // ROOT / LOUNGE
            </span>
          </div>

          <div className="flex-1 max-w-sm px-2 sm:px-4 relative">
            <MagnifyingGlass className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              ref={searchRef}
              placeholder="Search_Grid..."
              className="w-full bg-muted/10 text-[10px] font-bold uppercase text-muted-foreground rounded-none border-2 border-primary/20 hover:border-primary focus-visible:ring-0 focus-visible:border-primary transition-all h-9 pl-8 sm:pl-10 pr-16"
            />
            <kbd className="pointer-events-none absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 border-2 border-primary/20 bg-background px-1.5 font-mono text-[9px] font-black opacity-100 lg:flex">
              CMD+K
            </kbd>
          </div>

          <div className="flex items-center gap-1 sm:gap-3">
            <Button variant="ghost" size="icon" className="relative rounded-none hidden xs:flex hover:text-primary transition-colors">
              <ChatTeardrop size={20} weight="bold" />
            </Button>
            
            <Button variant="ghost" size="icon" className="relative rounded-none hover:text-primary transition-colors">
              <Bell size={20} weight="bold" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary animate-pulse" />
            </Button>
            
            <Separator orientation="vertical" className="h-6 mx-1 bg-primary/10" />
            <ModeToggle />
          </div>
        </header>

        {/* 3. SCROLLABLE AREA: This is the only part that moves */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#fafafa] dark:bg-[#0a0a0a] custom-scrollbar">
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </main>

      </SidebarInset>
    </SidebarProvider>
  )
}