import { useState, ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const NAV_ITEMS = [
  { path: '/admin', label: 'Overview', icon: '📊', exact: true },
  { path: '/admin/profile', label: 'Profile & Hero', icon: '👤' },
  { path: '/admin/projects', label: 'Projects', icon: '🚀' },
  { path: '/admin/skills', label: 'Skills', icon: '⚡' },
  { path: '/admin/experience', label: 'Experience', icon: '💼' },
  { path: '/admin/education', label: 'Education', icon: '🎓' },
  { path: '/admin/testimonials', label: 'Testimonials', icon: '💬' },
  { path: '/admin/messages', label: 'Messages', icon: '📬' },
  { path: '/admin/theme', label: 'Theme', icon: '🎨' },
  { path: '/admin/settings', label: 'SEO & Settings', icon: '⚙️' },
];

interface Props { children: ReactNode; title: string; }

export default function AdminLayout({ children, title }: Props) {
  const { logout } = useAuth();
  const { data } = useData();
  const nav = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const unread = data.messages.filter(m => !m.read).length;

  const handleLogout = () => { logout(); nav('/admin/login'); };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--background)' }}>
      {/* Sidebar */}
      <aside
        className={`flex-shrink-0 transition-all duration-300 relative border-r`}
        style={{
          width: collapsed ? 64 : 240,
          borderColor: 'var(--border)',
          background: 'rgba(10,15,31,0.95)',
          backdropFilter: 'blur(20px)',
          display: mobileOpen || window.innerWidth >= 768 ? 'flex' : 'none',
          flexDirection: 'column',
        }}
      >
        {/* Logo */}
        <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: 'var(--border)', height: 64 }}>
          <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--violet), #5b3fd4)' }}>
            <span className="text-white font-bold text-xs">A</span>
          </div>
          {!collapsed && (
            <span className="font-semibold text-sm truncate">Portfolio Admin</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 overflow-y-auto space-y-0.5">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `admin-sidebar-item ${isActive ? 'active' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {!collapsed && (
                <span className="truncate flex-1">{item.label}</span>
              )}
              {!collapsed && item.path === '/admin/messages' && unread > 0 && (
                <span className="text-xs font-bold rounded-full px-1.5 py-0.5 ml-auto" style={{ background: 'var(--violet)', color: '#fff', fontSize: 10 }}>
                  {unread}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t space-y-1" style={{ borderColor: 'var(--border)' }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-sidebar-item"
            title={collapsed ? 'View Live Site' : undefined}
          >
            <span className="text-base">🌐</span>
            {!collapsed && <span>View Live Site</span>}
          </a>
          <button
            onClick={() => setCollapsed(c => !c)}
            className="admin-sidebar-item w-full text-left"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span className="text-base">{collapsed ? '→' : '←'}</span>
            {!collapsed && <span>Collapse</span>}
          </button>
          <button onClick={handleLogout} className="admin-sidebar-item w-full text-left" style={{ color: '#f87171' }}>
            <span className="text-base">🚪</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b flex-shrink-0" style={{ borderColor: 'var(--border)', background: 'rgba(10,15,31,0.8)', backdropFilter: 'blur(10px)' }}>
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg"
              style={{ color: 'var(--muted-foreground)' }}
              onClick={() => setMobileOpen(m => !m)}
            >
              ☰
            </button>
            <h1 className="font-semibold text-base">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs hidden sm:block" style={{ color: 'var(--muted-foreground)' }}>
              {data.profile.name}
            </span>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'linear-gradient(135deg, var(--violet), var(--cyan))' }}>
              {data.profile.name.split(' ').map(w => w[0]).join('')}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
