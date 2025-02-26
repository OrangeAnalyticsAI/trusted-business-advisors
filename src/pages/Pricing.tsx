
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Calendar } from "lucide-react";

export default function Pricing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-primary/20 to-background z-0 animate-[gradient_8s_ease_infinite]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(225deg,_#FFE29F_0%,_#FFA99F_48%,_#FF719A_100%)] opacity-20 dark:opacity-10 z-0"></div>
        <div className="absolute inset-0 backdrop-blur-[120px] z-0"></div>
        <div className="container relative z-10">
          <div className="text-center animate-in">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Simple, transparent pricing
            </h1>
            <p className="mt-4 text-base text-muted-foreground">
              Choose the plan that's right for your business
            </p>
          </div>
        </div>
      </section>

      <div className="container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {/* Premium Business Content Subscription */}
          <Card className="relative">
            <CardHeader>
              <CardTitle>Premium Business Content</CardTitle>
              <CardDescription>Access to all premium business resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">£9.99</span>
                  <span className="ml-1 text-muted-foreground">/user/month</span>
                </div>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Access all video resources</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Professional document templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Financial spreadsheet templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Regular content updates</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg">
                Get Started
              </Button>
            </CardFooter>
          </Card>

          {/* Enterprise Plan */}
          <Card className="relative bg-primary/5">
            <CardHeader>
              <CardTitle>Enterprise Plan</CardTitle>
              <CardDescription>Custom solutions for larger organizations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">Custom pricing</span>
                </div>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Everything in Premium plan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Unlimited user licenses</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Custom content development</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="secondary" size="lg">
                Contact Sales
              </Button>
            </CardFooter>
          </Card>

          {/* Book a Consultation */}
          <Card className="relative bg-primary/5">
            <CardHeader>
              <CardTitle>Book a Consultation</CardTitle>
              <CardDescription>Get personalized guidance for your business</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">Free</span>
                  <span className="ml-1 text-muted-foreground">/30 min session</span>
                </div>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>One-on-one consultation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Needs assessment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Tailored recommendations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>No obligation</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="secondary" size="lg">
                <Calendar className="mr-2" />
                Schedule Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
