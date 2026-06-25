import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award, CalendarDays, AlertCircle, TrendingUp, CreditCard, Mail, FileText,
  Download, User, FlaskConical, Calculator, ClipboardList, BookOpen,
} from 'lucide-react';

const ANN_ICONS = { science: FlaskConical, math: Calculator, event: ClipboardList, english: BookOpen };

const ANNOUNCEMENTS = [
  { id: 1, type: 'Homework', icon: 'science', meta: 'Due Tomorrow, 11:59 PM • Science & Tech', title: 'Science Project: Solar System Model', desc: 'Complete the 3D model and submit the 500-word research summary via the student portal.' },
  { id: 2, type: 'Homework', icon: 'math', meta: 'Due Oct 26, 2023 • Advanced Mathematics', title: 'Math Workbook: Chapter 4 Exercises', desc: 'Solve problems 1-25 on pages 112-115. Show all working steps for partial credit.' },
  { id: 3, type: 'General', icon: 'event', meta: 'Due Oct 27, 2023 • School Event', title: 'Field Trip Consent Form: National Museum', desc: 'Digital signature required for the upcoming history department field trip scheduled for next Friday.' },
  { id: 4, type: 'Homework', icon: 'english', meta: 'Due Oct 30, 2023 • English Literature', title: 'English Essay: Character Analysis', desc: 'Draft a character analysis of Jay Gatsby focusing on the theme of the American Dream.' },
];

const EVENTS = [
  { date: 'Tomorrow • 18:00', title: 'PTA Meeting', sub: 'Main Auditorium', badge: 'High', cls: 'bg-primary-fixed text-on-primary-fixed' },
  { date: 'Oct 30 • 09:00', title: 'Math Olympiad', sub: 'Regional Level', badge: 'Event', cls: 'bg-secondary-fixed text-on-secondary-fixed' },
  { date: 'Nov 02 • All Day', title: 'School Photo Day', sub: 'Full Uniform Required', badge: 'Info', cls: 'bg-secondary-fixed text-on-secondary-fixed' },
];

const STATUS_CLS = { Exceling: 'bg-green-100 text-green-700', Steady: 'bg-blue-100 text-blue-700', 'Needs Review': 'bg-orange-100 text-orange-700' };

