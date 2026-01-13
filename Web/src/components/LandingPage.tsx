'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion, Variants } from 'framer-motion';
import { Shield, ArrowRightLeft, Clock, PenTool, Send, RotateCcw, Sparkles, Zap, Lock, Users, User } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════
// Animation Variants
// ═══════════════════════════════════════════════════════════════════════

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

const floatVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════
// Feature Data
// ═══════════════════════════════════════════════════════════════════════

const features = [
  {
    icon: Shield,
    title: 'Complete Anonymity',
    description: 'Your identity remains hidden. Express yourself freely without the weight of your persona.',
    gradient: 'from-purple-500 to-violet-600',
  },
  {
    icon: ArrowRightLeft,
    title: 'Organic Connections',
    description: 'Start with a one-way whisper. If it resonates, it can evolve into a two-way conversation.',
    gradient: 'from-fuchsia-500 to-pink-600',
  },
  {
    icon: Clock,
    title: 'Ephemeral Nature',
    description: 'Messages that don\'t linger. Experience the freedom of digital impermanence.',
    gradient: 'from-violet-500 to-purple-600',
  },
];

const howItWorks = [
  {
    icon: PenTool,
    step: '01',
    title: 'Compose',
    description: 'Write your message. Be honest, be vulnerable, be funny. It\'s up to you.',
  },
  {
    icon: Send,
    step: '02',
    title: 'Send',
    description: 'Release your whisper into the ether. It will find its way to a random listener.',
  },
  {
    icon: RotateCcw,
    step: '03',
    title: 'Echo',
    description: 'Wait for a response. If someone replies, a connection is made.',
  },
];

const stats = [
  { value: '100K+', label: 'Whispers Sent', icon: Send },
  { value: '50K+', label: 'Connections Made', icon: Users },
  { value: '99.9%', label: 'Uptime', icon: Zap },
  { value: '100%', label: 'Anonymous', icon: Lock },
];

// ═══════════════════════════════════════════════════════════════════════
// Components
// ═══════════════════════════════════════════════════════════════════════

/**
 * Animated floating orb decoration
 */
