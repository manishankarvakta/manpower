"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  MapPin,
  Building,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Award,
  Wallet,
  Calendar,
  AlertCircle
} from "lucide-react";

export default function WorkerDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-blue-50/50 p-8 border border-indigo-100 shadow-sm">
        <div className="absolute -top-12 -right-12 text-indigo-500/10 pointer-events-none">
          <Award className="w-64 h-64" />
        </div>
        <div className="relative z-10">
          <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-none mb-4 px-3 py-1 text-xs">
            Level 2 Worker
          </Badge>
          <h1 className="font-outfit text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Welcome back, {user?.displayName || "Worker"}! 👋
          </h1>
          <p className="text-slate-600 max-w-xl text-lg">
            You have 3 new recommended jobs matching your skills. Complete your profile to increase your visibility to top companies.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link href="/worker/jobs">
              <Button className="rounded-full px-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200">
                Browse Jobs
              </Button>
            </Link>
            <Link href="/worker/profile">
              <Button variant="outline" className="rounded-full px-6 border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                View Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Applications", value: "4", icon: Briefcase, color: "text-blue-600", bg: "bg-blue-100" },
          { label: "Interviews", value: "1", icon: Calendar, color: "text-emerald-600", bg: "bg-emerald-100" },
          { label: "Profile Views", value: "28", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100" },
          { label: "Earnings (SAR)", value: "0", icon: Wallet, color: "text-amber-600", bg: "bg-amber-100" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-white/50 backdrop-blur-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold font-outfit text-slate-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recommended Jobs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-outfit text-2xl font-semibold text-slate-900">Recommended for you</h2>
              <Link href="/worker/jobs">
                <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-full">
                  View all <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            <div className="grid gap-4">
              {[
                { title: "Senior Electrician", company: "Al-Bawani Construction", location: "Riyadh", type: "Full-time", salary: "SAR 3,000 - 4,500/mo", tags: ["Electrical", "Maintenance"], urgent: true },
                { title: "HVAC Technician", company: "Saudi Oger", location: "Jeddah", type: "Contract", salary: "SAR 2,500 - 3,500/mo", tags: ["Cooling", "Repairs"], urgent: false },
                { title: "Heavy Equipment Operator", company: "Nesma & Partners", location: "Dammam", type: "Full-time", salary: "SAR 4,000 - 5,500/mo", tags: ["Machinery", "Construction"], urgent: false }
              ].map((job, i) => (
                <Card key={i} className="group border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer bg-white">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-outfit font-semibold text-lg text-slate-900 group-hover:text-indigo-700 transition-colors">
                              {job.title}
                            </h3>
                            {job.urgent && (
                              <Badge variant="destructive" className="px-2 py-0.5 text-xs font-semibold">
                                Urgent
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5"><Building className="w-4 h-4 text-slate-400" /> {job.company}</span>
                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {job.location}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {job.tags.map((tag, j) => (
                            <Badge key={j} variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none font-medium">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col items-start sm:items-end gap-3 w-full sm:w-auto">
                        <div className="text-sm font-medium text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 w-full sm:w-auto text-center sm:text-right">
                          {job.salary}
                        </div>
                        <Button className="w-full sm:w-auto rounded-full bg-slate-900 text-white hover:bg-slate-800">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Profile Status */}
          <Card className="border-none shadow-sm bg-gradient-to-b from-white to-slate-50/50">
            <CardHeader className="pb-4">
              <CardTitle className="font-outfit text-lg">Profile Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="relative">
                  <Avatar className="w-20 h-20 border-4 border-white shadow-md">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.displayName || 'worker'}`} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-2xl font-semibold">
                      {user?.displayName?.charAt(0) || 'W'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1.5 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                    <AlertCircle className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">{user?.displayName || "Worker"}</h3>
                  <p className="text-sm text-slate-500 font-medium">General Laborer</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 font-medium">Profile Completion</span>
                  <span className="text-indigo-600 font-bold">65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>

              <div className="space-y-3 bg-white p-4 rounded-xl border border-amber-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-amber-500" /> Action Required
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Upload your valid Iqama and TUB card to reach 100% and start applying for jobs.
                </p>
                <Link href="/worker/documents" className="block w-full">
                  <Button size="sm" className="w-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none shadow-none mt-2 rounded-full font-semibold">
                    Verify Documents
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Application Tracking */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-4 flex flex-row items-center justify-between">
              <CardTitle className="font-outfit text-lg">Application Status</CardTitle>
              <Link href="/worker/applications" className="text-sm text-indigo-600 hover:underline font-medium">
                View all
              </Link>
            </CardHeader>
            <CardContent>
              <div className="relative border-l-2 border-slate-100 ml-3 space-y-6">
                {[
                  { title: "Interview Scheduled", company: "Saudi Oger", time: "Today, 10:00 AM", status: "upcoming", icon: Clock },
                  { title: "Application Under Review", company: "Al-Bawani Construction", time: "Yesterday", status: "review", icon: CheckCircle2 },
                  { title: "Application Submitted", company: "Nesma & Partners", time: "Oct 24, 2023", status: "submitted", icon: Briefcase }
                ].map((item, i) => (
                  <div key={i} className="relative pl-6">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-indigo-500 ring-4 ring-white flex items-center justify-center">
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{item.company}</p>
                      <p className="text-xs text-slate-400 mt-1 font-medium">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
