"use client"

import { useState, useEffect } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tag, Plus, AlertCircle } from "lucide-react"
import { validateFlair, getAvailableFlairs, isCustomFlairAllowed } from "@/lib/flair-validation"

export function FlairSelector({ 
  subreddits, 
  currentFlair, 
  onFlairChange,
  onCustomFlairAdd 
}) {
  const [selectedSubreddit, setSelectedSubreddit] = useState("")
  const [customFlair, setCustomFlair] = useState({
    text: "",
    backgroundColor: "#e2e8f0",
    textColor: "#1e293b"
  })
  const [validationError, setValidationError] = useState(null)

  // Update available flairs when subreddit changes
  useEffect(() => {
    if (selectedSubreddit) {
      const error = validateFlair(selectedSubreddit, currentFlair)
      setValidationError(error)
    }
  }, [selectedSubreddit, currentFlair])

  const subredditList = subreddits.split(',').map(s => s.trim()).filter(Boolean)
  const availableFlairs = selectedSubreddit ? getAvailableFlairs(selectedSubreddit) : []
  const allowCustom = selectedSubreddit ? isCustomFlairAllowed(selectedSubreddit) : false

  const handleFlairChange = (flair) => {
    const error = validateFlair(selectedSubreddit, flair)
    setValidationError(error)
    onFlairChange(error ? null : flair)
  }

  const handleCustomFlairAdd = (customFlair) => {
    const error = validateFlair(selectedSubreddit, customFlair)
    setValidationError(error)
    if (!error) {
      onCustomFlairAdd(customFlair)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Tag className="h-4 w-4" />
          <span className="text-sm font-medium">Post Flair</span>
        </div>
        {validationError && (
          <Badge variant="destructive" className="text-xs">
            Invalid Flair
          </Badge>
        )}
      </div>

      {/* Current Flair Display */}
      {currentFlair?.text && (
        <div className="flex items-center space-x-2">
          <Badge
            style={{
              backgroundColor: currentFlair.backgroundColor,
              color: currentFlair.textColor,
            }}
          >
            {currentFlair.text}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFlairChange(null)}
          >
            Remove
          </Button>
        </div>
      )}

      {/* Validation Error Display */}
      {validationError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {validationError}
          </AlertDescription>
        </Alert>
      )}

      {/* Flair Selection */}
      <div className="flex flex-col space-y-2">
        <Select
          value={selectedSubreddit}
          onValueChange={setSelectedSubreddit}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select subreddit for flair" />
          </SelectTrigger>
          <SelectContent>
            {subredditList.map((subreddit) => (
              <SelectItem key={subreddit} value={subreddit}>
                r/{subreddit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedSubreddit && (
          <>
            <div className="flex flex-wrap gap-2">
              {availableFlairs.map((flair) => (
                <Badge
                  key={flair.id}
                  style={{
                    backgroundColor: flair.backgroundColor,
                    color: flair.textColor,
                    cursor: 'pointer'
                  }}
                  className="hover:opacity-80 transition-opacity"
                  onClick={() => handleFlairChange({ ...flair, subreddit: selectedSubreddit })}
                >
                  {flair.text}
                </Badge>
              ))}
              
              {/* Custom Flair Creator */}
              {allowCustom && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Custom Flair
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium">Create Custom Flair</h4>
                      <div className="space-y-2">
                        <Input
                          placeholder="Flair text"
                          value={customFlair.text}
                          onChange={(e) => setCustomFlair({
                            ...customFlair,
                            text: e.target.value
                          })}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-muted-foreground">
                              Background Color
                            </label>
                            <Input
                              type="color"
                              value={customFlair.backgroundColor}
                              onChange={(e) => setCustomFlair({
                                ...customFlair,
                                backgroundColor: e.target.value
                              })}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">
                              Text Color
                            </label>
                            <Input
                              type="color"
                              value={customFlair.textColor}
                              onChange={(e) => setCustomFlair({
                                ...customFlair,
                                textColor: e.target.value
                              })}
                            />
                          </div>
                        </div>
                        <div className="pt-2">
                          <Badge
                            style={{
                              backgroundColor: customFlair.backgroundColor,
                              color: customFlair.textColor,
                            }}
                          >
                            {customFlair.text || 'Preview'}
                          </Badge>
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => handleCustomFlairAdd({
                            ...customFlair,
                            id: `custom-${Date.now()}`,
                            subreddit: selectedSubreddit
                          })}
                          disabled={!customFlair.text}
                        >
                          Add Custom Flair
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}