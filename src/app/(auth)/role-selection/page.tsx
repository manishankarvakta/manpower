"use client";
import { setUserRole } from "@/app/actions/auth";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { HardHat, Briefcase, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RoleSelectionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const handleSelectRole = async (role: "worker" | "contractor") => {
    if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your-api-key") {
      setLoadingRole(role);
      setTimeout(() => {
        localStorage.setItem("dev_mock_role", role);
        window.location.href = `/${role}`;
      }, 800);
      return;
    }

    if (!user) return;
    
    setLoadingRole(role);
    try {
      const res = await setUserRole(user.uid, role);
      if (res.success) {
        toast.success(`Role set to ${role}`);
        router.push(`/${role}`);
      } else {
        toast.error("Failed to set role. Please try again.");
        setLoadingRole(null);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      setLoadingRole(null);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 sm:p-8">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-2 shadow-inner">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="font-outfit text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Choose your path
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            Select how you want to use the platform. Your experience will be customized based on your selection.
          </p>
        </div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          <RoleCard 
            title="I'm a Worker"
            description="I want to upload my Iqama, build my professional profile, and find the best jobs."
            icon={HardHat}
            role="worker"
            selectedRole={loadingRole}
            onSelect={handleSelectRole}
          />

          <RoleCard 
            title="I'm a Contractor"
            description="I want to post jobs, hire verified workers, and manage my construction projects."
            icon={Briefcase}
            role="contractor"
            selectedRole={loadingRole}
            onSelect={handleSelectRole}
          />
        </div>

      </div>
    </div>
  );
}

interface RoleCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  role: "worker" | "contractor";
  selectedRole: string | null;
  onSelect: (role: "worker" | "contractor") => void;
}

function RoleCard({ title, description, icon: Icon, role, selectedRole, onSelect }: RoleCardProps) {
  const isLoading = selectedRole === role;
  const isOtherLoading = selectedRole !== null && selectedRole !== role;
  
  return (
    <button
      onClick={() => onSelect(role)}
      disabled={selectedRole !== null}
      className={cn(
        "group relative flex flex-col text-left p-8 sm:p-10 rounded-3xl border-2 transition-all duration-500 overflow-hidden outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
        !selectedRole ? "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:shadow-2xl hover:-translate-y-2 hover:border-primary/40" : "",
        isLoading ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-2xl shadow-primary/10 scale-[1.02]" : "",
        isOtherLoading ? "opacity-50 grayscale pointer-events-none scale-95 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900" : ""
      )}
    >
      {/* Top right icon */}
      <div className={cn(
        "absolute top-8 right-8 transition-all duration-300",
        isLoading ? "text-primary" : "text-slate-300 dark:text-slate-700 group-hover:translate-x-1 group-hover:text-primary"
      )}>
         {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ChevronRight className="w-6 h-6" />}
      </div>

      <div className={cn(
        "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 relative z-10",
        isLoading 
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-primary/10 group-hover:text-primary group-hover:scale-110"
      )}>
        <Icon className="w-8 h-8" strokeWidth={1.5} />
      </div>

      <h3 className="font-outfit text-2xl font-bold text-slate-900 dark:text-white mb-3 relative z-10">
        {title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-[90%] relative z-10">
        {description}
      </p>

      {/* Decorative background gradient blobs */}
      <div className={cn(
        "absolute -bottom-32 -right-32 w-64 h-64 rounded-full blur-3xl transition-all duration-700 pointer-events-none",
        isLoading ? "bg-primary/30 opacity-100 scale-150" : "bg-primary/0 opacity-0 group-hover:bg-primary/20 group-hover:opacity-100 group-hover:scale-110"
      )} />
    </button>
  );
}
