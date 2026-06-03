"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Briefcase, FileWarning, CheckCircle2, Activity, Database, HardDrive, ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const kpis = [
  {
    title: "Total Workers",
    value: "1,204",
    trend: "+12% from last month",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Total Contractors",
    value: "342",
    trend: "+5% from last month",
    icon: Briefcase,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Pending Verifications",
    value: "12",
    trend: "Requires immediate action",
    icon: FileWarning,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    isActionable: true,
  },
  {
    title: "Active Contracts",
    value: "856",
    trend: "+18% from last month",
    icon: CheckCircle2,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

const recentActivity = [
  { id: 1, user: "Ahmed A.", action: "submitted documents for verification", time: "10 mins ago", type: "verification" },
  { id: 2, user: "BuildCo Ltd.", action: "posted a new job: Senior Electrician", time: "1 hour ago", type: "job" },
  { id: 3, user: "Mohammed S.", action: "profile approved by admin", time: "2 hours ago", type: "approval" },
  { id: 4, user: "Gulf Contracting", action: "registered as a new contractor", time: "5 hours ago", type: "registration" },
  { id: 5, user: "System", action: "automated backup completed successfully", time: "1 day ago", type: "system" },
];

const systemHealth = [
  { name: "API Servers", status: "Healthy", uptime: "99.9%", icon: Activity, color: "text-emerald-500" },
  { name: "Database", status: "Healthy", uptime: "99.9%", icon: Database, color: "text-emerald-500" },
  { name: "Storage", status: "45% Used", uptime: "Normal", icon: HardDrive, color: "text-blue-500" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-outfit text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Monitor system metrics, review pending verifications, and track platform activity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden md:flex">
            Download Report
          </Button>
          <Link href="/admin/verifications">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
              Review Queue
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-md hover:border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <div className={cn("p-2 rounded-full", kpi.bg, kpi.color)}>
                <kpi.icon className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-outfit">{kpi.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {kpi.trend}
              </p>
              {kpi.isActionable && (
                <Link href="/admin/verifications" className="mt-4 block">
                  <Button variant="secondary" size="sm" className="w-full text-xs hover:bg-amber-500/20 hover:text-amber-500 transition-colors">
                    Review Now
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-border/50 shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across the platform.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-6 pl-2">
              {recentActivity.map((activity, i) => (
                <div key={activity.id} className="flex gap-4 items-start relative">
                  {/* Timeline line */}
                  {i !== recentActivity.length - 1 && (
                    <div className="absolute top-8 left-[15px] w-px h-full bg-border/50" />
                  )}
                  
                  <div className="relative z-10 flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center border-2 border-background">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <p className="text-sm leading-tight">
                      <span className="font-medium text-foreground">{activity.user}</span>{" "}
                      <span className="text-muted-foreground">{activity.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="bg-transparent border-t border-border/50 p-0 mt-auto">
            <Button variant="ghost" className="w-full h-12 text-sm text-muted-foreground hover:text-foreground rounded-none rounded-b-xl">
              View All Activity <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>

        {/* System Health */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Real-time infrastructure status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemHealth.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-secondary/20 transition-colors hover:bg-secondary/40">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-md bg-background shadow-sm border border-border/50", item.color)}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{item.uptime}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-border/50 shadow-sm bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors bg-background/50">
                <Users className="w-4 h-4 mr-2" /> Add New Admin
              </Button>
              <Button variant="outline" className="w-full justify-start border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors bg-background/50">
                <Briefcase className="w-4 h-4 mr-2" /> Broadcast Message
              </Button>
              <Button variant="outline" className="w-full justify-start border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors bg-background/50">
                <Database className="w-4 h-4 mr-2" /> Export Database
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
