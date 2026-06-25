import { useEffect, useMemo, useState } from 'react';
import { Download, ChevronLeft, ChevronRight, Save, CheckCircle2, Check } from 'lucide-react';

const STORAGE_KEY = 'sms_grading_v1';
const PAGE_SIZE = 4;

const CLASSES = ['Calculus III (Section B)', 'Physics 12-A', 'Advanced Mechanics'];

const ASSESSMENTS = [
  { id: 'q', cat: 'Quiz', title: 'Algebra Quiz #3', sub: '30/32', status: 'Pending', statusTone: 'text-primary', badge: 'bg-secondary-container text-on-secondary-container' },
  { id: 'f', cat: 'Formative', title: 'Lab Report - Optics', sub: '15/32', status: 'In Progress', statusTone: 'text-on-surface-variant', badge: 'bg-primary-container/10 text-primary' },
  { id: 's', cat: 'Summative', title: 'Mid-term Exam', sub: '28/32', status: '4 Urgent', statusTone: 'text-error', badge: 'bg-error-container text-on-error-container' },
];

function seedStudents() {
  return [
    { id: 1, name: 'Adrian Abbott', sid: 'BA-2024-001', grade: 'A-', marks: 92, comment: '' },
    { id: 2, name: 'Eleanor Campbell', sid: 'BA-2024-118', grade: 'B+', marks: 88, comment: 'Consistent improvement in proofs.' },
    { id: 3, name: 'Julian Knight', sid: 'BA-2024-054', grade: 'D', marks: null, comment: '' },
    { id: 4, name: 'Maya Wong', sid: 'BA-2024-092', grade: 'A', marks: 98, comment: 'Exceptional analysis of limits.' },
    { id: 5, name: 'Liam Bennett', sid: 'BA-2024-077', grade: 'B', marks: 84, comment: '' },
    { id: 6, name: 'Sofia Marin', sid: 'BA-2024-103', grade: 'A-', marks: 91, comment: '' },
    { id: 7, name: 'Noah Park', sid: 'BA-2024-061', grade: 'C+', marks: 78, comment: '' },
    { id: 8, name: 'Ava Sinclair', sid: 'BA-2024-045', grade: 'A', marks: 95, comment: '' },
    { id: 9, name: 'Ethan Cole', sid: 'BA-2024-088', grade: 'B-', marks: 81, comment: '' },
    { id: 10, name: 'Isabella Rossi', sid: 'BA-2024-112', grade: 'C', marks: 74, comment: '' },
    { id: 11, name: 'Mason Lee', sid: 'BA-2024-033', grade: 'F', marks: 55, comment: 'Needs significant support.' },
    { id: 12, name: 'Zoe Nakamura', sid: 'BA-2024-127', grade: 'B+', marks: 87, comment: '' },
  ];
}
function load() {
  try { const r = localStorage.getItem(STORAGE_KEY); if (!r) { const s = seedStudents(); localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); return s; } return JSON.parse(r); } catch { return seedStudents(); }
}
function persist(list) { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }

/* grade helpers */
function letterFromMark(m) {
  if (m == null || m === '') return null;
  const n = Number(m);
  if (n >= 97) return 'A+'; if (n >= 93) return 'A'; if (n >= 90) return 'A-';
  if (n >= 87) return 'B+'; if (n >= 83) return 'B'; if (n >= 80) return 'B-';
  if (n >= 77) return 'C+'; if (n >= 73) return 'C'; if (n >= 70) return 'C-';
  if (n >= 67) return 'D+'; if (n >= 63) return 'D'; if (n >= 60) return 'D-';
  return 'F';
}
function gradeTone(grade) {
  const L = (grade || '')[0];
  if (L === 'A' || L === 'B') return 'bg-primary-container/10 text-primary';
  if (L === 'C') return 'bg-secondary/10 text-secondary';
  return 'bg-error-container/20 text-error';
}
function initials(name = '') { return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase(); }
const AV = ['bg-secondary-container text-on-secondary-container', 'bg-primary-fixed text-on-primary-fixed'];

