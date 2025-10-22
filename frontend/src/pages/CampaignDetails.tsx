import { useState, useEffect } from "react"
import { PLATFORM_CONFIG } from "@/utils/platforms"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { campaignAPI, postAPI } from "@/api"
import { 
    Breadcrumb, 
    BreadcrumbItem, 
    BreadcrumbLink, 
    BreadcrumbList, 
    BreadcrumbPage, 
    BreadcrumbSeparator 
} from "../components/ui/breadcrumb"

const CampaignDetails = () => {
    const { campaignId } = useParams<{ campaignId: string }>()
    const navigate = useNavigate()
    const [campaign, setCampaign] = useState<Campaign | null>(null)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const getAllPosts = async() => {

        if (!campaignId) return

        const response = await postAPI.getAllPosts(campaignId)

        setPosts(response.posts)

        console.log(response)


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

    const truncateText = (text: string, maxLines: number = 3) => {
        const lineLength = 33 // Approximate characters per line
        const maxChars = lineLength * maxLines
        
        if (text.length <= maxChars) {
            return text
        }
        
        return text.substring(0, maxChars).trim() + '...'
    }

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp)
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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

            {campaign.postIds.length !== 0 ? <div>
                   {posts.map((post) => {
                    return <div>
                        {post.platform}
                        {post.script}
                    </div>
                   })}
                </div>
             : <div>
                <h3>this campaign doesn't have any posts yet</h3>
                <Button>Generate Posts</Button>
            </div>
            }

 
        </div>
    )
}

export default CampaignDetails