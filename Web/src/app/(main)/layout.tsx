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
 * Layout wrapper for authenticated pages that provides the main navigation and a centered, padded content area.
 *
 * Renders the top navigation and a responsive container that constrains width and applies horizontal and vertical padding for the page content.
 *
 * @param children - Content to be rendered inside the layout's main content area
 * @returns The layout element containing the navigation and the provided children
 */
export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen">
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
