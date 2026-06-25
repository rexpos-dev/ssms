import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Modal, Button, Input, Textarea } from '../../components/ui';
import {
  Plus, MoreVertical, Users, Video, Edit3, MessageSquare, AlertTriangle,
  ChevronRight, TrendingUp, Zap, Download, Check, X,
} from 'lucide-react';

/* ---------------- static-ish data ---------------- */
const SCHEDULE = [
  { time: '09:00', mer: 'AM', title: 'Physics 12-A', loc: 'Laboratory B • Room 402', students: 24, type: 'class' },
  { time: '11:30', mer: 'AM', title: 'Advanced Mechanics', loc: 'Auditorium 1 • Guest Lecture', type: 'live' },
  { time: '02:00', mer: 'PM', title: 'Faculty Meeting', loc: 'Conference Room C • Curricula Review', type: 'meeting' },
];

const TASKS = [
  { id: 1, icon: Edit3, iconBg: 'bg-secondary-container text-secondary', title: 'Ungraded: Midterm Physics', sub: '8 submissions remaining', progress: 75, to: '/teacher/grading' },
  { id: 2, icon: MessageSquare, iconBg: 'bg-surface-container-high text-on-secondary-fixed-variant', title: 'Unread Messages', sub: '3 from Parent Council', to: '/teacher/communication' },
  { id: 3, icon: AlertTriangle, iconBg: 'bg-error-container text-error', title: 'Overdue Reports', sub: 'Quarterly syllabus update', to: null },
];

const PERF = {
  'This Term': [
    { name: 'Physics 12-A', enrolled: 24, avg: 88.4, trend: [3, 5, 4, 6], status: 'Stable', tone: 'secondary' },
    { name: 'Advanced Mechanics', enrolled: 18, avg: 94.2, trend: [6, 5, 7, 8], status: 'Rising', tone: 'primary' },
    { name: 'Physics 11-B', enrolled: 26, avg: 76.8, trend: [6, 7, 5, 4], status: 'Needs Review', tone: 'error' },
  ],
  'Last Term': [
    { name: 'Physics 12-A', enrolled: 24, avg: 85.1, trend: [4, 4, 5, 5], status: 'Stable', tone: 'secondary' },
    { name: 'Advanced Mechanics', enrolled: 18, avg: 90.6, trend: [5, 6, 6, 7], status: 'Rising', tone: 'primary' },
    { name: 'Physics 11-B', enrolled: 26, avg: 79.2, trend: [7, 6, 6, 5], status: 'Stable', tone: 'secondary' },
  ],
};

const TONE = {
  primary: { bar: 'bg-primary', badge: 'bg-primary/10 text-primary', dot: 'bg-primary' },
  secondary: { bar: 'bg-secondary', badge: 'bg-secondary/10 text-secondary', dot: 'bg-secondary' },
  error: { bar: 'bg-error', badge: 'bg-error/10 text-error', dot: 'bg-error' },
};
const BAR_OPACITY = ['opacity-40', 'opacity-60', 'opacity-80', ''];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 18) return 'Good Afternoon';
  return 'Good Evening';
}
function lastName(name = 'Dr. Jenkins') {
  const parts = name.replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.|Prof\.)\s*/i, '').trim().split(/\s+/);
  return 'Dr. ' + parts[parts.length - 1];
}

