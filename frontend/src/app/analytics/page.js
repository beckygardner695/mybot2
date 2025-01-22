"use client"

import { useState, useEffect } from 'react'
import { Sidebar } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, Cell
} from 'recharts'
import {
  ArrowUp, ArrowDown, TrendingUp, Clock,
  BarChart2, PieChart as PieChartIcon,
  Activity, Users, MessageSquare,
  AlertTriangle, CheckCircle2
} from 'lucide-react'

// Mock data generators
const generateTimeSeriesData = (days = 30) => {
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    posts: Math.floor(Math.random() * 20),
    upvotes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 100),
    engagement: Math.random() * 10
  }))
}

const generateSubredditData = () => [
  { name: 'r/programming', posts: 45, upvotes: 2300, comments: 180, engagement: 8.5 },
  { name: 'r/webdev', posts: 32, upvotes: 1800, comments: 150, engagement: 7.8 },
  { name: 'r/reactjs', posts: 28, upvotes: 1500, comments: 120, engagement: 7.2 },
]

const generatePostPerformance = () => [
  { status: 'High Performing', value: 35, color: '#22c55e' },
  { status: 'Average', value: 45, color: '#3b82f6' },
  { status: 'Underperforming', value: 20, color: '#ef4444' },
]

export default function Analytics() {
  const [dateRange, setDateRange] = useState('30d')
  const [activeTab, setActiveTab] = useState('overview')
  const [timeSeriesData] = useState(generateTimeSeriesData())
  const [subredditData] = useState(generateSubredditData())
  const [performanceData] = useState(generatePostPerformance())

  // Calculate summary metrics
  const totalPosts = timeSeriesData.reduce((sum, day) => sum + day.posts, 0)
  const totalUpvotes = timeSeriesData.reduce((sum, day) => sum + day.upvotes, 0)
  const totalComments = timeSeriesData.reduce((sum, day) => sum + day.comments, 0)
  const avgEngagement = timeSeriesData.reduce((sum, day) => sum + day.engagement, 0) / timeSeriesData.length

  // Calculate trends
  const getPercentageChange = (metric) => {
    const midPoint = Math.floor(timeSeriesData.length / 2)
    const recent = timeSeriesData.slice(midPoint).reduce((sum, day) => sum + day[metric], 0)
    const previous = timeSeriesData.slice(0, midPoint).reduce((sum, day) => sum + day[metric], 0)
    return ((recent - previous) / previous * 100).toFixed(1)
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="container p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Track your Reddit posts performance and engagement
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                Export Data
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPosts}</div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className={getPercentageChange('posts') > 0 ? 'text-green-500' : 'text-red-500'}>
                    {getPercentageChange('posts')}%
                  </span>
                  <span className="text-muted-foreground">vs previous period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Upvotes</CardTitle>
                <ArrowUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUpvotes}</div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className={getPercentageChange('upvotes') > 0 ? 'text-green-500' : 'text-red-500'}>
                    {getPercentageChange('upvotes')}%
                  </span>
                  <span className="text-muted-foreground">vs previous period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Comments</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalComments}</div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className={getPercentageChange('comments') > 0 ? 'text-green-500' : 'text-red-500'}>
                    {getPercentageChange('comments')}%
                  </span>
                  <span className="text-muted-foreground">vs previous period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgEngagement.toFixed(1)}</div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className={getPercentageChange('engagement') > 0 ? 'text-green-500' : 'text-red-500'}>
                    {getPercentageChange('engagement')}%
                  </span>
                  <span className="text-muted-foreground">vs previous period</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="subreddits">Subreddits</TabsTrigger>
              <TabsTrigger value="posts">Posts</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Time Series Chart */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Performance Over Time</CardTitle>
                    <CardDescription>Track your posts' performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={timeSeriesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="upvotes"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            name="Upvotes"
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="comments"
                            stroke="#22c55e"
                            strokeWidth={2}
                            name="Comments"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Post Performance Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Post Performance Distribution</CardTitle>
                    <CardDescription>Performance categories of your posts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={performanceData}
                            dataKey="value"
                            nameKey="status"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                          >
                            {performanceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Subreddit Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Subreddits</CardTitle>
                    <CardDescription>Performance by subreddit</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={subredditData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="upvotes" fill="#3b82f6" name="Upvotes" />
                          <Bar dataKey="comments" fill="#22c55e" name="Comments" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Additional tabs content will be implemented next */}
          </Tabs>
        </div>
      </div>
    </div>
  )
}