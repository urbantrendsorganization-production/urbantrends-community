import { 
  UsersThree, 
  ShieldCheck, 
  Cpu, 
  IdentificationCard, 
  MagnifyingGlass,
  MapPin,
  EnvelopeSimple,
} from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const MEMBER_DIRECTORY = [
  {
    id: "USR-001",
    name: "Arch_Vince",
    role: "System Admin",
    status: "Active",
    location: "Node_London",
    blueprints: 142,
    reputation: 980,
    tags: ["Core", "DevOps"],
    initials: "AV"
  },
  {
    id: "USR-002",
    name: "Grid_Master",
    role: "Lead Architect",
    status: "Active",
    location: "Node_Tokyo",
    blueprints: 89,
    reputation: 750,
    tags: ["Frontend", "WebGL"],
    initials: "GM"
  },
  {
    id: "USR-003",
    name: "Eduh_Logic",
    role: "Senior Contributor",
    status: "Idle",
    location: "Node_Nairobi",
    blueprints: 45,
    reputation: 420,
    tags: ["Database", "RAG"],
    initials: "EL"
  },
  {
    id: "USR-004",
    name: "Data_Flow",
    role: "Security Analyst",
    status: "Offline",
    location: "Node_Berlin",
    blueprints: 22,
    reputation: 310,
    tags: ["Auth", "Encryption"],
    initials: "DF"
  }
]

function Members() {
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
            placeholder="Search_ID..." 
            className="rounded-none border-2 border-primary pl-10 h-11 bg-primary/5 uppercase text-xs font-black focus-visible:ring-0 focus-visible:border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          />
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex flex-wrap gap-2">
        {["All_Users", "Administrators", "Architects", "Contributors", "Bots"].map((filter, i) => (
          <Button 
            key={i}
            variant={i === 0 ? "default" : "outline"}
            className={cn(
              "rounded-none h-8 text-[10px] font-black uppercase px-4 transition-none",
              i === 0 ? "shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" : "border-2 border-primary/20 hover:border-primary"
            )}
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* MEMBERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-4">
        {MEMBER_DIRECTORY.map((member) => (
          <Card key={member.id} className="rounded-none border-2 border-primary bg-background shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group hover:translate-y-[-4px] hover:translate-x-[-4px] hover:shadow-[10px_10px_0px_0px_rgba(var(--primary),0.2)] transition-all overflow-hidden">
            <CardContent className="p-0">
              {/* TOP STRIP: ID & STATUS */}
              <div className="flex items-center justify-between bg-primary/5 p-3 border-b-2 border-primary/10">
                <span className="text-[9px] font-black text-muted-foreground tracking-widest uppercase italic">
                  ID: {member.id}
                </span>
                <div className="flex items-center gap-1.5">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-none",
                    member.status === "Active" ? "bg-green-500 animate-pulse" : "bg-muted-foreground/40"
                  )} />
                  <span className="text-[9px] font-black uppercase tracking-tighter">
                    {member.status}
                  </span>
                </div>
              </div>

              {/* PROFILE BODY */}
              <div className="p-5 flex gap-4">
                <Avatar className="h-16 w-16 rounded-none border-2 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <AvatarFallback className="rounded-none font-black text-xl">{member.initials}</AvatarFallback>
                </Avatar>
                
                <div className="space-y-1 overflow-hidden">
                  <h3 className="text-xl font-black uppercase tracking-tighter truncate group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-primary">
                    {member.role.includes("Admin") ? <ShieldCheck size={14} weight="fill" /> : <Cpu size={14} />}
                    <span className="text-[10px] font-black uppercase tracking-tight">{member.role}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground pt-1">
                    <MapPin size={12} weight="bold" />
                    <span className="text-[9px] font-bold uppercase">{member.location}</span>
                  </div>
                </div>
              </div>

              {/* STATS AREA */}
              <div className="grid grid-cols-2 border-y-2 border-primary/10 bg-muted/5">
                <div className="p-3 border-r-2 border-primary/10 text-center">
                  <p className="text-[8px] font-black uppercase opacity-50">Reputation</p>
                  <p className="text-sm font-black text-primary italic">+{member.reputation}</p>
                </div>
                <div className="p-3 text-center">
                  <p className="text-[8px] font-black uppercase opacity-50">Blueprints</p>
                  <p className="text-sm font-black italic">{member.blueprints}</p>
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="p-3 flex items-center justify-between bg-background">
                <div className="flex gap-1">
                  {member.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="rounded-none text-[8px] font-black uppercase px-1.5 py-0 border border-primary/10">
                      {tag}
                    </Badge>
                  ))}
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
    </div>
  )
}

export default Members