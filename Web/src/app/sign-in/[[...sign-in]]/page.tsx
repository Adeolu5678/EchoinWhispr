import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/20 rounded-full blur-[100px]" />
      </div>

      <div className="z-10 flex flex-col items-center gap-8 w-full max-w-md px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <span className="text-white font-bold text-xl">V</span>
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            VentureDeck
          </span>
        </Link>

        <SignIn appearance={{
          elements: {
            rootBox: "w-full",
            card: "bg-slate-900/50 backdrop-blur-xl border border-slate-800 shadow-2xl rounded-2xl w-full",
            headerTitle: "text-white text-xl font-bold",
            headerSubtitle: "text-slate-400",
            socialButtonsBlockButton: "bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 transition-colors",
            socialButtonsBlockButtonText: "text-white font-medium",
            dividerLine: "bg-slate-800",
            dividerText: "text-slate-500",
            formFieldLabel: "text-slate-300 font-medium",
            formFieldInput: "bg-slate-950/50 border border-slate-800 text-white focus:border-indigo-500 transition-colors rounded-lg",
            footerActionLink: "text-indigo-400 hover:text-indigo-300 font-medium",
            formButtonPrimary: "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-indigo-500/20 transition-all duration-200",
            footer: "hidden", // Hide default footer to simplify or keep if needed
          },
          layout: {
            socialButtonsPlacement: "bottom",
            socialButtonsVariant: "blockButton",
          }
        }} />
      </div>
    </div>
  );
}
