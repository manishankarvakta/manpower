"use client";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b bg-white px-4 md:px-8 py-4 flex items-center justify-between dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href={`/${role}`} className="text-lg font-semibold">Dashboard</Link>
                {role === "contractor" && <Link href="/contractor/jobs/create" className="text-lg font-semibold">Create Job</Link>}
              </nav>
            </SheetContent>
          </Sheet>
          <h1 className="font-outfit text-2xl font-bold text-primary">Manpower Platform</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-4 items-center mx-4">
            <Link href={`/${role}`} className="text-sm font-semibold hover:text-primary">Dashboard</Link>
            {role === "contractor" && <Link href="/contractor/jobs/create" className="text-sm font-semibold hover:text-primary">Create Job</Link>}
          </nav>
          <Button variant="outline" onClick={() => auth.signOut()}>Sign Out</Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
