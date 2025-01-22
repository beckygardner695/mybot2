// Add to imports
import { FilePreviewDialog } from './file-preview-dialog'
import { MoveFileDialog } from './move-file-dialog'

// Add to MediaManager component state
const [selectedFile, setSelectedFile] = useState(null)
const [showPreview, setShowPreview] = useState(false)
const [showMoveDialog, setShowMoveDialog] = useState(false)

// Add handlers
const handleMetadataChange = (metadata) => {
  // Update file metadata
  const updatedItems = mediaItems.map(item =>
    item.id === selectedFile.id
      ? { ...item, ...metadata }
      : item
  )
  setMediaItems(updatedItems)
  toast({
    title: "Metadata Updated",
    description: "File metadata has been successfully updated."
  })
}

const handleMoveFile = (targetFolder) => {
  // Move file to new folder
  const updatedItems = mediaItems.map(item =>
    item.id === selectedFile.id
      ? { ...item, folder: targetFolder }
      : item
  )
  setMediaItems(updatedItems)
  toast({
    title: "File Moved",
    description: `File moved to ${targetFolder}`
  })
}

// Add to context menu items
<ContextMenuItem onClick={() => {
  setSelectedFile(item)
  setShowPreview(true)
}}>
  <Eye className="h-4 w-4 mr-2" />
  Preview
</ContextMenuItem>
<ContextMenuItem onClick={() => {
  setSelectedFile(item)
  setShowMoveDialog(true)
}}>
  <FolderOpen className="h-4 w-4 mr-2" />
  Move
</ContextMenuItem>

// Add dialogs at the end of the component
{selectedFile && (
  <>
    <FilePreviewDialog
      file={selectedFile}
      open={showPreview}
      onOpenChange={setShowPreview}
      onMetadataChange={handleMetadataChange}
    />
    <MoveFileDialog
      open={showMoveDialog}
      onOpenChange={setShowMoveDialog}
      folders={folders}
      currentFolder={selectedFile.folder}
      onMove={handleMoveFile}
    />
  </>
)}