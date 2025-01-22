"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Power, Settings, Activity, MessageSquare } from "lucide-react"
import { Sidebar } from "@/components/ui/sidebar"

// Temporary mock data - will be replaced with actual bot data
const activityData = [
  { time: '00:00', posts: 4 },
  { time: '04:00', posts: 6 },
  { time: '08:00', posts: 8 },
  { time: '12:00', posts: 12 },
  { time: '16:00', posts: 7 },
  { time: '20:00', posts: 5 },
]

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64"> {/* Offset by sidebar width */}
        <div className="container p-6">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Reddit Bot Dashboard</h1>
              <p className="text-muted-foreground">Monitor and control your Reddit bot</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="default" size="default">
                <Power className="h-4 w-4 mr-2" />
                Start Bot
              </Button>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bot Status</CardTitle>
                <Activity className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Badge variant="success">Active</Badge>
                  <span className="text-sm text-muted-foreground">Last active: 2m ago</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Posts Today</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">+12% from yesterday</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.5%</div>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </CardContent>
            </Card>
          </div>

          {/* Activity Graph */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Posting Activity</CardTitle>
              <CardDescription>Posts per hour over the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="posts" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest bot actions and posts</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] w-full">
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center space-x-4 border-b pb-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Posted to r/subreddit</p>
                        <p className="text-sm text-muted-foreground">
                          "Example post title {i}"
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">Success</Badge>
                          <span className="text-xs text-muted-foreground">2 minutes ago</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}