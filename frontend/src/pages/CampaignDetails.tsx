import { useState, useEffect } from "react"
import { PLATFORM_CONFIG } from "@/utils/platforms"
import { useParams } from "react-router-dom"
import { MoreHorizontal, Calendar, Clock, Edit, Trash2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { Link } from "react-router-dom"
import { campaignAPI, postAPI, type Post, type Campaign } from "@/api"
import { 
    Breadcrumb, 
    BreadcrumbItem, 
    BreadcrumbLink, 
    BreadcrumbList, 
    BreadcrumbPage, 
    BreadcrumbSeparator 
} from "../components/ui/breadcrumb"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../components/ui/alert-dialog"
import PostEditDialog from "../components/PostEditDialog"

const CampaignDetails = () => {
    const { campaignId } = useParams<{ campaignId: string }>()
    const [campaign, setCampaign] = useState<Campaign | null>(null)
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [scheduleDialog, setScheduleDialog] = useState<{ isOpen: boolean; postId: string; currentDate?: string }>({
        isOpen: false,
        postId: "",
        currentDate: undefined
    })
    const [editDialog, setEditDialog] = useState<{ isOpen: boolean; post: Post | null }>({
        isOpen: false,
        post: null
    })

    const getAllPosts = async() => {
        if (!campaignId) return


            const response = await postAPI.getAllPosts(campaignId)
            setPosts(response.posts)
       
    }

    const handleSchedulePost = async (date: string) => {
        // Check if the selected date is beyond campaign end date
        if (campaign && campaign.endDate) {
            const selectedDate = new Date(date)
            const campaignEndDate = new Date(campaign.endDate)
            selectedDate.setHours(0, 0, 0, 0)
            campaignEndDate.setHours(0, 0, 0, 0)
            
            if (selectedDate > campaignEndDate) {
                setError("Cannot schedule post beyond campaign end date.")
                return
            }
        }

        // optimistic update
        const prevPosts = posts
        const normalizedDate = new Date(date)
        normalizedDate.setHours(0,0,0,0)
        const optimistic = posts.map(p => p._id === scheduleDialog.postId ? { ...p, scheduled_on: normalizedDate.toISOString(), status: 'scheduled' as const } : p)
        setPosts(optimistic)

        try {
            await postAPI.schedulePost(scheduleDialog.postId, date)
            setScheduleDialog({ isOpen: false, postId: "", currentDate: undefined })
            setError("") // Clear any previous errors
        } catch (error) {
            console.error("Error scheduling post:", error)
            setError("Failed to schedule post")
            // rollback
            setPosts(prevPosts)
        }
    }

    const openScheduleDialog = (postId: string, currentDate?: string) => {
        setScheduleDialog({
            isOpen: true,
            postId,
            currentDate
        })
    }

    const handleEditPost = (post: Post) => {
        setEditDialog({ isOpen: true, post });
    };

    const handleEditSuccess = (updatedPost: Post) => {
        setPosts(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
        setEditDialog({ isOpen: false, post: null });
    };

    const handleDeletePost = async (post: Post) => {
        // optimistic remove
        const prevPosts = posts
        setPosts(prev => prev.filter(p => p._id !== post._id))
        try {
            await postAPI.deletePost(post._id)
        } catch (error) {
            console.error("Error deleting post:", error)
            alert("Failed to delete post. Restoring.")
            // rollback
            setPosts(prevPosts)
        }
    };

    const handleGeneratePosts = async () => {
        if (!campaignId) return
        
        setLoading(true)
        try {
            await postAPI.generatePosts(campaignId)
            // Refresh posts to show the newly generated ones
            await getAllPosts()
        } catch (error) {
            console.error("Error generating posts:", error)
            setError("Failed to generate posts")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const fetchCampaign = async () => {
            if (!campaignId) {
                setError("Campaign ID not found")
                setLoading(false)
                return
            }

            try {
                const campaignData = await campaignAPI.getCampaign(campaignId)
                setCampaign(campaignData.campaign)
            } catch (error) {
                console.error("Error fetching campaign:", error)
                setError("Failed to load campaign")
            } finally {
                setLoading(false)
            }
        }

        fetchCampaign()
        getAllPosts()
    }, [campaignId])

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp)
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="space-y-8 mb-10">
                <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">Loading campaign...</p>
                </div>
            </div>
        )
    }

    if (error || !campaign) {
        return (
            <div className="space-y-8 mb-10">
                <div className="flex items-center justify-center h-64">
                    <p className="text-red-500">{error || "Campaign not found"}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 mb-10">
            <div className="space-y-2">
                <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/campaigns">campaigns</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{campaign.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            
            <div className="space-y-2">
                <h1 className="text-2xl font-medium text-wrap">{campaign.title}</h1>
                <p className="text-muted-foreground text-sm">{campaign.description}</p>
            </div>
            </div>

            {/* showing posts within the campaign */}
            {posts.length > 0 ? (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Posts ({posts.length})</h2>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                        {posts.map((post) => {
                            const platformConfig = PLATFORM_CONFIG[post.platform as keyof typeof PLATFORM_CONFIG]
                            const scheduledDate = post.scheduled_on ? new Date(post.scheduled_on) : null
                            
                            return (
                                <div key={post._id} className="border rounded-lg p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                {platformConfig?.icon && (
                                                    <img src={platformConfig.icon} alt={post.platform} className="w-4 h-4" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium capitalize">{post.platform}</p>
                                                <p className="text-sm text-gray-500">
                                                    Status: <span className={`capitalize ${
                                                        post.status === 'scheduled' ? 'text-blue-600' :
                                                        post.status === 'published' ? 'text-green-600' :
                                                        post.status === 'failed' ? 'text-red-600' :
                                                        'text-gray-600'
                                                    }`}>{post.status}</span>
                                                </p>
                                            </div>
                                        </div>
                                        {scheduledDate && (
                                            <div className="text-right text-sm text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{formatDate(scheduledDate.getTime())}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        {post.script && Array.isArray(post.script) && post.script.map((scriptItem: any, index: number) => (
                                            <div key={index} className="text-sm">
                                                {typeof scriptItem === 'object' ? (
                                                    Object.entries(scriptItem).map(([key, value]) => (
                                                        <div key={key} className="mb-1">
                                                            <span className="font-medium capitalize">{key}:</span> {String(value)}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="line-clamp-3">{String(scriptItem)}</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center pt-2 border-t">
                                        <div className="flex space-x-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => openScheduleDialog(post._id, post.scheduled_on)}
                                            >
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {post.scheduled_on ? 'Reschedule' : 'Schedule'}
                                            </Button>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <Button asChild variant="outline" size="sm">
                                                <Link to={`/posts/${post._id}`}>View Details</Link>
                                            </Button>
                                        <AlertDialog>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEditPost(post)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <AlertDialogTrigger asChild>
                                                            <button 
                                                                className="flex w-full items-center px-2 py-1.5 text-sm text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </button>
                                                        </AlertDialogTrigger>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>

                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Post</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete this post? This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction 
                                                        onClick={() => handleDeletePost(post)}
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ) : (
                <div className="text-center py-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-500 mb-4">This campaign doesn't have any posts yet.</p>
                    <Button onClick={handleGeneratePosts} disabled={loading}>
                        {loading ? "Generating..." : "Generate Posts"}
                    </Button>
                </div>
            )}

            {/* Schedule Dialog (date-only) */}
            <AlertDialog open={scheduleDialog.isOpen} onOpenChange={(open) => !open && setScheduleDialog({ isOpen: false, postId: "", currentDate: undefined })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Schedule Post</AlertDialogTitle>
                        <AlertDialogDescription>
                            Choose the date you want this post to be published.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-2">
                        <label htmlFor="date" className="block text-sm font-medium">Date</label>
                        <input
                            id="date"
                            type="date"
                            value={scheduleDialog.currentDate ? new Date(scheduleDialog.currentDate).toISOString().slice(0, 10) : ""}
                            onChange={(e) => setScheduleDialog((prev: any) => ({ ...prev, currentDate: e.target.value }))}
                            min={new Date().toISOString().slice(0, 10)}
                            max={campaign?.endDate ? new Date(campaign.endDate).toISOString().slice(0, 10) : undefined}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                        {campaign?.endDate && (
                            <p className="text-xs text-muted-foreground">
                                Campaign ends on {new Date(campaign.endDate).toLocaleDateString()}
                            </p>
                        )}
                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setScheduleDialog({ isOpen: false, postId: "", currentDate: undefined })}>Cancel</AlertDialogCancel>
                        <AlertDialogAction disabled={!scheduleDialog.currentDate} onClick={() => scheduleDialog.currentDate && handleSchedulePost(scheduleDialog.currentDate!)}>
                            Schedule Post
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Post Edit Dialog */}
            <PostEditDialog
                post={editDialog.post}
                isOpen={editDialog.isOpen}
                onClose={() => setEditDialog({ isOpen: false, post: null })}
                onSuccess={handleEditSuccess}
            />
        </div>
    )
}

export default CampaignDetails