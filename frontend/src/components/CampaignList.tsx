import UniversalHeader from "./UniversalHeader"
import SearchBar from "./Searchbar"
import { Button } from "./ui/button"
import { campaignAPI } from "../utils/api"
import type { Campaign } from "../utils/api"
import { useNavigate } from "react-router-dom"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { showToast } from "../utils/toast"

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
import CampaignEditDialog from "./CampaignEditDialog"
import { useState } from "react"

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
    onCampaignUpdated?: (updatedCampaign: Campaign) => void;
}

const CampaignList = ({ campaigns = [], isLoading = false, error = null, onCampaignDeleted, onCampaignUpdated }: CampaignListProps) => {
    const navigate = useNavigate();
    const [editDialog, setEditDialog] = useState<{ isOpen: boolean; campaign: Campaign | null }>({
        isOpen: false,
        campaign: null
    });
    const [query, setQuery] = useState("");

    const filteredCampaigns = (campaigns || []).filter(c => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
            (c.title || "").toLowerCase().includes(q) ||
            (c.description || "").toLowerCase().includes(q)
        );
    });

    const handleDeleteCampaign = async (campaign: Campaign) => {
        // optimistic notify parent first (so UI updates immediately)
        const rollback = () => onCampaignUpdated && onCampaignUpdated(campaign)
        if (onCampaignDeleted) onCampaignDeleted(campaign._id)
        try {
            await campaignAPI.deleteCampaign(campaign._id);
            showToast.campaignDeleted();
        } catch (error) {
            console.error("Error deleting campaign:", error);
            showToast.error("Failed to delete campaign", "Please try again");
            // best-effort restore callback
            rollback()
        }
    };

    const handleCreateNewCampaign = () => {
        navigate('/campaigns/create');
    };

    const handleEditCampaign = (campaign: Campaign) => {
        setEditDialog({ isOpen: true, campaign });
    };

    const handleEditSuccess = (updatedCampaign: Campaign) => {
        if (onCampaignUpdated) {
            onCampaignUpdated(updatedCampaign);
        }
        setEditDialog({ isOpen: false, campaign: null });
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
            <SearchBar placeholder="Search campaign" value={query} onChange={setQuery} />
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
                    {/* Mobile: horizontal scroll list */}
                    <div className="sm:hidden flex space-x-4 overflow-x-auto pb-2">
                        {filteredCampaigns && filteredCampaigns.length > 0 ? filteredCampaigns.map((campaign) => (
                            <div key={campaign._id} className="p-3 rounded-md bg-card min-w-[85%]">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-medium">{campaign.title || "untitled"}</h3>
                                        <AlertDialog>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEditCampaign(campaign)}>
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

                    {/* Tablet/Desktop: responsive grid */}
                    <div className="hidden sm:grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredCampaigns && filteredCampaigns.length > 0 ? filteredCampaigns.map((campaign) => (
                            <div key={campaign._id} className="p-3 rounded-md bg-card">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                   {/* Second row: Title */}
                                <h3 className="text-xl font-medium">{campaign.title}</h3>

                                <AlertDialog>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEditCampaign(campaign)}>
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10a1 1 0 011 1v14a1 1 0 01-1 1H6a1 1 0 01-1-1z" />
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

                    {(!filteredCampaigns || filteredCampaigns.length === 0) ? (
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

            {/* Edit Dialog */}
            <CampaignEditDialog
                campaign={editDialog.campaign}
                isOpen={editDialog.isOpen}
                onClose={() => setEditDialog({ isOpen: false, campaign: null })}
                onSuccess={handleEditSuccess}
            />
        </div>
    )
}

export default CampaignList