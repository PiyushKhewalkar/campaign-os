import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postAPI, type Post } from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ChevronRight } from 'lucide-react';

const CalendarPreview: React.FC = () => {
  const [upcomingPosts, setUpcomingPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Platform color mapping
  const platformColors: { [key: string]: string } = {
    'instagram': 'bg-pink-500',
    'twitter': 'bg-blue-500',
    'x': 'bg-blue-500',
    'linkedin': 'bg-blue-600',
    'reddit': 'bg-purple-500',
  };

  const getPlatformColor = (platform: string) => {
    return platformColors[platform.toLowerCase()] || 'bg-primary';
  };

  const fetchUpcomingPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await postAPI.getAllScheduledPosts();
      const scheduledPosts = response.posts;

      // Sort by scheduled date and take only the next 5 upcoming posts
      const upcoming = scheduledPosts
        .filter(post => {
          if (!post.scheduled_on) return false;
          const scheduledDate = new Date(post.scheduled_on);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return scheduledDate >= today;
        })
        .sort((a, b) => {
          const dateA = new Date(a.scheduled_on!);
          const dateB = new Date(b.scheduled_on!);
          return dateA.getTime() - dateB.getTime();
        })
        .slice(0, 5);

      setUpcomingPosts(upcoming);
    } catch (err) {
      console.error('Error fetching upcoming posts:', err);
      setError('Failed to load upcoming posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingPosts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const getPostPreview = (post: Post) => {
    if (post.script && Array.isArray(post.script) && post.script.length > 0) {
      const firstScript = post.script[0];
      if (typeof firstScript === 'object' && firstScript.text) {
        return firstScript.text.length > 60 
          ? firstScript.text.substring(0, 60) + '...'
          : firstScript.text;
      } else if (typeof firstScript === 'string') {
        return firstScript.length > 60 
          ? firstScript.substring(0, 60) + '...'
          : firstScript;
      }
    }
    return 'Scheduled post';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-destructive text-sm">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchUpcomingPosts}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (upcomingPosts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No upcoming posts scheduled</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create campaigns and schedule posts to see them here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Posts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingPosts.map((post) => (
            <div
              key={post._id}
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => navigate(`/posts/${post._id}`)}
            >
              <div className={`w-3 h-3 rounded-full ${getPlatformColor(post.platform)}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium capitalize">{post.platform}</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(post.scheduled_on!)}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {getPostPreview(post)}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarPreview;
