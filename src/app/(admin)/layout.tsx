"use client";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/client";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // For local MVP testing, we are not strictly enforcing the redirect 
    // so you can visualize the UI without needing to hack the DB first.
    // In production: if (!loading && (!user || role !== "admin")) router.push("/login");
  }, [user, role, loading, router]);

  if (loading) return <div className="p-8">Loading Admin Portal...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/admin" className="text-lg font-semibold hover:text-primary">Dashboard</Link>
                <Link href="/admin/worker" className="text-lg font-semibold hover:text-primary">Workers</Link>
                <Link href="/admin/verifications" className="text-lg font-semibold hover:text-primary">Verifications</Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-6">
            <h1 className="font-outfit text-2xl font-bold text-primary">Admin Control Center</h1>
            <nav className="hidden md:flex gap-4">
              <Link href="/admin" className="text-muted-foreground hover:text-foreground">Dashboard</Link>
              <Link href="/admin/worker" className="text-muted-foreground hover:text-foreground">Workers</Link>
              <Link href="/admin/verifications" className="text-muted-foreground hover:text-foreground">Verifications</Link>
            </nav>
          </div>
        </div>
        <Button variant="secondary" onClick={() => auth.signOut()}>Sign Out</Button>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
