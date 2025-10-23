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
              <div className="space-y-2">
                {post.script.map((item: any, idx: number) => (
                  <div key={idx} className="text-sm">
                    {typeof item === 'object' ? (
                      Object.entries(item).map(([k, v]) => (
                        <div key={k}>
                          <span className="font-medium capitalize">{k}: </span>
                          <span>{String(v)}</span>
                        </div>
                      ))
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