/* ========================================================= */
export default function TeacherGrading() {
  const [students, setStudents] = useState(load);
  const [klass, setKlass] = useState(CLASSES[0]);
  const [tab, setTab] = useState('Overview');
  const [activeAssessment, setActiveAssessment] = useState('s');
  const [show, setShow] = useState('All Students');
  const [page, setPage] = useState(1);
  const [savedId, setSavedId] = useState(null);
  const [banner, setBanner] = useState(null);

  useEffect(() => persist(students), [students]);
  function flash(msg) { setBanner(msg); setTimeout(() => setBanner(null), 2400); }

  function update(id, field, value) {
    setStudents((p) => p.map((s) => {
      if (s.id !== id) return s;
      if (field === 'marks') {
        const marks = value === '' ? null : Math.max(0, Math.min(100, Number(value)));
        return { ...s, marks, grade: marks == null ? s.grade : letterFromMark(marks) };
      }
      return { ...s, [field]: value };
    }));
  }
  function saveRow(id) {
    persist(students);
    setSavedId(id);
    setTimeout(() => setSavedId((v) => (v === id ? null : v)), 1600);
    const s = students.find((x) => x.id === id);
    flash(`Saved grade for ${s?.name}.`);
  }

  /* distribution */
  const dist = useMemo(() => {
    const buckets = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    students.forEach((s) => { const L = (s.grade || '')[0]; if (buckets[L] != null) buckets[L]++; });
    const max = Math.max(1, ...Object.values(buckets));
    return { buckets, max };
  }, [students]);

  const analytics = useMemo(() => {
    const marked = students.filter((s) => s.marks != null);
    const avg = marked.length ? Math.round(marked.reduce((a, s) => a + s.marks, 0) / marked.length) : 0;
    const hi = marked.length ? Math.max(...marked.map((s) => s.marks)) : 0;
    const lo = marked.length ? Math.min(...marked.map((s) => s.marks)) : 0;
    const pass = students.filter((s) => !['D', 'F'].includes((s.grade || '')[0])).length;
    return { avg, hi, lo, passRate: Math.round((pass / students.length) * 100), graded: marked.length, total: students.length };
  }, [students]);

  /* filter + paginate */
  const filtered = useMemo(() => students.filter((s) => {
    if (show === 'Needs Review') return ['C', 'D', 'F'].includes((s.grade || '')[0]) || (s.marks != null && s.marks < 70);
    if (show === 'Top Performers') return (s.grade || '')[0] === 'A';
    return true;
  }), [students, show]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  useEffect(() => { if (page > totalPages) setPage(1); }, [totalPages, page]);

  function exportGradebook() {
    const header = ['Student', 'ID', 'Current Grade', 'Mid-term Marks', 'Comments'];
    const csv = [header, ...students.map((s) => [s.name, s.sid, s.grade || '', s.marks ?? '', (s.comment || '').replace(/"/g, '""')])]
      .map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `gradebook_${klass.replace(/[^a-z0-9]/gi, '_')}.csv`; a.click();
    URL.revokeObjectURL(url);
    flash('Gradebook exported.');
  }

  /* ========================================================= */
  return (
    <div className="space-y-lg">
      {banner && (
        <div className="fixed top-20 right-8 z-[70] bg-primary text-on-primary px-lg py-md rounded-xl shadow-[0_12px_32px_rgba(0,6,102,0.35)] flex items-center gap-sm animate-fade-up">
          <Check size={18} /> <span className="font-label-md">{banner}</span>
        </div>
      )}

      {/* header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-lg">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-primary mb-1">Grading Center</h1>
          <div className="flex gap-sm items-center text-on-surface-variant text-label-sm">
            <span>Academic Year 2023-24</span><span>/</span>
            <select value={klass} onChange={(e) => setKlass(e.target.value)} className="bg-transparent border-none text-primary font-semibold focus:ring-0 p-0 cursor-pointer">
              {CLASSES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-md items-center">
          <div className="flex bg-surface-container rounded-xl p-1">
            {['Overview', 'Detailed Analytics'].map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-lg py-1.5 font-label-md rounded-lg transition-all ${tab === t ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>{t}</button>
            ))}
          </div>
          <button onClick={exportGradebook} className="bg-primary text-on-primary px-lg py-sm rounded-xl font-label-md flex items-center gap-sm hover:opacity-90 transition-all">
            <Download size={18} /> Export Gradebook
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-gutter">
        {/* left: assessment overview */}
        <section className="col-span-12 lg:col-span-4">
          <div className="card !p-0 overflow-hidden">
            <div className="px-lg py-md border-b border-surface-container-high flex justify-between items-center">
              <h3 className="font-headline-sm text-headline-sm">Assessment Overview</h3>
              <span className="bg-error-container text-on-error-container text-[10px] font-bold px-2 py-0.5 rounded-full">4 URGENT</span>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-surface-container-high">
                  <th className="px-md py-sm text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Category</th>
                  <th className="px-md py-sm text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Title</th>
                  <th className="px-md py-sm text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Subs</th>
                  <th className="px-md py-sm text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {ASSESSMENTS.map((a) => (
                  <tr key={a.id} onClick={() => setActiveAssessment(a.id)} className={`cursor-pointer transition-colors ${activeAssessment === a.id ? 'bg-surface-container' : 'hover:bg-surface-container'}`}>
                    <td className="px-md py-md"><span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${a.badge}`}>{a.cat}</span></td>
                    <td className="px-md py-md font-label-md text-[12px] text-primary">{a.title}</td>
                    <td className="px-md py-md text-[12px] text-on-surface">{a.sub}</td>
                    <td className="px-md py-md"><span className={`font-bold text-[11px] ${a.statusTone}`}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="bg-surface-container-high/30 p-md text-center">
              <button onClick={() => flash('All 12 assignments — full list coming up.')} className="text-on-surface-variant font-label-md hover:text-primary transition-colors">View All Assignments (12)</button>
            </div>
          </div>
        </section>

        {/* right: chart + table */}
        <section className="col-span-12 lg:col-span-8 space-y-gutter">
          {/* distribution */}
          <div className="card">
            <div className="flex justify-between items-start mb-lg flex-wrap gap-md">
              <div>
                <h3 className="font-headline-sm text-headline-sm">Grade Distribution</h3>
                <p className="text-body-sm text-on-surface-variant">Class Performance: {klass}</p>
              </div>
              <div className="flex gap-md">
                <Legend color="bg-primary-container" label="A - B Range" />
                <Legend color="bg-secondary" label="C - D Range" />
              </div>
            </div>
            <div className="h-[180px] flex items-end justify-between gap-md px-2 pb-8 border-b border-surface-container-high relative">
              {['A', 'B', 'C', 'D', 'F'].map((L) => {
                const count = dist.buckets[L];
                const h = Math.round((count / dist.max) * 100);
                const fill = L === 'A' || L === 'B' ? 'bg-primary-container' : L === 'F' ? 'bg-error' : 'bg-secondary';
                const track = L === 'A' || L === 'B' ? 'bg-primary-container/20' : L === 'F' ? 'bg-error-container/30' : 'bg-secondary-container/30';
                return (
                  <div key={L} className={`flex-1 max-w-[56px] mx-auto rounded-t-md relative group ${track}`} style={{ height: '100%' }}>
                    <div className={`absolute bottom-0 w-full ${fill} rounded-t-md transition-all duration-700`} style={{ height: `${h}%` }} />
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{count} Students</div>
                    <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-label-sm text-on-surface-variant">{L}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {tab === 'Detailed Analytics' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
              <Stat label="Class Average" value={`${analytics.avg}%`} />
              <Stat label="Highest Mark" value={`${analytics.hi}%`} />
              <Stat label="Lowest Mark" value={`${analytics.lo}%`} />
              <Stat label="Pass Rate" value={`${analytics.passRate}%`} />
            </div>
          )}

          {/* student entry table */}
          <div className="card !p-0 overflow-hidden">
            <div className="px-lg py-md border-b border-surface-container-high bg-surface-container-low/50 flex justify-between items-center gap-md flex-wrap">
              <h3 className="font-label-md uppercase tracking-widest text-on-surface-variant">Student Performance Entry</h3>
              <div className="flex items-center gap-sm">
                <span className="text-body-sm text-on-surface-variant">Show:</span>
                <select value={show} onChange={(e) => { setShow(e.target.value); setPage(1); }} className="bg-transparent border-none text-label-md text-primary focus:ring-0 cursor-pointer">
                  <option>All Students</option><option>Needs Review</option><option>Top Performers</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="bg-surface-container-low border-b border-surface-container-high">
                    <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider">Student Name</th>
                    <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider text-center">Current Grade</th>
                    <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider text-center">Mid-term Marks</th>
                    <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider">Teacher Comments</th>
                    <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {pageRows.map((s, i) => (
                    <tr key={s.id} className={`transition-colors hover:bg-tertiary-fixed/10 ${i % 2 ? 'bg-tertiary-fixed/5' : ''}`}>
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-md">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${AV[i % 2]}`}>{initials(s.name)}</span>
                          <div>
                            <p className="font-label-md text-on-surface">{s.name}</p>
                            <p className="text-[11px] text-on-surface-variant">ID: #{s.sid}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-lg py-md text-center">
                        <span className={`font-bold text-[14px] px-3 py-1 rounded ${gradeTone(s.grade)}`}>{s.grade || '—'}</span>
                      </td>
                      <td className="px-lg py-md text-center">
                        <input
                          type="number" min="0" max="100"
                          value={s.marks ?? ''}
                          onChange={(e) => update(s.id, 'marks', e.target.value)}
                          placeholder="Enter"
                          className="w-16 text-center border border-outline-variant focus:border-primary rounded-lg font-label-md py-1 focus:outline-none bg-surface-container-lowest"
                        />
                      </td>
                      <td className="px-lg py-md">
                        <input
                          type="text" value={s.comment}
                          onChange={(e) => update(s.id, 'comment', e.target.value)}
                          placeholder="Add feedback…"
                          className="w-full text-body-sm bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 focus:outline-none py-1"
                        />
                      </td>
                      <td className="px-lg py-md text-center">
                        <button onClick={() => saveRow(s.id)} title="Save" className={`transition-colors ${savedId === s.id ? 'text-green-600' : 'text-on-surface-variant hover:text-primary'}`}>
                          {savedId === s.id ? <CheckCircle2 size={20} /> : <Save size={20} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-lg flex justify-between items-center">
              <p className="text-body-sm text-on-surface-variant">Showing {pageRows.length} of {filtered.length} students</p>
              <div className="flex gap-sm">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors disabled:opacity-50"><ChevronLeft size={18} /></button>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors disabled:opacity-50"><ChevronRight size={18} /></button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (<div className="flex items-center gap-2"><span className={`w-3 h-3 rounded-full ${color}`} /><span className="text-[12px] text-on-surface-variant font-medium">{label}</span></div>);
}
function Stat({ label, value }) {
  return (<div className="card text-center"><p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-xs">{label}</p><p className="font-headline-md text-headline-md text-primary">{value}</p></div>);
}
