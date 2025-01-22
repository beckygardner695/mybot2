"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderPlus,
  FolderEdit,
  Trash2,
  Plus
} from "lucide-react"

export function FolderTree({ onFolderSelect, selectedFolder }) {
  const [folders, setFolders] = useState({
    '/': {
      name: 'Root',
      children: ['images', 'videos', 'templates'],
    },
    '/images': {
      name: 'Images',
      children: ['memes', 'screenshots'],
    },
    '/videos': {
      name: 'Videos',
      children: [],
    },
    '/templates': {
      name: 'Templates',
      children: [],
    },
    '/images/memes': {
      name: 'Memes',
      children: [],
    },
    '/images/screenshots': {
      name: 'Screenshots',
      children: [],
    },
  })
  
  const [expandedFolders, setExpandedFolders] = useState(['/'])
  const [newFolderName, setNewFolderName] = useState('')
  const [newFolderParent, setNewFolderParent] = useState(null)
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false)

  const toggleFolder = (path) => {
    setExpandedFolders(prev => 
      prev.includes(path)
        ? prev.filter(p => p !== path)
        : [...prev, path]
    )
  }

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return

    const newPath = `${newFolderParent}/${newFolderName.trim()}`
    setFolders(prev => ({
      ...prev,
      [newFolderParent]: {
        ...prev[newFolderParent],
        children: [...prev[newFolderParent].children, newFolderName.trim()]
      },
      [newPath]: {
        name: newFolderName.trim(),
        children: []
      }
    }))

    setNewFolderName('')
    setShowNewFolderDialog(false)
    setExpandedFolders(prev => [...prev, newFolderParent])
  }

  const handleDeleteFolder = (path) => {
    if (path === '/') return // Prevent root deletion

    const parentPath = path.split('/').slice(0, -1).join('/')
    const folderName = path.split('/').pop()

    setFolders(prev => {
      const newFolders = { ...prev }
      delete newFolders[path]
      newFolders[parentPath] = {
        ...newFolders[parentPath],
        children: newFolders[parentPath].children.filter(c => c !== folderName)
      }
      return newFolders
    })
  }

  const renderFolder = (path) => {
    const folder = folders[path]
    const isExpanded = expandedFolders.includes(path)
    const isSelected = selectedFolder === path

    return (
      <div key={path}>
        <ContextMenu>
          <ContextMenuTrigger>
            <Button
              variant="ghost"
              className={`w-full justify-start ${isSelected ? 'bg-accent' : ''}`}
              onClick={() => onFolderSelect(path)}
            >
              <div className="flex items-center space-x-2">
                {folder.children.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFolder(path)
                    }}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                )}
                <Folder className="h-4 w-4" />
                <span>{folder.name}</span>
              </div>
            </Button>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem
              onClick={() => {
                setNewFolderParent(path)
                setShowNewFolderDialog(true)
              }}
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              New Subfolder
            </ContextMenuItem>
            {path !== '/' && (
              <ContextMenuItem
                onClick={() => handleDeleteFolder(path)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Folder
              </ContextMenuItem>
            )}
          </ContextMenuContent>
        </ContextMenu>

        {isExpanded && folder.children.length > 0 && (
          <div className="ml-6">
            {folder.children.map(child => 
              renderFolder(`${path}/${child}`)
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setNewFolderParent('/')
          setShowNewFolderDialog(true)
        }}
      >
        <Plus className="h-4 w-4 mr-2" />
        New Folder
      </Button>

      <ScrollArea className="h-[500px]">
        {renderFolder('/')}
      </ScrollArea>

      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFolderDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}