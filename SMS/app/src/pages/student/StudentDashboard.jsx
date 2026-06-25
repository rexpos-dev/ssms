import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Modal, Button, Input } from '../../components/ui';
import {
  CalendarDays, ClipboardList, BarChart3, Megaphone, BookOpen, Headphones,
  ShieldCheck, Stethoscope, TrendingUp, Plus, Check,
} from 'lucide-react';

const TASKS_KEY = 'sms_student_tasks_v1';

const SCHEDULE = [
  { time: '09:00 AM', dur: '60 min', name: 'Advanced Calculus', loc: 'Room 402 • Dr. Henderson', status: 'Current', bar: 'bg-primary' },
  { time: '11:30 AM', dur: '90 min', name: 'Organic Chemistry Lab', loc: 'Lab Room B • Prof. Simmons', status: 'Upcoming', bar: 'bg-secondary' },
  { time: '02:15 PM', dur: '45 min', name: 'Modern History', loc: 'Seminar Room 12 • Dr. Wallace', status: 'Upcoming', bar: 'bg-secondary-fixed-dim' },
];

const SEED_TASKS = [
  { id: 1, title: 'Calculus Problem Set 8', due: 'Due today at 11:59 PM', priority: 'Urgent', progress: 85 },
  { id: 2, title: 'Chemistry Lab Report', due: 'Due Tomorrow, Oct 25', priority: 'Normal', progress: 40 },
  { id: 3, title: 'History Essay Outline', due: 'Due Friday, Oct 27', priority: 'Low', progress: 10 },
];

const PRIORITY = {
  Urgent: { wrap: 'bg-error-container/20 border-error', badge: 'bg-error text-on-error', bar: 'bg-error' },
  Normal: { wrap: 'bg-surface-container border-primary', badge: 'bg-primary text-on-primary', bar: 'bg-primary' },
  Low: { wrap: 'bg-surface-container border-secondary', badge: 'bg-secondary text-on-secondary', bar: 'bg-secondary' },
};

const SUBJECTS = [
  { name: 'Calculus', grade: 'A- (91%)', pct: 91 },
  { name: 'Chemistry', grade: 'A (95%)', pct: 95 },
];

const ANNOUNCEMENTS = [
  { id: 1, dot: 'bg-error', title: 'Winter Gala Ticket Sales', body: 'Tickets for the 2023 Winter Gala are now available for purchase in the student union and online portal.', time: 'Posted 2h ago' },
  { id: 2, dot: 'bg-outline-variant', title: 'Library Extended Hours', body: 'Starting next week, the main library will be open 24/7 for the mid-term examination period.', time: 'Posted yesterday' },
  { id: 3, dot: 'bg-outline-variant', title: 'New Internship Listings', body: 'The Career Center has added 15 new summer internship positions from our corporate partners.', time: 'Posted 2 days ago' },
];

const QUICK_LINKS = [
  { id: 'lib', icon: BookOpen, title: 'Library Resources', sub: 'Search catalogs & journals', featured: true },
  { id: 'it', icon: Headphones, title: 'IT Support', sub: 'Ticket system & live chat' },
  { id: 'hb', icon: ShieldCheck, title: 'Student Handbook', sub: 'Rules, policies & guides' },
];

