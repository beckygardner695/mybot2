"use client"

import { useState, useEffect } from 'react'
import { Sidebar } from "@/components/ui/sidebar"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { format, isSameDay } from 'date-fns'
import { Clock, Calendar as CalendarIcon, Edit, Trash2, RefreshCw } from "lucide-react"

// Helper function to group posts by date
const groupPostsByDate = (posts) => {
  const grouped = {}
  posts.forEach(post => {
    const dateKey = format(new Date(post.scheduledFor), 'yyyy-MM-dd')
    if (!grouped[dateKey]) {
      grouped[dateKey] = []
    }
    grouped[dateKey].push(post)
  })
  return grouped
}

export default function CalendarView() {
  const { toast } = useToast()
  const [date, setDate] = useState(new Date())
  const [selectedPost, setSelectedPost] = useState(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [scheduledPosts, setScheduledPosts] = useState([])
  const [viewMode, setViewMode] = useState('month') // month, week, day

  // Load scheduled posts from localStorage on mount
  useEffect(() => {
    const savedPosts = localStorage.getItem('scheduledPosts')
    if (savedPosts) {
      setScheduledPosts(JSON.parse(savedPosts))
    }
  }, [])

  // Get posts for selected date
  const getPostsForDate = (date) => {
    return scheduledPosts.filter(post => 
      isSameDay(new Date(post.scheduledFor), date)
    )
  }

  // Custom calendar day render to show post indicators
  const renderCalendarDay = (day) => {
    const posts = getPostsForDate(day)
    return (
      <div className="relative w-full h-full">
        <div className="absolute top-0 right-0">
          {posts.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {posts.length}
            </Badge>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="container p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Content Calendar</h1>
              <p className="text-muted-foreground">Manage your scheduled posts</p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month View</SelectItem>
                  <SelectItem value="week">Week View</SelectItem>
                  <SelectItem value="day">Day View</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Schedule Calendar</CardTitle>
                <CardDescription>View and manage scheduled posts</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  components={{
                    DayContent: renderCalendarDay
                  }}
                />
              </CardContent>
            </Card>

            {/* Scheduled Posts for Selected Date */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Posts for {format(date, 'MMMM d, yyyy')}
                </CardTitle>
                <CardDescription>
                  {getPostsForDate(date).length} posts scheduled
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {getPostsForDate(date).map((post) => (
                      <Card key={post.id} className="relative">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base">
                                {post.title}
                              </CardTitle>
                              <CardDescription>
                                {format(new Date(post.scheduledFor), 'h:mm a')}
                              </CardDescription>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedPost(post)
                                  setEditDialogOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  // Handle delete
                                  const updatedPosts = scheduledPosts.filter(p => p.id !== post.id)
                                  setScheduledPosts(updatedPosts)
                                  localStorage.setItem('scheduledPosts', JSON.stringify(updatedPosts))
                                  toast({
                                    title: "Post removed",
                                    description: "The scheduled post has been removed."
                                  })
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {post.subreddits.split(',').map((subreddit, i) => (
                              <Badge key={i} variant="secondary">
                                {subreddit.trim()}
                              </Badge>
                            ))}
                            {post.isNsfw && (
                              <Badge variant="destructive">NSFW</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {post.content}
                          </p>
                          {post.recurring && (
                            <Badge variant="outline" className="mt-2">
                              <RefreshCw className="mr-1 h-3 w-3" />
                              Recurring
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Schedule Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Scheduled Post</DialogTitle>
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-4">
              {/* Add scheduling form components here */}
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  // Handle save changes
                  setEditDialogOpen(false)
                  toast({
                    title: "Schedule updated",
                    description: "The post schedule has been updated."
                  })
                }}>
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}