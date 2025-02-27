
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase, SUPABASE_URL } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ConsultantToolsProps {
  onContentAdded: () => void;
  title?: string;
}

export const ConsultantTools = ({ 
  onContentAdded,
  title = "Consultant tools" 
}: ConsultantToolsProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [newContent, setNewContent] = useState({
    title: "",
    description: "",
    content_type: "video",
    contentFile: null as File | null,
    thumbnail: null as File | null,
  });
  
  const handleSubmitContent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newContent.title || !newContent.content_type || !newContent.contentFile) {
      toast.error("Title, content type, and file are required");
      return;
    }
    
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to add content");
        return;
      }

      const formData = new FormData();
      formData.append('contentFile', newContent.contentFile);
      if (newContent.thumbnail) {
        formData.append('thumbnail', newContent.thumbnail);
      }
      formData.append('title', newContent.title);
      formData.append('description', newContent.description || '');
      formData.append('contentType', newContent.content_type);

      const response = await fetch(`${SUPABASE_URL}/functions/v1/upload-content`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'x-user-id': user.id
        },
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload content');
      }

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
      console.error("Content submission error:", error);
      toast.error("Error adding content");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full flex items-center gap-2 mb-2">
            <Plus className="h-4 w-4" /> Add Content
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmitContent}>
            <DialogHeader>
              <DialogTitle>Add New Content</DialogTitle>
              <DialogDescription>
                Create new content for the platform. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="content-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="content-title"
                  placeholder="Title of your content"
                  className="col-span-3"
                  value={newContent.title}
                  onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="content-desc" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="content-desc"
                  placeholder="Describe your content..."
                  className="col-span-3"
                  value={newContent.description}
                  onChange={(e) => setNewContent({...newContent, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="content-type" className="text-right">
                  Type
                </Label>
                <Select 
                  value={newContent.content_type}
                  onValueChange={(value) => setNewContent({...newContent, content_type: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="content-file" className="text-right pt-2">
                  Content File
                </Label>
                <div className="col-span-3">
                  <Input
                    id="content-file"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files ? e.target.files[0] : null;
                      setNewContent({...newContent, contentFile: file});
                    }}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload your content file here.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="thumbnail" className="text-right pt-2">
                  Thumbnail
                </Label>
                <div className="col-span-3">
                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files ? e.target.files[0] : null;
                      setNewContent({...newContent, thumbnail: file});
                    }}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Optional: Add a thumbnail image
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Save Content'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Button variant="outline" className="w-full flex items-center gap-2" asChild>
        <a href="/content/manage">
          <Upload className="h-4 w-4" /> Manage Content
        </a>
      </Button>
    </Card>
  );
};
