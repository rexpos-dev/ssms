import { useEffect, useState } from 'react';
import { Modal, Button, Input, Textarea } from './ui';
import {
  ArrowRight, Gavel, Bot, Drama, Palette, CalendarDays, MapPin, Clock,
  MessagesSquare, ThumbsUp, Star, Plus, Check, GraduationCap, UtensilsCrossed, Users,
} from 'lucide-react';

const STORAGE_KEY = 'sms_schoollife_v1';

const CLUB_ICONS = { Gavel, Bot, Drama, Palette };
const NEWS_ICONS = { Academic: GraduationCap, Facilities: UtensilsCrossed, Community: Users };

/* ---------------- seed ---------------- */
function seed() {
  return {
    clubs: [
      { id: 1, name: 'Debate Club', icon: 'Gavel', tone: 'bg-primary-container text-on-primary-container', tag: 'TOP RATED', desc: 'Master the art of persuasion and critical thinking in competitive weekly sessions.', members: 84, joined: false },
      { id: 2, name: 'Robotics Society', icon: 'Bot', tone: 'bg-tertiary-container text-on-tertiary-container', desc: 'Building the future, one circuit at a time. Open to all engineering levels.', members: 47, joined: false },
      { id: 3, name: 'Drama Society', icon: 'Drama', tone: 'bg-secondary-container text-on-secondary-container', desc: 'Expression, performance, and stagecraft. Preparing for the Spring Musical.', members: 122, joined: false },
      { id: 4, name: 'Fine Arts Guild', icon: 'Palette', tone: 'bg-outline-variant/20 text-primary', desc: 'A space for visual artists to collaborate and exhibit their work across campus.', members: 33, joined: false },
    ],
    events: [
      { id: 1, month: 'FEB', day: 12, title: 'Winter Gala Night', location: 'Main Auditorium', time: '19:00 - 23:00', rsvp: false },
      { id: 2, month: 'FEB', day: 15, title: 'Inter-House Football Finals', location: 'Academy Stadium', time: '15:30 - 18:00', rsvp: false },
      { id: 3, month: 'FEB', day: 20, title: 'Guest Lecture: AI in Ethics', location: 'Hall 4B, Science Wing', time: '10:00 - 12:00', rsvp: false },
    ],
    news: [
      { id: 1, category: 'Academic', title: 'New Scholarship Opportunities Announced for 2024-25 Term', excerpt: 'The Bridges Foundation has increased its endowment, offering 15 additional merit-based scholarships for under-represented fields.', meta: '2 hours ago • By Admin' },
      { id: 2, category: 'Facilities', title: 'Campus Dining Hall to Introduce Extended Study Hours', excerpt: 'Starting next Monday, the West Wing Dining Hall will remain open until midnight to provide more late-night study spaces.', meta: 'Yesterday • By Facilities Dept' },
      { id: 3, category: 'Community', title: 'Celebrating Our Top 10 Student Volunteers', excerpt: 'Recognizing the incredible impact our students have made through the Bridges Outreach program this semester.', meta: '3 days ago • By Student Council' },
    ],
    achievements: [
      { id: 1, name: 'Elena Rodriguez', detail: 'wins National Science Bowl', sub: 'Class of 2024 • Physics Major', tone: 'bg-secondary text-white', likes: 42, liked: false },
      { id: 2, name: 'Mark J.', detail: 'published in International Design Journal', sub: 'Class of 2026 • Graphic Design', tone: 'bg-primary text-on-primary', likes: 31, liked: false },
      { id: 3, name: 'Sarah K.', detail: 'selected for United Nations Youth Summit', sub: 'Class of 2025 • Political Science', tone: 'bg-tertiary text-white', likes: 58, liked: false },
    ],
    discussionLikes: 450,
    discussionLiked: false,
  };
}
function load() {
  try { const r = localStorage.getItem(STORAGE_KEY); if (!r) { const s = seed(); localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); return s; } return { ...seed(), ...JSON.parse(r) }; } catch { return seed(); }
}
const initials = (n = '') => n.replace(/\.$/, '').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const CAT_BADGE = { Academic: 'bg-primary text-secondary-container', Facilities: 'bg-secondary text-white', Community: 'bg-tertiary text-white' };

