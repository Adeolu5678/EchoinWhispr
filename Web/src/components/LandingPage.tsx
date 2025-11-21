'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion, Variants } from 'framer-motion';
import { Shield, ArrowRightLeft, Clock, PenTool, Send, RotateCcw, Sparkles } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

export default function LandingPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-primary/20 p-2 rounded-lg">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight">EchoinWhispr</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/sign-in">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  Log In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              Whisper into the <span className="text-gradient">Void</span>.
              <br />
              Hear an Echo Back.
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Experience true anonymity. Share your thoughts, secrets, and dreams without judgment. 
              Connect with others on a deeper level, where identity takes a backseat to ideas.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20">
                  Start Whispering
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 glass hover:bg-white/5 border-white/10">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why EchoinWhispr?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built for privacy, designed for connection. Our platform offers a unique way to communicate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Complete Anonymity",
                description: "Your identity remains hidden. Express yourself freely without the weight of your persona."
              },
              {
                icon: ArrowRightLeft,
                title: "Organic Connections",
                description: "Start with a one-way whisper. If it resonates, it can evolve into a two-way conversation."
              },
              {
                icon: Clock,
                title: "Ephemeral Nature",
                description: "Messages that don't linger. Experience the freedom of digital impermanence."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="glass p-8 rounded-2xl hover:bg-white/5 transition-colors duration-300 border border-white/5"
              >
                <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-accent/10 via-background to-background" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-16">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: PenTool,
                step: "01",
                title: "Compose",
                description: "Write your message. Be honest, be vulnerable, be funny. It's up to you."
              },
              {
                icon: Send,
                step: "02",
                title: "Send",
                description: "Release your whisper into the ether. It will find its way to a random listener."
              },
              {
                icon: RotateCcw,
                step: "03",
                title: "Echo",
                description: "Wait for a response. If someone replies, a connection is made."
              }
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                <div className="relative bg-card border border-border p-8 rounded-xl h-full">
                  <span className="text-6xl font-black text-muted/20 absolute top-4 right-4 select-none">
                    {item.step}
                  </span>
                  <item.icon className="w-10 h-10 text-accent mb-6" />
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-semibold text-muted-foreground">EchoinWhispr</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <p className="text-sm text-muted-foreground/60">
            © 2024 EchoinWhispr. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}