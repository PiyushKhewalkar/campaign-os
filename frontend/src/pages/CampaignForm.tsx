import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"
import { campaignAPI } from "@/api"

const platformsList = [
  { id: "x", name: "X (Twitter)" },
  { id: "linkedin", name: "LinkedIn" },
  { id: "instagram", name: "Instagram" },
  { id: "reddit", name: "Reddit" },
]

const CampaignForm = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    platforms: [] as string[],
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNext = () => {
    // validation by step
    if (step === 0 && (!formData.title || !formData.description)) {
      setError("Please fill in all fields.")
      return
    }
    if (step === 1 && (!formData.startDate || !formData.endDate)) {
      setError("Please select both start and end dates.")
      return
    }
    if (step === 1 && formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate)
      const endDate = new Date(formData.endDate)
      if (startDate > endDate) {
        setError("Start date cannot be after end date.")
        return
      }
    }
    if (step === 2 && formData.platforms.length === 0) {
      setError("Please select at least one platform.")
      return
    }

    if (step < 2) {
      setStep(step + 1)
      setError("")
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
      setError("")
    }
  }

  const togglePlatform = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(id)
        ? prev.platforms.filter((p) => p !== id)
        : [...prev.platforms, id],
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError("")
    try {
      // simulate API call
      const response = await campaignAPI.createCampaign(formData)
      console.log("✅ Campaign Created:", response)
      navigate(`/campaigns`) // redirect
    } catch (err) {
      console.error(err)
      setError("Failed to create campaign. Try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Progress bar */}
      <div className="flex justify-center gap-2 p-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "h-2 flex-1 rounded-full transition-colors",
              i <= step ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>

      {/* Step Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Step 0 — Basic Info */}
        {step === 0 && (
          <>
            <h1 className="text-2xl font-semibold mb-6">Campaign Details</h1>
            <div className="space-y-4">
              <Input
                placeholder="Campaign title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <Textarea
                placeholder="Describe your campaign..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
          </>
        )}

        {/* Step 1 — Dates */}
        {step === 1 && (
          <>
            <h1 className="text-2xl font-semibold mb-6">Set campaign duration</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Start Date</label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">End Date</label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
          </>
        )}

        {/* Step 2 — Platforms */}
        {step === 2 && (
          <>
            <h1 className="text-2xl font-semibold mb-6">Select platforms</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {platformsList.map((p) => (
                <div
                  key={p.id}
                  onClick={() => togglePlatform(p.id)}
                  className={cn(
                    "border p-3 rounded-md cursor-pointer transition-colors select-none text-center",
                    formData.platforms.includes(p.id)
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-primary/40"
                  )}
                >
                  {p.name}
                </div>
              ))}
            </div>
            {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
          </>
        )}
      </div>

      {/* Sticky Footer */}
      <div className="p-4 border-t bg-background sticky bottom-0">
        <div className="flex gap-3">
          {step > 0 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1"
              disabled={isSubmitting}
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Creating..."
              : step < 2
              ? "Next"
              : "Create Campaign"}
          </Button>
        </div>
      </div>
    </div>
  )
}


export default CampaignForm