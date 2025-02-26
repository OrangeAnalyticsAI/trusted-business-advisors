
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { ArrowRight, FileText, Video, Table, Lock } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-24 container">
        <div className="text-center space-y-6 max-w-3xl mx-auto animate-in">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Expert Business Insights,
            <span className="text-primary"> On Demand</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Access premium business content from industry experts. Transform your business with actionable insights and professional guidance.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Content Types Section */}
      <section className="py-24 bg-muted">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Premium Business Content</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: "Professional Documents",
                description: "Access detailed PDF reports and strategic documents"
              },
              {
                icon: Video,
                title: "Expert Videos",
                description: "Watch in-depth analysis and tutorials from industry leaders"
              },
              {
                icon: Table,
                title: "Spreadsheet Templates",
                description: "Download ready-to-use Excel and Google Sheets templates"
              }
            ].map((item, i) => (
              <div key={i} className="glass p-6 rounded-lg space-y-4 hover:scale-105 transition-transform">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 container">
        <div className="glass rounded-2xl p-12 text-center max-w-4xl mx-auto">
          <Lock className="h-12 w-12 mx-auto text-primary mb-6" />
          <h2 className="text-3xl font-bold mb-4">Ready to Access Premium Content?</h2>
          <p className="text-muted-foreground mb-8">
            Join our community of business professionals and get instant access to expert resources.
          </p>
          <Button size="lg" className="gap-2">
            Start Your Journey <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
