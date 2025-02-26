import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { ArrowRight, FileText, Video, Table, Lock } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-16 sm:pt-32 pb-8 sm:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-primary/20 to-background z-0"></div>
        <div className="absolute inset-0 bg-[linear-gradient(225deg,_#FFE29F_0%,_#FFA99F_48%,_#FF719A_100%)] opacity-20 dark:opacity-10 z-0"></div>
        <div className="absolute inset-0 backdrop-blur-[120px] z-0"></div>
        <div className="container relative z-10">
          <div className="text-center space-y-3 sm:space-y-6 max-w-3xl mx-auto animate-in mt-16 sm:mt-0">
            <div className="relative inline-block">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                Expert Business Insights,
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"> On Demand</span>
              </h1>
              <div className="absolute -inset-x-6 -inset-y-4 bg-gradient-to-r from-primary/20 to-primary/0 blur-2xl -z-10 animate-pulse"></div>
            </div>
            <p className="text-lg sm:text-xl text-muted-foreground px-4 sm:px-0">
              Access premium business content from industry experts. Transform your business with actionable insights and professional guidance.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" disabled className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/10 transition-all duration-300">
                Jen hasn't built this yet <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="backdrop-blur-sm" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Options - Only visible on mobile */}
      <section className="py-12 border-y bg-background/50 backdrop-blur-sm md:hidden">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16">
            {[
              { href: "/content", label: "Content" },
              { href: "/pricing", label: "Pricing" },
              { href: "#consultation", label: "Book a consultation" },
              { href: "/about", label: "About" }
            ].map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Content Types Section */}
      <section className="py-8 sm:py-24 bg-muted">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-6 sm:mb-12">Premium Business Content</h2>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-8">
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
              <div key={i} className="glass p-4 sm:p-6 rounded-lg space-y-3 sm:space-y-4 hover:scale-105 transition-transform">
                <div className="h-10 sm:h-12 w-10 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg sm:text-xl">{item.title}</h3>
                <p className="text-muted-foreground text-sm sm:text-base">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-24 container">
        <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-12 text-center max-w-4xl mx-auto">
          <Lock className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-primary mb-4 sm:mb-6" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Access Premium Content?</h2>
          <p className="text-muted-foreground text-sm sm:text-base mb-6 sm:mb-8">
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
