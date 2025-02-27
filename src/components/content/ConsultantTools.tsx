
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { SUPABASE_URL, supabase } from "@/integrations/supabase/client";
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
    fileExt: string;
    file: File;
    bucket: string;
  } | null>(null);

  const checkFileExistsAndUpload = async (file: File, bucketName: string) => {
    const fileName = file.name;
    const fileExt = fileName.split('.').pop() || '';
    
    console.log(`Checking if file exists: ${fileName} in bucket ${bucketName}`);
    
    // Check if file exists
    const { data: existingFile, error: checkError } = await supabase.storage
      .from(bucketName)
      .list('', {
        search: fileName
      });
    
    if (checkError) {
      console.error("Error checking for existing file:", checkError);
      throw new Error(`Failed to check if file exists: ${checkError.message}`);
    }
    
    const fileExists = existingFile.some(f => f.name === fileName);
    
    if (fileExists) {
      console.log("File exists, showing confirmation dialog");
      setExistingFileInfo({
        fileName,
        fileExt,
        file,
        bucket: bucketName
      });
      setFileExistsDialog(true);
      return { exists: true, fileName: null };
    } else {
      console.log("File does not exist, uploading directly");
      // Upload the file directly using original filename
      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, { upsert: false });
      
      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }
      
      return { exists: false, fileName };
    }
  };
  
  const uploadFileWithOverwrite = async () => {
    if (!existingFileInfo) return null;
    
    const { fileName, file, bucket } = existingFileInfo;
    
    console.log(`Replacing file: ${fileName} in bucket ${bucket}`);
    
    try {
      // First, remove the existing file
      const { error: removeError } = await supabase.storage
        .from(bucket)
        .remove([fileName]);
      
      if (removeError) {
        console.error("Error removing existing file:", removeError);
        throw new Error(`Failed to remove existing file: ${removeError.message}`);
      }
      
      console.log("Existing file removed successfully");
      
      // Now upload the new file
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);
      
      if (uploadError) {
        console.error("Upload error during replacement:", uploadError);
        throw new Error(`Storage replacement failed: ${uploadError.message}`);
      }
      
      console.log("File replaced successfully");
      return fileName;
    } catch (error) {
      console.error("Error during file replacement:", error);
      throw error;
    }
  };
  
  const handleReplaceFile = async () => {
    try {
      setLoadingContent(true);
      
      // If there's a content file to replace
      let contentFileName = null;
      if (existingFileInfo?.file === newContent.contentFile) {
        contentFileName = await uploadFileWithOverwrite();
        setExistingFileInfo(null);
        setFileExistsDialog(false);
        
        // Check if we still need to handle the thumbnail
        if (newContent.thumbnail) {
          try {
            const { exists, fileName } = await checkFileExistsAndUpload(newContent.thumbnail, 'thumbnails');
            
            if (exists) {
              // We'll handle this in the next cycle
              return;
            }
          } catch (error) {
            console.error("Error checking thumbnail:", error);
            // Continue without thumbnail
          }
        }
        
        // If we get here, we can finalize the content submission
        await finalizeContentSubmission(contentFileName);
      } 
      // If there's a thumbnail to replace
      else if (existingFileInfo?.file === newContent.thumbnail) {
        await uploadFileWithOverwrite();
        setExistingFileInfo(null);
        setFileExistsDialog(false);
        
        // Now check and handle the content file
        if (newContent.contentFile) {
          try {
            const { exists, fileName } = await checkFileExistsAndUpload(
              newContent.contentFile, 
              'content_files'
            );
            
            if (exists) {
              // We'll handle this in the next cycle
              return;
            }
            
            contentFileName = fileName;
          } catch (error) {
            console.error("Error uploading content file after thumbnail replacement:", error);
            throw error;
          }
        }
        
        // If we get here, we can finalize
        await finalizeContentSubmission(contentFileName);
      }
    } catch (error) {
      console.error("Error replacing file:", error);
      toast.error(`Error replacing file: ${error.message || 'Unknown error'}`);
      setFileExistsDialog(false);
    } finally {
      setLoadingContent(false);
    }
  };
  
  const finalizeContentSubmission = async (contentFileName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to add content");
        return;
      }
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('content_files')
        .getPublicUrl(contentFileName);
      
      // If we have a thumbnail, upload that too
      let thumbnailUrl = null;
      let thumbnailFileName = null;
      
      if (newContent.thumbnail) {
        try {
          // Check if thumbnail exists and upload
          const { exists, fileName } = await checkFileExistsAndUpload(newContent.thumbnail, 'thumbnails');
          
          if (exists) {
            // If thumbnail exists but we're here, it means we need to wait for user confirmation
            // This will be handled in the next cycle after user clicks "Replace"
            return;
          }
          
          thumbnailFileName = fileName;
          
          if (thumbnailFileName) {
            const { data: { publicUrl: thumbPublicUrl } } = supabase.storage
              .from('thumbnails')
              .getPublicUrl(thumbnailFileName);
            
            thumbnailUrl = thumbPublicUrl;
          }
        } catch (thumbError) {
          console.warn("Thumbnail upload error:", thumbError);
          // Continue without thumbnail
        }
      }
      
      // Save the content metadata to the database
      const { data: contentData, error: contentError } = await supabase
        .from('content')
        .insert({
          title: newContent.title,
          description: newContent.description || null,
          content_type: newContent.content_type,
          content_url: publicUrl,
          thumbnail_url: thumbnailUrl,
          created_by: user.id,
          original_filename: contentFileName // Using original filename
        })
        .select()
        .single();
        
      if (contentError) {
        console.error("Content database insertion error:", contentError);
        throw new Error(`Failed to save content metadata: ${contentError.message}`);
      }
      
      console.log("Content metadata saved:", contentData);
      
      toast.success("Content added successfully");
      setNewContent({
        title: "",
        description: "",
        content_type: "video",
        contentFile: null,
        thumbnail: null
      });
      setDialogOpen(false);
      onContentAdded();
    } catch (error) {
      console.error("Error finalizing content submission:", error);
      throw error;
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
      
      // Check if content file exists and upload if it doesn't
      const { exists, fileName } = await checkFileExistsAndUpload(newContent.contentFile, 'content_files');
      
      if (exists) {
        // If file exists, we're waiting for user confirmation
        // The dialog is already shown by checkFileExistsAndUpload
        return;
      }
      
      // If we get here, file was uploaded successfully and doesn't exist
      if (fileName) {
        await finalizeContentSubmission(fileName);
      }
      
    } catch (error) {
      console.error("Content submission error:", error);
      toast.error(`Error adding content: ${error.message || 'Unknown error'}`);
    } finally {
      setLoadingContent(false);
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
