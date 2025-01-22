// Add to imports
import { FlairSelector } from "@/components/flair-selector"
import { validateFlair } from "@/lib/flair-validation"

// Add validation check before scheduling/posting
const validatePost = () => {
  const subreddits = currentDraft.subreddits.split(',').map(s => s.trim())
  
  for (const subreddit of subreddits) {
    const error = validateFlair(subreddit, currentDraft.flair)
    if (error) {
      toast({
        title: "Invalid Flair",
        description: error,
        variant: "destructive"
      })
      return false
    }
  }
  
  return true
}

// Update handleSchedulePost
const handleSchedulePost = (scheduleDetails) => {
  if (!validatePost()) return

  // ... rest of the scheduling logic ...
}

// Add inside CardContent, after the NSFW switch
<FlairSelector
  subreddits={currentDraft.subreddits}
  flairsBySubreddit={flairsBySubreddit}
  currentFlair={currentDraft.flair}
  onFlairChange={(flair) => setCurrentDraft({
    ...currentDraft,
    flair: flair
  })}
  onCustomFlairAdd={(customFlair) => {
    // Add custom flair to flairsBySubreddit
    setFlairsBySubreddit(prev => ({
      ...prev,
      [customFlair.subreddit]: [
        ...(prev[customFlair.subreddit] || []),
        customFlair
      ]
    }))
    // Set as current flair
    setCurrentDraft({
      ...currentDraft,
      flair: customFlair
    })
  }}
/>

// Update the preview dialog content to include flair
{currentDraft.flair && (
  <Badge
    style={{
      backgroundColor: currentDraft.flair.backgroundColor,
      color: currentDraft.flair.textColor,
    }}
    className="mb-2"
  >
    {currentDraft.flair.text}
  </Badge>
)}