/* ========================================================= */
export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const name = lastName(user?.name || 'Dr. Jenkins');

  const [term, setTerm] = useState('This Term');
  const [annOpen, setAnnOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [banner, setBanner] = useState(null);
  const [form, setForm] = useState({ title: '', message: '', audience: 'All Classes' });

  const rows = PERF[term];
  const today = useMemo(() => new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), []);

  function flash(msg) { setBanner(msg); setTimeout(() => setBanner(null), 2600); }

  function sendAnnouncement() {
    if (!form.title.trim()) { flash('Please add an announcement title.'); return; }
    try {
      const list = JSON.parse(localStorage.getItem('sms_announcements_v1') || '[]');
      list.unshift({ ...form, ts: new Date().toISOString() });
      localStorage.setItem('sms_announcements_v1', JSON.stringify(list));
    } catch { /* ignore */ }
    setAnnOpen(false);
    setForm({ title: '', message: '', audience: 'All Classes' });
    flash('Announcement posted.');
  }

  function exportCSV() {
    const header = ['Class Name', 'Enrolled', 'Avg Grade', 'Status'];
    const csv = [header, ...rows.map((r) => [r.name, r.enrolled, r.avg + '%', r.status])]
      .map((row) => row.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `class_performance_${term.replace(/\s/g, '_')}.csv`; a.click();
    URL.revokeObjectURL(url);
    flash('Performance report exported.');
  }

  /* ========================================================= */
  return (
    <div className="space-y-xl">
      {banner && (
        <div className="fixed top-20 right-8 z-[70] bg-primary text-on-primary px-lg py-md rounded-xl shadow-[0_12px_32px_rgba(0,6,102,0.35)] flex items-center gap-sm animate-fade-up">
          <Check size={18} /> <span className="font-label-md">{banner}</span>
        </div>
      )}

      {/* hero */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-primary">{greeting()}, {name}</h1>
          <p className="font-body-lg text-body-lg text-on-secondary-container mt-1">You have 4 classes and 12 pending tasks for today.</p>
        </div>
        <Button onClick={() => setAnnOpen(true)} icon={<Plus size={20} />}>New Announcement</Button>
      </section>

      {/* bento grid */}
      <div className="grid grid-cols-12 gap-lg">
        {/* today's schedule */}
        <div className="col-span-12 lg:col-span-8 card !p-0 overflow-hidden">
          <div className="px-gutter py-md border-b border-surface-variant flex justify-between items-center">
            <h3 className="font-headline-sm text-headline-sm text-primary">Today's Schedule</h3>
            <span className="font-label-md text-label-md text-secondary">{today}</span>
          </div>
          <div className="p-gutter space-y-md">
            {SCHEDULE.map((s, i) => {
              const live = s.type === 'live';
              return (
                <div
                  key={i}
                  className={`flex items-center p-md rounded-xl border transition-all ${
                    live ? 'bg-primary-container text-on-primary border-transparent' : 'bg-surface-container border-transparent hover:border-secondary'
                  }`}
                >
                  <div className={`w-20 text-center mr-lg border-r ${live ? 'border-on-primary/20' : 'border-outline-variant'}`}>
                    <p className={`font-label-md ${live ? 'text-white' : 'text-primary'}`}>{s.time}</p>
                    <p className={`text-[10px] uppercase font-bold ${live ? 'text-on-primary-container' : 'text-secondary'}`}>{s.mer}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-sm">
                      <h4 className={`font-body-md font-bold ${live ? '' : 'text-primary'}`}>{s.title}</h4>
                      {live && <span className="px-2 py-0.5 rounded text-[10px] bg-error text-white font-bold animate-pulse">LIVE</span>}
                    </div>
                    <p className={`text-sm ${live ? 'text-on-primary-container' : 'text-on-secondary-container'}`}>{s.loc}</p>
                  </div>
                  {s.type === 'class' && (
                    <>
                      <div className="flex -space-x-2 mr-md">
                        <div className="w-8 h-8 rounded-full bg-primary-fixed border-2 border-surface flex items-center justify-center text-[10px] font-bold text-primary">{s.students}</div>
                        <div className="w-8 h-8 rounded-full bg-secondary-fixed border-2 border-surface flex items-center justify-center text-[10px] font-bold text-secondary">ST</div>
                      </div>
                      <button onClick={() => navigate('/teacher/classes')} className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors" title="View class">
                        <MoreVertical size={20} />
                      </button>
                    </>
                  )}
                  {live && (
                    <button onClick={() => flash('Joining Advanced Mechanics session…')} className="ml-lg bg-white/10 hover:bg-white/20 px-lg py-sm rounded-lg text-sm font-bold transition-all flex items-center gap-sm">
                      <Video size={16} /> Join Session
                    </button>
                  )}
                  {s.type === 'meeting' && <Users size={20} className="text-secondary" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* right column */}
        <div className="col-span-12 lg:col-span-4 space-y-lg">
          <div className="card">
            <div className="flex justify-between items-center mb-lg">
              <h3 className="font-headline-sm text-headline-sm text-primary">Pending Tasks</h3>
              <span className="bg-error/10 text-error px-2 py-1 rounded text-xs font-bold">12 Total</span>
            </div>
            <div className="space-y-sm">
              {TASKS.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => (t.to ? navigate(t.to) : flash('Opening overdue reports…'))}
                    className="w-full text-left flex items-start gap-md p-sm hover:bg-surface-container rounded-lg transition-colors group"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${t.iconBg}`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body-sm font-bold text-on-surface">{t.title}</p>
                      <p className="text-xs text-on-secondary-container">{t.sub}</p>
                      {t.progress != null && (
                        <div className="w-full bg-outline-variant h-1 mt-sm rounded-full overflow-hidden">
                          <div className="bg-secondary h-full" style={{ width: `${t.progress}%` }} />
                        </div>
                      )}
                    </div>
                    <ChevronRight size={18} className="text-outline-variant group-hover:text-primary shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* weekly goal */}
          <div className="bg-primary-container rounded-2xl p-gutter text-on-primary relative overflow-hidden h-32 flex flex-col justify-center">
            <div className="relative z-10">
              <p className="font-label-md opacity-80 mb-1">Weekly Goal</p>
              <p className="font-headline-sm">92% Average Attendance</p>
              <p className="text-xs text-on-primary-container mt-1">Keep it up! This is 4% higher than last week.</p>
            </div>
            <TrendingUp size={100} className="absolute -right-4 -bottom-4 opacity-10" />
          </div>
        </div>

        {/* class performance */}
        <div className="col-span-12 card !p-0 overflow-hidden">
          <div className="px-gutter py-md border-b border-surface-variant flex justify-between items-center">
            <h3 className="font-headline-sm text-headline-sm text-primary">Class Performance Overview</h3>
            <div className="flex gap-sm items-center">
              <button
                onClick={() => setTerm((t) => (t === 'This Term' ? 'Last Term' : 'This Term'))}
                className="px-md py-1 rounded-md text-xs font-bold bg-surface-container text-on-surface border border-outline-variant hover:bg-surface-container-high transition-colors"
              >
                {term}
              </button>
              <button onClick={exportCSV} className="px-md py-1 rounded-md text-xs font-bold hover:bg-surface-container text-secondary transition-colors flex items-center gap-1">
                <Download size={14} /> Export CSV
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead className="bg-surface-container-high border-b border-outline-variant">
                <tr>
                  <th className="px-gutter py-sm font-label-sm text-on-secondary-fixed-variant uppercase tracking-wider">Class Name</th>
                  <th className="px-gutter py-sm font-label-sm text-on-secondary-fixed-variant uppercase tracking-wider text-center">Enrolled</th>
                  <th className="px-gutter py-sm font-label-sm text-on-secondary-fixed-variant uppercase tracking-wider text-center">Avg. Grade</th>
                  <th className="px-gutter py-sm font-label-sm text-on-secondary-fixed-variant uppercase tracking-wider">Trend (Last 4 Weeks)</th>
                  <th className="px-gutter py-sm font-label-sm text-on-secondary-fixed-variant uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant">
                {rows.map((r, i) => {
                  const tone = TONE[r.tone];
                  return (
                    <tr key={r.name} className={`hover:bg-surface transition-colors ${i % 2 ? 'bg-tertiary/5' : ''}`}>
                      <td className="px-gutter py-md font-body-md font-bold text-primary">{r.name}</td>
                      <td className="px-gutter py-md text-center text-on-surface-variant">{r.enrolled}</td>
                      <td className="px-gutter py-md text-center text-on-surface-variant font-bold">{r.avg}%</td>
                      <td className="px-gutter py-md">
                        <div className="flex items-end gap-1 h-8">
                          {r.trend.map((v, j) => (
                            <div key={j} className={`w-1.5 rounded-full ${tone.bar} ${BAR_OPACITY[j]}`} style={{ height: `${v * 4}px` }} />
                          ))}
                        </div>
                      </td>
                      <td className="px-gutter py-md text-right">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${tone.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${tone.dot} ${r.status === 'Rising' ? 'animate-pulse' : ''}`} /> {r.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Action FAB */}
      <div className="fixed bottom-8 right-8 z-50">
        {fabOpen && (
          <div className="absolute bottom-16 right-0 w-52 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_12px_32px_rgba(0,6,102,0.2)] overflow-hidden animate-fade-up">
            {[
              ['New Announcement', () => { setFabOpen(false); setAnnOpen(true); }],
              ['Mark Attendance', () => navigate('/teacher/attendance')],
              ['Grade Submissions', () => navigate('/teacher/grading')],
              ['Message Students', () => navigate('/teacher/communication')],
            ].map(([label, fn]) => (
              <button key={label} onClick={fn} className="block w-full text-left px-lg py-sm text-label-md text-on-surface hover:bg-surface-container transition-colors">{label}</button>
            ))}
          </div>
        )}
        <button onClick={() => setFabOpen((o) => !o)} className="w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform">
          {fabOpen ? <X size={26} /> : <Zap size={26} />}
        </button>
      </div>

      {/* New Announcement modal */}
      <Modal
        isOpen={annOpen}
        onClose={() => setAnnOpen(false)}
        title="New Announcement"
        actions={
          <>
            <Button variant="secondary" onClick={() => setAnnOpen(false)}>Cancel</Button>
            <Button onClick={sendAnnouncement} icon={<Plus size={16} />}>Post Announcement</Button>
          </>
        }
      >
        <div className="space-y-xs">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g., Midterm schedule update" />
          <Textarea label="Message" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Write your announcement…" />
          <div className="mb-lg">
            <label className="font-label-md text-label-md text-on-surface mb-sm block">Audience</label>
            <select className="input-field" value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}>
              <option>All Classes</option>
              <option>Physics 12-A</option>
              <option>Advanced Mechanics</option>
              <option>Physics 11-B</option>
              <option>Parents</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
