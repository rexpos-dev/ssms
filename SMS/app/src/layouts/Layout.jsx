import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      <Sidebar open={sidebarOpen} />
      <div className={`flex-1 flex flex-col min-w-0 transition-[padding] duration-300 ${sidebarOpen ? 'lg:pl-[260px]' : ''}`}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto p-margin-desktop">
          <div key={location.pathname} className="max-w-7xl mx-auto animate-fade-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
