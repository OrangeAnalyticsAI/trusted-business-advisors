
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { SUPABASE_URL, supabase } from "@/integrations/supabase/client";

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
  const [newContent, setNewContent] = useState<NewContent>({
    title: "",
    description: "",
    content_type: "video",
    contentFile: null,
    thumbnail: null
  });

  const handleSubmitContent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newContent.title || !newContent.content_type || !newContent.contentFile) {
      toast.error("Title, content type, and file are required");
      return;
    }
    
    try {
      setLoadingContent(true);
      
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
      </div>
    </Card>
  );
};
