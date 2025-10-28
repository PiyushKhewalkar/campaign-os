import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postAPI, type Post as PostType } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';

const Post: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      try {
        setLoading(true);
        setError(null);
        const res = await postAPI.getPost(postId);
        setPost(res.post);
      } catch (e: any) {
        setError(e?.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  return (
    <div className="space-y-6 pb-16">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/campaigns">campaigns</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>post details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading post...</p>
        </div>
      ) : error || !post ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">{error || 'Post not found'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-medium capitalize">{post.platform} post</h1>
            <p className="text-sm text-muted-foreground">Status: {post.status}</p>
            {post.scheduled_on && (
              <p className="text-sm text-muted-foreground">Scheduled: {new Date(post.scheduled_on).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            )}
          </div>

          <div className="border rounded-lg p-4 space-y-3">
            <h2 className="text-lg font-semibold">Content</h2>
            {Array.isArray(post.script) && post.script.length > 0 ? (
              <div className="space-y-4">
                {post.script.map((item: any, idx: number) => (
                  <div key={idx} className="text-sm space-y-3">
                    {typeof item === 'object' ? (
                      <>
                        {/* Show image placeholder if media_description exists */}
                        {item.media_description && (
                          <div className="relative w-full max-w-2xl aspect-video bg-muted rounded-lg overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center p-6">
                              <div className="text-center space-y-3">
                                <svg className="w-16 h-16 mx-auto text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm text-muted-foreground font-medium">{item.media_description}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Show other fields except media_description */}
                        <div className="space-y-2">
                          {Object.entries(item).map(([k, v]) => {
                            if (k === 'media_description') return null;
                            return (
                              <div key={k}>
                                <span className="font-medium capitalize">{k}: </span>
                                <span>{String(v)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div>{String(item)}</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No content available.</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to={`/campaigns/${post.campaignId}`}>Back to Campaign</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;