import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { FileText, Video, Table } from "lucide-react";

export default function Content() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="h-[150px] mt-16 relative overflow-hidden flex items-center">
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
    </div>
  );
}