function loadTasks() {
  try { const r = localStorage.getItem(TASKS_KEY); return r ? JSON.parse(r) : SEED_TASKS; } catch { return SEED_TASKS; }
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const first = (user?.name || 'Alex').split(' ')[0];

  const [tasks, setTasks] = useState(loadTasks);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', due: '', priority: 'Normal' });
  const [banner, setBanner] = useState(null);
  const flash = (msg) => { setBanner(msg); setTimeout(() => setBanner(null), 2400); };

  useEffect(() => { localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)); }, [tasks]);

  const today = useMemo(() => new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }), []);

  function addTask() {
    if (!form.title.trim()) { flash('Please enter an assignment title.'); return; }
    const id = Math.max(0, ...tasks.map((t) => t.id)) + 1;
    setTasks((p) => [{ id, title: form.title.trim(), due: form.due.trim() || 'No due date', priority: form.priority, progress: 0 }, ...p]);
    setForm({ title: '', due: '', priority: 'Normal' });
    setModalOpen(false);
    flash('Assignment added.');
  }

  return (
    <div className="space-y-xl">
      {banner && <div className="fixed top-20 right-8 z-[70] bg-primary text-on-primary px-lg py-md rounded-xl shadow-[0_12px_32px_rgba(0,6,102,0.35)] flex items-center gap-sm font-label-md animate-fade-up"><Check size={18} /> {banner}</div>}

      {/* welcome */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-primary mb-xs">Welcome Back, {first}!</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Today is {today}</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="px-lg py-sm bg-primary text-on-primary font-label-md rounded-lg shadow-sm hover:opacity-90 transition-opacity flex items-center gap-sm self-start md:self-auto">
          <Plus size={18} /> Quick Assignment
        </button>
      </section>

      {/* bento */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* schedule */}
        <div className="col-span-12 lg:col-span-8 card">
          <div className="flex items-center justify-between mb-lg pb-md border-b border-background">
            <h3 className="font-headline-md text-headline-md text-primary flex items-center gap-sm"><CalendarDays size={22} /> Current Schedule</h3>
            <button onClick={() => flash('Opening full calendar…')} className="text-primary font-label-md hover:underline">View Full Calendar</button>
          </div>
          <div className="space-y-sm">
            {SCHEDULE.map((s, i) => (
              <div key={i} className={`flex items-center gap-lg p-md rounded-lg border border-transparent hover:border-secondary transition-colors ${s.status === 'Current' ? 'bg-background' : 'bg-background/50 opacity-90'}`}>
                <div className="text-center min-w-[80px]">
                  <p className="font-label-md text-primary">{s.time}</p>
                  <p className="font-label-sm text-outline">{s.dur}</p>
                </div>
                <div className={`w-1 h-12 rounded-full ${s.bar}`} />
                <div className="flex-1 min-w-0">
                  <h4 className="font-headline-sm text-headline-sm text-on-surface">{s.name}</h4>
                  <p className="font-body-sm text-on-surface-variant">{s.loc}</p>
                </div>
                <span className={`px-sm py-xs text-label-sm rounded ${s.status === 'Current' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-variant text-on-surface-variant'}`}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* upcoming assignments */}
        <div className="col-span-12 lg:col-span-4 card flex flex-col">
          <div className="flex items-center justify-between mb-lg pb-md border-b border-background">
            <h3 className="font-headline-md text-headline-md text-primary flex items-center gap-sm"><ClipboardList size={22} /> Upcoming</h3>
          </div>
          <div className="space-y-md flex-1">
            {tasks.map((t) => {
              const p = PRIORITY[t.priority] || PRIORITY.Normal;
              return (
                <div key={t.id} className={`p-md border-l-4 rounded-r-lg ${p.wrap}`}>
                  <div className="flex justify-between items-start gap-sm mb-xs">
                    <h4 className="font-label-md text-on-surface">{t.title}</h4>
                    <span className={`text-[10px] px-xs py-[2px] rounded uppercase font-bold shrink-0 ${p.badge}`}>{t.priority}</span>
                  </div>
                  <p className="font-body-sm text-on-surface-variant mb-sm">{t.due}</p>
                  <div className="w-full bg-outline-variant h-1 rounded-full overflow-hidden"><div className={`${p.bar} h-full`} style={{ width: `${t.progress}%` }} /></div>
                </div>
              );
            })}
          </div>
          <button onClick={() => flash('Opening all assignments…')} className="mt-md w-full py-sm border border-outline-variant rounded-lg text-primary font-label-md hover:bg-surface-container transition-colors">All Assignments</button>
        </div>

        {/* academic progress */}
        <div className="col-span-12 lg:col-span-5 card">
          <h3 className="font-headline-md text-headline-md text-primary mb-lg flex items-center gap-sm"><BarChart3 size={22} /> Academic Progress</h3>
          <div className="grid grid-cols-2 gap-md">
            <div className="p-lg bg-background rounded-lg text-center border border-outline-variant/30">
              <p className="text-outline font-label-sm uppercase tracking-wider mb-sm">GPA (Unweighted)</p>
              <p className="text-[40px] font-bold text-primary leading-none">3.88</p>
              <p className="text-on-secondary-container font-label-sm font-medium mt-sm flex items-center justify-center gap-xs"><TrendingUp size={16} /> +0.2 this term</p>
            </div>
            <div className="p-lg bg-background rounded-lg text-center border border-outline-variant/30">
              <p className="text-outline font-label-sm uppercase tracking-wider mb-sm">Credits Earned</p>
              <p className="text-[40px] font-bold text-primary leading-none">92</p>
              <p className="text-on-surface-variant font-label-sm font-medium mt-sm">of 120 required</p>
            </div>
          </div>
          <div className="mt-lg space-y-sm">
            {SUBJECTS.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between mb-xs">
                  <span className="font-label-md text-on-surface">{s.name}</span>
                  <span className="font-bold text-primary">{s.grade}</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden"><div className="bg-primary h-full" style={{ width: `${s.pct}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        {/* announcements */}
        <div className="col-span-12 lg:col-span-4 card">
          <h3 className="font-headline-md text-headline-md text-primary mb-lg flex items-center gap-sm"><Megaphone size={22} /> Announcements</h3>
          <div className="space-y-lg">
            {ANNOUNCEMENTS.map((a) => (
              <button key={a.id} onClick={() => flash(`Opening: ${a.title}`)} className="flex gap-md text-left w-full">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${a.dot}`} />
                <div>
                  <h4 className="font-label-md text-on-surface">{a.title}</h4>
                  <p className="text-body-sm text-on-surface-variant line-clamp-2">{a.body}</p>
                  <span className="text-[10px] text-outline font-medium">{a.time}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* quick links */}
        <div className="col-span-12 lg:col-span-3 space-y-md">
          {QUICK_LINKS.map((q) => {
            const Icon = q.icon;
            return (
              <button key={q.id} onClick={() => flash(`Opening ${q.title}…`)} className={`block w-full text-left p-md rounded-xl border hover:scale-[1.02] transition-transform shadow-sm ${q.featured ? 'bg-primary-container text-on-primary-container border-primary' : 'bg-surface-container-lowest border-outline-variant'}`}>
                <div className="flex items-center gap-md">
                  <Icon size={30} className={q.featured ? '' : 'text-primary'} />
                  <div>
                    <h4 className={`font-label-md ${q.featured ? '' : 'text-on-surface'}`}>{q.title}</h4>
                    <p className={`text-[12px] ${q.featured ? 'opacity-80' : 'text-on-surface-variant'}`}>{q.sub}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* medical history */}
        <div className="col-span-12 lg:col-span-4 card flex flex-col">
          <h3 className="font-headline-md text-headline-md text-primary mb-lg flex items-center gap-sm"><Stethoscope size={22} /> Medical History</h3>
          <div className="space-y-md flex-1">
            <div className="grid grid-cols-2 gap-sm">
              <MedBox label="Allergies" value="Peanuts (Severe), Penicillin" />
              <MedBox label="Blood Type" value="B+" />
            </div>
            <MedBox label="Chronic Conditions" value="None" />
            <div className="p-sm bg-background rounded border border-outline-variant/30">
              <p className="text-outline text-[10px] uppercase tracking-wider font-bold">Emergency Contact</p>
              <p className="text-body-sm text-on-surface font-medium">Elena Mercer (Mother)</p>
              <p className="text-label-sm text-on-surface-variant">0917-123-4567</p>
            </div>
          </div>
          <button onClick={() => flash('Opening full health records…')} className="mt-md w-full py-sm border border-outline-variant rounded-lg text-primary font-label-md hover:bg-surface-container transition-colors">View Health Records</button>
        </div>
      </div>

      {/* quick assignment modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Quick Assignment"
        actions={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={addTask} icon={<Plus size={16} />}>Add</Button></>}>
        <div className="space-y-xs">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g., Biology reading — Ch. 5" />
          <Input label="Due" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} placeholder="e.g., Due Friday, Oct 27" />
          <div className="mb-lg">
            <label className="font-label-md text-label-md text-on-surface mb-sm block">Priority</label>
            <select className="input-field" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option>Urgent</option><option>Normal</option><option>Low</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function MedBox({ label, value }) {
  return (
    <div className="p-sm bg-background rounded border border-outline-variant/30">
      <p className="text-outline text-[10px] uppercase tracking-wider font-bold">{label}</p>
      <p className="text-body-sm text-on-surface font-medium">{value}</p>
    </div>
  );
}
