import { Menu, Search, Bell, Zap } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

export const Header = ({ onMenuClick }) => {
  return (
    <header className="h-16 bg-surface/70 backdrop-blur-xl border-b border-white/40 flex justify-between items-center px-margin-desktop z-40 sticky top-0">
      <div className="flex items-center flex-1 gap-md">
        <button
          onClick={onMenuClick}
          className="text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg p-xs transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-md top-1/2 -translate-y-1/2 text-outline" />
          <input
            className="w-full pl-xl pr-md py-xs bg-surface-container-low/70 border border-outline-variant/60 rounded-full font-body-md backdrop-blur transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_4px_rgba(0,6,102,0.10)]"
            placeholder="Search students, faculty, or records..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-md ml-lg">
        <button className="relative text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg p-xs transition-all">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full ring-2 ring-surface"></span>
        </button>
        <button className="text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg p-xs transition-all">
          <Zap size={20} />
        </button>
        <ThemeToggle />
        <div className="h-8 w-px bg-outline-variant/60"></div>
        <div className="flex items-center gap-sm">
          <div className="text-right hidden sm:block">
            <p className="font-label-md text-label-md text-on-surface leading-tight">Admin User</p>
            <p className="text-[10px] uppercase tracking-wide text-on-surface-variant">Systems Overseer</p>
          </div>
          <img
            alt="Administrator"
            className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-[0_0_15px_rgba(0,6,102,0.25)]"
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Administrator"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
