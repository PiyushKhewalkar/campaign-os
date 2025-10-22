import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  CalendarCurrentDate,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView,
  type CalendarEvent,
} from '@/components/ui/full-calendar';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const navigate = useNavigate();

  // Platform color mapping
  const platformColors: { [key: string]: 'blue' | 'green' | 'pink' | 'purple' | 'default' } = {
    'instagram': 'pink',
    'twitter': 'blue',
    'linkedin': 'blue',
    'reddit': 'purple',
  };

  const getPlatformColor = (platform: string) => {
    return platformColors[platform.toLowerCase()] || 'default';
  };

  const fetchScheduledPosts = async (page: number = 1, append: boolean = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);
      
      // Get all scheduled posts directly from the new API endpoint
      const { postAPI } = await import('@/api');
      const response = await postAPI.getAllScheduledPosts();
      const scheduledPosts = response.posts;

      // Implement client-side pagination for better performance
      const ITEMS_PER_PAGE = 20;
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginatedPosts = scheduledPosts.slice(startIndex, endIndex);

      const calendarEvents: CalendarEvent[] = paginatedPosts.map(post => {
        const scheduledDate = new Date(post.scheduled_on!);
        // normalize to start of day
        scheduledDate.setHours(0,0,0,0);
        return {
          id: post._id,
          start: scheduledDate,
          end: scheduledDate,
          title: `${post.platform}: ${post.script?.[0]?.text || 'Scheduled Post'}`,
          color: getPlatformColor(post.platform),
        };
      });

      if (append) {
        setEvents(prev => [...prev, ...calendarEvents]);
      } else {
        setEvents(calendarEvents);
      }

      // Check if there are more items
      setHasMore(endIndex < scheduledPosts.length);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error fetching scheduled posts:', err);
      setError('Failed to load scheduled posts');
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMoreEvents = () => {
    if (!isLoadingMore && hasMore) {
      fetchScheduledPosts(currentPage + 1, true);
    }
  };

  useEffect(() => {
    fetchScheduledPosts();
  }, []);

  const handleEventClick = (event: CalendarEvent) => {
    if (event?.id) {
      navigate(`/posts/${event.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading calendar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => fetchScheduledPosts()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Content Calendar</h1>
        <p className="text-muted-foreground">
          View and manage your scheduled posts across all platforms
        </p>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-3">
          {Object.entries(platformColors).map(([platform, color]) => (
            <div key={platform} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                color === 'blue' ? 'bg-blue-500' :
                color === 'green' ? 'bg-green-500' :
                color === 'pink' ? 'bg-pink-500' :
                color === 'purple' ? 'bg-purple-500' :
                'bg-primary'
              }`} />
              <span className="text-sm capitalize">{platform}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Container */}
      <div className="h-[600px]">
        <div className="p-0 h-full overflow-x-auto">
          <Calendar
            events={events}
            onEventClick={handleEventClick}
            defaultDate={new Date()}
            view="month"
          >
            {/* Calendar Controls inside provider to access context */}
            <div className="flex items-center justify-between p-4 border-b min-w-[640px]">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                <CalendarCurrentDate />
              </div>
              <div className="flex items-center gap-2">
                <CalendarViewTrigger view="week">Week</CalendarViewTrigger>
                <CalendarViewTrigger view="month">Month</CalendarViewTrigger>
              </div>
              <div className="flex items-center gap-2">
                <CalendarPrevTrigger>
                  <ChevronLeft className="h-4 w-4" />
                </CalendarPrevTrigger>
                <CalendarTodayTrigger>Today</CalendarTodayTrigger>
                <CalendarNextTrigger>
                  <ChevronRight className="h-4 w-4" />
                </CalendarNextTrigger>
              </div>
            </div>

            <div className="min-w-[640px]">
              <CalendarMonthView />
              <CalendarWeekView />
            </div>
          </Calendar>
        </div>
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-6 flex justify-center">
          <Button 
            onClick={() => loadMoreEvents()}
            disabled={isLoadingMore}
            variant="outline"
            className="w-full sm:w-auto"
          >
            {isLoadingMore ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                Loading more events...
              </>
            ) : (
              'Load More Events'
            )}
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">posts scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter(event => {
                const now = new Date();
                const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
                const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));
                return event.start >= weekStart && event.start <= weekEnd;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">posts this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter(event => {
                const today = new Date();
                return event.start.toDateString() === today.toDateString();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">posts today</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarPage;
