"use client"

import { useState, useEffect } from 'react'
import { Sidebar } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { MediaManager } from "@/components/media-manager"
import { FolderTree } from "@/components/folder-tree"
import { 
  FolderOpen, 
  Upload, 
  Search, 
  Grid, 
  List,
  SortAsc,
  Filter
} from "lucide-react"

export default function ContentManager() {
  const { toast } = useToast()
  const [viewMode, setViewMode] = useState('grid')
  const [selectedFolder, setSelectedFolder] = useState('/')
  const [searchQuery, setSearchQuery] = useState('')
  
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="container p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Content Manager</h1>
              <p className="text-muted-foreground">
                Organize and manage your media files
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Folder Tree */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Folders</CardTitle>
              </CardHeader>
              <CardContent>
                <FolderTree 
                  onFolderSelect={setSelectedFolder}
                  selectedFolder={selectedFolder}
                />
              </CardContent>
            </Card>

            {/* Content Area */}
            <div className="col-span-9 space-y-6">
              {/* Search and Filters */}
              <Card>
                <CardContent className="py-3">
                  <div className="flex items-center space-x-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <SortAsc className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Media Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Content</CardTitle>
                  <CardDescription>
                    {selectedFolder === '/' ? 'All content' : `Folder: ${selectedFolder}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MediaManager
                    viewMode={viewMode}
                    selectedFolder={selectedFolder}
                    searchQuery={searchQuery}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}