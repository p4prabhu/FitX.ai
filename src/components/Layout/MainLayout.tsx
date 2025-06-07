import Header from './Header';
import type { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-bg-page text-bg-nav flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center w-full px-2 sm:px-6 py-8">
        {children}
      </main>
      <footer className="bg-bg-nav border-t border-[#222222]/10 mt-8">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-text-nav-hover text-sm">
            © 2024 FitX.ai. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout; 