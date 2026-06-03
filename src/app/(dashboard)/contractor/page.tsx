"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Briefcase, 
  Users, 
  UserCheck, 
  Plus, 
  ArrowRight,
  MapPin,
  CalendarDays,
  FileText,
  TrendingUp,
  Activity
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    title: "Active Job Posts",
    value: "12",
    trend: "+2 this week",
    icon: Briefcase,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    title: "Candidates Under Review",
    value: "48",
    trend: "+15 this week",
    icon: Users,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    title: "Successful Hires",
    value: "156",
    trend: "+5 this month",
    icon: UserCheck,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
  }
];

const activeJobs = [
  {
    id: "JOB-2938",
    title: "Senior Electrical Engineer",
    location: "Riyadh, KSA",
    candidates: 14,
    posted: "2 days ago",
    status: "Urgent",
  },
  {
    id: "JOB-2939",
    title: "Project Manager (Construction)",
    location: "Jeddah, KSA",
    candidates: 8,
    posted: "5 days ago",
    status: "Active",
  },
  {
    id: "JOB-2940",
    title: "HVAC Technician",
    location: "Dammam, KSA",
    candidates: 22,
    posted: "1 week ago",
    status: "Active",
  },
];

const recentMatches = [
  {
    id: "C-110",
    name: "Ahmed Hassan",
    role: "Electrical Engineer",
    match: 95,
    status: "Interviewing",
    avatar: "AH",
  },
  {
    id: "C-111",
    name: "Mohammad Ali",
    role: "Project Manager",
    match: 88,
    status: "Screening",
    avatar: "MA",
  },
  {
    id: "C-112",
    name: "Syed Rahman",
    role: "HVAC Technician",
    match: 92,
    status: "Offer Extended",
    avatar: "SR",
  },
  {
    id: "C-113",
    name: "John Doe",
    role: "Safety Inspector",
    match: 78,
    status: "New Match",
    avatar: "JD",
  }
];

export default function ContractorDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-in-out">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-outfit text-3xl font-bold tracking-tight text-foreground">
            Contractor Dashboard
          </h2>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's an overview of your hiring activities.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:flex">
            <FileText className="mr-2 h-4 w-4" />
            View Reports
          </Button>
          <Link href="/contractor/jobs/create">
            <Button className="shadow-md transition-all hover:shadow-lg">
              <Plus className="mr-2 h-4 w-4" /> 
              Post New Job
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border/50 shadow-sm transition-all hover:shadow-md hover:border-primary/20 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline space-x-2">
                    <h3 className="text-3xl font-bold font-outfit tracking-tight">{stat.value}</h3>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor} transition-transform group-hover:scale-110`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs">
                <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />
                <span className="text-emerald-500 font-medium">{stat.trend}</span>
                <span className="text-muted-foreground ml-1">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Active Jobs */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-sm flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-outfit text-xl">Active Job Postings</CardTitle>
                <CardDescription>Manage and track your current job listings</CardDescription>
              </div>
              <Link href="/contractor/jobs">
                <Button variant="ghost" size="sm" className="text-primary">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                {activeJobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border/40 bg-card hover:bg-accent/5 transition-colors gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <Link href={`/contractor/jobs/${job.id}`} className="font-semibold text-base hover:text-primary transition-colors">
                          {job.title}
                        </Link>
                        {job.status === "Urgent" && (
                          <Badge variant="destructive" className="h-5 px-1.5 text-[10px] uppercase font-bold tracking-wider">
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-3.5 w-3.5" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <CalendarDays className="mr-1 h-3.5 w-3.5" />
                          {job.posted}
                        </div>
                        <div className="flex items-center text-primary font-medium">
                          <Users className="mr-1 h-3.5 w-3.5" />
                          {job.candidates} Candidates
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:w-auto">
                       <Button variant="outline" size="sm" className="w-full sm:w-auto">
                         Review
                       </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Top Candidates & Activity */}
        <div className="space-y-8">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="font-outfit text-xl">Top Matches</CardTitle>
              <CardDescription>AI recommended candidates for your roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {recentMatches.map((candidate) => (
                  <div key={candidate.id} className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border border-border/50">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {candidate.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1 overflow-hidden">
                      <p className="text-sm font-medium leading-none truncate">
                        {candidate.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {candidate.role}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={candidate.match} className="h-1.5 flex-1" />
                        <span className="text-[10px] font-bold text-primary">{candidate.match}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-primary">
                View All Matches
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-border/50 shadow-sm bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="pb-3">
              <CardTitle className="font-outfit text-lg flex items-center">
                <Activity className="mr-2 h-4 w-4 text-primary" />
                Platform Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                 <div className="flex gap-3 relative before:absolute before:left-[11px] before:top-6 before:h-full before:w-[2px] before:bg-border/60 pb-1">
                   <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 z-10">
                     <div className="h-2 w-2 rounded-full bg-primary"></div>
                   </div>
                   <div className="space-y-0.5">
                     <p className="text-sm font-medium">New candidates applied</p>
                     <p className="text-xs text-muted-foreground">2 hours ago</p>
                   </div>
                 </div>
                 <div className="flex gap-3 relative before:absolute before:left-[11px] before:top-6 before:h-full before:w-[2px] before:bg-border/60 pb-1">
                   <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 z-10">
                     <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                   </div>
                   <div className="space-y-0.5">
                     <p className="text-sm font-medium">Interview scheduled</p>
                     <p className="text-xs text-muted-foreground">5 hours ago</p>
                   </div>
                 </div>
                 <div className="flex gap-3 relative z-10">
                   <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 z-10">
                     <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                   </div>
                   <div className="space-y-0.5">
                     <p className="text-sm font-medium">Job post approved</p>
                     <p className="text-xs text-muted-foreground">Yesterday</p>
                   </div>
                 </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
