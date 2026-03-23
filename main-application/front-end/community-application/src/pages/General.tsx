import { useState, useEffect, useRef } from "react"
import {
  PaperPlaneRight,
  Hash,
  Circle,
  UsersThree,
  ShieldCheck,
  Cpu,
  Code
} from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import api from "@/lib/api"
import { toast } from "sonner"
import { useAuth } from "@/components/auth-context"

interface Discussion {
  id: number
  title: string
  content: string
  category: string
  author: { username: string; display_name: string }
  comment_count: number
  is_resolved: boolean
  created_at: string
}

interface Member {
  id: number
  display_name: string
  role: "DEVELOPER" | "CREATOR" | "TEAM" | string
  is_verified: boolean
  user: { username: string }
}

const ROLE_LABEL: Record<string, string> = {
  DEVELOPER: "Developer",
  CREATOR: "Creator",
  TEAM: "Team",
}

function getRoleIcon(role: string) {
  const r = role?.toUpperCase()
  if (r === "DEVELOPER") return <ShieldCheck size={10} weight="fill" />
  if (r === "CREATOR") return <Code size={10} />
  return <Cpu size={10} />
}

function General() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Discussion[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const feedEndRef = useRef<HTMLDivElement>(null)

  const fetchMessages = async () => {
    try {
      const res = await api.get("api/discussions/?category=GENERAL")
      setMessages(res.data.results || res.data)
    } catch {
      toast.error("Failed to load chat")
    } finally {
      setLoading(false)
    }
  }

  const fetchMembers = async () => {
    try {
      const res = await api.get("accounts/accounts/")
      setMembers(res.data.results || res.data)
    } catch {
      // silent fail for sidebar
    }
  }

  useEffect(() => {
    fetchMessages()
    fetchMembers()
  }, [])

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    setSending(true)
    try {
      await api.post("api/discussions/", {
        title: input.substring(0, 100),
        content: input,
        category: "GENERAL",
      })
      setInput("")
      await fetchMessages()
    } catch {
      toast.error("Failed to send message")
    } finally {
      setSending(false)
    }
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
  }

  const getInitials = (name: string) => (name || "??").substring(0, 2).toUpperCase()

  // Separate online-like states from member list
  const onlineMembers = members.filter((m) => m.is_verified)
  const offlineMembers = members.filter((m) => !m.is_verified)

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
          <Badge className="rounded-none text-[9px] font-black uppercase bg-primary/10 text-primary border-none">
            {messages.length} messages
          </Badge>
        </header>

        {/* CHAT FEED */}
        <ScrollArea className="flex-1 p-6 bg-[#fafafa] dark:bg-[#0c0c0c]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-xs uppercase tracking-widest opacity-50 font-mono animate-pulse">Loading_Transmissions...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-xs uppercase tracking-widest opacity-50 font-mono">Channel_Empty — Start_Transmission</span>
            </div>
          ) : (
            <div className="space-y-8 max-w-4xl mx-auto">
              {messages.map((msg) => {
                const isMe = msg.author?.username === user?.username
                const authorName = msg.author?.display_name || msg.author?.username || "Unknown"
                return (
                  <div key={msg.id} className={cn("flex gap-4 group", isMe ? "flex-row-reverse" : "flex-row")}>
                    <Avatar className="rounded-none border-2 border-primary h-10 w-10 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      <AvatarFallback className="rounded-none font-black text-xs">{getInitials(authorName)}</AvatarFallback>
                    </Avatar>
                    <div className={cn("flex flex-col space-y-1 max-w-[80%]", isMe ? "items-end" : "items-start")}>
                      <div className="flex items-center gap-2 px-1 text-[10px] font-black uppercase tracking-tighter">
                        <span>{authorName}</span>
                        <span className="opacity-30">{formatTime(msg.created_at)}</span>
                      </div>
                      <div className={cn(
                        "p-4 text-sm font-medium border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all",
                        isMe ? "bg-primary text-primary-foreground border-primary" : "bg-background border-primary/20"
                      )}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={feedEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* INPUT CONSOLE */}
        <div className="p-4 border-t-4 border-primary bg-background shrink-0">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={sending}
              placeholder="Execute transmission..."
              className="rounded-none border-2 border-primary/20 focus-visible:ring-0 focus-visible:border-primary h-12 bg-muted/10 font-bold uppercase text-xs placeholder:opacity-30"
            />
            <Button
              type="submit"
              disabled={sending || !input.trim()}
              className="rounded-none h-12 px-6 bg-primary hover:bg-primary/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
            >
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
            {members.length}
          </Badge>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* VERIFIED MEMBERS */}
            {onlineMembers.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-[9px] font-black uppercase text-muted-foreground/60 tracking-[0.2em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-none bg-green-500" />
                  verified_Directory
                </h4>
                <div className="space-y-1">
                  {onlineMembers.map((member) => (
                    <button key={member.id} className="w-full flex items-center gap-3 p-2 hover:bg-primary/10 transition-colors group relative border-l-2 border-transparent hover:border-primary">
                      <div className="relative">
                        <Avatar className="h-8 w-8 rounded-none border-2 border-primary/20 group-hover:border-primary transition-colors">
                          <AvatarFallback className="text-[10px] font-black rounded-none">
                            {getInitials(member.display_name || member.user?.username)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-background" />
                      </div>
                      <div className="flex flex-col items-start overflow-hidden">
                        <span className="text-[11px] font-black uppercase truncate tracking-tighter group-hover:text-primary transition-colors">
                          {member.display_name || member.user?.username}
                        </span>
                        <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                          {getRoleIcon(member.role)}
                          <span className="text-[8px] font-black uppercase">{ROLE_LABEL[member.role?.toUpperCase()] || member.role || "Team"}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* OTHER MEMBERS */}
            {offlineMembers.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-[9px] font-black uppercase text-muted-foreground/60 tracking-[0.2em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-none bg-muted-foreground/30" />
                  other_Directory
                </h4>
                <div className="space-y-1">
                  {offlineMembers.map((member) => (
                    <button key={member.id} className="w-full flex items-center gap-3 p-2 hover:bg-primary/10 transition-colors group relative border-l-2 border-transparent hover:border-primary">
                      <Avatar className="h-8 w-8 rounded-none border-2 border-primary/20 group-hover:border-primary transition-colors">
                        <AvatarFallback className="text-[10px] font-black rounded-none">
                          {getInitials(member.display_name || member.user?.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start overflow-hidden">
                        <span className="text-[11px] font-black uppercase truncate tracking-tighter group-hover:text-primary transition-colors">
                          {member.display_name || member.user?.username}
                        </span>
                        <div className="flex items-center gap-1 opacity-40">
                          {getRoleIcon(member.role)}
                          <span className="text-[8px] font-black uppercase">{ROLE_LABEL[member.role?.toUpperCase()] || member.role || "Team"}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* FOOTER STATS */}
        <div className="p-4 border-t-2 border-primary/10 bg-black/5">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[8px] font-black uppercase">
              <span className="opacity-40">Total_Members</span>
              <span className="text-primary">{members.length}</span>
            </div>
            <div className="h-1 w-full bg-muted overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${Math.min((onlineMembers.length / Math.max(members.length, 1)) * 100, 100)}%` }} />
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default General