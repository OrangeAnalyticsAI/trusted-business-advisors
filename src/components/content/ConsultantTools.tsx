
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  SUPABASE_URL, 
  supabase, 
  storage, 
  fileExistsInContent,
  replaceContentFile,
  CONTENT_FILES_BUCKET,
  THUMBNAILS_BUCKET,
  uploadFileToStorage,
  removeFileFromStorage
} from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface NewContent {
  title: string;
  description: string;
  content_type: string;
  contentFile: File | null;
  thumbnail: File | null;
}

interface ConsultantToolsProps {
  onContentAdded: () => void;
}

export const ConsultantTools = ({ onContentAdded }: ConsultantToolsProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [fileExistsDialog, setFileExistsDialog] = useState(false);
  const [newContent, setNewContent] = useState<NewContent>({
    title: "",
    description: "",
    content_type: "video",
    contentFile: null,
    thumbnail: null
  });

  // Store file info when duplicate is detected
  const [existingFileInfo, setExistingFileInfo] = useState<{
    fileName: string;
    file: File;
  } | null>(null);

  // Handle file replacement when a file with the same name is found
  const handleReplaceFile = async () => {
    if (!existingFileInfo || !existingFileInfo.file) {
      setFileExistsDialog(false);
      return;
    }

    try {
      setLoadingContent(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to replace content");
        setFileExistsDialog(false);
        return;
      }

      const fileName = existingFileInfo.file.name;
      
      // Upload the content file, replacing the existing one
      const { url: contentUrl, error: contentUploadError } = await uploadFileToStorage(
        CONTENT_FILES_BUCKET, 
        fileName, 
        existingFileInfo.file,
        true // Enable upsert to replace existing file
      );
      
      if (contentUploadError) {
        toast.error(`Failed to upload content: ${contentUploadError.message}`);
        setLoadingContent(false);
        setFileExistsDialog(false);
        return;
      }
      
      // Handle thumbnail if it exists
      let thumbnailUrl = null;
      if (newContent.thumbnail) {
        const thumbnailName = newContent.thumbnail.name;
        
        const { url: thumbUrl, error: thumbUploadError } = await uploadFileToStorage(
          THUMBNAILS_BUCKET, 
          thumbnailName, 
          newContent.thumbnail,
          true // Enable upsert to replace existing thumbnail
        );
        
        if (thumbUploadError) {
          console.warn("Thumbnail upload error:", thumbUploadError);
          // Continue without thumbnail
        } else {
          thumbnailUrl = thumbUrl;
        }
      }
      
      // Update the content record
      const updateSuccess = await replaceContentFile(
        fileName,
        contentUrl as string,
        thumbnailUrl,
        newContent.content_type,
        newContent.title,
        newContent.description || null,
        user.id
      );
      
      if (!updateSuccess) {
        toast.error("Failed to update content metadata");
        setLoadingContent(false);
        setFileExistsDialog(false);
        return;
      }
      
      toast.success("Content replaced successfully");
      onContentAdded();
      
      // Reset state
      setNewContent({
        title: "",
        description: "",
        content_type: "video",
        contentFile: null,
        thumbnail: null
      });
      setFileExistsDialog(false);
      setDialogOpen(false);
      
    } catch (error) {
      console.error("File replacement error:", error);
      toast.error(`Error replacing file: ${error.message || 'Unknown error'}`);
    } finally {
      setLoadingContent(false);
      setFileExistsDialog(false);
    }
  };

  const handleSubmitContent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newContent.title || !newContent.content_type || !newContent.contentFile) {
      toast.error("Title, content type, and file are required");
      return;
    }
    
    try {
      setLoadingContent(true);
      
      // Check if a file with the same name exists
      const fileName = newContent.contentFile.name;
      const fileExists = await fileExistsInContent(fileName);
      
      if (fileExists) {
        // Show confirmation dialog for replacement
        setExistingFileInfo({
          fileName,
          file: newContent.contentFile
        });
        setFileExistsDialog(true);
        return;
      }
      
      // If file doesn't exist, continue with normal upload
      await uploadNewContent();
      
    } catch (error) {
      console.error("Content submission error:", error);
      toast.error(`Error adding content: ${error.message || 'Unknown error'}`);
    } finally {
      setLoadingContent(false);
    }
  };
  
  const uploadNewContent = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to add content");
        return;
      }
      
      if (!newContent.contentFile) {
        toast.error("Content file is required");
        return;
      }
      
      // Upload content file with original filename
      const fileName = newContent.contentFile.name;
      
      // Upload the content file
      const { url: contentUrl, error: contentUploadError } = await uploadFileToStorage(
        CONTENT_FILES_BUCKET,
        fileName,
        newContent.contentFile
      );
      
      if (contentUploadError) {
        toast.error(`Failed to upload content: ${contentUploadError.message}`);
        return;
      }
      
      // Handle thumbnail if it exists
      let thumbnailUrl = null;
      if (newContent.thumbnail) {
        const thumbnailName = newContent.thumbnail.name;
        
        const { url: thumbUrl, error: thumbUploadError } = await uploadFileToStorage(
          THUMBNAILS_BUCKET, 
          thumbnailName, 
          newContent.thumbnail
        );
        
        if (thumbUploadError) {
          console.warn("Thumbnail upload error:", thumbUploadError);
          // Continue without thumbnail
        } else {
          thumbnailUrl = thumbUrl;
        }
      }
      
      // Insert content record with original filename
      const { data: contentData, error: contentError } = await supabase
        .from('content')
        .insert({
          title: newContent.title,
          description: newContent.description || null,
          content_type: newContent.content_type,
          content_url: contentUrl,
          thumbnail_url: thumbnailUrl,
          created_by: user.id,
          original_filename: fileName
        })
        .select()
        .single();
        
      if (contentError) {
        console.error("Content database insertion error:", contentError);
        toast.error(`Failed to save content metadata: ${contentError.message}`);
        return;
      }
      
      toast.success("Content added successfully");
      onContentAdded();
      
      // Reset form
      setNewContent({
        title: "",
        description: "",
        content_type: "video",
        contentFile: null,
        thumbnail: null
      });
      setDialogOpen(false);
      
    } catch (error) {
      console.error("Error uploading new content:", error);
      throw error;
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold mb-3">Consultant Tools</h3>
      <div className="space-y-3">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="default" 
              className="w-full flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Load Content
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmitContent}>
              <DialogHeader>
                <DialogTitle>Add New Content</DialogTitle>
                <DialogDescription>
                  Add premium business content for your clients.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newContent.title}
                    onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                    placeholder="e.g. Business Strategy Guide"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newContent.description}
                    onChange={(e) => setNewContent({...newContent, description: e.target.value})}
                    placeholder="Brief description of the content"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content-type">Content Type</Label>
                  <select
                    id="content-type"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newContent.content_type}
                    onChange={(e) => setNewContent({...newContent, content_type: e.target.value})}
                  >
                    <option value="video">Video</option>
                    <option value="document">Document</option>
                    <option value="spreadsheet">Spreadsheet</option>
                    <option value="presentation">Presentation</option>
                    <option value="report">Report</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content-file">Content File</Label>
                  <Input
                    id="content-file"
                    type="file"
                    onChange={(e) => setNewContent({...newContent, contentFile: e.target.files?.[0] || null})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail Image (optional)</Label>
                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewContent({...newContent, thumbnail: e.target.files?.[0] || null})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loadingContent}>
                  {loadingContent ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Content'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        <AlertDialog open={fileExistsDialog} onOpenChange={setFileExistsDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>File Already Exists</AlertDialogTitle>
              <AlertDialogDescription>
                A file with the name "{existingFileInfo?.fileName}" already exists. 
                Would you like to replace it?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setFileExistsDialog(false);
                setLoadingContent(false);
              }}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleReplaceFile}>
                Replace Existing File
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
};
