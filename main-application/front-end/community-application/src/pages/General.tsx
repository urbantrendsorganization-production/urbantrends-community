import { 
  PaperPlaneRight, 
  Hash, 
  Circle,
  UsersThree,
  ShieldCheck,
  Cpu
} from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const MEMBERS = [
  { id: 1, name: "arch_vince", status: "online", role: "ADMIN", color: "text-red-500" },
  { id: 2, name: "grid_master", status: "online", role: "CORE", color: "text-primary" },
  { id: 3, name: "eduh_logic", status: "online", role: "USER", color: "text-green-500" },
  { id: 4, name: "data_flow", status: "offline", role: "USER", color: "text-muted-foreground" },
  { id: 5, name: "node_zero", status: "away", role: "BOT", color: "text-orange-500" },
]

const CHAT_LOGS = [
  { id: 1, user: "arch_vince", time: "14:20", message: "Has anyone benchmarked the new Postgres vector extension?", isMe: false, initials: "AV" },
  { id: 2, user: "grid_master", time: "14:22", message: "Tested it last night. Data locality makes it worth the trade-off.", isMe: false, initials: "GM" },
  { id: 3, user: "eduh_logic", time: "14:25", message: "Agreed. Consistency is key for our RAG pipeline.", isMe: true, initials: "EL" },
]

function General() {
  return (
    <div className="flex h-[calc(100vh-12rem)] font-mono border-4 border-primary bg-background shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      
      {/* LEFT: MAIN CHAT AREA */}
      <div className="flex flex-col flex-1 min-w-0 border-r-4 border-primary">
        {/* CHANNEL HEADER */}
        <header className="flex items-center justify-between p-4 border-b-2 border-primary bg-primary/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Hash size={20} weight="bold" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-tighter italic">General_Chat</h2>
              <div className="flex items-center gap-2">
                <Circle size={8} weight="fill" className="text-green-500 animate-pulse" />
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                  Secure_Channel_Active
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* CHAT FEED */}
        <ScrollArea className="flex-1 p-6 bg-[#fafafa] dark:bg-[#0c0c0c]">
          <div className="space-y-8 max-w-4xl mx-auto">
            {CHAT_LOGS.map((log) => (
              <div key={log.id} className={cn("flex gap-4 group", log.isMe ? "flex-row-reverse" : "flex-row")}>
                <Avatar className="rounded-none border-2 border-primary h-10 w-10 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <AvatarFallback className="rounded-none font-black text-xs">{log.initials}</AvatarFallback>
                </Avatar>
                <div className={cn("flex flex-col space-y-1 max-w-[80%]", log.isMe ? "items-end" : "items-start")}>
                  <div className="flex items-center gap-2 px-1 text-[10px] font-black uppercase tracking-tighter">
                    <span>{log.user}</span>
                    <span className="opacity-30">{log.time}</span>
                  </div>
                  <div className={cn(
                    "p-4 text-sm font-medium border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all",
                    log.isMe ? "bg-primary text-primary-foreground border-primary" : "bg-background border-primary/20"
                  )}>
                    {log.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* INPUT CONSOLE */}
        <div className="p-4 border-t-4 border-primary bg-background shrink-0">
          <form className="flex items-center gap-3">
            <Input 
              placeholder="Execute transmission..." 
              className="rounded-none border-2 border-primary/20 focus-visible:ring-0 focus-visible:border-primary h-12 bg-muted/10 font-bold uppercase text-xs placeholder:opacity-30"
            />
            <Button type="submit" className="rounded-none h-12 px-6 bg-primary hover:bg-primary/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
              <PaperPlaneRight size={22} weight="bold" />
            </Button>
          </form>
        </div>
      </div>

      {/* RIGHT: MEMBER LIST SIDEBAR (Hidden on mobile) */}
      <aside className="hidden lg:flex flex-col w-64 bg-muted/5">
        <div className="p-4 border-b-2 border-primary bg-primary/5 flex items-center gap-2">
          <UsersThree size={20} weight="bold" className="text-primary" />
          <h3 className="text-[10px] font-black uppercase tracking-widest">Active_Nodes</h3>
          <Badge className="ml-auto rounded-none bg-primary text-[9px] font-black h-5 min-w-5 justify-center">
            {MEMBERS.filter(m => m.status === 'online').length}
          </Badge>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* GROUP BY STATUS */}
            {['online', 'away', 'offline'].map((status) => (
              <div key={status} className="space-y-3">
                <h4 className="text-[9px] font-black uppercase text-muted-foreground/60 tracking-[0.2em] flex items-center gap-2">
                  <div className={cn("w-1.5 h-1.5 rounded-none", 
                    status === 'online' ? 'bg-green-500' : status === 'away' ? 'bg-orange-500' : 'bg-muted-foreground/30'
                  )} />
                  {status}_Directory
                </h4>
                
                <div className="space-y-1">
                  {MEMBERS.filter(m => m.status === status).map((member) => (
                    <button key={member.id} className="w-full flex items-center gap-3 p-2 hover:bg-primary/10 transition-colors group relative border-l-2 border-transparent hover:border-primary">
                      <div className="relative">
                        <Avatar className="h-8 w-8 rounded-none border-2 border-primary/20 group-hover:border-primary transition-colors">
                          <AvatarFallback className="text-[10px] font-black rounded-none">{member.name.substring(0,2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {status === 'online' && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-background" />
                        )}
                      </div>
                      <div className="flex flex-col items-start overflow-hidden">
                        <span className={cn("text-[11px] font-black uppercase truncate tracking-tighter group-hover:text-primary transition-colors")}>
                          {member.name}
                        </span>
                        <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                          {member.role === 'ADMIN' ? <ShieldCheck size={10} weight="fill" /> : <Cpu size={10} />}
                          <span className="text-[8px] font-black uppercase">{member.role}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* FOOTER STATS */}
        <div className="p-4 border-t-2 border-primary/10 bg-black/5">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[8px] font-black uppercase">
              <span className="opacity-40">System_Load</span>
              <span className="text-primary">0.04ms</span>
            </div>
            <div className="h-1 w-full bg-muted overflow-hidden">
              <div className="h-full bg-primary w-[15%]" />
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default General