const FloatingOrb = ({ 
  className, 
  delay = 0,
  size = 'md'
}: { 
  className?: string; 
  delay?: number;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const sizes = {
    sm: 'w-32 h-32',
    md: 'w-64 h-64',
    lg: 'w-96 h-96',
  };

  return (
    <motion.div
      variants={floatVariants}
      initial="initial"
      animate="animate"
      style={{ animationDelay: `${delay}s` }}
      className={`absolute rounded-full blur-3xl pointer-events-none ${sizes[size]} ${className}`}
    />
  );
};

/**
 * Feature card with glass effect and hover glow
 */
const FeatureCard = ({ 
  feature, 
  index 
}: { 
  feature: typeof features[0]; 
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.15, duration: 0.5 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="group relative"
  >
    {/* Glow effect on hover */}
    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500" />
    
    <div className="relative glass-card p-8 rounded-2xl h-full transition-all duration-300 group-hover:border-primary/30">
      {/* Icon container with gradient background */}
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-glow transition-shadow duration-300`}>
        <feature.icon className="w-7 h-7 text-white" />
      </div>
      
      <h3 className="text-xl font-display font-bold mb-3 group-hover:text-gradient transition-all duration-300">
        {feature.title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {feature.description}
      </p>
    </div>
  </motion.div>
);

/**
 * How it works step card
 */
const StepCard = ({ 
  item, 
  index 
}: { 
  item: typeof howItWorks[0]; 
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.2, duration: 0.5 }}
    className="relative group"
  >
    {/* Connecting line (hidden on last item) */}
    {index < howItWorks.length - 1 && (
      <div className="hidden md:block absolute top-10 left-[calc(100%+1rem)] w-[calc(100%-2rem)] h-px">
        <div className="w-full h-full bg-gradient-to-r from-primary/50 via-accent/30 to-transparent" />
      </div>
    )}
    
    {/* Glow effect on hover */}
    <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
    
    <div className="relative glass-card p-8 rounded-xl h-full transition-all duration-300 group-hover:border-primary/30">
      {/* Step number */}
      <span className="absolute top-4 right-4 text-6xl font-display font-black text-white/5 select-none group-hover:text-primary/10 transition-colors duration-300">
        {item.step}
      </span>
      
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-6 group-hover:bg-accent/30 transition-colors duration-300">
          <item.icon className="w-6 h-6 text-accent" />
        </div>
        
        <h3 className="text-2xl font-display font-bold mb-4 group-hover:text-gradient transition-all duration-300">
          {item.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  </motion.div>
);

/**
 * Stat card component
 */
const StatCard = ({ 
  stat, 
  index 
}: { 
  stat: typeof stats[0]; 
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.4 }}
    className="text-center group"
  >
    <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-300">
      <stat.icon className="w-6 h-6 text-primary" />
    </div>
    <div className="text-3xl md:text-4xl font-display font-bold text-gradient mb-1">
      {stat.value}
    </div>
    <div className="text-sm text-muted-foreground">
      {stat.label}
    </div>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════════

export default function LandingPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════════════════════
          Navigation
          ═══════════════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 group"
            >
              <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg shadow-glow-sm group-hover:shadow-glow transition-shadow duration-300">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-display font-bold tracking-tight">EchoinWhispr</span>
            </motion.div>
            
            {/* Auth buttons - responsive */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 sm:gap-3"
            >
              <Link href="/sign-in">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground px-2 sm:px-4">
                  <span className="hidden sm:inline">Log In</span>
                  <User className="w-4 h-4 sm:hidden" />
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="gradient" size="sm" className="shadow-lg shadow-primary/20 px-3 sm:px-4">
                  <span className="hidden sm:inline">Sign Up</span>
                  <Sparkles className="w-4 h-4 sm:hidden" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════
          Hero Section
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-24 pb-16 md:pt-32 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background" />
        
        {/* Floating orbs */}
        <FloatingOrb className="bg-primary/30 -top-20 left-1/4" size="lg" delay={0} />
        <FloatingOrb className="bg-accent/20 bottom-0 right-1/4" size="md" delay={2} />
        <FloatingOrb className="bg-violet-500/20 top-1/2 -left-20" size="md" delay={4} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 text-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-muted-foreground">Now in Public Beta</span>
            </motion.div>
            
            {/* Headline */}
            <motion.h1 
              variants={itemVariants} 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-8"
            >
              Whisper into the{' '}
              <span className="text-gradient text-glow">Void</span>.
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              Hear an Echo Back.
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p 
              variants={itemVariants} 
              className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto"
            >
              Experience true anonymity. Share your thoughts, secrets, and dreams without judgment. 
              Connect with others on a deeper level, where identity takes a backseat to ideas.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants} 
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/sign-up">
                <Button 
                  size="xl" 
                  variant="gradient"
                  className="w-full sm:w-auto shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-shadow"
                >
                  Start Whispering
                </Button>
              </Link>
              <Link href="#features">
                <Button 
                  size="xl" 
                  variant="glass" 
                  className="w-full sm:w-auto"
                >
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          Stats Section
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-10 md:py-16 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8 md:p-12"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <StatCard key={stat.label} stat={stat} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          Features Section
          ═══════════════════════════════════════════════════════════════════ */}
      <section id="features" className="py-12 md:py-24 relative">
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-sm font-medium text-primary mb-4 tracking-wide uppercase">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
              Why EchoinWhispr?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Built for privacy, designed for connection. Our platform offers a unique way to communicate.
            </p>
          </motion.div>

          {/* Feature cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          How It Works Section
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-12 md:py-24 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-accent/10 via-background to-background" />
        <FloatingOrb className="bg-accent/20 top-1/3 -right-32" size="lg" delay={1} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-sm font-medium text-accent mb-4 tracking-wide uppercase">
              Getting Started
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
              How It Works
            </h2>
          </motion.div>
          
          {/* Steps grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {howItWorks.map((item, index) => (
              <StepCard key={item.step} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CTA Section
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-12 md:py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-12 md:p-16 relative overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Ready to Start Whispering?
              </h2>
              <p className="text-muted-foreground mb-8 text-lg max-w-xl mx-auto">
                Join thousands of others who have found a new way to connect, share, and be heard.
              </p>
              <Link href="/sign-up">
                <Button size="xl" variant="gradient" className="shadow-xl shadow-primary/25">
                  Get Started for Free
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          Footer
          ═══════════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-white/5 py-12 bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-primary to-accent p-1.5 rounded-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-semibold text-muted-foreground">EchoinWhispr</span>
            </div>
            
            {/* Links */}
            <div className="flex gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors duration-200">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors duration-200">Terms</a>
              <a href="#" className="hover:text-primary transition-colors duration-200">Contact</a>
            </div>
            
            {/* Copyright */}
            <p className="text-sm text-muted-foreground/60">
              © {new Date().getFullYear()} EchoinWhispr. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}