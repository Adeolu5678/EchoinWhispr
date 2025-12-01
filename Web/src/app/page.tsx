'use client';

import Link from "next/link";
import { ArrowRight, Rocket, Shield, Users, Zap, Globe, Target } from "lucide-react";
import { SignInButton, useUser } from "@clerk/nextjs";

export default function LandingPage() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl opacity-50 animate-pulse" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-medium text-slate-300">VentureDeck 3.0 is Live</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            Where Ambition <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
              Meets Opportunity
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            We envision a world where every groundbreaking idea has a clear path to reality. 
            VentureDeck is the catalyst that transforms raw ambition into investable enterprises.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            {isSignedIn ? (
              <Link 
                href="/dashboard"
                className="group relative px-8 py-4 bg-white text-slate-950 rounded-full font-semibold text-lg hover:bg-slate-100 transition-all hover:scale-105 active:scale-95"
              >
                Go to Dashboard
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <SignInButton mode="modal">
                <button className="group relative px-8 py-4 bg-white text-slate-950 rounded-full font-semibold text-lg hover:bg-slate-100 transition-all hover:scale-105 active:scale-95">
                  Start Your Journey
                  <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </SignInButton>
            )}
            <Link 
              href="#how-it-works"
              className="px-8 py-4 bg-white/5 text-white rounded-full font-semibold text-lg hover:bg-white/10 border border-white/10 transition-all backdrop-blur-sm"
            >
              How it Works
            </Link>
          </div>
        </div>
      </section>

      {/* Strategic Aims / Features */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Our Strategic Aims</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Built on four pillars to revolutionize the venture capital landscape.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={Globe}
              title="Democratize Access"
              description="Leveling the playing field for entrepreneurs by providing standardized tools to showcase potential."
              delay={0}
            />
            <FeatureCard 
              icon={Target}
              title="Accelerate Discovery"
              description="Empowering investors with high-signal, data-driven deal flow to find the next unicorn efficiently."
              delay={100}
            />
            <FeatureCard 
              icon={Shield}
              title="Build Trust"
              description="Establishing a verified ecosystem where certifications, skills, and reputation are transparent."
              delay={200}
            />
            <FeatureCard 
              icon={Users}
              title="Foster Connection"
              description="Creating meaningful, direct channels between founders, funders, and builders."
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* The Ecosystem */}
      <section className="py-32 bg-slate-900/50 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-8">Two Worlds, <br/>One Platform</h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <Rocket className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">The Forge</h3>
                    <p className="text-slate-400 leading-relaxed">
                      For Entrepreneurs. A structured environment to articulate visions, build pitch decks, and showcase traction. Turn your idea into an investable asset.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Deal Flow</h3>
                    <p className="text-slate-400 leading-relaxed">
                      For Investors. A high-signal discovery engine to find, vet, and connect with the next generation of unicorns. Data-driven due diligence at your fingertips.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-3xl opacity-20" />
              <div className="relative bg-slate-950 border border-white/10 rounded-3xl p-8 shadow-2xl">
                {/* Abstract UI Mockup */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-800" />
                      <div>
                        <div className="h-4 w-32 bg-slate-800 rounded mb-2" />
                        <div className="h-3 w-20 bg-slate-800/50 rounded" />
                      </div>
                    </div>
                    <div className="h-8 w-24 bg-indigo-500/20 rounded-full" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-slate-800/50 rounded" />
                    <div className="h-4 w-5/6 bg-slate-800/50 rounded" />
                    <div className="h-4 w-4/6 bg-slate-800/50 rounded" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="h-24 bg-slate-800/30 rounded-xl" />
                    <div className="h-24 bg-slate-800/30 rounded-xl" />
                    <div className="h-24 bg-slate-800/30 rounded-xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600/5" />
        <div className="container mx-auto px-6 relative text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to Launch?</h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Join the ecosystem where the future is being built today.
          </p>
          <SignInButton mode="modal">
            <button className="px-10 py-5 bg-white text-slate-950 rounded-full font-bold text-xl hover:bg-slate-100 transition-all hover:scale-105 shadow-xl shadow-white/10">
              Get Started Now
            </button>
          </SignInButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-slate-950">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <Link href="/" className="text-2xl font-bold text-white mb-4 block">VentureDeck</Link>
              <p className="text-slate-400 max-w-sm">
                The ultimate launchpad for new startups. Bridging the gap between ambition and opportunity.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Platform</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="#" className="hover:text-white transition-colors">The Forge</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Deal Flow</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 text-center text-slate-500 text-sm">
            © {new Date().getFullYear()} VentureDeck. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) {
  return (
    <div 
      className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-1 group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-indigo-400" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
