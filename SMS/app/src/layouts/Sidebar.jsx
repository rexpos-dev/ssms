import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarDays,
  Wallet,
  BarChart3,
  ClipboardCheck,
  UserPlus,
  Sparkles,
  Settings,
  Plus,
  HeartPulse,
} from 'lucide-react';

export const Sidebar = ({ open }) => {
  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, end: true },
    { label: 'User Management', href: '/admin/users', icon: UserPlus },
    { label: 'Student Directory', href: '/admin/students', icon: Users },
    { label: 'Faculty Management', href: '/admin/faculty', icon: GraduationCap },
    { label: 'Academic Calendar', href: '/admin/calendar', icon: CalendarDays },
    { label: 'Financials', href: '/admin/financial', icon: Wallet },
    { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { label: 'Requirements', href: '/admin/requirements', icon: ClipboardCheck },
    { label: 'Medical', href: '/admin/medical', icon: HeartPulse },
    { label: 'Registrar', href: '/admin/registrar', icon: UserPlus },
    { label: 'School Life', href: '/admin/school-life', icon: Sparkles },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside
      className={`w-[260px] h-screen fixed left-0 top-0 flex flex-col p-md z-50 transition-transform border-r border-white/5 bg-gradient-to-b from-tertiary via-tertiary to-[#0d1b3a] ${
        !open ? '-translate-x-full' : ''
      }`}
    >
      {/* Brand */}
      <div className="flex items-center gap-sm mb-xxl px-xs pt-xs">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-container to-surface-tint flex items-center justify-center shadow-[0_0_20px_rgba(76,86,175,0.6)]">
          <span className="text-white text-xl">🏫</span>
        </div>
        <div>
          <h1 className="font-headline-sm text-headline-sm text-on-tertiary">Bridges Academy</h1>
          <p className="text-[10px] uppercase tracking-widest text-on-tertiary-container">Admin Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-xs overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.end}
              className={({ isActive }) =>
                `group relative flex items-center gap-md px-md py-sm rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-container/80 to-surface-tint/40 text-on-tertiary shadow-[0_0_20px_rgba(76,86,175,0.35)]'
                    : 'text-on-tertiary-container hover:bg-white/5 hover:text-on-tertiary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full bg-primary-fixed-dim" />}
                  <Icon size={20} className="shrink-0" />
                  <span className="font-label-md text-label-md">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* CTA */}
      <div className="mt-auto pt-md border-t border-white/10">
        <button className="w-full bg-gradient-to-br from-primary-container to-surface-tint text-white py-sm rounded-xl flex items-center justify-center gap-sm font-label-md text-label-md active:scale-95 transition-transform shadow-[0_6px_20px_rgba(76,86,175,0.4)] hover:brightness-110">
          <Plus size={18} /> New Enrollment
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
