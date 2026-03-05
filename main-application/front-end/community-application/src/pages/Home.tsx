import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { 
  Brain, PaperPlaneRight, TerminalWindow, XCircle, Sparkle,
  Copy, Check, ClockCounterClockwise as HistoryIcon, TrendUp, Gear,
  ChatCircle, ArrowFatUp, UsersFour, Plus, LockKeyOpen
} from "@phosphor-icons/react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, DialogContent, DialogClose 
} from "@/components/ui/dialog"
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-context"

interface QueryHistory {
  id: number;
  prompt: string;
  response: string;
  category: string;
  created_at: string;
}

function Home() {
  const { user } = useAuth() // 2. Access global auth state
  const [prompt, setPrompt] = useState("")
  const [category, setCategory] = useState("general")
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [history, setHistory] = useState<QueryHistory[]>([])
  const [copied, setCopied] = useState(false)

  const trendingData = [
    { id: 1, title: "Optimizing Multi-Tenant Data Isolation", author: "arch_vince", replies: 42, upvotes: 128, cat: "Backend" },
    { id: 2, title: "React Server Components in Urban Mapping", author: "grid_master", replies: 15, upvotes: 89, cat: "Frontend" },
    { id: 3, title: "Is Redis still the king of geo-caching?", author: "data_flow", replies: 67, upvotes: 210, cat: "Database" },
  ]

  const fetchHistory = async () => {
    if (!user) return // 3. Prevent API calls if not authenticated
    setHistoryLoading(true)
    try {
      const res = await api.get("api/ai/queries/")
      setHistory(res.data)
    } catch (err) { console.error("Sync error:", err) }
    finally { setHistoryLoading(false) }
  }

  useEffect(() => { fetchHistory() }, [user])

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return
    setLoading(true)
    try {
      const res = await api.post("api/ai/queries/", { prompt, category })
      setAiResponse(res.data.response)
      setPrompt("")
      if (user) fetchHistory() 
    } catch (err: any) {
      toast.error("AI Protocol Failed.")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!aiResponse) return
    navigator.clipboard.writeText(aiResponse)
    setCopied(true)
    toast.success("Blueprint Copied")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn(
      "flex flex-col lg:flex-row max-w-[1400px] mx-auto gap-0 lg:gap-10 font-mono pb-20 px-4 transition-all duration-500",
      !user && "justify-center" // Center main content if no user
    )}>
      
      {/* SIDEBAR: PROJECT ARCHIVE (Only visible if user is logged in) */}
      {user && (
        <aside className="w-full lg:w-80 space-y-4 pt-10 border-b lg:border-b-0 lg:border-r border-primary/10 pb-6 lg:pb-0 lg:pr-6 animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              <HistoryIcon size={18} weight="bold" /> Project_Archive
            </div>
            {historyLoading && <Loader2 size={12} className="animate-spin" />}
          </div>

          <div className="flex flex-col gap-3 max-h-[300px] lg:max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
            {history.length === 0 && !historyLoading && (
               <div className="p-4 border-2 border-dashed text-[10px] text-center opacity-50 uppercase font-bold">Log_Buffer_Empty</div>
            )}
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => setAiResponse(item.response)}
                className="w-full text-left p-3 border-2 border-muted hover:border-primary bg-background shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)] transition-all group"
              >
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="rounded-none text-[8px] uppercase px-1 py-0 border-primary/30 text-primary">
                    {item.category || 'General'}
                  </Badge>
                  <span className="text-[8px] opacity-40 font-bold">{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
                <span className="text-[11px] font-bold block truncate uppercase tracking-tighter group-hover:text-primary">
                  {item.prompt}
                </span>
              </button>
            ))}
          </div>
        </aside>
      )}

      {/* MAIN CONTENT */}
      <main className={cn(
        "flex-1 space-y-10 pt-10 transition-all duration-500",
        user ? "max-w-4xl" : "max-w-3xl mx-auto" // Center and tighten width if logged out
      )}>
        <section className="space-y-8">
          <div className="flex items-center justify-between px-1">
            <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary">
              <Brain weight="duotone" size={24} />
              Architect_System_Core
            </h2>
            {!user && (
              <Badge className="rounded-none border-2 border-orange-500/50 bg-orange-500/5 text-orange-600 text-[9px] font-black uppercase gap-1.5 px-2 py-1">
                <LockKeyOpen size={12} weight="bold" /> Restricted_Access
              </Badge>
            )}
          </div>

          <div className="space-y-12">
            {/* AI INPUT FORM */}
            <form onSubmit={handleAskAI} className="space-y-3">
              <div className="flex p-2 w-full items-center gap-2 bg-background shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-2 border-primary">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-[140px] rounded-none border-r-2 border-y-0 border-l-0 border-primary h-12 focus:ring-0 uppercase font-black text-[10px] bg-primary/5">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-2 border-primary font-mono uppercase text-[10px]">
                    <SelectItem value="general"># General</SelectItem>
                    <SelectItem value="frontend"># Frontend</SelectItem>
                    <SelectItem value="backend"># Backend</SelectItem>
                    <SelectItem value="database"># Database</SelectItem>
                    <SelectItem value="devops"># Devops</SelectItem>
                  </SelectContent>
                </Select>

                <Input 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={loading}
                  placeholder={user ? "System query: i.e. structure for micro-services..." : "Login to archive your blueprints..."} 
                  className="rounded-none border-0 focus-visible:ring-0 h-12 bg-transparent text-sm placeholder:opacity-40 font-bold"
                />
                <Button type="submit" disabled={loading} className="rounded-none h-12 w-12 shrink-0 transition-none hover:bg-primary/90">
                  {loading ? <Loader2 className="animate-spin" /> : <PaperPlaneRight size={20} weight="bold" />}
                </Button>
              </div>
              <p className="text-[9px] uppercase font-bold text-muted-foreground ml-1 flex items-center gap-2">
                <span className={cn("w-1.5 h-1.5 rounded-full", user ? "bg-green-500 animate-pulse" : "bg-orange-500")} />
                Handshake: {user ? "Authenticated" : "Guest_Session"} // Classification: {category}
              </p>
            </form>

            {/* TRENDING SECTION */}
            <div className="border-t-2 border-primary/10 pt-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                    <TrendUp size={28} weight="bold" className="text-primary" /> Trending_Insights
                  </h2>
                  <p className="text-sm text-muted-foreground leading-tight max-w-md italic">
                    Latest architectural patterns and system optimizations from the collective.
                  </p>
                </div>
                <Button variant="outline" className="rounded-none border-2 border-primary font-black uppercase text-[11px] gap-2 h-10 px-6 transition-none shadow-[4px_4px_0px_0px_rgba(var(--primary),0.2)] hover:bg-primary hover:text-white">
                  <Gear size={16} weight="bold" /> Customize Feed
                </Button>
              </div>

              {/* TRENDING GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trendingData.map((post) => (
                  <Card key={post.id} className="rounded-none border-2 border-muted hover:border-primary transition-all group bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3">
                      <Badge className="rounded-none text-[8px] font-black uppercase bg-primary/10 text-primary border-none">
                        {post.cat}
                      </Badge>
                    </div>
                    <CardHeader className="p-5">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase mb-2">
                        <UsersFour size={14} weight="bold" /> {post.author}
                      </div>
                      <h3 className="text-sm font-black uppercase leading-tight group-hover:text-primary transition-colors cursor-pointer">
                        {post.title}
                      </h3>
                    </CardHeader>
                    <CardFooter className="p-3 border-t-2 border-muted/50 flex items-center gap-5 bg-muted/5">
                      <div className="flex items-center gap-1.5 text-[10px] font-black">
                        <ArrowFatUp size={16} weight="bold" className="text-primary" /> {post.upvotes}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-black">
                        <ChatCircle size={16} weight="bold" /> {post.replies}
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto rounded-none h-8 text-[9px] font-black uppercase hover:bg-primary hover:text-white transition-none">
                        View_Blueprint
                      </Button>
                    </CardFooter>
                  </Card>
                ))}

                {/* CALL TO ACTION CARD */}
                <Card className="rounded-none border-2 border-dashed border-primary/30 flex flex-col items-center justify-center p-8 text-center space-y-4 bg-primary/5 group hover:border-solid hover:border-primary transition-all cursor-pointer">
                  <div className="p-3 bg-primary/10 rounded-none border-2 border-primary/20 group-hover:scale-110 transition-transform">
                    <Plus size={24} weight="bold" className="text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black uppercase tracking-widest">Contribute Logic</h4>
                    <p className="text-[10px] text-muted-foreground uppercase leading-tight font-bold">
                      Upload your architectural <br /> solutions to the grid.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* MODAL */}
        <Dialog open={!!aiResponse} onOpenChange={(open) => !open && setAiResponse(null)}>
  <DialogContent className="max-w-4xl w-[95vw] rounded-none border-4 border-primary p-0 bg-background shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] gap-0 overflow-hidden">
    
    {/* HEADER SECTION */}
    <div className="flex items-center justify-between bg-primary p-4 text-primary-foreground border-b-2 border-primary">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
        <TerminalWindow size={20} weight="bold" /> Output_Stream_v2.5
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={handleCopy} variant="ghost" size="sm" className="h-8 gap-2 text-[10px] font-black uppercase hover:bg-white/20 text-primary-foreground transition-none">
          {copied ? <Check weight="bold" /> : <Copy weight="bold" />} {copied ? "Stored" : "Copy_Logic"}
        </Button>
        <DialogClose asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-white/20 transition-none">
            <XCircle size={22} weight="bold" />
          </Button>
        </DialogClose>
      </div>
    </div>

    {/* CONTENT SECTION: Changed to ensure high contrast in both modes */}
    <div className="p-8 max-h-[70vh] overflow-y-auto bg-[#0a0a0a] selection:bg-primary selection:text-primary-foreground">
      <div className="prose prose-zinc prose-invert max-w-none text-sm font-sans leading-relaxed text-zinc-100 prose-headings:text-white prose-strong:text-white prose-code:text-primary prose-pre:bg-zinc-900 prose-pre:border-2 prose-pre:border-white/10">
        <ReactMarkdown>{aiResponse || ""}</ReactMarkdown>
      </div>
    </div>
    
  </DialogContent>
</Dialog>
      </main>
    </div>
  )
}

export default Home