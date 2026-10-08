import { useData } from '../../contexts/DataContext';
import { Link } from 'react-router-dom';

function StatCard({ icon, label, value, sub, color }: { icon: string; label: string; value: number | string; sub?: string; color: string }) {
  return (
    <div className="glass p-5 relative overflow-hidden hover:border-violet-500/20 transition-colors">
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: color }} />
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="font-mono text-2xl font-bold" style={{ color: color.includes('violet') || color.includes('7c5c') ? 'var(--violet)' : color.includes('22d3') ? 'var(--cyan)' : '#4ade80' }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
      </div>
      <p className="font-medium text-sm">{label}</p>
      {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{sub}</p>}
    </div>
  );
}

export default function Overview() {
  const { data } = useData();

  const unread = data.messages.filter(m => !m.read).length;
  const totalMsgs = data.messages.length;
  const featured = data.projects.filter(p => p.featured && p.status === 'published').length;

  const recentActivity = [
    ...data.messages.slice(0, 3).map(m => ({ type: 'message', label: `New message from ${m.name}`, date: m.date, icon: '📬' })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h2 className="font-serif text-2xl font-semibold mb-1">Welcome back 👋</h2>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Here's an overview of your portfolio's activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="🚀" label="Projects" value={data.projects.filter(p => p.status === 'published').length} sub={`${featured} featured`} color="linear-gradient(90deg, var(--violet), transparent)" />
        <StatCard icon="📬" label="Messages" value={totalMsgs} sub={`${unread} unread`} color="linear-gradient(90deg, var(--cyan), transparent)" />
        <StatCard icon="📥" label="Resume Downloads" value={data.profile.resumeDownloads} sub="all time" color="linear-gradient(90deg, #4ade80, transparent)" />
        <StatCard icon="⭐" label="Testimonials" value={data.testimonials.filter(t => t.approved).length} sub="approved" color="linear-gradient(90deg, #fbbf24, transparent)" />
      </div>

      {/* Quick links */}
      <div>
        <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to: '/admin/messages', label: 'View Inbox', icon: '📬', badge: unread },
            { to: '/admin/projects', label: 'Add Project', icon: '➕' },
            { to: '/admin/profile', label: 'Edit Profile', icon: '✏️' },
            { to: '/admin/theme', label: 'Customize Theme', icon: '🎨' },
          ].map(item => (
            <Link
              key={item.to}
              to={item.to}
              className="glass p-4 text-center hover:border-violet-500/20 transition-colors block group relative"
            >
              {item.badge ? (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--violet)', color: '#fff' }}>
                  {item.badge}
                </span>
              ) : null}
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="text-xs font-medium">{item.label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent messages */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm" style={{ color: 'var(--muted-foreground)' }}>Recent Messages</h3>
          <Link to="/admin/messages" className="text-xs" style={{ color: 'var(--violet)' }}>View all →</Link>
        </div>
        {data.messages.length === 0 ? (
          <div className="glass p-8 text-center" style={{ color: 'var(--muted-foreground)' }}>
            <p className="text-2xl mb-2">📭</p>
            <p className="text-sm">No messages yet. Contact form submissions will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.messages.slice(0, 5).map(msg => (
              <Link
                key={msg.id}
                to="/admin/messages"
                className="glass p-4 flex items-start gap-4 hover:border-violet-500/20 transition-colors block"
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, var(--violet), var(--cyan))', color: '#fff' }}>
                  {msg.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm">{msg.name}</span>
                    {!msg.read && <span className="w-2 h-2 rounded-full bg-violet-400 flex-shrink-0" />}
                  </div>
                  <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{msg.message}</p>
                </div>
                <span className="text-xs flex-shrink-0" style={{ color: 'var(--muted-foreground)' }}>
                  {new Date(msg.date).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Download log */}
      {data.profile.resumeDownloadLog.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>Resume Downloads (last 5)</h3>
          <div className="glass p-4 space-y-2">
            {data.profile.resumeDownloadLog.slice(0, 5).map((date, i) => (
              <div key={i} className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                <span>📥</span>
                <span>{new Date(date).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
