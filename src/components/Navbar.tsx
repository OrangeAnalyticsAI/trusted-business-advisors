
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { supabase, SUPABASE_URL } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Upload, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export function Navbar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isConsultant, setIsConsultant] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newContent, setNewContent] = useState({
    title: "",
    description: "",
    content_type: "video",
    contentFile: null as File | null,
    thumbnail: null as File | null
  });

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        checkUserType(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        checkUserType(session.user.id);
      } else {
        setIsConsultant(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUserType = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', userId)
        .maybeSingle();
        
      if (profileError) {
        console.error("Error fetching profile:", profileError);
      } else if (profileData) {
        setIsConsultant(profileData.user_type === 'consultant');
      }
    } catch (error) {
      console.error("Profile check error:", error);
    }
  };

  const handleConsultationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast("Coming Soon", {
      description: "Jen hasn't built this yet",
      position: "top-center",
    });
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      supabase.auth.signOut().then(() => {
        toast.success("Logged out successfully");
        navigate("/");
      });
    } else {
      navigate("/auth");
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
    } catch (error) {
      console.error("Content submission error:", error);
      toast.error("Error adding content");
    } finally {
      setLoadingContent(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-lg border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 ml-[220px]">
          <div className="hidden md:flex gap-6">
            <a href="/" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
              <Home className="h-4 w-4" />
            </a>
            <a href="/content" className="text-muted-foreground hover:text-primary transition-colors">
              Content
            </a>
            {isConsultant && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-muted-foreground hover:text-primary transition-colors">
                    <Upload className="h-4 w-4 mr-2" /> Load Content
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
            )}
            <a href="/pricing" className="text-muted-foreground hover:text-primary transition-colors">
              Pricing
            </a>
            <a 
              href="#consultation" 
              className="text-muted-foreground hover:text-primary transition-colors"
              onClick={handleConsultationClick}
            >
              Book a consultation
            </a>
            <a href="/about" className="text-muted-foreground hover:text-primary transition-colors">
              About
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button onClick={handleAuthClick} className="text-base">
            {isAuthenticated ? "Sign Out" : "Sign In"}
          </Button>
        </div>
      </div>
    </nav>
  );
}
