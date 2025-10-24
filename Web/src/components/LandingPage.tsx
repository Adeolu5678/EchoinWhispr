'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, ArrowRightLeft, Clock, PenTool, Send, RotateCcw } from 'lucide-react';

/**
 * LandingPage component for unauthenticated users.
 *
 * Displays a comprehensive homepage with header, hero section, features, how it works, testimonials, and footer.
 * Includes navigation links to authentication routes using Next.js Link.
 *
 * @returns {JSX.Element} The rendered landing page
 */
export default function LandingPage(): JSX.Element {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#242447] px-4 sm:px-10 py-3">
              <div className="flex items-center gap-4 text-white">
                <div className="size-6 text-primary">
                  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fill="currentColor" fillRule="evenodd"></path>
                  </svg>
                </div>
                <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">EchoinWhispr</h2>
              </div>
              <div className="flex gap-2">
                <Link href="/sign-up">
                  <Button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
                    <span className="truncate">Sign Up</span>
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#242447] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#343465] transition-colors">
                    <span className="truncate">Log In</span>
                  </Button>
                </Link>
              </div>
            </header>
            <main className="flex-1">
              <div className="@container py-10">
                <div className="@[480px]:p-4">
                  <div className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center p-4" style={{ backgroundImage: 'linear-gradient(rgba(17, 17, 33, 0.5) 0%, rgba(17, 17, 33, 0.8) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCkoIawgKA5lHMHIwvNHxPBlcjBkzMxjzF8rn1jyXifVTpSUfP9cU-foacs-jWJLm52sGK7HCepCbKqJLvP1VFH3MHOPih3G8gB5n3Q1Wqk3pekhPSsy-mMjoHi5ZlZjY5lWflbvI1dEOUC44u9glnnY4F8tTtPz12hvbmzvjeaqHq_qTJrrCasmS9wBm3jdTHHSDWDChR0G83_7zEJcLuOdpYm2UdGB2Nikr3uLvM_YxJLWCuYKKMA6TwRcve0pxeePgxTm-N_aRU")' }}>
                    <div className="flex flex-col gap-2 text-center max-w-2xl">
                      <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                        Whisper into the Void. Hear an Echo Back.
                      </h1>
                      <p className="text-white/80 text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                        EchoinWhispr is a platform for anonymous messages. Styled with <span className="font-semibold text-white">Tailwind CSS</span> and built with <span className="font-semibold text-white">Shadcn UI</span> components.
                      </p>
                    </div>
                    <div className="flex-wrap gap-3 flex justify-center">
                      <Link href="/sign-up">
                        <Button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] hover:bg-primary/90 transition-colors">
                          <span className="truncate">Get Started</span>
                        </Button>
                      </Link>
                      <Link href="/sign-in">
                        <Button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#242447] text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] hover:bg-[#343465] transition-colors">
                          <span className="truncate">Learn More</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-10 px-4 py-10 @container">
                <div className="flex flex-col gap-4 text-center items-center">
                  <h2 className="text-white tracking-tight text-3xl font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]">
                    Discover a New Way to Connect
                  </h2>
                  <p className="text-white/80 text-base font-normal leading-normal max-w-[720px]">
                    Our platform is built on the principles of anonymity and the potential for genuine connection. Here is what makes EchoinWhispr unique:
                  </p>
                </div>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 p-0">
                  <div className="flex flex-1 gap-4 rounded-xl border border-[#343465] bg-[#1a1a32] p-6 flex-col items-center text-center">
                    <Shield className="text-primary text-4xl" />
                    <div className="flex flex-col gap-1">
                      <h3 className="text-white text-lg font-bold leading-tight">Anonymity</h3>
                      <p className="text-[#9393c8] text-sm font-normal leading-normal">Your identity is your secret. Share your thoughts without revealing who you are.</p>
                    </div>
                  </div>
                  <div className="flex flex-1 gap-4 rounded-xl border border-[#343465] bg-[#1a1a32] p-6 flex-col items-center text-center">
                    <ArrowRightLeft className="text-primary text-4xl" />
                    <div className="flex flex-col gap-1">
                      <h3 className="text-white text-lg font-bold leading-tight">One-Way to Two-Way</h3>
                      <p className="text-[#9393c8] text-sm font-normal leading-normal">From a single whisper to a meaningful conversation. See where your messages take you.</p>
                    </div>
                  </div>
                  <div className="flex flex-1 gap-4 rounded-xl border border-[#343465] bg-[#1a1a32] p-6 flex-col items-center text-center">
                    <Clock className="text-primary text-4xl" />
                    <div className="flex flex-col gap-1">
                      <h3 className="text-white text-lg font-bold leading-tight">No Digital Trail</h3>
                      <p className="text-[#9393c8] text-sm font-normal leading-normal">Messages that disappear, leaving no trace behind.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-10">
                <h2 className="text-white text-center text-3xl font-bold leading-tight tracking-[-0.015em] px-4 pb-6 pt-5">How it Works</h2>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 p-4">
                  <div className="flex flex-1 gap-3 rounded-xl border border-[#343465] bg-[#1a1a32] p-6 flex-col">
                    <PenTool className="text-primary text-3xl" />
                    <div className="flex flex-col gap-1">
                      <h3 className="text-white text-lg font-bold leading-tight">1. Compose Your Whisper</h3>
                      <p className="text-[#9393c8] text-sm font-normal leading-normal">Write your anonymous message, free from the constraints of identity.</p>
                    </div>
                  </div>
                  <div className="flex flex-1 gap-3 rounded-xl border border-[#343465] bg-[#1a1a32] p-6 flex-col">
                    <Send className="text-primary text-3xl" />
                    <div className="flex flex-col gap-1">
                      <h3 className="text-white text-lg font-bold leading-tight">2. Send it into the Ether</h3>
                      <p className="text-[#9393c8] text-sm font-normal leading-normal">Your whisper is sent out, ready to be discovered by another user.</p>
                    </div>
                  </div>
                  <div className="flex flex-1 gap-3 rounded-xl border border-[#343465] bg-[#1a1a32] p-6 flex-col">
                    <RotateCcw className="text-primary text-3xl" />
                    <div className="flex flex-col gap-1">
                      <h3 className="text-white text-lg font-bold leading-tight">3. Wait for an Echo</h3>
                      <p className="text-[#9393c8] text-sm font-normal leading-normal">If your whisper resonates, you might receive a reply and start a conversation.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-10 px-4">
                <div className="flex flex-col gap-6 text-center items-center">
                  <h2 className="text-white text-3xl font-bold leading-tight tracking-[-0.015em]">What People Are Saying</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                    <div className="bg-[#1a1a32] p-6 rounded-xl border border-[#343465] flex flex-col items-center gap-4">
                      <p className="text-white/90 italic">&ldquo;The freedom to speak my mind without judgment is liberating. I&apos;ve had some of the most profound conversations here.&rdquo;</p>
                      <span className="text-[#9393c8] font-semibold">- User_Alpha7</span>
                    </div>
                    <div className="bg-[#1a1a32] p-6 rounded-xl border border-[#343465] flex flex-col items-center gap-4">
                      <p className="text-white/90 italic">&ldquo;It&apos;s exciting. You never know if your whisper will echo back. It&apos;s a beautiful way to connect with strangers.&rdquo;</p>
                      <span className="text-[#9393c8] font-semibold">- EchoSeeker22</span>
                    </div>
                  </div>
                </div>
              </div>
            </main>
            <footer className="mt-20 border-t border-solid border-t-[#242447] px-4 sm:px-10 py-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-white/50 text-sm">
                  <span>© 2024 EchoinWhispr.</span>
                  <span>All rights reserved.</span>
                </div>
                <div className="flex gap-4">
                  <a className="text-white/80 hover:text-white transition-colors text-sm" href="#">About Us</a>
                  <a className="text-white/80 hover:text-white transition-colors text-sm" href="#">Contact</a>
                  <a className="text-white/80 hover:text-white transition-colors text-sm" href="#">Privacy Policy</a>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}