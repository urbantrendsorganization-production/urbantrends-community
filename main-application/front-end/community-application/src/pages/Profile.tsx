import { useState, useEffect, useRef } from "react"
import api from "@/lib/api"
import { toast } from "sonner"
import {
    UserGear,
    FloppyDiskBack,
    Fingerprint,
    MapPin,
    Globe,
    CircleNotch,
    IdentificationCard,
    TextT,
    Camera,
    User
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-context"


export default function Profile() {
    const { setUser } = useAuth()
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // MATCHING YOUR API SCHEMA
    const [formData, setFormData] = useState({
        display_name: "",
        bio: "",
        location: "",
        website: ""
    })

    // Avatar state: current URL from server + pending file upload
    const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)

    // [GET] accounts/accounts/me/
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("accounts/accounts/me/")
                // Map the incoming data to our form state
                setFormData({
                    display_name: res.data.display_name || "",
                    bio: res.data.bio || "",
                    location: res.data.location || "",
                    website: res.data.website || ""
                })
                // Prefer uploaded file URL, fall back to avatar_url
                setCurrentAvatarUrl(res.data.avatar || res.data.avatar_url || null)
            } catch {
                toast.error("DATA_SYNC_ERROR: Access Denied")
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setAvatarFile(file)
        setAvatarPreview(URL.createObjectURL(file))
    }

    // [PATCH] accounts/accounts/me/
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setUpdating(true)
        try {
            let res

            if (avatarFile) {
                // Send as multipart/form-data when a file is attached
                const data = new FormData()
                data.append("display_name", formData.display_name)
                data.append("bio", formData.bio)
                data.append("location", formData.location)
                data.append("website", formData.website)
                data.append("avatar", avatarFile)

                res = await api.patch("accounts/accounts/me/", data, {
                    headers: { "Content-Type": "multipart/form-data" },
                })

                // Release the object URL now that the upload is done
                if (avatarPreview) URL.revokeObjectURL(avatarPreview)
                setAvatarFile(null)
                setAvatarPreview(null)
                setCurrentAvatarUrl(res.data.avatar || res.data.avatar_url || null)
            } else {
                res = await api.patch("accounts/accounts/me/", formData)
            }

            // This now updates the Context AND LocalStorage
            if (setUser) {
                setUser(res.data)
            }

            toast.success("IDENTITY_UPDATED: Grid sync complete")
            // Stay on the page so the user sees the success state!
        } catch {
            toast.error("UPDATE_REJECTED: Protocol Violation")
        } finally {
            setUpdating(false)
        }
    }

    const displayedAvatar = avatarPreview || currentAvatarUrl
    const initials = (formData.display_name || "??").substring(0, 2).toUpperCase()

    if (loading) return (
        <div className="flex h-[50vh] items-center justify-center font-mono italic opacity-50">
            <CircleNotch size={32} className="animate-spin mr-2" /> Initializing_Sync...
        </div>
    )

    return (
        <div className="max-w-3xl mx-auto font-mono pb-20 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-primary pb-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                        <Fingerprint size={32} weight="bold" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Protocol_v4.5</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
                        Edit_Profile
                    </h1>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-70">
                        Current_User: {formData.display_name || "Anonymous_Node"}
                    </p>
                </div>
            </div>

            <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-8">

                {/* AVATAR UPLOAD CARD */}
                <Card className="rounded-none border-2 border-primary bg-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <CardHeader className="bg-primary text-primary-foreground p-4">
                        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <Camera size={20} weight="bold" /> Identity_Image
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="flex items-center gap-8">
                            {/* AVATAR PREVIEW */}
                            <div className="relative shrink-0">
                                <Avatar className="h-24 w-24 rounded-none border-2 border-primary shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                                    {displayedAvatar ? (
                                        <AvatarImage src={displayedAvatar} alt="Avatar" className="object-cover" />
                                    ) : null}
                                    <AvatarFallback className="rounded-none font-black text-2xl">
                                        {initials || <User size={32} weight="bold" />}
                                    </AvatarFallback>
                                </Avatar>
                                {avatarPreview && (
                                    <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[8px] font-black uppercase px-1 py-0.5">
                                        New
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3 flex-1">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest">Upload_New_Image</p>
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">
                                        Accepts JPG, PNG, WEBP — Replaces current avatar
                                    </p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="rounded-none border-2 border-primary font-black uppercase text-[10px] h-10 px-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all hover:bg-primary hover:text-primary-foreground"
                                >
                                    <Camera size={16} weight="bold" className="mr-2" />
                                    {avatarPreview ? "Change_Selection" : "Select_Image"}
                                </Button>
                                {avatarPreview && (
                                    <p className="text-[9px] font-black text-primary uppercase tracking-widest animate-pulse">
                                        // File staged — commit to upload
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-none border-2 border-primary bg-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <CardHeader className="bg-primary text-primary-foreground p-4">
                        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <UserGear size={20} weight="bold" /> Public_Registry_Data
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">

                        {/* DISPLAY NAME */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase flex items-center gap-2">
                                <IdentificationCard size={14} weight="bold" /> Alias_Signature
                            </label>
                            <Input
                                value={formData.display_name}
                                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                placeholder="The Architect"
                                className="rounded-none border-2 border-primary/20 bg-muted/5 font-black uppercase text-xs focus-visible:border-primary focus-visible:ring-0"
                            />
                        </div>

                        {/* BIO */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase flex items-center gap-2 italic">
                                <TextT size={14} weight="bold" /> Mission_Statement // Bio
                            </label>
                            <textarea
                                rows={3}
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full rounded-none border-2 border-primary/20 bg-muted/5 p-3 text-xs font-bold focus:outline-none focus:border-primary transition-colors resize-none"
                                placeholder="Declare your architectural focus..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* LOCATION */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase flex items-center gap-2">
                                    <MapPin size={14} weight="bold" /> Grid_Coordinates
                                </label>
                                <Input
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="Nairobi, KE"
                                    className="rounded-none border-2 border-primary/20 bg-muted/5 font-bold text-xs"
                                />
                            </div>

                            {/* WEBSITE */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase flex items-center gap-2">
                                    <Globe size={14} weight="bold" /> Virtual_Relay // Website
                                </label>
                                <Input
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    placeholder="https://..."
                                    className="rounded-none border-2 border-primary/20 bg-muted/5 font-bold text-xs"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* SUBMISSION */}
                <div className="flex justify-end pt-4">
                    <Button
                        disabled={updating}
                        type="submit"
                        className="w-full sm:w-auto rounded-none h-14 px-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all font-black uppercase tracking-widest"
                    >
                        {updating ? (
                            <CircleNotch size={24} className="animate-spin" />
                        ) : (
                            <>
                                <FloppyDiskBack size={20} className="mr-2" weight="bold" />
                                Commit_Logic
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
