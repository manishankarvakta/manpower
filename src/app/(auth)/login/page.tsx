"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { user, role, loading } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isEmailLoggingIn, setIsEmailLoggingIn] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      if (role === "worker") router.push("/worker");
      else if (role === "contractor") router.push("/contractor");
      else router.push("/role-selection");
    }
  }, [user, role, loading, router]);

  const handleGoogleLogin = async () => {
    if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your-api-key") {
      localStorage.setItem("dev_mock_logged_in", "true");
      window.location.reload();
      return;
    }

    setIsLoggingIn(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Successfully logged in!");
    } catch (error: any) {
      console.error("Login failed", error);
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailLoggingIn(true);
    setTimeout(() => {
      setIsEmailLoggingIn(false);
      toast.info("Email login is coming soon. Please use Google Sign In for now.");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-slate-950">
      {/* Left Visual Pane */}
      <div className="hidden w-1/2 flex-col justify-between bg-slate-950 p-10 lg:flex relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.3),rgba(255,255,255,0))] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_100%_100%,rgba(120,119,198,0.2),transparent_50%)] pointer-events-none" />
        <div className="absolute top-1/4 left-[-10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Logo/Brand */}
        <div className="relative z-10 flex items-center gap-3">
           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/20">
             <span className="font-bold text-xl font-outfit">S</span>
           </div>
           <span className="text-2xl font-bold tracking-tight text-white font-outfit">Saudi Manpower</span>
        </div>

        {/* Content */}
        <div className="relative z-10 mb-12 max-w-lg">
          <div className="mb-6 inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-300 backdrop-blur-md">
            🚀 The Kingdom's Premier Platform
          </div>
          <h1 className="text-4xl font-semibold text-white tracking-tight mb-6 font-outfit leading-[1.15]">
            Connecting premium talent with exceptional opportunities.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-10">
            Streamline your workforce management, discover verified contractors, and elevate your career with the most trusted platform in Saudi Arabia.
          </p>
          
          <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50 backdrop-blur-sm w-fit">
            <div className="flex -space-x-3">
              <img className="h-10 w-10 rounded-full border-2 border-slate-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="User 1" />
              <img className="h-10 w-10 rounded-full border-2 border-slate-900 object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" alt="User 2" />
              <img className="h-10 w-10 rounded-full border-2 border-slate-900 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="User 3" />
              <img className="h-10 w-10 rounded-full border-2 border-slate-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="User 4" />
            </div>
            <div className="text-sm text-slate-400">
              <span className="text-white font-semibold">10,000+</span> professionals<br/>already joined us
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Pane */}
      <div className="flex w-full flex-col justify-center bg-white px-6 py-12 dark:bg-slate-950 lg:w-1/2 lg:px-20 xl:px-32">
        <div className="mx-auto w-full max-w-md space-y-8">
          
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 lg:hidden mb-10">
             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/20">
               <span className="font-bold text-xl font-outfit">S</span>
             </div>
             <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-outfit">Saudi Manpower</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-outfit">
              Welcome back
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              Please enter your details to sign in to your account.
            </p>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@company.com" 
                required 
                className="h-12 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 transition-all focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</Label>
                <Link href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                required 
                className="h-12 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 transition-all focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
              />
            </div>

            <Button type="submit" disabled={isEmailLoggingIn} className="w-full h-12 text-base font-medium bg-slate-900 hover:bg-slate-800 text-white dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors shadow-sm">
              {isEmailLoggingIn ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : null}
              Sign In
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                Or continue with
              </span>
            </div>
          </div>

          <Button 
            type="button" 
            variant="outline" 
            onClick={handleGoogleLogin} 
            disabled={isLoggingIn}
            className="w-full h-12 text-base font-medium border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-900 dark:text-slate-300 transition-all hover:shadow-sm"
          >
            {isLoggingIn ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            Google
          </Button>

          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
