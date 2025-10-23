import React, { useState, useEffect } from 'react';
import CampaignList from '../components/CampaignList';
import Greeting from '@/components/Greeting';
import { campaignAPI, type Campaign } from '../utils/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import CalendarPreview from '@/components/CalendarPreview';
import UniversalHeader from '@/components/UniversalHeader';
import { showToast } from '../utils/toast';

const Home: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {user} = useAuth()

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
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch campaigns';
        setError(errorMessage);
        // Only show toast for genuine errors, not for empty results
        if (errorMessage.toLowerCase().includes('no campaigns') || errorMessage.toLowerCase().includes('not found')) {
          // This is expected for new users - don't show error toast
        } else {
          showToast.error(errorMessage, undefined, 'campaigns');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Handle campaign deletion
  const handleCampaignDeleted = (campaignId: string) => {
    setCampaigns(prevCampaigns => prevCampaigns.filter(c => c._id !== campaignId));
  };

  // Handle campaign update
  const handleCampaignUpdated = (updatedCampaign: Campaign) => {
    setCampaigns(prevCampaigns => 
      prevCampaigns.map(c => c._id === updatedCampaign._id ? updatedCampaign : c)
    );
  };

  // Limit campaigns to 5 for home page
  const limitedCampaigns = campaigns.slice(0, 5);
  const hasMoreCampaigns = campaigns.length > 5;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-8">
          <Greeting name={user?.email}/>
          
          {/* Campaigns Section */}
          <div className="space-y-4">
            <CampaignList 
              campaigns={limitedCampaigns} 
              isLoading={isLoading} 
              error={error}
              onCampaignDeleted={handleCampaignDeleted}
              onCampaignUpdated={handleCampaignUpdated}
            />
            
            {/* View All Button */}
            {hasMoreCampaigns && (
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/campaigns')}
                  className="w-full sm:w-auto"
                >
                  View All Campaigns ({campaigns.length})
                </Button>
              </div>
            )}
          </div>

          {/* Calendar Preview Section */}
          <div className="space-y-4">
            <UniversalHeader heading="Upcoming events" subheading="Your scheduled content calendar" buttonLabel="view full calendar" onButtonClick={() => navigate("/calendar")}/>
            <CalendarPreview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
