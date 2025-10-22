import React, { useState, useEffect } from 'react';
import UniversalHeader from '@/components/UniversalHeader';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle,  AlertDialogDescription, AlertDialogFooter,AlertDialogCancel, AlertDialogHeader, AlertDialogAction} from '../components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/Searchbar';
import { campaignAPI, type Campaign } from '../api';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"

const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate()

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
    try {
        await campaignAPI.deleteCampaign(campaign._id);
        // Remove the deleted campaign from the local state
        setCampaigns(prevCampaigns => prevCampaigns.filter(c => c._id !== campaign._id));
    } catch (error) {
        console.error("Error deleting campaign:", error);
        alert("Failed to delete campaign. Please try again.");
    }
};

  const handleAddCampaign = () => {
    navigate("/create")
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
            <SearchBar placeholder="Search campaigns"/>
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
             {campaigns && campaigns.length > 0 ? campaigns.map((campaign) => (
                <div key={campaign._id} className="p-3 rounded-md bg-primary-foreground min-w-[90%]">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                        <div className="flex justify-start space-x-2 items-center">
                            <h3 className="text-xl font-medium">{campaign.title || "untitled"}</h3>
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
                     <Button variant={"outline"} className="w-full" onClick={() => navigate(`/campaigns/${campaign._id}`)}>View Campaign</Button>
                 </div>
             )) : (
                 <div className="text-center py-8">
                     <p className="text-muted-foreground">No campaigns found.</p>
                 </div>
             )}
             </div>
         )}
     </div>
 )
};

export default Campaigns;
