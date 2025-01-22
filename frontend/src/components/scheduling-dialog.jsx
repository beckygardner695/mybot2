"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { format } from 'date-fns'
import { Clock, RefreshCw } from "lucide-react"

export function SchedulingDialog({ 
  open, 
  onOpenChange, 
  onSchedule, 
  initialDate = new Date() 
}) {
  const [selectedDate, setSelectedDate] = useState(initialDate)
  const [selectedTime, setSelectedTime] = useState("12:00")
  const [recurring, setRecurring] = useState(false)
  const [recurringInterval, setRecurringInterval] = useState("weekly")

  const handleSchedule = () => {
    const scheduledDateTime = new Date(selectedDate)
    const [hours, minutes] = selectedTime.split(":")
    scheduledDateTime.setHours(parseInt(hours), parseInt(minutes))

    onSchedule({
      scheduledFor: scheduledDateTime.toISOString(),
      recurring,
      recurringInterval: recurring ? recurringInterval : null
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Time</label>
            <Input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={recurring}
              onCheckedChange={setRecurring}
            />
            <span>Make this a recurring post</span>
          </div>

          {recurring && (
            <Select value={recurringInterval} onValueChange={setRecurringInterval}>
              <SelectTrigger>
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          )}

          <div className="text-sm text-muted-foreground">
            This post will be published on{' '}
            {format(selectedDate, 'MMMM d, yyyy')} at {selectedTime}
            {recurring && ` and repeat ${recurringInterval}`}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSchedule}>
            <Clock className="mr-2 h-4 w-4" />
            Schedule Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}