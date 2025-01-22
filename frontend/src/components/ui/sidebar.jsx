"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Calendar,
  FileText,
  BarChart2,
  Users,
  FolderOpen,
  MessageSquare,
  Settings,
  Upload,
  Megaphone
} from "lucide-react"

const navigation = [
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  {
    name: 'Posts',
    href: '/posts',
    icon: FileText,
    children: [
      { name: 'Scheduler', href: '/posts/scheduler' },
      { name: 'Promotions', href: '/posts/promotions' },
      { name: 'Bulk Upload', href: '/posts/bulk-upload' },
    ],
  },
  { 
    name: 'Analytics', 
    href: '/analytics', 
    icon: BarChart2,
    children: [
      { name: 'Overview', href: '/analytics' },
      { name: 'Post Performance', href: '/analytics/posts' },
      { name: 'Subreddit Analysis', href: '/analytics/subreddits' },
    ]
  },
  { name: 'Subreddits', href: '/subreddits', icon: Users },
  { name: 'Content Manager', href: '/content', icon: FolderOpen },
  {
    name: 'Autoresponders',
    href: '/autoresponders',
    icon: MessageSquare,
    children: [
      { name: 'Comment', href: '/autoresponders/comment' },
      { name: 'Message', href: '/autoresponders/message' },
    ],
  },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col fixed left-0 top-0 border-r bg-background">
      <div className="p-4">
        <h2 className="text-lg font-semibold">RedditPulse</h2>
      </div>
      
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const IconComponent = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          
          return (
            <div key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <IconComponent className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
              
              {item.children && (
                <div className="ml-8 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      className={cn(
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                        pathname === child.href
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}