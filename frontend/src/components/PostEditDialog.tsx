import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { postAPI, type Post, type UpdatePostData } from "../api"

interface PostEditDialogProps {
  post: Post | null
  isOpen: boolean
  onClose: () => void
  onSuccess: (updatedPost: Post) => void
}

const PostEditDialog = ({ post, isOpen, onClose, onSuccess }: PostEditDialogProps) => {
  const [script, setScript] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Initialize script when post changes
  useEffect(() => {
    if (post?.script && Array.isArray(post.script)) {
      // Convert script array to string for editing
      const scriptText = post.script.map(item => {
        if (typeof item === 'object') {
          return Object.entries(item).map(([key, value]) => `${key}: ${value}`).join('\n')
        }
        return String(item)
      }).join('\n\n')
      setScript(scriptText)
    } else {
      setScript("")
    }
  }, [post])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!post) return

    setIsLoading(true)
    setError("")

    try {
      // Convert script text back to array format
      const scriptArray = script.split('\n\n').map(block => {
        const lines = block.split('\n')
        if (lines.length === 1) {
          return lines[0]
        }
        // If multiple lines, create object
        const obj: any = {}
        lines.forEach(line => {
          const [key, ...valueParts] = line.split(': ')
          if (key && valueParts.length > 0) {
            obj[key] = valueParts.join(': ')
          }
        })
        return Object.keys(obj).length > 0 ? obj : block
      })

      const updateData: UpdatePostData = {
        script: scriptArray
      }

      // optimistic update object
      const optimisticPost: Post = { ...post, script: scriptArray }
      onSuccess(optimisticPost)
      onClose()

      // sync with server
      const response = await postAPI.updatePost(post._id, updateData)
      // ensure parent has the server copy (could be same)
      onSuccess(response.post)
    } catch (error) {
      console.error("Error updating post:", error)
      setError("Failed to update post. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Post Content</DialogTitle>
          <DialogDescription>
            Edit the script content for this post. You can format it as plain text or use the format "key: value" for structured content.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="script">Post Script</Label>
              <Textarea
                id="script"
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Enter your post content here..."
                rows={8}
                required
                className="min-h-[200px]"
              />
            </div>
            {error && (
              <div className="text-sm text-red-500">{error}</div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default PostEditDialog