/* ========================================================= */
export default function SchoolLifeHub() {
  const [data, setData] = useState(load);
  const [heroOpen, setHeroOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', body: '' });
  const [banner, setBanner] = useState(null);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }, [data]);
  function flash(msg) { setBanner(msg); setTimeout(() => setBanner(null), 2400); }

  const toggleClub = (id) => setData((d) => ({ ...d, clubs: d.clubs.map((c) => c.id === id ? { ...c, joined: !c.joined, members: c.members + (c.joined ? -1 : 1) } : c) }));
  const toggleRsvp = (id) => setData((d) => ({ ...d, events: d.events.map((e) => e.id === id ? { ...e, rsvp: !e.rsvp } : e) }));
  const toggleLike = (id) => setData((d) => ({ ...d, achievements: d.achievements.map((a) => a.id === id ? { ...a, liked: !a.liked, likes: a.likes + (a.liked ? -1 : 1) } : a) }));
  const toggleDiscussion = () => setData((d) => ({ ...d, discussionLiked: !d.discussionLiked, discussionLikes: d.discussionLikes + (d.discussionLiked ? -1 : 1) }));

  function postDiscussion() {
    if (!form.title.trim()) { flash('Please enter a topic.'); return; }
    const id = Math.max(0, ...data.news.map((n) => n.id)) + 1;
    setData((d) => ({ ...d, news: [{ id, category: 'Community', title: form.title.trim(), excerpt: form.body.trim() || 'New discussion started.', meta: 'Just now • By You' }, ...d.news] }));
    setForm({ title: '', body: '' });
    setModalOpen(false);
    flash('Discussion posted.');
  }

  const rsvpCount = data.events.filter((e) => e.rsvp).length;

  /* ========================================================= */
  return (
    <div className="space-y-xl pb-24">
      {banner && (
        <div className="fixed top-20 right-8 z-[70] bg-primary text-on-primary px-lg py-md rounded-xl shadow-[0_12px_32px_rgba(0,6,102,0.35)] flex items-center gap-sm animate-fade-up">
          <Check size={18} /> <span className="font-label-md">{banner}</span>
        </div>
      )}

      {/* hero */}
      <section className="relative overflow-hidden rounded-2xl min-h-[300px] flex items-end bg-gradient-to-br from-primary-container via-primary to-[#0a1240]">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(189,194,255,0.5), transparent 45%)' }} />
        <GraduationCap className="absolute right-6 top-6 opacity-10 text-white" size={160} />
        <div className="relative p-xl max-w-2xl">
          <span className="bg-white/15 text-white px-sm py-1 rounded text-label-sm font-bold mb-md inline-block backdrop-blur">FEATURED NEWS</span>
          <h2 className="font-headline-xl text-headline-xl text-white mb-sm leading-tight">Summer Internship Fair: Connecting Bridges Students with Industry Leaders</h2>
          <p className="text-white/80 font-body-lg mb-md">
            Join over 50 global companies on campus next Thursday to explore career paths and secure your future.
            {heroOpen && ' Representatives from technology, finance, healthcare, and the creative industries will host workshops, portfolio reviews, and on-the-spot interviews throughout the day.'}
          </p>
          <button onClick={() => setHeroOpen((v) => !v)} className="bg-white text-primary px-lg py-sm rounded-lg font-bold hover:bg-secondary-container transition-all active:scale-95">
            {heroOpen ? 'Show Less' : 'Read More'}
          </button>
        </div>
      </section>

      {/* bento */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* clubs */}
        <div className="col-span-12 lg:col-span-8 card !p-0 overflow-hidden">
          <div className="p-lg border-b border-surface-container flex items-center justify-between gap-md">
            <div>
              <h3 className="font-headline-md text-headline-md text-primary">Student Organizations</h3>
              <p className="text-body-sm text-on-surface-variant">Find your tribe among our 40+ active student-led clubs.</p>
            </div>
            <button onClick={() => flash('Showing all 40+ clubs…')} className="text-primary font-bold text-label-md flex items-center gap-xs hover:underline shrink-0">View All <ArrowRight size={16} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter p-lg">
            {data.clubs.map((club) => {
              const Icon = CLUB_ICONS[club.icon] || Gavel;
              return (
                <div key={club.id} className="flex items-start gap-md p-md bg-surface-container-low rounded-xl border border-outline-variant/20 hover:border-secondary transition-colors group">
                  <div className={`w-16 h-16 rounded-xl shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform ${club.tone}`}><Icon size={28} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-sm mb-xs">
                      <h4 className="font-headline-sm text-headline-sm text-on-surface truncate">{club.name}</h4>
                      {club.tag && <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-[10px] font-bold shrink-0">{club.tag}</span>}
                    </div>
                    <p className="text-body-sm text-on-surface-variant line-clamp-2 mb-md">{club.desc}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        <span className="w-6 h-6 rounded-full border-2 border-white bg-primary-fixed flex items-center justify-center text-[9px] font-bold text-primary">JS</span>
                        <span className="w-6 h-6 rounded-full border-2 border-white bg-secondary-fixed flex items-center justify-center text-[9px] font-bold text-secondary">MK</span>
                        <span className="w-6 h-6 rounded-full border-2 border-white bg-surface-container-highest flex items-center justify-center text-[9px] text-on-surface-variant">+{club.members}</span>
                      </div>
                      <button onClick={() => toggleClub(club.id)} className={`px-md py-1 rounded-lg text-label-sm font-bold active:scale-95 transition-all ${club.joined ? 'bg-secondary-container text-on-secondary-container' : 'bg-primary text-white'}`}>
                        {club.joined ? 'Joined ✓' : 'Join Club'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* right column */}
        <div className="col-span-12 lg:col-span-4 space-y-lg">
          <div className="card">
            <div className="flex items-center justify-between mb-lg">
              <h3 className="font-headline-sm text-headline-sm text-primary">Upcoming Events</h3>
              <CalendarDays size={20} className="text-primary" />
            </div>
            <div className="space-y-md">
              {data.events.map((e) => (
                <div key={e.id} className="flex gap-md group">
                  <div className="flex flex-col items-center justify-center w-12 h-14 bg-surface-container rounded-lg border border-outline-variant/30 text-primary shrink-0">
                    <span className="text-xs font-bold leading-none">{e.month}</span>
                    <span className="text-xl font-extrabold leading-none">{e.day}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-label-md text-on-surface group-hover:text-primary transition-colors">{e.title}</h5>
                    <p className="text-[12px] text-on-surface-variant flex items-center gap-1"><MapPin size={14} /> {e.location}</p>
                    <p className="text-[12px] text-on-surface-variant flex items-center gap-1"><Clock size={14} /> {e.time}</p>
                  </div>
                  <button onClick={() => toggleRsvp(e.id)} className={`self-center px-sm py-xs rounded-lg text-label-sm font-bold transition-colors shrink-0 ${e.rsvp ? 'bg-primary text-on-primary' : 'border border-outline-variant text-primary hover:bg-surface-container'}`}>
                    {e.rsvp ? 'Going' : 'RSVP'}
                  </button>
                </div>
              ))}
            </div>
            <button onClick={() => flash(rsvpCount ? `You're going to ${rsvpCount} event${rsvpCount > 1 ? 's' : ''}.` : 'Tap RSVP on an event to reserve your spot.')} className="w-full mt-lg border border-primary text-primary py-sm rounded-lg font-bold text-label-md hover:bg-primary/5 transition-colors">
              RSVP for Events{rsvpCount > 0 ? ` (${rsvpCount})` : ''}
            </button>
          </div>

          {/* trending discussion */}
          <div className="bg-primary-container text-on-primary-container rounded-2xl p-lg shadow-md">
            <div className="flex items-center gap-md mb-md">
              <MessagesSquare size={20} />
              <h3 className="font-label-md font-bold uppercase tracking-widest">Trending Discussion</h3>
            </div>
            <p className="font-headline-sm text-headline-sm text-white mb-md">"How can we make campus more sustainable for 2025?"</p>
            <div className="flex items-center justify-between">
              <button onClick={toggleDiscussion} className="text-xs opacity-80 hover:opacity-100 flex items-center gap-1 transition-opacity">
                <ThumbsUp size={14} className={data.discussionLiked ? 'fill-current' : ''} /> 128 replies • {data.discussionLikes} likes
              </button>
              <button onClick={() => flash('Opening discussion thread…')} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"><ArrowRight size={18} /></button>
            </div>
          </div>
        </div>

        {/* campus news */}
        <div className="col-span-12 lg:col-span-6 card !p-0 overflow-hidden flex flex-col">
          <div className="p-lg border-b border-surface-container"><h3 className="font-headline-md text-headline-md text-primary">Campus News Feed</h3></div>
          <div className="flex-1 overflow-y-auto p-lg space-y-lg max-h-[460px]">
            {data.news.map((n) => {
              const Icon = NEWS_ICONS[n.category] || Users;
              return (
                <div key={n.id} className="flex gap-lg items-start">
                  <div className="w-24 h-24 rounded-lg bg-surface-container shrink-0 flex items-center justify-center text-primary/40"><Icon size={32} /></div>
                  <div className="min-w-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${CAT_BADGE[n.category] || 'bg-secondary text-white'}`}>{n.category}</span>
                    <h4 className="font-label-md mt-1 mb-1 hover:text-primary cursor-pointer transition-colors" onClick={() => flash(`Opening: ${n.title}`)}>{n.title}</h4>
                    <p className="text-body-sm text-on-surface-variant line-clamp-2">{n.excerpt}</p>
                    <span className="text-xs text-on-surface-variant mt-1 block">{n.meta}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* achievements */}
        <div className="col-span-12 lg:col-span-6 card !p-lg bg-surface-container-low">
          <div className="flex items-center justify-between mb-lg">
            <h3 className="font-headline-md text-headline-md text-primary">Student Achievements</h3>
            <Star size={22} className="text-primary" />
          </div>
          <div className="space-y-lg">
            {data.achievements.map((a) => (
              <div key={a.id} className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant/20 flex gap-md items-center group hover:shadow-md transition-shadow">
                <span className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shrink-0 ${a.tone}`}>{initials(a.name)}</span>
                <div className="flex-1 min-w-0">
                  <h5 className="font-label-md text-on-surface"><span className="font-bold">{a.name}</span> {a.detail}</h5>
                  <p className="text-body-sm text-on-surface-variant">{a.sub}</p>
                </div>
                <button onClick={() => toggleLike(a.id)} className={`p-2 rounded-full transition-colors flex items-center gap-1 text-label-sm font-bold ${a.liked ? 'bg-primary text-white' : 'bg-surface-container-high text-primary hover:bg-primary hover:text-white'}`}>
                  <ThumbsUp size={16} /> {a.likes}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAB */}
      <div className="fixed bottom-8 right-8 z-40">
        <button onClick={() => { setForm({ title: '', body: '' }); setModalOpen(true); }} className="bg-primary text-white flex items-center gap-sm px-lg py-md rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all">
          <Plus size={20} /> <span className="font-label-md">Start Discussion</span>
        </button>
      </div>

      {/* modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Start a Discussion"
        actions={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={postDiscussion} icon={<Plus size={16} />}>Post</Button></>}>
        <div className="space-y-xs">
          <Input label="Topic" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="How can we improve campus life?" />
          <Textarea label="Details" rows={4} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Share your thoughts…" />
        </div>
      </Modal>
    </div>
  );
}
