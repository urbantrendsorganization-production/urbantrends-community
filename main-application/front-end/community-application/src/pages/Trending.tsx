import { 
  TrendUp, 
  Fire, 
  ChartLineUp, 
  ArrowsClockwise, 
  Eye, 
  ChatCircle, 
  Browser,
  Database,
  Lightning
} from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const TRENDING_METRICS = [
  { 
    id: 1, 
    title: "Edge-Runtime Geo-Caching", 
    growth: "+142%", 
    views: "12.4k", 
    replies: 89, 
    category: "Infrastructure",
    heat: 85,
    icon: Lightning,
    description: "New benchmarks showing 40ms reduction in TTFB using distributed V8 isolates."
  },
  { 
    id: 2, 
    title: "Vector-Sharding Strategies", 
    growth: "+89%", 
    views: "8.1k", 
    replies: 156, 
    category: "Database",
    heat: 62,
    icon: Database,
    description: "Discussion on horizontal scaling for high-dimensional embedding stores."
  },
  { 
    id: 3, 
    title: "Micro-Frontend Orchestration", 
    growth: "+44%", 
    views: "5.2k", 
    replies: 42, 
    category: "Frontend",
    heat: 30,
    icon: Browser,
    description: "Standardizing the handshake between Module Federation and Next.js 15."
  }
]

function Trending() {
  function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }
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

        <div className="flex items-center gap-2 bg-primary/5 border-2 border-primary/20 p-2">
          <ArrowsClockwise size={16} className="text-primary animate-spin-slow" />
          <span className="text-[10px] font-black uppercase tracking-tight">Auto-Refresh: 60s</span>
        </div>
      </div>

      {/* TOP ANALYTICS STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Active_Queries", val: "1,204/hr", icon: ChartLineUp },
          { label: "System_Heat", val: "CRITICAL", icon: Fire, color: "text-orange-500" },
          { label: "Data_Throughput", val: "4.2 GB/s", icon: Lightning },
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
        {TRENDING_METRICS.map((item) => (
          <Card key={item.id} className="rounded-none border-4 border-primary bg-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_0px_rgba(var(--primary),0.3)] transition-all group overflow-hidden">
            <CardHeader className="p-6 border-b-2 border-primary/10 relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <item.icon size={80} weight="duotone" />
              </div>
              
              <div className="flex justify-between items-start mb-4">
                <Badge className="rounded-none bg-primary text-primary-foreground text-[10px] font-black uppercase px-2 py-0.5">
                  {item.category}
                </Badge>
                <div className="flex items-center gap-1 text-green-500 font-black text-xs">
                  <TrendUp size={16} weight="bold" /> {item.growth}
                </div>
              </div>
              
              <CardTitle className="text-2xl font-black uppercase tracking-tight leading-none mb-2">
                {item.title}
              </CardTitle>
              <p className="text-xs text-muted-foreground font-bold leading-relaxed max-w-[85%] italic">
                {item.description}
              </p>
            </CardHeader>

            <CardContent className="p-6 space-y-4 bg-primary/5">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-black uppercase">
                  <span>Logic_Heat_Index</span>
                  <span className={cn(item.heat > 70 ? "text-orange-500" : "text-primary")}>{item.heat}%</span>
                </div>
                <Progress value={item.heat} className="h-2 rounded-none bg-primary/20 border border-primary/10" />
              </div>
            </CardContent>

            <CardFooter className="p-4 border-t-2 border-primary/10 flex items-center justify-between bg-background">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase opacity-60">
                  <Eye size={16} weight="bold" /> {item.views}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase opacity-60">
                  <ChatCircle size={16} weight="bold" /> {item.replies}
                </div>
              </div>
              <Button variant="ghost" className="rounded-none border-2 border-primary h-9 font-black uppercase text-[10px] gap-2 px-4 hover:bg-primary hover:text-white transition-none">
                Inspect_Blueprint <Lightning weight="fill" />
              </Button>
            </CardFooter>
          </Card>
        ))}

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
    </div>
  )
}

export default Trending