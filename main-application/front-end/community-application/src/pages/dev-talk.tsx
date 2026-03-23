import { useState, useEffect } from "react"
import {
  TerminalWindow,
  Code,
  GitBranch,
  GitCommit,
  ChatCircleText,
  Plus,
  CheckCircle
} from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import api from "@/lib/api"
import { toast } from "sonner"

interface Discussion {
  id: number
  title: string
  content: string
  category: string
  author: { username: string; display_name: string }
  comment_count: number
  is_pinned: boolean
  is_resolved: boolean
  created_at: string
}

interface Comment {
  id: number
  content: string
  author: { username: string; display_name: string }
  created_at: string
  replies: Comment[]
}

function DevTalk() {
  const [topics, setTopics] = useState<Discussion[]>([])
  const [activeTopic, setActiveTopic] = useState<Discussion | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentInput, setCommentInput] = useState("")
  const [sending, setSending] = useState(false)
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")
  const [creating, setCreating] = useState(false)

  const fetchTopics = async () => {
    try {
      const res = await api.get("api/discussions/?category=DEV_TALK")
      const data = res.data.results || res.data
      setTopics(data)
      if (!activeTopic && data.length > 0) {
        setActiveTopic(data[0])
      }
    } catch {
      toast.error("Failed to load discussions")
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async (discussionId: number) => {
    setCommentsLoading(true)
    try {
      const res = await api.get(`api/discussions/${discussionId}/comments/`)
      setComments(res.data.results || res.data)
    } catch {
      toast.error("Failed to load thread")
    } finally {
      setCommentsLoading(false)
    }
  }

  useEffect(() => {
    fetchTopics()
  }, [])

  useEffect(() => {
    if (activeTopic) {
      fetchComments(activeTopic.id)
    }
  }, [activeTopic])

  const handlePushComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentInput.trim() || !activeTopic) return
    setSending(true)
    try {
      await api.post(`api/discussions/${activeTopic.id}/comments/`, {
        content: commentInput,
      })
      setCommentInput("")
      await fetchComments(activeTopic.id)
      await fetchTopics()
    } catch {
      toast.error("Failed to push comment")
    } finally {
      setSending(false)
    }
  }

  const handleResolve = async () => {
    if (!activeTopic) return
    try {
      await api.post(`api/discussions/${activeTopic.id}/resolve/`)
      toast.success(activeTopic.is_resolved ? "Discussion reopened" : "Discussion resolved")
      await fetchTopics()
      setActiveTopic((prev) => prev ? { ...prev, is_resolved: !prev.is_resolved } : null)
    } catch {
      toast.error("Failed to update status")
    }
  }

  const handleNewProposal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newContent.trim()) return
    setCreating(true)
    try {
      const res = await api.post("api/discussions/", {
        title: newTitle,
        content: newContent,
        category: "DEV_TALK",
      })
      setNewTitle("")
      setNewContent("")
      setShowNewDialog(false)
      toast.success("Proposal deployed")
      await fetchTopics()
      setActiveTopic(res.data)
    } catch {
      toast.error("Failed to create proposal")
    } finally {
      setCreating(false)
    }
  }

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return "just now"
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const getStatusColor = (d: Discussion) => {
    if (d.is_resolved) return "bg-green-500"
    return "bg-orange-500"
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] font-mono border-4 border-primary bg-background shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">

      {/* LEFT: THREAD NAVIGATOR */}
      <aside className="hidden md:flex flex-col w-72 border-r-4 border-primary bg-muted/5">
        <div className="p-4 border-b-2 border-primary bg-primary/10 flex items-center gap-2">
          <GitBranch size={20} weight="bold" className="text-primary" />
          <h3 className="text-[10px] font-black uppercase tracking-widest">Active_Branches</h3>
        </div>
        <ScrollArea className="flex-1">
          {loading ? (
            <div className="p-4 text-center">
              <span className="text-[10px] uppercase tracking-widest opacity-50 animate-pulse">Loading...</span>
            </div>
          ) : topics.length === 0 ? (
            <div className="p-4 text-center">
              <span className="text-[10px] uppercase tracking-widest opacity-50">No_Branches_Found</span>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setActiveTopic(topic)}
                  className={cn(
                    "w-full text-left p-3 border-2 transition-all flex flex-col gap-2 group",
                    activeTopic?.id === topic.id
                      ? "bg-primary text-primary-foreground border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      : "border-transparent hover:border-primary/20 hover:bg-primary/5"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className={cn(
                      "rounded-none text-[8px] uppercase font-black px-1 py-0",
                      activeTopic?.id === topic.id ? "border-primary-foreground text-primary-foreground" : "border-primary/30 text-primary"
                    )}>
                      {topic.category}
                    </Badge>
                    <div className={cn("w-2 h-2 rounded-none rotate-45", getStatusColor(topic))} />
                  </div>
                  <span className="text-[11px] font-black truncate uppercase leading-none">
                    {topic.title}
                  </span>
                  <span className={cn(
                    "text-[8px] font-bold uppercase",
                    activeTopic?.id === topic.id ? "text-primary-foreground/60" : "text-muted-foreground/50"
                  )}>
                    {topic.comment_count} comments
                  </span>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-4 border-t-2 border-primary/10">
          <Button
            onClick={() => setShowNewDialog(true)}
            className="w-full rounded-none border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-white font-black uppercase text-[10px] h-10 shadow-[4px_4px_0px_0px_rgba(var(--primary),0.2)]"
          >
            <Plus size={14} weight="bold" className="mr-1" /> New_Proposal
          </Button>
        </div>
      </aside>

      {/* RIGHT: DISCUSSION AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="p-4 border-b-2 border-primary bg-background flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <TerminalWindow size={24} weight="duotone" className="text-primary" />
            <div className="flex flex-col">
              <h2 className="text-sm font-black uppercase tracking-tighter">
                {activeTopic?.title || "Select_Branch"}
              </h2>
              <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">
                Status: {activeTopic?.is_resolved ? "Resolved" : "Under_Review"} // {activeTopic ? `${activeTopic.comment_count} comments` : "No_Selection"}
              </p>
            </div>
          </div>
          {activeTopic && (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleResolve}
                variant="outline"
                className={cn(
                  "rounded-none border-2 text-[9px] font-black uppercase h-8",
                  activeTopic.is_resolved
                    ? "border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                    : "border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                )}
              >
                {activeTopic.is_resolved ? "Reopen_Logic" : "Approve_Logic"}
              </Button>
            </div>
          )}
        </header>

        <ScrollArea className="flex-1 p-6 bg-[#0a0a0a]">
          {!activeTopic ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-xs uppercase tracking-widest opacity-30 text-white font-mono">Select_A_Branch_To_View_Thread</span>
            </div>
          ) : commentsLoading ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-xs uppercase tracking-widest opacity-50 text-white font-mono animate-pulse">Loading_Thread...</span>
            </div>
          ) : (
            <div className="space-y-10 max-w-3xl mx-auto">
              {/* Original post */}
              <div className="relative pl-8 border-l-2 border-primary/20">
                <div className="absolute -left-[11px] top-0 bg-[#0a0a0a] p-1">
                  <GitCommit size={18} weight="bold" className="text-primary" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                    <span className="text-primary">{activeTopic.author?.display_name || activeTopic.author?.username}</span>
                    <span className="opacity-30">opened thread</span>
                    <span className="opacity-20 ml-auto">{formatTime(activeTopic.created_at)}</span>
                    {activeTopic.is_resolved && <CheckCircle size={14} weight="fill" className="text-green-500" />}
                  </div>
                  <div className="bg-zinc-900/50 border-2 border-zinc-800 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <p className="text-sm text-zinc-300 font-medium leading-relaxed">
                      {activeTopic.content}
                    </p>
                  </div>
                </div>
              </div>

              {/* Comments */}
              {comments.map((comment) => (
                <div key={comment.id} className="relative pl-8 border-l-2 border-primary/20">
                  <div className="absolute -left-[11px] top-0 bg-[#0a0a0a] p-1">
                    <ChatCircleText size={18} weight="bold" className="text-muted-foreground" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                      <span className="text-primary">{comment.author?.display_name || comment.author?.username}</span>
                      <span className="opacity-30">commented</span>
                      <span className="opacity-20 ml-auto">{formatTime(comment.created_at)}</span>
                    </div>
                    <div className="bg-zinc-900/50 border-2 border-zinc-800 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <p className="text-sm text-zinc-300 font-medium leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                    {/* Nested replies */}
                    {comment.replies?.map((reply) => (
                      <div key={reply.id} className="ml-6 pl-6 border-l-2 border-zinc-700/50">
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest mb-2">
                          <span className="text-primary/70">{reply.author?.display_name || reply.author?.username}</span>
                          <span className="opacity-20">{formatTime(reply.created_at)}</span>
                        </div>
                        <div className="bg-zinc-900/30 border border-zinc-800/50 p-3">
                          <p className="text-xs text-zinc-400 font-medium">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <div className="text-center py-8">
                  <span className="text-[10px] uppercase tracking-widest opacity-30 text-white font-mono">No_Comments_Yet — Be_First_To_Respond</span>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* FOOTER INPUT */}
        {activeTopic && (
          <footer className="p-4 border-t-4 border-primary bg-background shrink-0">
            <form onSubmit={handlePushComment} className="flex gap-3">
              <div className="flex-1 relative">
                <Code size={18} className="absolute left-3 top-3.5 text-primary opacity-50" />
                <input
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  disabled={sending}
                  placeholder="Append technical commentary..."
                  className="w-full bg-muted/10 border-2 border-primary/20 h-12 pl-10 pr-4 text-[11px] font-black uppercase focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <Button
                type="submit"
                disabled={sending || !commentInput.trim()}
                className="rounded-none h-12 px-8 bg-primary hover:bg-primary/90 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                Push_Comment
              </Button>
            </form>
          </footer>
        )}
      </main>

      {/* NEW PROPOSAL DIALOG */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="rounded-none border-4 border-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-background font-mono max-w-lg">
          <DialogHeader className="border-b-2 border-primary/10 pb-4">
            <DialogTitle className="text-xl font-black uppercase tracking-tighter">New_Proposal</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleNewProposal} className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest">Branch_Title</label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. refactor/auth-middleware"
                className="rounded-none border-2 border-primary/30 h-11 text-xs font-bold uppercase focus-visible:ring-0 focus-visible:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest">Description</label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Describe the proposal..."
                rows={4}
                className="w-full bg-muted/10 border-2 border-primary/30 p-3 text-xs font-bold focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="rounded-none border-2 border-primary/30 font-black uppercase text-[10px] h-10">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={creating || !newTitle.trim() || !newContent.trim()}
                className="rounded-none flex-1 bg-primary font-black uppercase text-[10px] h-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                {creating ? "Deploying..." : "Deploy_Proposal"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DevTalk