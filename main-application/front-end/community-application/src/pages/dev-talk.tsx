import { 
  TerminalWindow, 
  Code, 
  GitBranch, 
  GitCommit, 
  
  ChatCircleText
} from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const TOPICS = [
  { id: 1, title: "refactor/auth-middleware", tag: "Backend", active: true, status: "review" },
  { id: 2, title: "fix/spatial-indexing-leak", tag: "Database", active: false, status: "merged" },
  { id: 3, title: "feat/web-gl-viewports", tag: "Frontend", active: false, status: "bug" },
]

const THREAD = [
  {
    id: "0x1",
    user: "arch_vince",
    action: "pushed logic",
    time: "2h ago",
    content: "Optimized the JWT handshake. Reduced overhead by 14% by caching the public key in the Redis layer.",
    code: "const verify = async (token) => {\n  const key = await redis.get('pub_key');\n  return jwt.verify(token, key);\n}",
    type: "commit"
  },
  {
    id: "0x2",
    user: "grid_master",
    action: "reviewed",
    time: "1h ago",
    content: "Looks solid. Added a check for key expiry to prevent stale handshakes.",
    type: "comment"
  }
]

function DevTalk() {
  return (
    <div className="flex h-[calc(100vh-12rem)] font-mono border-4 border-primary bg-background shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      
      {/* LEFT: THREAD NAVIGATOR */}
      <aside className="hidden md:flex flex-col w-72 border-r-4 border-primary bg-muted/5">
        <div className="p-4 border-b-2 border-primary bg-primary/10 flex items-center gap-2">
          <GitBranch size={20} weight="bold" className="text-primary" />
          <h3 className="text-[10px] font-black uppercase tracking-widest">Active_Branches</h3>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {TOPICS.map((topic) => (
              <button 
                key={topic.id}
                className={cn(
                  "w-full text-left p-3 border-2 transition-all flex flex-col gap-2 group",
                  topic.active 
                    ? "bg-primary text-primary-foreground border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
                    : "border-transparent hover:border-primary/20 hover:bg-primary/5"
                )}
              >
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className={cn(
                    "rounded-none text-[8px] uppercase font-black px-1 py-0",
                    topic.active ? "border-primary-foreground text-primary-foreground" : "border-primary/30 text-primary"
                  )}>
                    {topic.tag}
                  </Badge>
                  <div className={cn(
                    "w-2 h-2 rounded-none rotate-45",
                    topic.status === 'review' ? 'bg-orange-500' : 'bg-green-500'
                  )} />
                </div>
                <span className="text-[11px] font-black truncate uppercase leading-none">
                  {topic.title}
                </span>
              </button>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t-2 border-primary/10">
          <Button className="w-full rounded-none border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-white font-black uppercase text-[10px] h-10 shadow-[4px_4px_0px_0px_rgba(var(--primary),0.2)]">
            New_Proposal +
          </Button>
        </div>
      </aside>

      {/* RIGHT: DISCUSSION AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="p-4 border-b-2 border-primary bg-background flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <TerminalWindow size={24} weight="duotone" className="text-primary" />
            <div className="flex flex-col">
              <h2 className="text-sm font-black uppercase tracking-tighter">refactor/auth-middleware</h2>
              <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">Status: Under_Review // ID: 882-99-X</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="rounded-none border-2 border-green-600 text-green-600 text-[9px] font-black uppercase h-8 hover:bg-green-600 hover:text-white">
              Approve_Logic
            </Button>
          </div>
        </header>

        <ScrollArea className="flex-1 p-6 bg-[#0a0a0a]">
          <div className="space-y-10 max-w-3xl mx-auto">
            {THREAD.map((log) => (
              <div key={log.id} className="relative pl-8 border-l-2 border-primary/20">
                {/* ICON MARKER */}
                <div className="absolute -left-[11px] top-0 bg-[#0a0a0a] p-1">
                  {log.type === 'commit' ? 
                    <GitCommit size={18} weight="bold" className="text-primary" /> : 
                    <ChatCircleText size={18} weight="bold" className="text-muted-foreground" />
                  }
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                    <span className="text-primary">{log.user}</span>
                    <span className="opacity-30">{log.action}</span>
                    <span className="opacity-20 ml-auto">{log.time}</span>
                  </div>

                  <div className="bg-zinc-900/50 border-2 border-zinc-800 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <p className="text-sm text-zinc-300 font-medium leading-relaxed">
                      {log.content}
                    </p>
                    {log.code && (
                      <div className="mt-4 bg-black p-4 border-l-4 border-primary font-mono text-xs overflow-x-auto text-zinc-400">
                        <pre><code>{log.code}</code></pre>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-4 px-1">
                    <button className="text-[9px] font-black uppercase text-primary hover:underline">Reply</button>
                    <button className="text-[9px] font-black uppercase text-muted-foreground hover:text-white">Upvote_Logic(12)</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* FOOTER INPUT */}
        <footer className="p-4 border-t-4 border-primary bg-background shrink-0">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Code size={18} className="absolute left-3 top-3.5 text-primary opacity-50" />
              <input 
                placeholder="Append technical commentary..." 
                className="w-full bg-muted/10 border-2 border-primary/20 h-12 pl-10 pr-4 text-[11px] font-black uppercase focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <Button className="rounded-none h-12 px-8 bg-primary hover:bg-primary/90 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Push_Comment
            </Button>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default DevTalk