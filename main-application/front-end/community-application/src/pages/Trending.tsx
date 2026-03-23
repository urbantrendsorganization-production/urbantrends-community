import { useState, useEffect, useCallback } from "react"
import {
  TrendUp,
  Fire,
  ChartLineUp,
  ArrowsClockwise,
  Eye,
  ChatCircle,
  Lightning
} from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import api from "@/lib/api"
import { toast } from "sonner"

interface TrendingDiscussion {
  id: number
  title: string
  content: string
  category: string
  author: { username: string; display_name: string }
  comment_count: number
  created_at: string
}

interface ActiveMember {
  username: string
  display_name: string
  comment_count: number
}

interface TrendingData {
  trending_discussions: TrendingDiscussion[]
  active_members: ActiveMember[]
  recent_announcements: { id: number; title: string; priority: string; created_at: string }[]
}

function Trending() {
  const [data, setData] = useState<TrendingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [countdown, setCountdown] = useState(60)

  const fetchTrending = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)
    try {
      const res = await api.get("api/trending/")
      setData(res.data)
      setCountdown(60)
    } catch {
      if (!silent) toast.error("Failed to load trending data")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchTrending()
  }, [fetchTrending])

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      fetchTrending(true)
    }, 60000)
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 60 : prev - 1))
    }, 1000)
    return () => {
      clearInterval(refreshInterval)
      clearInterval(countdownInterval)
    }
  }, [fetchTrending])

  const discussions = data?.trending_discussions || []
  const activeMembers = data?.active_members || []

  // Compute heat index based on comment count relative to max
  const maxComments = Math.max(...discussions.map((d) => d.comment_count), 1)
  const getHeat = (count: number) => Math.round((count / maxComments) * 100)

  return (
    <div className="space-y-10 font-mono pb-20">

      {/* VELOCITY HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-primary pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <TrendUp size={32} weight="bold" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Market_Velocity</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
            Trending_Now
          </h1>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-70">
            Real-time analysis of architectural heat levels across the global grid.
          </p>
        </div>

        <button
          onClick={() => fetchTrending(true)}
          className="flex items-center gap-2 bg-primary/5 border-2 border-primary/20 p-2 hover:border-primary transition-colors cursor-pointer"
        >
          <ArrowsClockwise size={16} className={cn("text-primary", refreshing && "animate-spin")} />
          <span className="text-[10px] font-black uppercase tracking-tight">Auto-Refresh: {countdown}s</span>
        </button>
      </div>

      {/* TOP ANALYTICS STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Trending_Topics", val: String(discussions.length), icon: ChartLineUp },
          { label: "Active_Contributors", val: String(activeMembers.length), icon: Fire, color: activeMembers.length > 3 ? "text-orange-500" : undefined },
          { label: "System_Heat", val: discussions.length > 0 ? "ACTIVE" : "IDLE", icon: Lightning },
        ].map((stat, i) => (
          <div key={i} className="border-2 border-primary p-4 bg-background shadow-[4px_4px_0px_0px_rgba(var(--primary),1)]">
            <div className="flex items-center gap-2 mb-1 opacity-50">
              <stat.icon size={14} weight="bold" />
              <span className="text-[9px] font-black uppercase">{stat.label}</span>
            </div>
            <div className={cn("text-xl font-black uppercase italic", stat.color)}>
              {stat.val}
            </div>
          </div>
        ))}
      </div>

      {/* TRENDING GRID */}
      {loading ? (
        <div className="flex items-center justify-center p-16">
          <span className="text-xs uppercase tracking-widest opacity-50 font-mono animate-pulse">Calculating_Velocity...</span>
        </div>
      ) : discussions.length === 0 ? (
        <div className="flex items-center justify-center p-16">
          <span className="text-xs uppercase tracking-widest opacity-50 font-mono">No_Trending_Data_Available</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
          {discussions.map((item) => {
            const heat = getHeat(item.comment_count)
            return (
              <Card key={item.id} className="rounded-none border-4 border-primary bg-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_0px_rgba(var(--primary),0.3)] transition-all group overflow-hidden">
                <CardHeader className="p-6 border-b-2 border-primary/10 relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Lightning size={80} weight="duotone" />
                  </div>

                  <div className="flex justify-between items-start mb-4">
                    <Badge className="rounded-none bg-primary text-primary-foreground text-[10px] font-black uppercase px-2 py-0.5">
                      {item.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-green-500 font-black text-xs">
                      <TrendUp size={16} weight="bold" /> {item.comment_count} replies
                    </div>
                  </div>

                  <CardTitle className="text-2xl font-black uppercase tracking-tight leading-none mb-2">
                    {item.title}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground font-bold leading-relaxed max-w-[85%] italic">
                    {item.content.length > 120 ? item.content.substring(0, 120) + "..." : item.content}
                  </p>
                </CardHeader>

                <CardContent className="p-6 space-y-4 bg-primary/5">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-black uppercase">
                      <span>Logic_Heat_Index</span>
                      <span className={cn(heat > 70 ? "text-orange-500" : "text-primary")}>{heat}%</span>
                    </div>
                    <Progress value={heat} className="h-2 rounded-none bg-primary/20 border border-primary/10" />
                  </div>
                </CardContent>

                <CardFooter className="p-4 border-t-2 border-primary/10 flex items-center justify-between bg-background">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase opacity-60">
                      <Eye size={16} weight="bold" /> {item.author?.display_name || item.author?.username}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase opacity-60">
                      <ChatCircle size={16} weight="bold" /> {item.comment_count}
                    </div>
                  </div>
                  <Button variant="ghost" className="rounded-none border-2 border-primary h-9 font-black uppercase text-[10px] gap-2 px-4 hover:bg-primary hover:text-white transition-none">
                    Inspect_Blueprint <Lightning weight="fill" />
                  </Button>
                </CardFooter>
              </Card>
            )
          })}

          {/* PROMOTION CARD */}
          <div className="lg:col-span-2 border-4 border-dashed border-primary/30 p-8 flex flex-col items-center justify-center text-center space-y-4 bg-primary/5 group hover:border-solid hover:border-primary transition-all">
            <Fire size={48} className="text-primary/40 group-hover:text-primary transition-colors" weight="duotone" />
            <div className="space-y-1">
              <h3 className="text-xl font-black uppercase italic">Submit_Your_Logic</h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Have a high-performance pattern? Upload to the grid and start trending.
              </p>
            </div>
            <Button className="rounded-none font-black uppercase h-12 px-10 bg-primary shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              Deploy_Pattern
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Trending