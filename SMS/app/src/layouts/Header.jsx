import { Menu, Search, Bell, Zap, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { useState } from 'react';

export const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  const roleLabels = {
    admin: 'Systems Overseer',
    teacher: 'Faculty Member',
    student: 'Student',
    parent: 'Parent/Guardian',
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
            placeholder="Search..."
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
        <div className="flex items-center gap-sm relative">
          <button
            onClick={() => setShowLogoutMenu(!showLogoutMenu)}
            className="flex items-center gap-sm p-xs rounded-lg hover:bg-surface-container transition-all"
          >
            <div className="text-right hidden sm:block">
              <p className="font-label-md text-label-md text-on-surface leading-tight">{user?.name || 'User'}</p>
              <p className="text-[10px] uppercase tracking-wide text-on-surface-variant">{roleLabels[user?.role] || 'Unknown'}</p>
            </div>
            <img
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-[0_0_15px_rgba(0,6,102,0.25)]"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
            />
          </button>

          {/* Logout Menu */}
          {showLogoutMenu && (
            <div className="absolute right-0 top-12 bg-surface border border-outline-variant rounded-lg shadow-lg z-50">
              <button
                onClick={handleLogout}
                className="w-full px-lg py-sm text-left font-label-md text-on-surface hover:bg-surface-container flex items-center gap-sm transition-colors"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
