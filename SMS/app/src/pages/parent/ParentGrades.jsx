import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, TrendingUp, Award, MessageCircle, Sigma, BookOpen, Landmark, FlaskConical, User } from 'lucide-react';

const SUBJECT_ICONS = { Sigma, BookOpen, Landmark, FlaskConical };

const TERMS = {
  'Fall Term 2023': {
    gpa: '3.88', delta: '+0.12 from last term', rank: '12 / 180', rankNote: 'Top 7% of Class',
    subjects: [
      { name: 'Mathematics (Calculus)', icon: 'Sigma', classAvg: 82, assessment: 94, grade: 'A', status: 'Distinction' },
      { name: 'Physics (Advanced)', icon: 'FlaskConical', classAvg: 78, assessment: 88, grade: 'A-', status: 'Honors' },
      { name: 'English Literature', icon: 'BookOpen', classAvg: 85, assessment: 92, grade: 'A', status: 'Distinction' },
      { name: 'Modern World History', icon: 'Landmark', classAvg: 75, assessment: 82, grade: 'B+', status: 'Consistent' },
    ],
  },
  'Spring Term 2023': {
    gpa: '3.76', delta: '+0.08 from last term', rank: '18 / 180', rankNote: 'Top 10% of Class',
    subjects: [
      { name: 'Mathematics (Calculus)', icon: 'Sigma', classAvg: 80, assessment: 90, grade: 'A-', status: 'Honors' },
      { name: 'Physics (Advanced)', icon: 'FlaskConical', classAvg: 76, assessment: 84, grade: 'B+', status: 'Consistent' },
      { name: 'English Literature', icon: 'BookOpen', classAvg: 84, assessment: 90, grade: 'A', status: 'Distinction' },
      { name: 'Modern World History', icon: 'Landmark', classAvg: 74, assessment: 79, grade: 'B', status: 'Consistent' },
    ],
  },
};

const GPA_TREND = {
  Yearly: [
    { label: 'Grade 8', pct: 60 }, { label: 'Grade 9', pct: 75 },
    { label: 'Grade 10', pct: 82 }, { label: 'Grade 11', pct: 92 },
  ],
  Quarterly: [
    { label: 'Q1', pct: 80 }, { label: 'Q2', pct: 85 },
    { label: 'Q3', pct: 88 }, { label: 'Q4', pct: 92 },
  ],
};

const FEEDBACK = [
  { id: 1, subject: 'Mathematics (Calculus)', teacher: 'Dr. Aris Thorne', tone: 'bg-tertiary-fixed text-on-tertiary-fixed-variant', comment: '"Marcus shows great aptitude for derivative analysis. His homework consistency is commendable."' },
  { id: 2, subject: 'English Literature', teacher: 'Mrs. Elena Vance', tone: 'bg-secondary-fixed text-on-secondary-fixed-variant', comment: '"Excellent essay on \'The Great Gatsby\'. Depth of analysis has significantly improved this term."' },
];

const STATUS_CLS = {
  Distinction: 'bg-green-100 text-green-800',
  Honors: 'bg-green-100 text-green-800',
  Consistent: 'bg-surface-container-high text-secondary',
};

