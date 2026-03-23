import { useState, useEffect } from "react"
import {
  UsersThree,
  ShieldCheck,
  Cpu,
  Code,
  IdentificationCard,
  MagnifyingGlass,
  MapPin,
  EnvelopeSimple,
} from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import api from "@/lib/api"
import { toast } from "sonner"

interface Member {
  id: number
  display_name: string
  slug: string
  avatar: string | null
  avatar_url: string | null
  role: string
  bio: string | null
  location: string | null
  website: string | null
  reputation: number
  is_verified: boolean
  user: { username: string; email: string }
}

const FILTER_TABS = ["All_Users", "Developers", "Creators", "Team"] as const
const ROLE_MAP: Record<string, string> = {
  All_Users: "",
  Developers: "DEVELOPER",
  Creators: "CREATOR",
  Team: "TEAM",
}

const ROLE_LABEL: Record<string, string> = {
  DEVELOPER: "Developer",
  CREATOR: "Creator",
  TEAM: "Team",
}

function getRoleIcon(role: string) {
  const r = role?.toUpperCase()
  if (r === "DEVELOPER") return <ShieldCheck size={14} weight="fill" />
  if (r === "CREATOR") return <Code size={14} />
  return <Cpu size={14} />
}

function Members() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState<string>("All_Users")

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true)
      try {
        const res = await api.get("accounts/accounts/")
        setMembers(res.data.results || res.data)
      } catch {
        toast.error("Failed to load member directory")
      } finally {
        setLoading(false)
      }
    }
    fetchMembers()
  }, [])

  const filtered = members.filter((m) => {
    const roleKey = ROLE_MAP[activeFilter]
    const matchesRole = !roleKey || m.role?.toUpperCase() === roleKey
    const matchesSearch =
      !search ||
      (m.display_name || m.user?.username || "").toLowerCase().includes(search.toLowerCase())
    return matchesRole && matchesSearch
  })

  const getInitials = (m: Member) =>
    (m.display_name || m.user?.username || "??").substring(0, 2).toUpperCase()

  const getAvatarSrc = (m: Member) => m.avatar || m.avatar_url || undefined

  return (
    <div className="space-y-10 font-mono pb-20">

      {/* HEADER: DATABASE INDEX */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-primary pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <IdentificationCard size={32} weight="bold" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Personnel_Database</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
            Community_Members
          </h1>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-70">
            Authorized personnel currently registered within the Urbantrends collective.
          </p>
        </div>

        {/* SEARCH CONSOLE */}
        <div className="relative w-full md:w-72">
          <MagnifyingGlass className="absolute left-3 top-3 text-primary" size={18} weight="bold" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search_ID..."
            className="rounded-none border-2 border-primary pl-10 h-11 bg-primary/5 uppercase text-xs font-black focus-visible:ring-0 focus-visible:border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          />
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((filter) => (
          <Button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            variant={activeFilter === filter ? "default" : "outline"}
            className={cn(
              "rounded-none h-8 text-[10px] font-black uppercase px-4 transition-none",
              activeFilter === filter ? "shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" : "border-2 border-primary/20 hover:border-primary"
            )}
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* MEMBERS GRID */}
      {loading ? (
        <div className="flex items-center justify-center p-16">
          <span className="text-xs uppercase tracking-widest opacity-50 font-mono animate-pulse">Loading_Personnel_Data...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex items-center justify-center p-16">
          <span className="text-xs uppercase tracking-widest opacity-50 font-mono">No_Records_Found</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-4">
          {filtered.map((member) => (
            <Card key={member.id} className="rounded-none border-2 border-primary bg-background shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group hover:translate-y-[-4px] hover:translate-x-[-4px] hover:shadow-[10px_10px_0px_0px_rgba(var(--primary),0.2)] transition-all overflow-hidden">
              <CardContent className="p-0">
                {/* TOP STRIP: ID & STATUS */}
                <div className="flex items-center justify-between bg-primary/5 p-3 border-b-2 border-primary/10">
                  <span className="text-[9px] font-black text-muted-foreground tracking-widest uppercase italic">
                    ID: USR-{String(member.id).padStart(3, "0")}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-none",
                      member.is_verified ? "bg-green-500 animate-pulse" : "bg-muted-foreground/40"
                    )} />
                    <span className="text-[9px] font-black uppercase tracking-tighter">
                      {member.is_verified ? "Verified" : "Pending"}
                    </span>
                  </div>
                </div>

                {/* PROFILE BODY */}
                <div className="p-5 flex gap-4">
                  <Avatar className="h-16 w-16 rounded-none border-2 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {getAvatarSrc(member) && (
                      <AvatarImage src={getAvatarSrc(member)} alt={member.display_name || member.user?.username} className="object-cover" />
                    )}
                    <AvatarFallback className="rounded-none font-black text-xl">{getInitials(member)}</AvatarFallback>
                  </Avatar>

                  <div className="space-y-1 overflow-hidden">
                    <h3 className="text-xl font-black uppercase tracking-tighter truncate group-hover:text-primary transition-colors">
                      {member.display_name || member.user?.username}
                    </h3>
                    <div className="flex items-center gap-1.5 text-primary">
                      {getRoleIcon(member.role)}
                      <span className="text-[10px] font-black uppercase tracking-tight">
                        {ROLE_LABEL[member.role?.toUpperCase()] || member.role || "Team"}
                      </span>
                    </div>
                    {member.location && (
                      <div className="flex items-center gap-1.5 text-muted-foreground pt-1">
                        <MapPin size={12} weight="bold" />
                        <span className="text-[9px] font-bold uppercase">{member.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* STATS AREA */}
                <div className="grid grid-cols-2 border-y-2 border-primary/10 bg-muted/5">
                  <div className="p-3 border-r-2 border-primary/10 text-center">
                    <p className="text-[8px] font-black uppercase opacity-50">Reputation</p>
                    <p className="text-sm font-black text-primary italic">+{member.reputation ?? 0}</p>
                  </div>
                  <div className="p-3 text-center">
                    <p className="text-[8px] font-black uppercase opacity-50">Handle</p>
                    <p className="text-sm font-black italic truncate">@{member.user?.username}</p>
                  </div>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="p-3 flex items-center justify-between bg-background">
                  <div className="flex gap-1">
                    <Badge variant="secondary" className="rounded-none text-[8px] font-black uppercase px-1.5 py-0 border border-primary/10">
                      {ROLE_LABEL[member.role?.toUpperCase()] || member.role || "Team"}
                    </Badge>
                    {member.is_verified && (
                      <Badge variant="secondary" className="rounded-none text-[8px] font-black uppercase px-1.5 py-0 border border-primary/10">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none border-2 border-primary/10 hover:border-primary hover:bg-primary hover:text-white transition-all">
                    <EnvelopeSimple size={18} weight="bold" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* RECRUITMENT CARD */}
          <div className="border-2 border-dashed border-primary/30 p-8 flex flex-col items-center justify-center text-center space-y-4 bg-primary/5 group hover:border-solid hover:border-primary transition-all cursor-pointer">
            <UsersThree size={48} className="text-primary/30 group-hover:text-primary transition-colors group-hover:scale-110" weight="duotone" />
            <div className="space-y-1">
              <h3 className="text-sm font-black uppercase tracking-widest">Expand Collective</h3>
              <p className="text-[9px] font-bold text-muted-foreground uppercase leading-tight">
                Invite trusted architects <br /> to the system core.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Members
