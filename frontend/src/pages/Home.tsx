import React, { useState, useEffect } from 'react';
import CampaignList from '../components/CampaignList';
import Greeting from '@/components/Greeting';
import { campaignAPI, type Campaign } from '../api';
import { useAuth } from '@/context/AuthContext';

const Home: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError(err instanceof Error ? err.message : 'Failed to fetch campaigns');
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="">
          <Greeting name={user?.email}/>
          <div className="">
            <CampaignList 
              campaigns={campaigns || []} 
              isLoading={isLoading} 
              error={error}
              onCampaignDeleted={handleCampaignDeleted}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
