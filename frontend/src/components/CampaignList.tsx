import UniversalHeader from "./UniversalHeader"
import SearchBar from "./Searchbar"
import { Button } from "./ui/button"
import { campaignAPI } from "../api"
import type { Campaign } from "../api"
import { useNavigate } from "react-router-dom"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"
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
} from "./ui/alert-dialog"

// Function to limit description to 2 lines
const truncateDescription = (description: string | undefined, maxLength: number = 60) => {
    if (!description) return "No description available";
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
};

interface CampaignListProps {
    campaigns?: Campaign[];
    isLoading?: boolean;
    error?: string | null;
    onCampaignDeleted?: (campaignId: string) => void;
}

const CampaignList = ({ campaigns = [], isLoading = false, error = null, onCampaignDeleted }: CampaignListProps) => {
    const navigate = useNavigate();

    const handleDeleteCampaign = async (campaign: Campaign) => {
        try {
            await campaignAPI.deleteCampaign(campaign._id);
            // Notify parent component about the deletion
            if (onCampaignDeleted) {
                onCampaignDeleted(campaign._id);
            }
        } catch (error) {
            console.error("Error deleting campaign:", error);
            alert("Failed to delete campaign. Please try again.");
        }
    };

    const handleCreateNewCampaign = () => {
        navigate('/campaigns/create');
    };

    return (
        <div className="space-y-5">
            <div className="space-y-5">
            <UniversalHeader 
                heading="Your Campaigns" 
                subheading="These are your past battles. Some won hearts, some got roasted" 
                buttonLabel="+ Create New" 
                onButtonClick={handleCreateNewCampaign}
            />
            <SearchBar placeholder="Search campaign"/>
            </div>

            {isLoading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading campaigns...</p>
                </div>
            ) : error ? (
                <div className="text-center py-8">
                    <p className="text-destructive">{error}</p>
                    <Button onClick={() => window.location.reload()} className="mt-2">
                        Try Again
                    </Button>
                </div>
            ) : (
                <>
                    <div className="flex space-x-5 overflow-x-scroll scrollbar-hide">
                        {campaigns && campaigns.length > 0 ? campaigns.map((campaign) => (
                            <div key={campaign._id} className="p-3 rounded-md bg-card min-w-[90%]">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                    <div className="flex justify-start space-x-2 items-center">
                                    {campaign.platforms.includes('x') && (
                                            <div className="bg-black text-white rounded-full p-1">
                                                <span className="text-xs font-bold">X</span>
                                            </div>
                                        )}
                                        {campaign.platforms.includes('instagram') && (
                                            <div className="bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-full p-1">
                                                <span className="text-xs font-bold">IG</span>
                                            </div>
                                        )}
                                        {campaign.platforms.includes('linkedin') && (
                                            <div className="bg-blue-600 text-white rounded-full p-1">
                                                <span className="text-xs font-bold">LI</span>
                                            </div>
                                        )}
                                        <h3 className="text-xl font-medium">{campaign.title}</h3>
                                    </div>

                                <AlertDialog>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
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
                                            <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete "{campaign.title}"? This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction 
                                                onClick={() => handleDeleteCampaign(campaign)}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                </div>
                                <p className="text-muted-foreground">{truncateDescription(campaign.description)}</p>
                            </div>
                            <div className="space-y-2 my-3">
                                <p className="text-muted-foreground text-sm flex items-center gap-2">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Start: {new Date(campaign.startDate).toLocaleDateString()}
                                </p>
                                <p className="text-muted-foreground text-sm flex items-center gap-2">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    End: {new Date(campaign.endDate).toLocaleDateString()}
                                </p>
                                <p className="text-muted-foreground text-sm flex items-center gap-2">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10a1 1 0 011 1v14a1 1 0 01-1 1H6a1 1 0 01-1-1V5a1 1 0 011-1z" />
                                    </svg>
                                    Posts: {campaign.postIds.length}
                                </p>
                            </div>
                            <Button variant={"outline"} className="w-full" onClick={() => navigate(`/campaigns/${campaign._id}`)}>View Campaign</Button>
                        </div>
                    )) : (
                        <div className="text-center py-8 w-full">
                            <p className="text-muted-foreground">No campaigns found.</p>
                        </div>
                    )}
                </div>

                {(!campaigns || campaigns.length === 0) ? (
                    <div className="text-center py-8 space-y-4">
                        <p className="text-muted-foreground">You haven't created any campaigns yet. Start by creating your first marketing campaign!</p>
                        <Button onClick={handleCreateNewCampaign} className="bg-primary-foreground text-white">
                            + Create Your First Campaign
                        </Button>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <Button variant={"ghost"} className="">view all campaigns</Button>
                    </div>
                )}
                </>
            )}
        </div>
    )
}

export default CampaignList