import React, { useState, useEffect } from 'react';
import UniversalHeader from '@/components/UniversalHeader';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle,  AlertDialogDescription, AlertDialogFooter,AlertDialogCancel, AlertDialogHeader, AlertDialogAction} from '../components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/Searchbar';
import { campaignAPI, type Campaign } from '../api';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import CampaignEditDialog from "@/components/CampaignEditDialog"


const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const navigate = useNavigate()
  const [editDialog, setEditDialog] = useState<{ isOpen: boolean; campaign: Campaign | null }>({ isOpen: false, campaign: null })

  // Function to limit description to 2 lines
const truncateDescription = (description: string | undefined, maxLength: number = 60) => {
    if (!description) return "No description available";
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
};


  // Fetch campaigns on component mount
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await campaignAPI.getAllCampaigns();
        setCampaigns(response.campaigns);
      } catch (err) {
        console.error('Error fetching campaigns:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch campaigns');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleDeleteCampaign = async (campaign: Campaign) => {
    // optimistic remove
    const prev = campaigns
    setCampaigns(prevCampaigns => prevCampaigns.filter(c => c._id !== campaign._id))
    try {
        await campaignAPI.deleteCampaign(campaign._id);
    } catch (error) {
        console.error("Error deleting campaign:", error);
        alert("Failed to delete campaign. Restoring.");
        setCampaigns(prev)
    }
};

  const handleAddCampaign = () => {
    navigate("/campaigns/create")
  }

  return (
    <div className="space-y-6 pb-20">
        <div className="space-y-5">
            <UniversalHeader 
                heading="Campaigns" 
                subheading="Complete overview of all your marketing campaigns" 
                buttonLabel="+ Create New" 
                onButtonClick={handleAddCampaign}
            />
            <SearchBar placeholder="Search campaigns" value={query} onChange={setQuery}/>
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
             <div className="space-y-4">
             {campaigns && campaigns.length > 0 ? (
               <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
               {campaigns.filter(c => {
                  const q = query.trim().toLowerCase();
                  if (!q) return true;
                  return (
                    (c.title || "").toLowerCase().includes(q) ||
                    (c.description || "").toLowerCase().includes(q)
                  );
               }).map((campaign) => (
                <div key={campaign._id} className="p-3 rounded-md bg-card">
                    <div className="space-y-3">
                        {/* First row: Platform logos and three dots */}
                        <div>
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
                                        <DropdownMenuItem onClick={() => setEditDialog({ isOpen: true, campaign })}>
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
                        

                        {/* Campaign details */}
                        <div className="space-y-2">
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
                    
                    </div>
                    <Button variant={"outline"} className="w-full mt-4" onClick={() => navigate(`/campaigns/${campaign._id}`)}>View Campaign</Button>
                </div>
               ))}
               </div>
             ) : (
                 <div className="text-center py-8">
                     <p className="text-muted-foreground">No campaigns found.</p>
                 </div>
             )}
             </div>
         )}
        <CampaignEditDialog 
          campaign={editDialog.campaign}
          isOpen={editDialog.isOpen}
          onClose={() => setEditDialog({ isOpen: false, campaign: null })}
          onSuccess={(updated) => setCampaigns(prev => prev.map(c => c._id === updated._id ? updated : c))}
        />
     </div>
 )
};

export default Campaigns;