const CHILDREN = {
  marcus: {
    name: 'Marcus', grade: 'Grade 10', gpa: '3.85', delta: '+0.2 from last term', attendance: '96%', absences: '2 excused absences', pending: '04', balance: '₱1,250.00',
    performance: [
      { subject: 'Advanced Mathematics', teacher: 'Dr. Aris Thorne', grade: 'A-', attendance: '98%', status: 'Exceling' },
      { subject: 'Physics II', teacher: 'Prof. Elena Vance', grade: 'B+', attendance: '92%', status: 'Steady' },
      { subject: 'English Literature', teacher: 'Ms. Sarah Jenkins', grade: 'A', attendance: '100%', status: 'Exceling' },
      { subject: 'History of Art', teacher: 'Mr. Julian Ross', grade: 'B-', attendance: '85%', status: 'Needs Review' },
    ],
  },
  elena: {
    name: 'Elena', grade: 'Grade 7', gpa: '3.92', delta: '+0.1 from last term', attendance: '99%', absences: '0 absences', pending: '02', balance: '₱0.00',
    performance: [
      { subject: 'General Mathematics', teacher: 'Mr. Leo Park', grade: 'A', attendance: '99%', status: 'Exceling' },
      { subject: 'Integrated Science', teacher: 'Ms. Nadia Cruz', grade: 'A-', attendance: '100%', status: 'Exceling' },
      { subject: 'English', teacher: 'Mrs. Beth Cole', grade: 'B+', attendance: '97%', status: 'Steady' },
      { subject: 'World Geography', teacher: 'Mr. Sam Reyes', grade: 'A', attendance: '98%', status: 'Exceling' },
    ],
  },
};

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [child, setChild] = useState('marcus');
  const [annType, setAnnType] = useState('Homework');
  const [banner, setBanner] = useState(null);
  const flash = (msg) => { setBanner(msg); setTimeout(() => setBanner(null), 2400); };

  const c = CHILDREN[child];
  const anns = ANNOUNCEMENTS.filter((a) => a.type === annType);

  function downloadPDF() {
    const rows = c.performance.map((p) => `<tr><td>${p.subject}</td><td>${p.teacher}</td><td>${p.grade}</td><td>${p.attendance}</td><td>${p.status}</td></tr>`).join('');
    const html = `<!doctype html><html><head><title>Semester Performance — ${c.name}</title>
      <style>body{font-family:Inter,Arial,sans-serif;padding:40px;color:#111d23}h1{color:#000666}table{width:100%;border-collapse:collapse;margin-top:16px}th,td{border:1px solid #c6c5d4;padding:8px;font-size:13px;text-align:left}th{background:#e3f0f8;text-transform:uppercase;font-size:11px}</style></head>
      <body><h1>Current Semester Performance — ${c.name} (${c.grade})</h1><p>GPA ${c.gpa} · Attendance ${c.attendance}</p>
      <table><thead><tr><th>Subject</th><th>Teacher</th><th>Mid-Term</th><th>Attendance</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>
      <script>window.onload=function(){window.print()}<\/script></body></html>`;
    const w = window.open('', '_blank'); if (w) { w.document.write(html); w.document.close(); flash('Opening performance report…'); } else flash('Allow pop-ups to download.');
  }

  return (
    <div className="space-y-xl">
      {banner && <div className="fixed top-20 right-8 z-[70] bg-primary text-on-primary px-lg py-md rounded-xl shadow-[0_12px_32px_rgba(0,6,102,0.35)] font-label-md animate-fade-up">{banner}</div>}

      {/* welcome + child switcher */}
      <section className="flex flex-col md:flex-row justify-between md:items-end gap-lg">
        <div className="flex flex-col gap-xs">
          <span className="font-label-md uppercase tracking-wider text-secondary">Welcome Back</span>
          <h1 className="font-headline-lg text-headline-lg text-primary">Academic Overview</h1>
        </div>
        <div className="bg-surface-container p-xs rounded-xl flex gap-xs">
          {Object.entries(CHILDREN).map(([key, val]) => (
            <button key={key} onClick={() => setChild(key)} className={`px-lg py-sm font-label-md rounded-lg flex items-center gap-sm transition-all ${child === key ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-secondary hover:bg-surface-container-high'}`}>
              <User size={16} /> {val.name} ({val.grade})
            </button>
          ))}
        </div>
      </section>

      {/* bento */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* stat cards */}
        <div className="col-span-12 md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-gutter">
          <StatCard tone="bg-primary-container text-on-primary-container" icon={<Award size={20} />} label="Current GPA" value={c.gpa} foot={<span className="flex items-center gap-xs text-green-600"><TrendingUp size={14} /> {c.delta}</span>} />
          <StatCard tone="bg-secondary-container text-on-secondary-container" icon={<CalendarDays size={20} />} label="Attendance" value={c.attendance} foot={<span className="text-secondary">{c.absences}</span>} />
          <StatCard tone="bg-error-container text-on-error-container" icon={<AlertCircle size={20} />} label="Pending Tasks" value={c.pending} foot={<span className="flex items-center gap-xs text-error"><AlertCircle size={14} /> Due in 48 hours</span>} />
        </div>

        {/* quick actions */}
        <div className="col-span-12 md:col-span-4 md:row-span-2">
          <div className="bg-primary-container text-on-primary rounded-2xl p-xl h-full flex flex-col">
            <h4 className="font-headline-sm text-headline-sm mb-lg text-white">Quick Actions</h4>
            <div className="flex flex-col gap-md flex-grow">
              <button onClick={() => navigate('/parent/finance')} className="w-full bg-white text-primary font-label-md py-md rounded-lg px-lg flex items-center justify-between hover:opacity-90 transition-all active:scale-95">Pay Outstanding Fees <CreditCard size={18} /></button>
              <button onClick={() => navigate('/parent/communication')} className="w-full border border-white/30 text-white font-label-md py-md rounded-lg px-lg flex items-center justify-between hover:bg-white/10 transition-all active:scale-95">Message Teacher <Mail size={18} /></button>
              <button onClick={() => navigate('/parent/attendance')} className="w-full border border-white/30 text-white font-label-md py-md rounded-lg px-lg flex items-center justify-between hover:bg-white/10 transition-all active:scale-95">Absence Report <FileText size={18} /></button>
            </div>
            <div className="mt-xl p-md bg-white/10 rounded-lg">
              <p className="font-label-sm opacity-80 mb-sm">Overall Outstanding Balance</p>
              <p className="font-headline-md text-headline-md text-white">{c.balance}</p>
            </div>
          </div>
        </div>

        {/* announcements */}
        <div className="col-span-12 md:col-span-5">
          <div className="card !p-0 overflow-hidden h-full flex flex-col">
            <div className="p-lg border-b border-surface-container flex justify-between items-center gap-md flex-wrap">
              <h4 className="font-headline-sm text-headline-sm text-primary">School Announcements</h4>
              <div className="flex items-center gap-md">
                <div className="flex bg-surface-container p-xs rounded-lg gap-xs">
                  {['General', 'Homework'].map((t) => (
                    <button key={t} onClick={() => setAnnType(t)} className={`px-sm py-1 font-label-sm rounded transition-colors ${annType === t ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-secondary hover:bg-surface-container-high'}`}>{t}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-lg flex flex-col gap-lg">
              {anns.length === 0 && <p className="text-body-sm text-on-surface-variant text-center py-md">No {annType.toLowerCase()} announcements.</p>}
              {anns.map((a, i) => {
                const Icon = ANN_ICONS[a.icon] || ClipboardList;
                return (
                  <div key={a.id} className={`flex gap-md ${i > 0 ? 'border-t border-surface-container pt-lg' : ''}`}>
                    <div className="shrink-0 w-12 h-12 rounded-lg bg-tertiary-fixed flex items-center justify-center text-primary"><Icon size={22} /></div>
                    <div className="flex flex-col gap-xs">
                      <span className="font-label-sm text-secondary">{a.meta}</span>
                      <h5 className="font-label-md text-on-surface font-bold">{a.title}</h5>
                      <p className="font-body-sm text-secondary line-clamp-2">{a.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* upcoming */}
        <div className="col-span-12 md:col-span-3">
          <div className="card !p-0 overflow-hidden h-full flex flex-col">
            <div className="p-lg border-b border-surface-container"><h4 className="font-headline-sm text-headline-sm text-primary">Upcoming</h4></div>
            <div className="flex flex-col">
              {EVENTS.map((e, i) => (
                <button key={i} onClick={() => navigate('/parent/school-life')} className={`text-left p-lg hover:bg-tertiary-fixed/40 transition-colors ${i < EVENTS.length - 1 ? 'border-b border-surface-container' : ''}`}>
                  <div className="flex items-start justify-between gap-sm">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-secondary">{e.date}</span>
                      <p className="font-label-md font-bold text-on-surface">{e.title}</p>
                      <p className="font-body-sm text-secondary">{e.sub}</p>
                    </div>
                    <span className={`px-sm py-xs rounded font-label-sm shrink-0 ${e.cls}`}>{e.badge}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* performance */}
      <div className="card !p-0 overflow-hidden">
        <div className="p-xl border-b border-surface-container flex justify-between items-center gap-md flex-wrap">
          <h4 className="font-headline-md text-headline-md text-primary">Current Semester Performance</h4>
          <button onClick={downloadPDF} className="text-secondary font-label-md flex items-center gap-sm px-md py-sm hover:bg-surface-container rounded-lg transition-colors">Download Detailed PDF <Download size={18} /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[640px]">
            <thead><tr className="bg-tertiary-fixed/50 border-b border-surface-container">
              {['Subject', 'Teacher', 'Mid-Term Grade', 'Attendance', 'Status'].map((h) => <th key={h} className="px-xl py-md font-label-sm text-on-tertiary-fixed-variant uppercase tracking-widest">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-surface-container">
              {c.performance.map((p) => (
                <tr key={p.subject} className="hover:bg-tertiary-fixed/20 transition-all">
                  <td className="px-xl py-lg font-label-md text-on-surface">{p.subject}</td>
                  <td className="px-xl py-lg font-body-sm text-secondary">{p.teacher}</td>
                  <td className="px-xl py-lg font-headline-sm text-headline-sm text-primary">{p.grade}</td>
                  <td className="px-xl py-lg font-body-sm text-secondary">{p.attendance}</td>
                  <td className="px-xl py-lg"><span className={`px-sm py-xs rounded font-label-sm ${STATUS_CLS[p.status] || 'bg-surface-container-high text-secondary'}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ tone, icon, label, value, foot }) {
  return (
    <div className="card flex flex-col gap-md">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tone}`}>{icon}</div>
      <div>
        <p className="font-label-sm text-secondary uppercase">{label}</p>
        <h4 className="font-headline-xl text-headline-xl text-primary">{value}</h4>
      </div>
      <div className="font-label-sm">{foot}</div>
    </div>
  );
}
