
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const teamMembers = [
  {
    name: "Paul Ward",
    expertise: "Industrial, Operational, Digital Transformation",
    photo: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
    initials: "PW",
    bio: "Paul Ward is a seasoned expert in industrial operations and digital transformation. With years of experience helping businesses modernize their operations, Paul specializes in implementing cutting-edge solutions that drive efficiency and growth."
  },
  {
    name: "Jen Payne",
    expertise: "Logistics & Supply Chain, Manufacturing, Digital Transformation",
    photo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    initials: "JP",
    bio: "Jen Payne brings extensive expertise in logistics, supply chain management, and manufacturing processes. Her approach combines traditional best practices with innovative digital solutions to optimize business operations."
  },
  {
    name: "Natasha Cleeve",
    expertise: "Recruitment, Interim, C-Suite & Talent Acquisition",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    initials: "NC",
    bio: "Natasha Cleeve is a specialist in executive recruitment and talent acquisition. Her deep understanding of organizational needs helps companies find and retain top-tier talent, particularly at the C-Suite level."
  },
  {
    name: "Tim Green",
    expertise: "Commercial Sales & Marketing",
    photo: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    initials: "TG",
    bio: "Tim Green is a commercial sales and marketing strategist who helps businesses develop and execute effective go-to-market strategies. His expertise spans both traditional and digital marketing channels."
  }
];

export default function About() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="py-24 container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tighter mb-4">Our Team of Experts</h1>
          <p className="text-lg text-muted-foreground">
            Meet our experienced business advisors who are here to help transform your business
          </p>
        </div>

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
      </section>
    </div>
  );
}
