import { ReactNode } from 'react';
import { Navigation } from '@/components/Navigation';

/**
 * Props for the MainLayout component
 */
interface MainLayoutProps {
  /** Child components to render within the layout */
  children: ReactNode;
}

/**
 * Main application layout for authenticated users.
 *
 * This layout provides the structure for all authenticated pages in the application,
 * including the main navigation header and proper layout structure. It ensures
 * consistent navigation and layout across all main application pages.
 *
 * Features:
 * - Main navigation header for authenticated users
 * - Proper layout structure with consistent spacing
 * - Responsive design that works on all screen sizes
 * - Integration with Clerk authentication for user state
 * - Clean, minimal design following project guidelines
 *
 * @param props - The component props
 * @returns {JSX.Element} The rendered main layout
 */
export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-primary">
      {/* Main Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
