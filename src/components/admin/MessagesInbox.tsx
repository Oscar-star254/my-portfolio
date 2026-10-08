import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import type { Message } from '../../data/seed';

export default function MessagesInbox() {
  const { data, updateMessage, deleteMessage } = useData();
  const [selected, setSelected] = useState<Message | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred'>('all');
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  const filtered = data.messages.filter(m => {
    if (filter === 'unread' && m.read) return false;
    if (filter === 'starred' && !m.starred) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.message.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openMessage = (m: Message) => {
    setSelected(m);
    if (!m.read) updateMessage(m.id, { read: true });
  };

  const exportCSV = () => {
    const rows = [['Name', 'Email', 'Message', 'Date', 'Read'], ...data.messages.map(m => [m.name, m.email, m.message.replace(/,/g, ';'), m.date, String(m.read)])];
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'messages.csv';
    a.click();
  };

  const unreadCount = data.messages.filter(m => !m.read).length;

  if (selected) {
    return (
      <div className="max-w-2xl space-y-4">
        <button onClick={() => setSelected(null)} className="btn-secondary text-sm">← Back to Inbox</button>
        <div className="glass p-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="font-semibold text-lg">{selected.name}</h2>
              <a href={`mailto:${selected.email}`} className="text-sm" style={{ color: 'var(--cyan)' }}>{selected.email}</a>
              <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{new Date(selected.date).toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => updateMessage(selected.id, { starred: !selected.starred })} className="text-lg" title={selected.starred ? 'Unstar' : 'Star'}>
                {selected.starred ? '⭐' : '☆'}
              </button>
            </div>
          </div>
          <div className="p-4 rounded-lg whitespace-pre-wrap text-sm leading-relaxed" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
            {selected.message}
          </div>
          <div className="flex gap-3 mt-6">
            <a href={`mailto:${selected.email}?subject=Re: Your message`} className="btn-primary text-sm">
              Reply by Email
            </a>
            <button
              onClick={() => { deleteMessage(selected.id); setSelected(null); }}
              className="btn-secondary text-sm"
              style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#f87171' }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-4">
      {confirmDel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div className="glass-strong p-6 max-w-sm w-full mx-4">
            <h3 className="font-semibold mb-2">Delete message?</h3>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { deleteMessage(confirmDel); setConfirmDel(null); }} className="flex-1 py-2 rounded-lg text-sm font-semibold" style={{ background: '#ef4444', color: '#fff' }}>Delete</button>
              <button onClick={() => setConfirmDel(null)} className="flex-1 btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <input
          className="input-field flex-1 min-w-0"
          style={{ maxWidth: 280 }}
          placeholder="Search messages..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          {(['all', 'unread', 'starred'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors"
              style={{ background: filter === f ? 'rgba(124,92,255,0.15)' : 'rgba(255,255,255,0.05)', color: filter === f ? 'var(--violet)' : 'var(--muted-foreground)' }}>
              {f} {f === 'unread' && unreadCount > 0 ? `(${unreadCount})` : ''}
            </button>
          ))}
        </div>
        <button onClick={exportCSV} className="btn-secondary text-xs py-2">Export CSV</button>
      </div>

      {filtered.length === 0 ? (
        <div className="glass p-12 text-center">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>No messages found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(msg => (
            <div
              key={msg.id}
              className="glass p-4 flex items-start gap-4 cursor-pointer hover:border-violet-500/20 transition-colors"
              style={{ opacity: msg.read ? 0.75 : 1 }}
              onClick={() => openMessage(msg)}
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, var(--violet), var(--cyan))', color: '#fff' }}>
                {msg.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{msg.name}</span>
                  {!msg.read && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--violet)' }} />}
                  {msg.starred && <span className="text-xs">⭐</span>}
                </div>
                <p className="text-xs truncate mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{msg.message}</p>
              </div>
              <div className="flex-shrink-0 flex flex-col items-end gap-2">
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{new Date(msg.date).toLocaleDateString()}</span>
                <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                  <button onClick={() => updateMessage(msg.id, { starred: !msg.starred })} className="text-sm px-1.5 py-0.5 rounded">{msg.starred ? '⭐' : '☆'}</button>
                  <button onClick={() => setConfirmDel(msg.id)} className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>×</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