export default function ParentGrades() {
  const navigate = useNavigate();
  const [term, setTerm] = useState('Fall Term 2023');
  const [period, setPeriod] = useState('Yearly');
  const [banner, setBanner] = useState(null);

  const data = TERMS[term];
  const trend = GPA_TREND[period];
  const flash = (msg) => { setBanner(msg); setTimeout(() => setBanner(null), 2400); };

  const trendMax = useMemo(() => Math.max(...trend.map((t) => t.pct)), [trend]);

  function downloadReport() {
    const rows = data.subjects.map((s) => `<tr><td>${s.name}</td><td>${s.classAvg}%</td><td>${s.assessment}%</td><td>${s.grade}</td><td>${s.status}</td></tr>`).join('');
    const html = `<!doctype html><html><head><title>Academic Report — Marcus Chen</title>
      <style>body{font-family:Inter,Arial,sans-serif;color:#111d23;padding:40px}h1{color:#000666;margin-bottom:4px}
      .sub{color:#4a626d;margin-top:0}table{width:100%;border-collapse:collapse;margin-top:16px}
      th,td{border:1px solid #c6c5d4;padding:8px;text-align:left;font-size:13px}th{background:#e3f0f8;text-transform:uppercase;font-size:11px}
      .cards{display:flex;gap:16px;margin-top:16px}.c{border:1px solid #c6c5d4;border-radius:8px;padding:16px;flex:1}</style></head>
      <body><h1>Bridges Academy — Academic Report</h1><p class="sub">Marcus Chen · Grade 11 · Section B · ${term}</p>
      <div class="cards"><div class="c"><b>Overall GPA</b><br>${data.gpa} (${data.delta})</div>
      <div class="c"><b>Rank</b><br>${data.rank} — ${data.rankNote}</div></div>
      <table><thead><tr><th>Subject</th><th>Class Avg</th><th>Assessment</th><th>Final Grade</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>
      <script>window.onload=function(){window.print()}<\/script></body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); flash('Opening report — use “Save as PDF”.'); }
    else flash('Please allow pop-ups to download the report.');
  }

  return (
    <div className="space-y-gutter">
      {banner && (
        <div className="fixed top-20 right-8 z-[70] bg-primary text-on-primary px-lg py-md rounded-xl shadow-[0_12px_32px_rgba(0,6,102,0.35)] flex items-center gap-sm animate-fade-up">
          <span className="font-label-md">{banner}</span>
        </div>
      )}

      {/* student banner */}
      <div className="flex items-center justify-between gap-md flex-wrap">
        <div className="flex items-center gap-md">
          <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary"><User size={22} /></div>
          <div>
            <h1 className="font-headline-sm text-headline-sm text-primary">Marcus Chen</h1>
            <p className="font-label-sm text-secondary">Grade 11 • Section B</p>
          </div>
        </div>
        <button onClick={downloadReport} className="flex items-center gap-sm px-lg py-sm bg-primary text-on-primary rounded-lg font-label-md hover:opacity-90 active:scale-95 transition-all">
          <Download size={18} /> Download Report
        </button>
      </div>

      {/* bento */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* GPA */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 card flex flex-col justify-between min-h-[160px]">
          <div className="flex justify-between items-start">
            <span className="font-label-md text-secondary uppercase tracking-wider">Overall GPA</span>
            <TrendingUp size={20} className="text-primary" />
          </div>
          <div><div className="font-headline-lg text-headline-lg text-primary">{data.gpa}</div><p className="text-label-sm text-on-secondary-container">{data.delta}</p></div>
        </div>
        {/* Rank */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 card flex flex-col justify-between min-h-[160px]">
          <div className="flex justify-between items-start">
            <span className="font-label-md text-secondary uppercase tracking-wider">Rank</span>
            <Award size={20} className="text-primary" />
          </div>
          <div><div className="font-headline-lg text-headline-lg text-primary">{data.rank}</div><p className="text-label-sm text-secondary">{data.rankNote}</p></div>
        </div>
        {/* Next exam */}
        <div className="col-span-12 lg:col-span-6 bg-primary-container text-on-primary rounded-2xl p-xl relative overflow-hidden min-h-[160px] flex flex-col justify-center">
          <div className="relative z-10">
            <h3 className="font-headline-sm text-headline-sm text-on-primary-container mb-xs">Next Major Exam</h3>
            <p className="font-body-lg text-white font-bold">Advanced Physics Lab</p>
            <p className="font-label-md opacity-80 mt-sm">Tuesday, Oct 24 • 09:00 AM</p>
          </div>
          <FlaskConical size={140} className="absolute right-[-20px] bottom-[-20px] opacity-10" />
        </div>

        {/* GPA trend */}
        <div className="col-span-12 lg:col-span-8 card">
          <div className="flex justify-between items-center mb-xl">
            <h3 className="font-headline-sm text-headline-sm text-primary">GPA Trend Over Time</h3>
            <div className="flex gap-sm">
              {['Quarterly', 'Yearly'].map((p) => (
                <button key={p} onClick={() => setPeriod(p)} className={`px-md py-xs rounded-full font-label-sm transition-colors ${period === p ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-secondary hover:bg-surface-container'}`}>{p}</button>
              ))}
            </div>
          </div>
          <div className="h-[240px] w-full flex items-end gap-lg px-md relative">
            <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none">
              {[0, 1, 2, 3].map((i) => <div key={i} className="border-t border-on-surface" />)}
            </div>
            {trend.map((t, idx) => {
              const last = idx === trend.length - 1;
              return (
                <div key={t.label} className="flex-grow flex flex-col items-center gap-sm">
                  <div className={`w-full rounded-t-lg transition-all hover:brightness-110 cursor-pointer ${last ? 'bg-primary' : 'bg-primary-fixed-dim'}`} style={{ height: `${(t.pct / trendMax) * 200}px` }} title={`${t.label}: ${t.pct}%`} />
                  <span className={`text-label-sm ${last ? 'text-primary font-bold' : 'text-secondary'}`}>{t.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* feedback */}
        <div className="col-span-12 lg:col-span-4 card">
          <div className="flex justify-between items-center mb-lg">
            <h3 className="font-headline-sm text-headline-sm text-primary">Recent Feedback</h3>
            <button onClick={() => flash('Showing all teacher feedback…')} className="text-primary text-label-sm font-bold hover:underline">View All</button>
          </div>
          <div className="flex flex-col gap-lg">
            {FEEDBACK.map((f, i) => (
              <div key={f.id} className={`flex gap-md pb-md ${i < FEEDBACK.length - 1 ? 'border-b border-surface-container-high' : ''}`}>
                <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center ${f.tone}`}><User size={20} /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-label-md text-primary">{f.subject}</p>
                  <p className="font-body-sm text-secondary mt-xs italic">{f.comment}</p>
                  <p className="text-[11px] uppercase tracking-tight text-outline mt-sm font-bold">— {f.teacher}</p>
                </div>
                <button onClick={() => navigate('/parent/communication')} title="Message teacher" className="text-primary hover:bg-surface-container-high p-xs rounded-full transition-colors h-fit"><MessageCircle size={18} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* grades table */}
        <div className="col-span-12 card !p-0 overflow-hidden">
          <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center gap-md flex-wrap">
            <h3 className="font-headline-sm text-headline-sm text-primary">Current Term Grades</h3>
            <select value={term} onChange={(e) => setTerm(e.target.value)} className="bg-surface border border-outline rounded-lg text-label-md px-md py-xs focus:ring-1 focus:ring-primary outline-none">
              {Object.keys(TERMS).map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead className="bg-surface-container-low">
                <tr>
                  {['Subject', 'Class Avg', 'Assessment', 'Final Grade', 'Status'].map((h) => (
                    <th key={h} className="px-xl py-md font-label-sm uppercase tracking-widest text-secondary">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high">
                {data.subjects.map((s, idx) => {
                  const Icon = SUBJECT_ICONS[s.icon] || BookOpen;
                  return (
                    <tr key={s.name} className={`hover:bg-tertiary-fixed/40 transition-colors ${idx % 2 ? 'bg-tertiary/5' : ''}`}>
                      <td className="px-xl py-lg">
                        <div className="flex items-center gap-md">
                          <div className="w-8 h-8 rounded bg-primary-container flex items-center justify-center text-on-primary"><Icon size={18} /></div>
                          <span className="font-body-md text-primary font-semibold">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-xl py-lg text-secondary">{s.classAvg}%</td>
                      <td className="px-xl py-lg">
                        <div className="w-32 h-2 bg-surface-container rounded-full overflow-hidden"><div className="h-full bg-primary transition-all" style={{ width: `${s.assessment}%` }} /></div>
                      </td>
                      <td className="px-xl py-lg font-headline-sm text-headline-sm text-primary">{s.grade}</td>
                      <td className="px-xl py-lg"><span className={`px-md py-xs rounded font-label-sm ${STATUS_CLS[s.status] || 'bg-surface-container-high text-secondary'}`}>{s.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
