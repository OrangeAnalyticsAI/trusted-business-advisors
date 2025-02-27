
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Video, Table, Search } from "lucide-react";
import { useState } from "react";

export default function Content() {
  const [searchQuery, setSearchQuery] = useState("");
  
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
          {/* Main Content Area - 3/4 width on desktop */}
          <div className="lg:col-span-3">
            {/* Video Content Section */}
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
          </div>
          
          {/* Right Sidebar for Content Navigation - 1/4 width on desktop */}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
