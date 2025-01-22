"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export function FilePreviewDialog({ 
  file, 
  open, 
  onOpenChange,
  onMetadataChange 
}) {
  const [metadata, setMetadata] = useState({
    title: file?.name || '',
    description: file?.description || '',
    tags: file?.tags || [],
    customFields: file?.customFields || {}
  })
  const [newTag, setNewTag] = useState('')

  const handleMetadataSave = () => {
    onMetadataChange(metadata)
  }

  const addTag = () => {
    if (newTag && !metadata.tags.includes(newTag)) {
      setMetadata(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tag) => {
    setMetadata(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>{file?.name}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="preview" className="h-full">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="h-[calc(100%-2rem)]">
            <div className="h-full flex items-center justify-center bg-accent rounded-lg">
              {file?.type?.startsWith('image/') ? (
                <img
                  src={file.url}
                  alt={file.name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : file?.type?.startsWith('video/') ? (
                <video
                  src={file.url}
                  controls
                  className="max-h-full max-w-full"
                />
              ) : (
                <div className="text-center">
                  <File className="h-16 w-16 mx-auto mb-4" />
                  <p>Preview not available</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="metadata" className="h-[calc(100%-2rem)]">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={metadata.title}
                    onChange={(e) => setMetadata(prev => ({
                      ...prev,
                      title: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={metadata.description}
                    onChange={(e) => setMetadata(prev => ({
                      ...prev,
                      description: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {metadata.tags.map(tag => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add new tag"
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button onClick={addTag}>Add</Button>
                  </div>
                </div>
                <div>
                  <Label>File Information</Label>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Size: {file?.size}</p>
                    <p>Type: {file?.type}</p>
                    <p>Created: {file?.created}</p>
                    <p>Last Modified: {file?.modified}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Button onClick={handleMetadataSave}>Save Changes</Button>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}