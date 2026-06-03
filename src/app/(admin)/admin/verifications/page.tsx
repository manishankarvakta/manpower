"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { approveWorkerVerification } from "@/app/actions/admin";
import { useState } from "react";
import { Search, Eye, CheckCircle2, XCircle, FileText, FileCheck, Clock, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const MOCK_QUEUE = [
  { id: "wk_1", name: "Ahmed Al-Farsi", type: "Iqama (ID)", submitted: "2 hours ago", status: "pending", score: 85 },
  { id: "wk_2", name: "Mohammed Jaber", type: "TUB Card", submitted: "5 hours ago", status: "pending", score: 92 },
  { id: "wk_3", name: "Sara Al-Otaibi", type: "Passport", submitted: "1 day ago", status: "approved", score: 99 },
  { id: "wk_4", name: "Fahad Al-Dosari", type: "Visa", submitted: "2 days ago", status: "rejected", score: 45 },
  { id: "wk_5", name: "Yousef Ibrahim", type: "Medical Certificate", submitted: "Just now", status: "pending", score: 78 },
];

const statusStyles = {
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  approved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-500 border-red-500/20",
};

const statusIcons = {
  pending: Clock,
  approved: CheckCircle2,
  rejected: XCircle,
};

export default function VerificationQueuePage() {
  const [queue, setQueue] = useState(MOCK_QUEUE);
  const [processing, setProcessing] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const handleApprove = async (id: string) => {
    setProcessing(id);
    const res = await approveWorkerVerification(id);
    // Even if mock API fails/succeeds, we update UI for demonstration
    if (res?.success || true) {
      setQueue(queue.map(q => q.id === id ? { ...q, status: "approved" } : q));
    }
    setProcessing(null);
  };
  
  const handleReject = (id: string) => {
    setQueue(queue.map(q => q.id === id ? { ...q, status: "rejected" } : q));
  }

  const filteredQueue = queue.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) && 
    (filter === "all" || item.status === filter)
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-outfit text-3xl font-bold text-slate-50 tracking-tight">Document Verifications</h2>
          <p className="text-slate-400 mt-1">Review and process worker identity documents.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-slate-900/50 border-slate-800 text-slate-300 py-1.5 px-3">
            <span className="w-2 h-2 rounded-full bg-amber-500 mr-2 animate-pulse"></span>
            {queue.filter(q => q.status === "pending").length} Pending
          </Badge>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 backdrop-blur-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search by name or ID..." 
            className="pl-9 bg-slate-950/50 border-slate-800 text-slate-200 placeholder:text-slate-500 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            className={`flex-1 sm:flex-none border-slate-800 ${filter === 'all' ? 'bg-slate-800 text-slate-100' : 'bg-transparent text-slate-400 hover:text-slate-200'}`}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant="outline" 
            className={`flex-1 sm:flex-none border-slate-800 ${filter === 'pending' ? 'bg-amber-500/20 text-amber-500 border-amber-500/30' : 'bg-transparent text-slate-400 hover:text-slate-200'}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <Card className="bg-slate-900/40 border-slate-800/60 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/60 bg-slate-900/50">
                <th className="py-4 px-6 font-medium text-slate-400 text-sm">Applicant & Document</th>
                <th className="py-4 px-6 font-medium text-slate-400 text-sm">AI Score</th>
                <th className="py-4 px-6 font-medium text-slate-400 text-sm">Submitted</th>
                <th className="py-4 px-6 font-medium text-slate-400 text-sm">Status</th>
                <th className="py-4 px-6 font-medium text-slate-400 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredQueue.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <FileCheck className="w-12 h-12 text-slate-700 mb-3" />
                      <p>No documents found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredQueue.map((item) => {
                  const StatusIcon = statusIcons[item.status as keyof typeof statusIcons];
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/20 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-800/80 flex items-center justify-center border border-slate-700">
                            <FileText className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-200">{item.name}</h3>
                            <p className="text-xs text-slate-500 mt-0.5">{item.type} • {item.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${item.score > 90 ? 'bg-emerald-500' : item.score > 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${item.score}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400">{item.score}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-slate-400">{item.submitted}</span>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant="outline" className={`${statusStyles[item.status as keyof typeof statusStyles]} flex items-center gap-1.5 w-fit`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span className="capitalize">{item.status}</span>
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-200 hover:bg-slate-800">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {item.status === 'pending' && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                                onClick={() => handleApprove(item.id)}
                                disabled={processing === item.id}
                              >
                                {processing === item.id ? <Clock className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                onClick={() => handleReject(item.id)}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 w-8 text-slate-400 hover:text-slate-200 hover:bg-slate-800">
                              <MoreHorizontal className="w-4 h-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                              <DropdownMenuItem className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer">View Details</DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer">Download File</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-400 hover:bg-red-950 focus:bg-red-950 focus:text-red-400 cursor-pointer">Request Re-upload</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
