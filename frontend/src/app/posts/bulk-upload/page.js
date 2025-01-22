"use client"

import { useState } from 'react'
import { Sidebar } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Download, 
  Upload, 
  FileSpreadsheet, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react"
import * as XLSX from 'xlsx'

export default function BulkUpload() {
  const { toast } = useToast()
  const [uploadedFile, setUploadedFile] = useState(null)
  const [parsedData, setParsedData] = useState([])
  const [validationResults, setValidationResults] = useState([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState('idle') // idle, validating, uploading, complete, error

  // Template structure for download
  const templateData = [
    {
      title: "Example Post Title",
      content: "Post content here",
      subreddit: "subreddit_name",
      scheduled_time: "YYYY-MM-DD HH:mm",
      flair: "Post Flair",
      nsfw: "false",
      spoiler: "false",
      auto_delete_hours: "24",
      auto_delete_score: "0"
    }
  ]

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet(templateData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Template")
    XLSX.writeFile(wb, "reddit_bulk_upload_template.xlsx")
  }

  const validateRow = (row, index) => {
    const errors = []
    
    // Required fields
    if (!row.title?.trim()) errors.push("Title is required")
    if (!row.subreddit?.trim()) errors.push("Subreddit is required")
    
    // Title length
    if (row.title?.length > 300) errors.push("Title exceeds 300 characters")
    
    // Valid datetime
    if (row.scheduled_time) {
      const date = new Date(row.scheduled_time)
      if (isNaN(date.getTime())) errors.push("Invalid scheduled time format")
      if (date < new Date()) errors.push("Scheduled time must be in the future")
    }
    
    // Numeric values
    if (row.auto_delete_hours && isNaN(Number(row.auto_delete_hours))) {
      errors.push("Auto delete hours must be a number")
    }
    if (row.auto_delete_score && isNaN(Number(row.auto_delete_score))) {
      errors.push("Auto delete score must be a number")
    }
    
    // Boolean values
    if (row.nsfw && !['true', 'false'].includes(row.nsfw.toLowerCase())) {
      errors.push("NSFW must be true or false")
    }
    if (row.spoiler && !['true', 'false'].includes(row.spoiler.toLowerCase())) {
      errors.push("Spoiler must be true or false")
    }

    return {
      rowIndex: index,
      valid: errors.length === 0,
      errors
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setUploadedFile(file)
      setUploadStatus('validating')
      
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const workbook = XLSX.read(e.target.result, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const data = XLSX.utils.sheet_to_json(worksheet)
          
          setParsedData(data)
          const validations = data.map((row, index) => validateRow(row, index))
          setValidationResults(validations)
          
          setUploadStatus(validations.every(v => v.valid) ? 'ready' : 'error')
          
          toast({
            title: validations.every(v => v.valid) 
              ? "File validated successfully" 
              : "Validation errors found",
            description: `${validations.filter(v => v.valid).length} of ${validations.length} rows are valid`,
            variant: validations.every(v => v.valid) ? "default" : "destructive"
          })
        } catch (error) {
          setUploadStatus('error')
          toast({
            title: "Error parsing file",
            description: "Please ensure the file follows the template format",
            variant: "destructive"
          })
        }
      }
      reader.readAsArrayBuffer(file)
    }
  }

  const handleBulkUpload = async () => {
    if (uploadStatus !== 'ready') return
    
    setUploadStatus('uploading')
    let progress = 0
    
    for (const [index, post] of parsedData.entries()) {
      try {
        // Simulate API call - replace with actual API integration
        await new Promise(resolve => setTimeout(resolve, 500))
        
        progress = ((index + 1) / parsedData.length) * 100
        setUploadProgress(progress)
      } catch (error) {
        toast({
          title: "Error uploading post",
          description: `Failed to upload post: ${post.title}`,
          variant: "destructive"
        })
      }
    }
    
    setUploadStatus('complete')
    toast({
      title: "Bulk upload complete",
      description: `Successfully scheduled ${parsedData.length} posts`
    })
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="container p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Bulk Upload</h1>
              <p className="text-muted-foreground">
                Upload and schedule multiple posts at once
              </p>
            </div>
            <Button onClick={downloadTemplate}>
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
          </div>

          <div className="grid gap-6">
            {/* Upload Card */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Posts</CardTitle>
                <CardDescription>
                  Upload an Excel or CSV file with your posts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-8">
                    <div className="text-center">
                      <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="mt-4">
                        <Button onClick={() => document.getElementById('file-upload').click()}>
                          <Upload className="mr-2 h-4 w-4" />
                          Select File
                        </Button>
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          accept=".xlsx,.csv"
                          onChange={handleFileUpload}
                        />
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        XLSX or CSV files only
                      </p>
                    </div>
                  </div>

                  {uploadedFile && (
                    <Alert>
                      <FileSpreadsheet className="h-4 w-4" />
                      <AlertDescription>
                        {uploadedFile.name} - {parsedData.length} posts
                      </AlertDescription>
                    </Alert>
                  )}

                  {uploadStatus === 'uploading' && (
                    <div className="space-y-2">
                      <Progress value={uploadProgress} />
                      <p className="text-sm text-muted-foreground">
                        Uploading {Math.round(uploadProgress)}%
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={handleBulkUpload}
                  disabled={uploadStatus !== 'ready'}
                >
                  Schedule {parsedData.length} Posts
                </Button>
              </CardFooter>
            </Card>

            {/* Validation Results */}
            {validationResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Validation Results</CardTitle>
                  <CardDescription>
                    {validationResults.filter(v => v.valid).length} of {validationResults.length} posts are valid
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Row</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Subreddit</TableHead>
                          <TableHead>Scheduled Time</TableHead>
                          <TableHead>Issues</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parsedData.map((row, index) => {
                          const validation = validationResults[index]
                          return (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                {validation.valid ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                )}
                              </TableCell>
                              <TableCell>{row.title}</TableCell>
                              <TableCell>r/{row.subreddit}</TableCell>
                              <TableCell>{row.scheduled_time}</TableCell>
                              <TableCell>
                                {validation.errors.map((error, i) => (
                                  <Badge 
                                    key={i}
                                    variant="destructive"
                                    className="mr-1 mb-1"
                                  >
                                    {error}
                                  </Badge>
                                ))}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* Scheduled Posts Preview */}
            {uploadStatus === 'complete' && (
              <Card>
                <CardHeader>
                  <CardTitle>Scheduled Posts</CardTitle>
                  <CardDescription>
                    Overview of your scheduled posts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    {parsedData.map((post, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 border-b py-4"
                      >
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1 space-y-1">
                          <p className="font-medium">{post.title}</p>
                          <div className="flex items-center space-x-2">
                            <Badge>r/{post.subreddit}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {post.scheduled_time}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}