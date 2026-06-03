"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { createJob } from "@/app/actions/jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Briefcase, MapPin, DollarSign, ArrowRight, Sparkles } from "lucide-react";

const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  budget: z.string().min(1, "Budget is required."),
  location: z.string().min(2, "Location is required."),
});

type JobFormValues = z.infer<typeof jobSchema>;

export default function CreateJobPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
  });

  const onSubmit = async (data: JobFormValues) => {
    setLoading(true);
    try {
      const res = await createJob(data);
      if (res.success) {
        toast.success("Job posted successfully!");
        router.push("/contractor");
      } else {
        toast.error("Failed to post job.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="space-y-2">
          <div className="inline-flex items-center justify-center p-2 bg-blue-100/50 text-blue-700 rounded-xl mb-2">
            <Sparkles className="w-5 h-5 mr-2" />
            <span className="font-semibold text-sm tracking-tight">New Opportunity</span>
          </div>
          <h1 className="text-4xl font-outfit font-bold text-slate-900 tracking-tight">
            Create a Job Posting
          </h1>
          <p className="text-slate-500 text-lg max-w-xl">
            Define your requirements clearly to find the best workforce for your upcoming project.
          </p>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 group/form">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden backdrop-blur-xl">
            <div className="p-6 sm:p-8 space-y-10">
              
              {/* Section 1: Job Fundamentals */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Job Fundamentals</h3>
                    <p className="text-sm text-slate-500">The basic details of your requirement.</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-slate-700 font-medium">Job Title</Label>
                    <Input 
                      id="title" 
                      {...register("title")} 
                      placeholder="e.g., 5x Master Electricians for Commercial Build" 
                      className="h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all shadow-sm rounded-xl"
                    />
                    {errors.title && <p className="text-sm text-red-500 font-medium mt-1 animate-in fade-in slide-in-from-top-1">{errors.title.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-slate-700 font-medium">Detailed Description</Label>
                    <Textarea 
                      id="description" 
                      {...register("description")} 
                      placeholder="Describe the project scope, specific skills required, timeline, and any other relevant details..." 
                      className="min-h-[160px] resize-none bg-slate-50/50 border-slate-200 focus:bg-white transition-all py-3.5 shadow-sm rounded-xl leading-relaxed" 
                    />
                    {errors.description && <p className="text-sm text-red-500 font-medium mt-1 animate-in fade-in slide-in-from-top-1">{errors.description.message}</p>}
                  </div>
                </div>
              </div>

              {/* Section 2: Logistics & Budget */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Logistics & Budget</h3>
                    <p className="text-sm text-slate-500">Where is it and what is the budget?</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-slate-700 font-medium">Location</Label>
                    <div className="relative group">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-emerald-500" />
                      <Input 
                        id="location" 
                        {...register("location")} 
                        placeholder="e.g., Riyadh, Saudi Arabia" 
                        className="h-12 pl-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-all shadow-sm rounded-xl"
                      />
                    </div>
                    {errors.location && <p className="text-sm text-red-500 font-medium mt-1 animate-in fade-in slide-in-from-top-1">{errors.location.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="budget" className="text-slate-700 font-medium">Budget (SAR)</Label>
                    <div className="relative group">
                      <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-emerald-500" />
                      <Input 
                        id="budget" 
                        type="number"
                        {...register("budget")} 
                        placeholder="e.g., 15000" 
                        className="h-12 pl-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-all shadow-sm rounded-xl"
                      />
                    </div>
                    {errors.budget && <p className="text-sm text-red-500 font-medium mt-1 animate-in fade-in slide-in-from-top-1">{errors.budget.message}</p>}
                  </div>
                </div>
              </div>

            </div>
            
            {/* Form Actions (Sticky-like footer) */}
            <div className="bg-slate-50/80 px-6 py-5 sm:px-8 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-500 font-medium text-center sm:text-left">
                Review your details before publishing.
              </p>
              <Button 
                type="submit" 
                disabled={loading} 
                className="group w-full sm:w-auto h-12 px-8 text-base shadow-sm hover:shadow-md transition-all rounded-xl font-semibold bg-slate-900 hover:bg-slate-800 text-white"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Publishing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Publish Job Posting
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
