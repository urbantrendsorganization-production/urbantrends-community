import { 
  PushPin, 
  CalendarBlank, 
  UserCircle, 
  SealCheck,
  ArrowSquareOut,
  WarningOctagon,
  Broadcast
} from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

const ANNOUNCEMENTS = [
  {
    id: "UA-102",
    title: "v2.5 System Handshake: AI Core Integration",
    date: "MAR 05, 2026",
    author: "ADMIN_ARCHITECT",
    content: "The Architect System Core is now live for all members. This update introduces dynamic history archiving and optimized context switching for backend blueprints.",
    type: "SYSTEM_UPDATE",
    priority: "CRITICAL"
  },
  {
    id: "UA-101",
    title: "Community Guidelines: Logic Over Rhetoric",
    date: "FEB 28, 2026",
    author: "MOD_GRID",
    content: "A reminder to all contributors: please tag your blueprints correctly (#frontend, #devops) to ensure the indexer can route queries efficiently.",
    type: "GENERAL",
    priority: "STABLE"
  }
]

function Announcement() {
  return (
    <div className="space-y-10 font-mono pb-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-primary pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Broadcast size={32} weight="fill" className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Live_Transmission</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">
            Announcements
          </h1>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-70">
            Source: Urbantrends_Logic_Gate // Frequency: High_Priority
          </p>
        </div>

        {/* STATUS STAMP */}
        <div className="hidden lg:flex items-center gap-4 border-2 border-dashed border-primary/30 p-4 bg-primary/5">
          <div className="text-right">
            <p className="text-[10px] font-black uppercase">System_Uptime</p>
            <p className="text-xl font-black text-primary">99.98%</p>
          </div>
          <Separator orientation="vertical" className="h-10 bg-primary/20" />
          <div className="text-right">
            <p className="text-[10px] font-black uppercase">Node_Status</p>
            <p className="text-xl font-black text-green-500 underline decoration-2 decoration-green-500/30">ONLINE</p>
          </div>
        </div>
      </div>

      {/* PINNED / IMPORTANT NOTICE */}
      <div className="bg-primary text-primary-foreground p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
        <div className="absolute top-[-10px] right-[-10px] opacity-10 rotate-12 transition-transform group-hover:rotate-0">
          <WarningOctagon size={120} weight="fill" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-black/20 w-fit px-2 py-1">
            <PushPin weight="fill" /> Important_Directive
          </div>
          <h2 className="text-xl font-black uppercase">Scheduled Maintenance: Node_Recluster</h2>
          <p className="text-sm font-bold opacity-90 max-w-2xl">
            Grid synchronization will be intermittent on Sunday at 04:00 UTC. Ensure all current blueprints are saved to local project archives.
          </p>
        </div>
      </div>

      {/* ANNOUNCEMENT FEED */}
      <div className="grid gap-8">
        {ANNOUNCEMENTS.map((post) => (
          <Card key={post.id} className="rounded-none border-2 border-primary bg-background shadow-[4px_4px_0px_0px_rgba(var(--primary),0.1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
            <CardHeader className="border-b-2 border-muted/50 p-6 flex flex-row items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="rounded-none border-2 border-primary text-[9px] font-black uppercase px-2">
                    {post.type}
                  </Badge>
                  {post.priority === "CRITICAL" && (
                    <Badge className="rounded-none bg-destructive text-destructive-foreground text-[9px] font-black uppercase px-2 animate-pulse">
                      Critical
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-2xl font-black uppercase tracking-tight hover:text-primary transition-colors cursor-pointer">
                  {post.title}
                </CardTitle>
              </div>
              <div className="text-right font-bold text-[10px] opacity-40">
                REF_ID: {post.id}
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <p className="text-sm leading-relaxed text-muted-foreground font-medium">
                {post.content}
              </p>
            </CardContent>

            <CardFooter className="p-4 bg-muted/10 border-t-2 border-muted/50 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase">
                  <UserCircle size={18} weight="bold" className="text-primary" />
                  {post.author}
                  <SealCheck size={14} weight="fill" className="text-blue-500" />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-60">
                  <CalendarBlank size={18} weight="bold" />
                  {post.date}
                </div>
              </div>
              
              <Button variant="outline" className="rounded-none border-2 border-black font-black uppercase text-[10px] gap-2 h-8 px-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                Read_Full_Log <ArrowSquareOut weight="bold" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* FOOTER PAGINATION/STATUS */}
      <div className="text-center pt-10">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20">
          End_of_Transmission_Archive_v1.0
        </p>
      </div>
    </div>
  )
}

export default Announcement