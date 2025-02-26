
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const teamMembers = [
  {
    name: "Paul Ward",
    expertise: "Industrial, Operational, Digital Transformation",
    photo: "/lovable-uploads/587e2bcb-bb0c-441d-8b4d-3f1f27e324ac.png",
    initials: "PW",
    bio: "Paul Ward is a seasoned expert in industrial operations and digital transformation. With years of experience helping businesses modernize their operations, Paul specializes in implementing cutting-edge solutions that drive efficiency and growth."
  },
  {
    name: "Mark Akinlade",
    expertise: "Legal Services",
    photo: "/lovable-uploads/2bf12ddb-a199-4417-a656-5ec88cd09df3.png",
    initials: "MA",
    bio: "Mark Akinlade is an experienced legal professional providing comprehensive legal services to businesses. His expertise covers corporate law, compliance, and regulatory matters, ensuring businesses navigate legal complexities effectively."
  },
  {
    name: "Natasha Cleeve",
    expertise: "Recruitment, Interim, C-Suite & Talent Acquisition",
    photo: "/lovable-uploads/3360b116-7593-424d-973e-b3e77021044f.png",
    initials: "NC",
    bio: "Natasha Cleeve is a specialist in executive recruitment and talent acquisition. Her deep understanding of organizational needs helps companies find and retain top-tier talent, particularly at the C-Suite level."
  },
  {
    name: "Gabriella Eberhardt",
    expertise: "HR & People Capital",
    photo: "/lovable-uploads/2ec2751a-9550-4392-afd6-42afbaf57d52.png",
    initials: "GE",
    bio: "Gabriella Eberhardt is a seasoned HR professional specializing in people capital management. Her expertise lies in developing effective HR strategies, cultural transformation, and implementing people-centric initiatives that drive organizational success."
  },
  {
    name: "Tim Green",
    expertise: "Commercial Sales & Marketing",
    photo: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    initials: "TG",
    bio: "Tim Green is a commercial sales and marketing strategist who helps businesses develop and execute effective go-to-market strategies. His expertise spans both traditional and digital marketing channels."
  },
  {
    name: "Paul Hardy",
    expertise: "Corporate Finance, Accounting, M&A",
    photo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    initials: "PH",
    bio: "Paul Hardy brings extensive experience in corporate finance, accounting, and mergers & acquisitions. His strategic approach to financial management and M&A transactions helps businesses optimize their financial performance and growth opportunities."
  },
  {
    name: "Jen Payne",
    expertise: "Logistics & Supply Chain, Manufacturing, Digital Transformation",
    photo: "/lovable-uploads/2e4f4225-3cea-40e1-a82d-66aa42534987.png",
    initials: "JP",
    bio: "Jen Payne brings extensive expertise in logistics, supply chain management, and manufacturing processes. Her approach combines traditional best practices with innovative digital solutions to optimize business operations."
  }
];

export default function About() {
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
                Our Team of
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"> Experts</span>
              </h1>
              <div className="absolute -inset-x-6 -inset-y-4 bg-gradient-to-r from-primary/20 to-primary/0 blur-2xl -z-10 animate-pulse"></div>
            </div>
            <p className="mt-4 text-base text-muted-foreground">
              Meet our experienced business advisors who are here to help transform your business
            </p>
          </div>
        </div>
      </section>

      <div className="container py-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member) => (
            <Dialog key={member.name}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={member.photo} alt={member.name} />
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <CardTitle className="text-xl">{member.name}</CardTitle>
                      <CardDescription className="text-sm">{member.expertise}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="mt-2">View Bio →</Button>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={member.photo} alt={member.name} />
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    {member.name}
                  </DialogTitle>
                  <DialogDescription className="text-base font-medium text-primary">
                    {member.expertise}
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  <p className="text-muted-foreground">{member.bio}</p>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </div>
  );
}
