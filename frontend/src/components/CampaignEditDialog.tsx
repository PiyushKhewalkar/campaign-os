import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
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
import { campaignAPI, type Campaign, type UpdateCampaignData } from "../utils/api"
import { showToast } from "../utils/toast"

interface CampaignEditDialogProps {
  campaign: Campaign | null
  isOpen: boolean
  onClose: () => void
  onSuccess: (updatedCampaign: Campaign) => void
}

const CampaignEditDialog = ({ campaign, isOpen, onClose, onSuccess }: CampaignEditDialogProps) => {
  const [formData, setFormData] = useState({
    title: campaign?.title || "",
    description: campaign?.description || "",
    startDate: campaign?.startDate ? new Date(campaign.startDate).toISOString().split('T')[0] : "",
    endDate: campaign?.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : "",
    platforms: campaign?.platforms || []
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const platformOptions = [
    { value: 'x', label: 'X (Twitter)' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'reddit', label: 'Reddit' }
  ]

  // Keep form in sync when a different campaign is selected or dialog opened
  useEffect(() => {
    setFormData({
      title: campaign?.title || "",
      description: campaign?.description || "",
      startDate: campaign?.startDate ? new Date(campaign.startDate).toISOString().split('T')[0] : "",
      endDate: campaign?.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : "",
      platforms: campaign?.platforms || []
    })
  }, [campaign, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!campaign) return

    setIsLoading(true)
    setError("")

    try {
      const updateData: UpdateCampaignData = {
        title: formData.title,
        description: formData.description,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        platforms: formData.platforms
      }

      const response = await campaignAPI.updateCampaign(campaign._id, updateData)
      onSuccess(response.updatedCampaign)
      showToast.campaignUpdated()
      onClose()
    } catch (error) {
      console.error("Error updating campaign:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to update campaign. Please try again."
      setError(errorMessage)
      showToast.error("Failed to update campaign", "Please try again")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlatformChange = (platform: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      platforms: checked 
        ? [...prev.platforms, platform]
        : prev.platforms.filter(p => p !== platform)
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Campaign</DialogTitle>
          <DialogDescription>
            Make changes to your campaign here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Campaign title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Campaign description"
                rows={3}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Platforms</Label>
              <div className="grid grid-cols-2 gap-2">
                {platformOptions.map((platform) => (
                  <label key={platform.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.platforms.includes(platform.value)}
                      onChange={(e) => handlePlatformChange(platform.value, e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">{platform.label}</span>
                  </label>
                ))}
              </div>
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

export default CampaignEditDialog
