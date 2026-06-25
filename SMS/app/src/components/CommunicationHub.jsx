import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Search, Edit, Send, Phone, Video, MoreVertical, Paperclip,
  Image as ImageIcon, Smile, ArrowLeft, X, Check, CheckCheck,
} from 'lucide-react';
import {
  resolveCurrentUserId, conversationsFor, getConversation, sendMessage,
  markRead, subscribe, directoryFor, getParticipant,
} from '../data/messageStore';

/* ---------- small helpers ---------------------------------------- */
const roleLabel = { teacher: 'Teacher', student: 'Student', parent: 'Parent', staff: 'Staff' };
const rolePlural = { teacher: 'Teachers', student: 'Students', parent: 'Parents', staff: 'Staff' };

function initials(name = '') {
  return name.replace(/\(.*?\)/g, '').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

function avatarClasses(color) {
  switch (color) {
    case 'primary': return 'bg-primary text-on-primary';
    case 'secondary': return 'bg-secondary text-white';
    default: return 'bg-tertiary text-white';
  }
}

function timeShort(ts) {
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const yest = new Date(now); yest.setDate(now.getDate() - 1);
  if (sameDay) return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  if (d.toDateString() === yest.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function clockTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function dayLabel(ts) {
  const d = new Date(ts);
  const now = new Date();
  const yest = new Date(now); yest.setDate(now.getDate() - 1);
  if (d.toDateString() === now.toDateString()) return 'Today';
  if (d.toDateString() === yest.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
}

/* ================================================================= */
export default function CommunicationHub({ portalLabel = 'Communication' }) {
  const { user } = useAuth();
  const meId = useMemo(() => resolveCurrentUserId(user), [user]);

  const [version, setVersion] = useState(0);          // bump to refresh from store
  const [selectedId, setSelectedId] = useState(null);  // other participant id
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [mobileThread, setMobileThread] = useState(false); // mobile: show thread pane

  const threadRef = useRef(null);

  // live refresh on any store change (this tab or another tab)
  useEffect(() => subscribe(() => setVersion((v) => v + 1)), []);

  const conversations = useMemo(
    () => (meId ? conversationsFor(meId) : []),
    [meId, version]
  );

  // auto-select first conversation
  useEffect(() => {
    if (!selectedId && conversations.length) setSelectedId(conversations[0].otherId);
  }, [conversations, selectedId]);

  // mark read + scroll when opening a thread
  useEffect(() => {
    if (meId && selectedId) {
      markRead(meId, selectedId);
    }
  }, [meId, selectedId, version]);

  const active = useMemo(
    () => (meId && selectedId ? getConversation(meId, selectedId) : null),
    [meId, selectedId, version]
  );

  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [active?.messages?.length, selectedId]);

  // filter chips available for this portal
  const categories = useMemo(() => {
    const roles = new Set(conversations.map((c) => c.other.role));
    const order = ['teacher', 'student', 'parent', 'staff'];
    return ['all', ...order.filter((r) => roles.has(r))];
  }, [conversations]);

  const visible = conversations.filter((c) => {
    const matchesFilter = filter === 'all' || c.other.role === filter;
    const q = query.trim().toLowerCase();
    const matchesQuery = !q
      || c.other.name.toLowerCase().includes(q)
      || (c.last?.text || '').toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });

  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);

  function handleSend() {
    if (!draft.trim() || !meId || !selectedId) return;
    sendMessage(meId, selectedId, draft);
    setDraft('');
    setVersion((v) => v + 1);
  }

  function openConversation(otherId) {
    setSelectedId(otherId);
    setShowNew(false);
    setMobileThread(true);
  }

  if (!meId) {
    return (
      <div className="card text-center py-xxl text-on-surface-variant">
        Sign in to view your messages.
      </div>
    );
  }

  const directory = directoryFor(meId).filter(
    (p) => !conversations.some((c) => c.otherId === p.id)
  );

  /* -------------------------------------------------------------- */
  return (
    <div className="space-y-lg">
      <div className="flex items-end justify-between gap-md flex-wrap">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-primary">{portalLabel}</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-xs">
            {totalUnread > 0 ? `You have ${totalUnread} unread message${totalUnread > 1 ? 's' : ''}` : 'You are all caught up'}
          </p>
        </div>
      </div>

      <div className="card !p-0 overflow-hidden flex h-[calc(100vh-220px)] min-h-[560px]">
        {/* ---------------- Inbox pane ---------------- */}
        <section
          className={`w-full md:w-[340px] shrink-0 border-r border-outline-variant/70 flex flex-col bg-surface-container-lowest/40
          ${mobileThread ? 'hidden md:flex' : 'flex'}`}
        >
          {/* header + search + filters */}
          <div className="p-lg border-b border-outline-variant/70">
            <div className="flex items-center justify-between mb-md">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Inbox</h2>
              <button
                onClick={() => setShowNew((s) => !s)}
                title="New message"
                className="w-9 h-9 rounded-full btn-primary !px-0"
              >
                <Edit size={16} />
              </button>
            </div>
            <div className="relative mb-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search conversations…"
                className="w-full rounded-xl bg-surface-container-low/70 border border-outline-variant/60 py-sm pl-9 pr-3 text-body-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex gap-sm overflow-x-auto scrollbar-hide pb-1">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`px-md py-1.5 rounded-full text-label-sm font-label-md whitespace-nowrap transition-colors border ${
                    filter === c
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container border-outline-variant/60 text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {c === 'all' ? 'All' : rolePlural[c]}
                </button>
              ))}
            </div>
          </div>

          {/* new-message directory */}
          {showNew && (
            <div className="border-b border-outline-variant/70 bg-surface-container-low/50">
              <div className="px-lg py-sm flex items-center justify-between">
                <span className="text-label-sm uppercase tracking-wide text-on-surface-variant">New message to…</span>
                <button onClick={() => setShowNew(false)} className="text-on-surface-variant hover:text-primary"><X size={16} /></button>
              </div>
              <div className="max-h-56 overflow-y-auto">
                {directory.length === 0 && (
                  <p className="px-lg pb-md text-body-sm text-on-surface-variant">You already have a thread with everyone available.</p>
                )}
                {directory.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => openConversation(p.id)}
                    className="w-full flex items-center gap-md px-lg py-sm hover:bg-surface-container text-left"
                  >
                    <span className={`w-9 h-9 rounded-full flex items-center justify-center text-label-sm font-bold ${avatarClasses(p.color)}`}>{initials(p.name)}</span>
                    <span className="min-w-0">
                      <span className="block font-label-md text-on-surface truncate">{p.name}</span>
                      <span className="block text-label-sm text-on-surface-variant truncate">{roleLabel[p.role]} · {p.subtitle}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* conversation list */}
          <div className="flex-1 overflow-y-auto">
            {visible.length === 0 && (
              <p className="p-lg text-body-sm text-on-surface-variant text-center">No conversations found.</p>
            )}
            {visible.map((c) => {
              const isActive = c.otherId === selectedId;
              return (
                <button
                  key={c.id}
                  onClick={() => openConversation(c.otherId)}
                  className={`w-full text-left p-md flex gap-md border-l-4 transition-colors ${
                    isActive
                      ? 'bg-surface-container-high border-primary'
                      : 'border-transparent border-b border-b-outline-variant/50 hover:bg-surface-container'
                  }`}
                >
                  <span className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shrink-0 ${avatarClasses(c.other.color)}`}>{initials(c.other.name)}</span>
                  <span className="flex-1 min-w-0">
                    <span className="flex justify-between items-start gap-sm">
                      <span className={`font-label-md text-on-surface truncate ${c.unread ? 'font-bold' : ''}`}>
                        {c.other.name} <span className="text-on-surface-variant font-normal">({roleLabel[c.other.role]})</span>
                      </span>
                      <span className={`text-[11px] shrink-0 ${c.unread ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>{c.last ? timeShort(c.last.ts) : ''}</span>
                    </span>
                    <span className="flex items-center gap-sm mt-1">
                      <span className={`text-label-sm truncate flex-1 ${c.unread ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                        {c.last ? (c.last.senderId === meId ? 'You: ' : '') + c.last.text : 'No messages yet'}
                      </span>
                      {c.unread > 0 && (
                        <span className="shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-on-primary text-[11px] font-bold flex items-center justify-center">{c.unread}</span>
                      )}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ---------------- Thread pane ---------------- */}
        <section className={`flex-1 flex-col bg-surface-container-lowest/20 ${mobileThread ? 'flex' : 'hidden md:flex'}`}>
          {!active ? (
            <div className="flex-1 flex items-center justify-center text-on-surface-variant">
              Select a conversation to start messaging.
            </div>
          ) : (
            <>
              {/* thread header */}
              <div className="px-lg py-md border-b border-outline-variant/70 flex items-center justify-between gap-md bg-surface-container-lowest/40">
                <div className="flex items-center gap-md min-w-0">
                  <button onClick={() => setMobileThread(false)} className="md:hidden text-on-surface-variant hover:text-primary"><ArrowLeft size={20} /></button>
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${avatarClasses(active.other.color)}`}>{initials(active.other.name)}</span>
                  <div className="min-w-0">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface leading-tight truncate">{active.other.name}</h3>
                    <div className="flex items-center gap-sm">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      <p className="text-[12px] text-on-surface-variant truncate">{roleLabel[active.other.role]} · {active.other.subtitle}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-xs text-on-surface-variant">
                  <button className="p-2 rounded-lg hover:bg-surface-container hover:text-primary transition-colors" title="Call"><Phone size={18} /></button>
                  <button className="p-2 rounded-lg hover:bg-surface-container hover:text-primary transition-colors" title="Video call"><Video size={18} /></button>
                  <button className="p-2 rounded-lg hover:bg-surface-container hover:text-primary transition-colors" title="More"><MoreVertical size={18} /></button>
                </div>
              </div>

              {/* messages */}
              <div ref={threadRef} className="flex-1 overflow-y-auto p-lg space-y-md">
                {active.messages.length === 0 && (
                  <p className="text-center text-body-sm text-on-surface-variant mt-xl">No messages yet. Say hello 👋</p>
                )}
                {active.messages.map((m, i) => {
                  const mine = m.senderId === meId;
                  const showDay = i === 0 || dayLabel(active.messages[i - 1].ts) !== dayLabel(m.ts);
                  const isLastMine = mine && i === active.messages.length - 1;
                  const seen = mine && active.messages.slice(i + 1).some((n) => n.senderId !== meId);
                  return (
                    <div key={m.id}>
                      {showDay && (
                        <div className="flex justify-center my-md">
                          <span className="px-md py-1 bg-surface-container text-on-surface-variant text-[11px] font-bold rounded-full uppercase tracking-wider">{dayLabel(m.ts)}</span>
                        </div>
                      )}
                      <div className={`flex items-end gap-sm max-w-[82%] ${mine ? 'ml-auto flex-row-reverse' : ''}`}>
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${avatarClasses(mine ? 'primary' : active.other.color)}`}>
                          {initials(mine ? (user?.name || 'Me') : active.other.name)}
                        </span>
                        <div className={mine ? 'flex flex-col items-end' : ''}>
                          <div className={`p-md text-body-sm leading-relaxed ${
                            mine
                              ? 'bg-primary text-on-primary rounded-2xl rounded-br-sm shadow-sm'
                              : 'bg-surface-container text-on-surface rounded-2xl rounded-bl-sm border border-outline-variant/60'
                          }`}>
                            {m.text}
                          </div>
                          <span className="text-[10px] text-on-surface-variant mt-1 px-1 flex items-center gap-1">
                            {clockTime(m.ts)}
                            {isLastMine && (seen
                              ? (<><CheckCheck size={12} className="text-primary" /> Read</>)
                              : (<><Check size={12} /> Sent</>))}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* composer */}
              <div className="p-lg border-t border-outline-variant/70 bg-surface-container-lowest/40">
                <div className="rounded-2xl border border-outline-variant/70 bg-surface-container-low/60 p-sm focus-within:border-primary transition-colors">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    rows={2}
                    placeholder={`Message ${active.other.name}…`}
                    className="w-full bg-transparent border-none resize-none text-body-sm focus:ring-0 focus:outline-none p-sm"
                  />
                  <div className="flex items-center justify-between border-t border-outline-variant/40 pt-sm mt-1">
                    <div className="flex gap-1 text-on-surface-variant">
                      <button className="p-2 rounded-lg hover:text-primary hover:bg-surface-container transition-colors" title="Attach file"><Paperclip size={18} /></button>
                      <button className="p-2 rounded-lg hover:text-primary hover:bg-surface-container transition-colors" title="Add image"><ImageIcon size={18} /></button>
                      <button className="p-2 rounded-lg hover:text-primary hover:bg-surface-container transition-colors" title="Emoji"><Smile size={18} /></button>
                    </div>
                    <button
                      onClick={handleSend}
                      disabled={!draft.trim()}
                      className="btn-primary !py-sm !px-lg disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span>Send</span>
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
