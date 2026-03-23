import { useState, useEffect } from "react"
import {
  PushPin,
  CalendarBlank,
  UserCircle,
  SealCheck,
  ArrowSquareOut,
  WarningOctagon,
  Broadcast,
  CaretUp
} from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import { toast } from "sonner"

interface Announcement {
  id: number
  title: string
  content: string
  category: string
  author: {
    username: string
    display_name: string
    avatar_url: string | null
  }
  priority: string
  is_pinned: boolean
  created_at: string
  updated_at: string
}

function Announcement() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true)
      try {
        const res = await api.get("api/announcements/")
        setAnnouncements(res.data.results || res.data)
      } catch {
        toast.error("Failed to load announcements")
      } finally {
        setLoading(false)
      }
    }
    fetchAnnouncements()
  }, [])

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).toUpperCase()
  }

  const pinnedAnnouncement = announcements.find((a) => a.is_pinned)

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
            <p className="text-[10px] font-black uppercase">Total_Broadcasts</p>
            <p className="text-xl font-black text-primary">{announcements.length}</p>
          </div>
          <Separator orientation="vertical" className="h-10 bg-primary/20" />
          <div className="text-right">
            <p className="text-[10px] font-black uppercase">Node_Status</p>
            <p className="text-xl font-black text-green-500 underline decoration-2 decoration-green-500/30">ONLINE</p>
          </div>
        </div>
      </div>

      {/* PINNED / IMPORTANT NOTICE */}
      {pinnedAnnouncement ? (
        <div className="bg-primary text-primary-foreground p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
          <div className="absolute top-[-10px] right-[-10px] opacity-10 rotate-12 transition-transform group-hover:rotate-0">
            <WarningOctagon size={120} weight="fill" />
          </div>
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-black/20 w-fit px-2 py-1">
              <PushPin weight="fill" /> Pinned_Directive
            </div>
            <h2 className="text-xl font-black uppercase">{pinnedAnnouncement.title}</h2>
            <p className="text-sm font-bold opacity-90 max-w-2xl">
              {pinnedAnnouncement.content}
            </p>
          </div>
        </div>
      ) : !loading && (
        <div className="bg-primary text-primary-foreground p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
          <div className="absolute top-[-10px] right-[-10px] opacity-10 rotate-12 transition-transform group-hover:rotate-0">
            <WarningOctagon size={120} weight="fill" />
          </div>
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-black/20 w-fit px-2 py-1">
              <PushPin weight="fill" /> Important_Directive
            </div>
            <h2 className="text-xl font-black uppercase">Welcome to Urbantrends Community</h2>
            <p className="text-sm font-bold opacity-90 max-w-2xl">
              Stay tuned for system updates, community events, and critical directives from the admin collective.
            </p>
          </div>
        </div>
      )}

      {/* ANNOUNCEMENT FEED */}
      {loading ? (
        <div className="flex items-center justify-center p-16">
          <span className="text-xs uppercase tracking-widest opacity-50 font-mono animate-pulse">Receiving_Transmissions...</span>
        </div>
      ) : announcements.length === 0 ? (
        <div className="flex items-center justify-center p-16">
          <span className="text-xs uppercase tracking-widest opacity-50 font-mono">No_Broadcasts_Found</span>
        </div>
      ) : (
        <div className="grid gap-8">
          {announcements.map((post) => (
            <Card key={post.id} className="rounded-none border-2 border-primary bg-background shadow-[4px_4px_0px_0px_rgba(var(--primary),0.1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
              <CardHeader className="border-b-2 border-muted/50 p-6 flex flex-row items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="rounded-none border-2 border-primary text-[9px] font-black uppercase px-2">
                      {post.category}
                    </Badge>
                    {post.priority?.toUpperCase() === "CRITICAL" && (
                      <Badge className="rounded-none bg-destructive text-destructive-foreground text-[9px] font-black uppercase px-2 animate-pulse">
                        Critical
                      </Badge>
                    )}
                    {post.is_pinned && (
                      <Badge className="rounded-none bg-orange-500 text-white text-[9px] font-black uppercase px-2">
                        Pinned
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl font-black uppercase tracking-tight hover:text-primary transition-colors cursor-pointer">
                    {post.title}
                  </CardTitle>
                </div>
                <div className="text-right font-bold text-[10px] opacity-40">
                  REF_ID: UA-{String(post.id).padStart(3, "0")}
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <p className="text-sm leading-relaxed text-muted-foreground font-medium">
                  {expandedIds.has(post.id)
                    ? post.content
                    : post.content.length > 200
                    ? post.content.substring(0, 200) + "..."
                    : post.content}
                </p>
              </CardContent>

              <CardFooter className="p-4 bg-muted/10 border-t-2 border-muted/50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase">
                    <UserCircle size={18} weight="bold" className="text-primary" />
                    {post.author?.display_name || post.author?.username || "System"}
                    <SealCheck size={14} weight="fill" className="text-blue-500" />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-60">
                    <CalendarBlank size={18} weight="bold" />
                    {formatDate(post.created_at)}
                  </div>
                </div>

                {post.content.length > 200 && (
                  <Button
                    onClick={() => toggleExpand(post.id)}
                    variant="outline"
                    className="rounded-none border-2 border-black font-black uppercase text-[10px] gap-2 h-8 px-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    {expandedIds.has(post.id) ? (
                      <>Collapse_Log <CaretUp weight="bold" /></>
                    ) : (
                      <>Read_Full_Log <ArrowSquareOut weight="bold" /></>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

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