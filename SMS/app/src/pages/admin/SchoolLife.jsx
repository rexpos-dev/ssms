import { useState } from 'react';
import { Card, Input, Textarea, Button, Modal, Badge } from '../../components/ui';
import { ArrowRight, ThumbsUp, MapPin, Clock, Trophy, Plus, MessageSquare } from 'lucide-react';

// ============================================================
// SEED DATA
// ============================================================

const SEED_CLUBS = [
  { id: 1, name: 'Debate Club', tag: 'Top Rated', desc: 'Master the art of persuasion and critical thinking through competitive debate.', members: 48, joined: false },
  { id: 2, name: 'Robotics Society', tag: null, desc: 'Building the future, one circuit at a time. Open to all skill levels.', members: 61, joined: false },
  { id: 3, name: 'Drama Society', tag: null, desc: 'Expression, performance, and the magic of live theatre.', members: 54, joined: false },
  { id: 4, name: 'Fine Arts Guild', tag: null, desc: 'A space for visual artists to collaborate and exhibit their work.', members: 39, joined: false },
];

const SEED_EVENTS = [
  { id: 1, month: 'FEB', day: 12, title: 'Winter Gala Night', location: 'Main Auditorium', time: '19:00 - 23:00', rsvp: false },
  { id: 2, month: 'FEB', day: 15, title: 'Inter-House Football Finals', location: 'Academy Stadium', time: '14:00 - 16:00', rsvp: false },
  { id: 3, month: 'FEB', day: 20, title: 'Guest Lecture: AI in Ethics', location: 'Hall 4, Science Wing', time: '12:00 - 13:00', rsvp: false },
];

const SEED_NEWS = [
  { id: 1, category: 'Academic', title: 'New Scholarship Opportunities Announced for 2024-25 Term', excerpt: 'The Bridges Foundation has increased its endowment, offering 15 additional merit-based scholarships.', meta: '2 hours ago • By Admin' },
  { id: 2, category: 'Facility', title: 'Campus Dining Hall to Introduce Extended Study Hours', excerpt: 'Starting next Monday, the West Wing Dining Hall will remain open until midnight to support students.', meta: 'Yesterday • By Facilities Dept' },
  { id: 3, category: 'Community', title: 'Celebrating Our Top 10 Student Volunteers', excerpt: 'Recognizing the incredible impact our students have made through the Bridges Outreach Program.', meta: '2 days ago • By Student Council' },
];

const SEED_ACHIEVEMENTS = [
  { id: 1, name: 'Elena Rodriguez', detail: 'wins National Science Bowl', sub: 'Class of 2024 • Physics Major', likes: 42, liked: false },
  { id: 2, name: 'Mark J.', detail: 'published in International Design Journal', sub: 'Class of 2024 • Graphic Design', likes: 31, liked: false },
  { id: 3, name: 'Sarah K.', detail: 'selected for United Nations Youth Summit', sub: 'Class of 2025 • Political Science', likes: 58, liked: false },
];

const CATEGORY_VARIANT = { Academic: 'primary', Facility: 'warning', Community: 'success' };
const initials = (name) => name.replace(/\.$/, '').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

// ============================================================
// PAGE
// ============================================================

