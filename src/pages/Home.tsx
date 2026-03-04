import React from 'react'
import { 
  Brain, 
  PaperPlaneRight, 
  ChatCircle, 
  ArrowFatUp, 
  ShareNetwork,
  Clock
} from "@phosphor-icons/react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

function Home() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 font-mono">
      
      {/* SECTION 1: AI ARCHITECT INPUT GROUP */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
            <Brain weight="duotone" className="text-primary" size={20} />
            Ask_Architect_AI
          </h2>
          <Badge variant="outline" className="rounded-none border-dashed text-[10px]">
            v3.4-stable
          </Badge>
        </div>

        <div className="flex p-3 w-full items-center gap-3 bg-background shadow-sm border-2 border-primary/20">
          <Input 
            placeholder="How can I optimize urban traffic flow in React?..." 
            className="rounded-none border-0 focus-visible:ring-0 h-14 bg-transparent text-sm"
          />
          <Button className="rounded-none  border-l">
            <PaperPlaneRight size={20} weight="bold" />
          </Button>
        </div>
      </section>

      {/* SECTION 2: COMMUNITY FEED */}
      <section className="space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground border-b pb-2">
          Recent_Activity
        </h3>

        {/* SAMPLE POST 1 */}
        <Card className="rounded-none border-2 transition-colors hover:border-primary/40">
          <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
            <Avatar className="rounded-none border">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">j_doe_99</span>
                <Badge className="rounded-none text-[9px] h-4 uppercase">Moderator</Badge>
              </div>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Clock size={12} /> 2 hours ago in #general
              </span>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 text-sm leading-relaxed">
            Just finished reading the new urban planning documentation. The way they handle 
            pedestrian flow variables in the latest update is incredible. Anyone else 
            experimenting with this?
          </CardContent>
          <CardFooter className="p-2 border-t flex items-center gap-4">
            <Button variant="ghost" size="sm" className="rounded-none gap-2 text-xs">
              <ArrowFatUp size={16} /> 124
            </Button>
            <Button variant="ghost" size="sm" className="rounded-none gap-2 text-xs">
              <ChatCircle size={16} /> 18
            </Button>
            <Button variant="ghost" size="sm" className="rounded-none ml-auto">
              <ShareNetwork size={16} />
            </Button>
          </CardFooter>
        </Card>

        {/* SAMPLE POST 2 (Image/Project Post) */}
        <Card className="rounded-none border-2">
          <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
            <Avatar className="rounded-none border">
              <AvatarFallback>AT</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-bold">arch_tech</span>
              <span className="text-[10px] text-muted-foreground">4 hours ago in #showcase</span>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            <p className="text-sm font-medium">New Community Layout Draft:</p>
            <div className="aspect-video bg-muted border flex items-center justify-center text-xs text-muted-foreground uppercase tracking-widest italic">
              [Image_Attachment_Render]
            </div>
          </CardContent>
          <CardFooter className="p-2 border-t flex gap-4">
            <Button variant="ghost" size="sm" className="rounded-none gap-2 text-xs">
              <ArrowFatUp size={16} /> 89
            </Button>
            <Button variant="ghost" size="sm" className="rounded-none gap-2 text-xs">
              <ChatCircle size={16} /> 5
            </Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  )
}

export default Home