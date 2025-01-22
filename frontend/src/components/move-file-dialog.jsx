"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Folder, ChevronRight } from "lucide-react"

export function MoveFileDialog({
  open,
  onOpenChange,
  folders,
  currentFolder,
  onMove
}) {
  const [selectedFolder, setSelectedFolder] = useState(currentFolder)

  const renderFolder = (path, indent = 0) => {
    const folder = folders[path]
    if (!folder) return null

    return (
      <div key={path}>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start",
            selectedFolder === path ? "bg-accent" : ""
          )}
          style={{ paddingLeft: `${indent * 1.5 + 1}rem` }}
          onClick={() => setSelectedFolder(path)}
        >
          <Folder className="h-4 w-4 mr-2" />
          {folder.name}
        </Button>
        {folder.children.map(child => 
          renderFolder(`${path}/${child}`, indent + 1)
        )}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move File</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          {renderFolder('/')}
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => {
              onMove(selectedFolder)
              onOpenChange(false)
            }}
            disabled={selectedFolder === currentFolder}
          >
            Move Here
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}