export const SchoolLife = () => {
  const [clubs, setClubs] = useState(SEED_CLUBS);
  const [events, setEvents] = useState(SEED_EVENTS);
  const [news, setNews] = useState(SEED_NEWS);
  const [achievements, setAchievements] = useState(SEED_ACHIEVEMENTS);
  const [heroExpanded, setHeroExpanded] = useState(false);
  const [discussionLiked, setDiscussionLiked] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', body: '' });
  const [formError, setFormError] = useState('');

  const toggleClub = (id) =>
    setClubs((prev) => prev.map((c) => (c.id === id ? { ...c, joined: !c.joined, members: c.members + (c.joined ? -1 : 1) } : c)));
  const toggleRsvp = (id) => setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, rsvp: !e.rsvp } : e)));
  const toggleLike = (id) =>
    setAchievements((prev) => prev.map((a) => (a.id === id ? { ...a, liked: !a.liked, likes: a.likes + (a.liked ? -1 : 1) } : a)));

  const rsvpCount = events.filter((e) => e.rsvp).length;

  const postDiscussion = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setFormError('Please enter a title');
      return;
    }
    const nextId = news.reduce((max, n) => Math.max(max, n.id), 0) + 1;
    setNews((prev) => [{ id: nextId, category: 'Community', title: form.title, excerpt: form.body || 'New discussion started by Admin.', meta: 'Just now • By Admin User' }, ...prev]);
    setForm({ title: '', body: '' });
    setModalOpen(false);
  };

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------
  return (
    <div>
      {/* Hero */}
      <div className="rounded-xl overflow-hidden bg-gradient-to-r from-primary to-primary-container text-on-primary p-xl mb-xl">
        <span className="inline-flex items-center gap-xs text-label-sm uppercase tracking-widest text-on-primary/70 mb-md">Featured</span>
        <h1 className="font-headline-lg text-headline-lg mb-md max-w-2xl">
          Summer Internship Fair: Connecting Bridges Students with Industry Leaders
        </h1>
        <p className="font-body-md text-on-primary/80 max-w-2xl mb-lg">
          Join over 50 global companies on campus next Thursday to explore career paths and secure your future.
          {heroExpanded && ' Representatives from technology, finance, healthcare, and the creative industries will host workshops, portfolio reviews, and on-the-spot interviews throughout the day.'}
        </p>
        <Button variant="secondary" onClick={() => setHeroExpanded((v) => !v)} className="bg-on-primary text-primary border-on-primary">
          {heroExpanded ? 'Show Less' : 'Read More'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-lg">
        {/* Main column */}
        <div className="space-y-lg">
          {/* Student organizations */}
          <Card>
            <div className="flex items-center justify-between mb-xs">
              <h2 className="font-headline-sm text-headline-sm text-primary">Student Organizations</h2>
              <button className="text-primary font-label-md text-label-md hover:underline flex items-center gap-xs">View All <ArrowRight size={14} /></button>
            </div>
            <p className="font-body-sm text-on-surface-variant mb-lg">Find your tribe among our 40+ active student-led clubs.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              {clubs.map((club) => (
                <div key={club.id} className="border border-outline-variant rounded-lg p-lg">
                  <div className="flex items-start justify-between mb-sm">
                    <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary font-label-md">{initials(club.name)}</div>
                    {club.tag && <Badge variant="warning" size="sm">{club.tag}</Badge>}
                  </div>
                  <h3 className="font-label-md text-body-md text-on-surface mb-xs">{club.name}</h3>
                  <p className="font-body-sm text-on-surface-variant mb-md line-clamp-2">{club.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-label-sm text-on-surface-variant">{club.members} members</span>
                    <Button size="sm" variant={club.joined ? 'secondary' : 'primary'} onClick={() => toggleClub(club.id)}>
                      {club.joined ? 'Joined ✓' : 'Join Club'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Campus news feed */}
          <Card>
            <h2 className="font-headline-sm text-headline-sm text-primary mb-lg">Campus News Feed</h2>
            <div className="space-y-lg">
              {news.map((n) => (
                <div key={n.id} className="flex gap-md pb-lg border-b border-surface-variant last:border-0 last:pb-0">
                  <div className="w-24 h-20 rounded-lg bg-surface-container shrink-0 flex items-center justify-center text-outline">
                    <MessageSquare size={24} />
                  </div>
                  <div className="min-w-0">
                    <Badge variant={CATEGORY_VARIANT[n.category] || 'secondary'} size="sm">{n.category}</Badge>
                    <h3 className="font-label-md text-body-md text-on-surface mt-xs mb-xs">{n.title}</h3>
                    <p className="font-body-sm text-on-surface-variant line-clamp-2">{n.excerpt}</p>
                    <p className="text-label-sm text-on-surface-variant mt-xs">{n.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-lg">
          {/* Upcoming events */}
          <Card>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-lg">Upcoming Events</h3>
            <div className="space-y-md mb-lg">
              {events.map((e) => (
                <div key={e.id} className="flex gap-md">
                  <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-surface-container shrink-0">
                    <span className="text-label-sm text-on-surface-variant">{e.month}</span>
                    <span className="font-headline-sm text-headline-sm text-primary leading-none">{e.day}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-label-md text-body-md text-on-surface truncate">{e.title}</p>
                    <p className="text-label-sm text-on-surface-variant flex items-center gap-xs"><MapPin size={12} /> {e.location}</p>
                    <p className="text-label-sm text-on-surface-variant flex items-center gap-xs"><Clock size={12} /> {e.time}</p>
                  </div>
                  <button
                    onClick={() => toggleRsvp(e.id)}
                    className={`self-center px-sm py-xs rounded text-label-sm font-label-md transition-colors ${
                      e.rsvp ? 'bg-primary text-on-primary' : 'border border-outline-variant text-primary hover:bg-surface-container'
                    }`}
                  >
                    {e.rsvp ? 'Going' : 'RSVP'}
                  </button>
                </div>
              ))}
            </div>
            <Button variant="secondary" className="w-full">RSVP for Events{rsvpCount > 0 ? ` (${rsvpCount})` : ''}</Button>
          </Card>

          {/* Trending discussion */}
          <Card className="bg-tertiary text-on-tertiary">
            <p className="text-label-sm uppercase tracking-widest text-on-tertiary-container mb-sm">Trending Discussion</p>
            <p className="font-headline-sm text-headline-sm mb-lg">"How can we make campus more sustainable for 2025?"</p>
            <div className="flex items-center justify-between">
              <button onClick={() => setDiscussionLiked((v) => !v)} className="flex items-center gap-xs text-on-tertiary-container hover:text-on-tertiary transition-colors">
                <ThumbsUp size={14} /> 128 replies • {discussionLiked ? 451 : 450} likes
              </button>
              <button className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center active:scale-95 transition-transform">
                <ArrowRight size={18} />
              </button>
            </div>
          </Card>

          {/* Student achievements */}
          <Card>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-lg flex items-center gap-sm"><Trophy size={18} /> Student Achievements</h3>
            <div className="space-y-md">
              {achievements.map((a) => (
                <div key={a.id} className="flex items-start gap-md">
                  <div className="w-9 h-9 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-label-sm font-label-md shrink-0">{initials(a.name)}</div>
                  <div className="min-w-0 flex-1">
                    <p className="font-body-sm text-on-surface"><span className="font-label-md">{a.name}</span> {a.detail}</p>
                    <p className="text-label-sm text-on-surface-variant">{a.sub}</p>
                  </div>
                  <button onClick={() => toggleLike(a.id)} className={`flex items-center gap-xs text-label-sm shrink-0 transition-colors ${a.liked ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
                    <ThumbsUp size={14} /> {a.likes}
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Floating start discussion */}
      <div className="flex justify-end mt-lg">
        <Button onClick={() => { setForm({ title: '', body: '' }); setFormError(''); setModalOpen(true); }} className="flex items-center gap-sm">
          <Plus size={18} /> Start Discussion
        </Button>
      </div>

      {/* Start discussion modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Start a Discussion"
        actions={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={postDiscussion}>Post</Button>
          </>
        }
      >
        <form onSubmit={postDiscussion} className="space-y-xs">
          <Input label="Topic" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} error={formError} placeholder="How can we improve campus life?" />
          <Textarea label="Details" rows={4} value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} placeholder="Share your thoughts..." />
        </form>
      </Modal>
    </div>
  );
};

export default SchoolLife;
