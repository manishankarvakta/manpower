import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ShieldCheck, Zap, FileSignature, Users, ArrowRight, Building2, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary flex flex-col" dir="ltr">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-outfit font-bold text-xl tracking-tight">KSA Manpower</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</Link>
            <Link href="#stats" className="hover:text-foreground transition-colors">Statistics</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors px-3 py-2">
              Log In
            </Link>
            <Link href="/register" className={buttonVariants({ size: "sm", className: "rounded-full px-5" })}>
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
          
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              The Vision 2030 Manpower Solution
            </div>
            
            <h1 className="font-outfit text-5xl md:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
              Empowering the Workforce of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500">Saudi Arabia</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
              Connect with verified manual workers and licensed contractors instantly. Fast, secure, and fully automated onboarding to accelerate your projects.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <Link href="/register" className={buttonVariants({ size: "lg", className: "w-full sm:w-auto h-14 px-8 text-base rounded-full group" })}>
                Find Workers
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className={buttonVariants({ variant: "outline", size: "lg", className: "w-full sm:w-auto h-14 px-8 text-base rounded-full" })}>
                Join as Contractor
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="border-y border-border/50 bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border/50">
              <div className="flex flex-col items-center justify-center py-4">
                <span className="text-4xl font-bold font-outfit text-primary mb-2">50,000+</span>
                <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Verified Workers</span>
              </div>
              <div className="flex flex-col items-center justify-center py-4">
                <span className="text-4xl font-bold font-outfit text-primary mb-2">12,000+</span>
                <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Licensed Contractors</span>
              </div>
              <div className="flex flex-col items-center justify-center py-4">
                <span className="text-4xl font-bold font-outfit text-primary mb-2">100%</span>
                <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Secure Contracts</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-outfit mb-4">Why Choose Our Platform?</h2>
              <p className="text-muted-foreground text-lg">
                We bridge the gap between quality manpower and major projects with an innovative, secure, and intuitive platform.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                  <ShieldCheck className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Verified Talent</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Every worker is strictly vetted, and every contractor is officially licensed. Trust is our foundation.
                </p>
              </div>

              {/* Card 2 */}
              <div className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                  <Zap className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Instant Matching</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Our advanced algorithm matches job requirements with the perfect skill sets in seconds.
                </p>
              </div>

              {/* Card 3 */}
              <div className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                  <FileSignature className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Secure Contracts</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Automated digital agreements and secure payment gateways protect all parties involved.
                </p>
              </div>

              {/* Card 4 */}
              <div className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                  <Users className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Vast Network</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Access thousands of active profiles across all major cities and provinces in Saudi Arabia.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="py-24 bg-muted/20 border-t border-border/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-outfit mb-16">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
              {/* Connecting Lines (Desktop only) */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-border -z-10"></div>
              
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-background border-4 border-primary/20 flex items-center justify-center mb-6 text-3xl font-bold font-outfit text-primary shadow-sm">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3">Create an Account</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Sign up in minutes. Complete our fast automated onboarding and verification process.
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-background border-4 border-primary/50 flex items-center justify-center mb-6 text-3xl font-bold font-outfit text-primary shadow-md">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3">Post or Browse</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Contractors can post requirements, while workers can browse available opportunities.
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-primary border-4 border-primary/20 flex items-center justify-center mb-6 text-3xl font-bold font-outfit text-primary-foreground shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3">Connect & Hire</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Sign digital contracts and manage your workforce or projects seamlessly on our platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-primary/5"></div>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold font-outfit mb-6 text-foreground">
              Ready to scale your workforce?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of contractors and workers already using our platform to build the future of Saudi Arabia.
            </p>
            <Link href="/register" className={buttonVariants({ size: "lg", className: "h-14 px-10 text-lg rounded-full group" })}>
              Get Started Now
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" />
            <span className="font-outfit font-semibold text-lg">KSA Manpower</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Saudi Manpower Platform. All rights reserved.
          </div>
          <div className="flex gap-4 text-sm font-medium text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
