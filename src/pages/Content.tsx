
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Video, Table, Search, Upload, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Type definition for content items
interface ContentItem {
  id: string;
  title: string;
  description: string;
  content_type: string;
  content_url?: string;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

// Type definition for user profile
interface UserProfile {
  id: string;
  user_type: 'client' | 'consultant';
  email: string;
  full_name?: string;
}

export default function Content() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isConsultant, setIsConsultant] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [newContent, setNewContent] = useState({
    title: "",
    description: "",
    content_type: "video", // Default type
    content_url: ""
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Categories for content filtering
  const categories = [
    { id: "all", name: "All Content" },
    { id: "videos", name: "Videos" },
    { id: "documents", name: "Documents" },
    { id: "spreadsheets", name: "Spreadsheets" },
    { id: "presentations", name: "Presentations" },
    { id: "reports", name: "Reports" }
  ];
  
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Check user profile and load initial data
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Fetch user profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (profileError) {
            console.error("Error fetching profile:", profileError);
            toast.error("Error fetching user profile");
          } else if (profileData) {
            setUserProfile(profileData);
            setIsConsultant(profileData.user_type === 'consultant');
          }
          
          // Load content
          await fetchContent();
        }
      } catch (error) {
        console.error("Session or profile check error:", error);
        toast.error("Error checking user session");
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, []);
  
  // Fetch content from database
  const fetchContent = async () => {
    try {
      setLoadingContent(true);
      
      // Filter by category if not "all"
      let query = supabase.from('content').select('*');
      
      if (selectedCategory !== "all") {
        // Convert category id to content_type format
        const contentType = selectedCategory.slice(0, -1); // Remove 's' from end (videos -> video)
        query = query.eq('content_type', contentType);
      }
      
      // Apply search filter if present
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }
      
      // Order by most recent
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching content:", error);
        toast.error("Failed to load content");
      } else {
        setContentItems(data || []);
        console.log("Content loaded:", data);
      }
    } catch (error) {
      console.error("Content fetch error:", error);
      toast.error("Error loading content");
    } finally {
      setLoadingContent(false);
    }
  };
  
  // Handle content form submission
  const handleSubmitContent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newContent.title || !newContent.content_type) {
      toast.error("Title and content type are required");
      return;
    }
    
    try {
      setLoadingContent(true);
      
      const { data, error } = await supabase
        .from('content')
        .insert([
          {
            title: newContent.title,
            description: newContent.description,
            content_type: newContent.content_type,
            content_url: newContent.content_url,
            // Use created_by automatically via RLS
          }
        ])
        .select();
        
      if (error) {
        console.error("Error adding content:", error);
        toast.error("Failed to add content");
      } else {
        toast.success("Content added successfully");
        setNewContent({
          title: "",
          description: "",
          content_type: "video",
          content_url: ""
        });
        setDialogOpen(false);
        await fetchContent(); // Refresh content list
      }
    } catch (error) {
      console.error("Content submission error:", error);
      toast.error("Error adding content");
    } finally {
      setLoadingContent(false);
    }
  };
  
  // Get content icon based on type
  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'document':
        return FileText;
      case 'spreadsheet':
        return Table;
      default:
        return FileText;
    }
  };
  
  // Handle category change and refetch content
  useEffect(() => {
    if (!loading) {
      fetchContent();
    }
  }, [selectedCategory, searchQuery]);
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="h-[200px] sm:h-[150px] mt-16 pt-16 sm:pt-0 relative overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-primary/20 to-background z-0 animate-[gradient_8s_ease_infinite]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(225deg,_#FFE29F_0%,_#FFA99F_48%,_#FF719A_100%)] opacity-20 dark:opacity-10 z-0"></div>
        <div className="absolute inset-0 backdrop-blur-[120px] z-0"></div>
        <div className="container relative z-10">
          <div className="text-center animate-in">
            <div className="relative inline-block">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                Premium Business
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"> Content</span>
              </h1>
              <div className="absolute -inset-x-6 -inset-y-4 bg-gradient-to-r from-primary/20 to-primary/0 blur-2xl -z-10 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar for Content Navigation - 1/4 width on desktop */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Search Box */}
              <Card className="p-4">
                <div className="space-y-3">
                  <Label htmlFor="content-search" className="text-sm font-semibold">Search Content</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="content-search"
                      type="search"
                      placeholder="Search resources..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </Card>
              
              {/* Categories */}
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-3">Categories</h3>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === category.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted/50 text-foreground"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </Card>
              
              {/* Popular Resources */}
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-3">Popular Resources</h3>
                <div className="space-y-3">
                  {[
                    { title: "2023 Business Trends", type: "Document" },
                    { title: "Marketing Strategy Template", type: "Spreadsheet" },
                    { title: "Customer Acquisition Webinar", type: "Video" },
                  ].map((resource, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <a href="#" className="text-sm hover:underline hover:text-primary transition-colors">
                        {resource.title}
                        <span className="text-xs text-muted-foreground ml-1">({resource.type})</span>
                      </a>
                    </div>
                  ))}
                </div>
              </Card>
              
              {/* Load Content Button - Only shown to consultants */}
              {isConsultant && (
                <Card className="p-4">
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full" variant="default">
                        <Upload className="mr-2 h-4 w-4" />
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
                            <Label htmlFor="content-url">Content URL (optional)</Label>
                            <Input
                              id="content-url"
                              value={newContent.content_url}
                              onChange={(e) => setNewContent({...newContent, content_url: e.target.value})}
                              placeholder="https://example.com/your-content"
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
                </Card>
              )}
            </div>
          </div>
          
          {/* Main Content Area - 3/4 width on desktop */}
          <div className="lg:col-span-3">
            {/* Loading state */}
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {/* Dynamic content from database */}
                {contentItems.length > 0 && (
                  <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Recent Uploads</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {contentItems.map((item) => {
                        const Icon = getContentIcon(item.content_type);
                        return (
                          <Card key={item.id} className="overflow-hidden">
                            <div className="aspect-video bg-muted relative flex items-center justify-center">
                              {item.thumbnail_url ? (
                                <img 
                                  src={item.thumbnail_url} 
                                  alt={item.title} 
                                  className="w-full h-full object-cover" 
                                />
                              ) : (
                                <Icon className="h-12 w-12 text-muted-foreground" />
                              )}
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold mb-2">{item.title}</h3>
                              <p className="text-muted-foreground text-sm">{item.description}</p>
                              {item.content_url && (
                                <div className="mt-4">
                                  <a 
                                    href={item.content_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary text-sm hover:underline flex items-center"
                                  >
                                    View Content
                                  </a>
                                </div>
                              )}
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* Add fallback if no content yet */}
                {!loading && contentItems.length === 0 && (
                  <div className="bg-muted/30 rounded-lg p-8 text-center my-8">
                    <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No content found</h3>
                    <p className="text-muted-foreground mb-6">
                      {searchQuery || selectedCategory !== "all" 
                        ? "Try changing your search or category filters" 
                        : "Be the first to add premium business content"}
                    </p>
                    {isConsultant && (
                      <Button onClick={() => setDialogOpen(true)}>
                        <Upload className="mr-2 h-4 w-4" />
                        Add Your First Content
                      </Button>
                    )}
                  </div>
                )}

                {/* Default/Example Content Sections */}
                <section className="mb-12">
                  <h2 className="text-2xl font-semibold mb-6">Expert Video Resources</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="overflow-hidden">
                        <div className="aspect-video bg-muted relative flex items-center justify-center">
                          <Video className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold mb-2">Business Strategy Session {i}</h3>
                          <p className="text-muted-foreground text-sm">Expert insights on growing your business in today's market.</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Documents Section */}
                <section className="mb-12">
                  <h2 className="text-2xl font-semibold mb-6">Professional Documents</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="p-6 flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Business Plan Template {i}</h3>
                          <p className="text-muted-foreground text-sm">Professional templates and guides for business planning.</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Spreadsheets Section */}
                <section>
                  <h2 className="text-2xl font-semibold mb-6">Spreadsheet Templates</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="p-6 flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Table className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Financial Analysis Template {i}</h3>
                          <p className="text-muted-foreground text-sm">Ready-to-use spreadsheets for financial planning and analysis.</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
