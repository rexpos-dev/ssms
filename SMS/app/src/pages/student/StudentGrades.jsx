import { useState } from 'react';
import { TrendingUp, Download, Printer, History, ChevronRight, Award } from 'lucide-react';

const COURSES = [
  { name: 'AP Calculus BC', code: 'MAT-402', credits: 4, instructor: 'Dr. Elizabeth Thorne', attendance: 98, midterm: 'A- (92%)', grade: 'A', pct: '94.5%' },
  { name: 'Advanced Microeconomics', code: 'ECO-310', credits: 3, instructor: 'Prof. Julian Vane', attendance: 94, midterm: 'B+ (88%)', grade: 'A-', pct: '91.2%' },
  { name: 'World Literature IV', code: 'ENG-450', credits: 3, instructor: 'Dr. Sarah Jenkins', attendance: 100, midterm: 'A (96%)', grade: 'A', pct: '97.8%' },
  { name: 'Organic Chemistry I', code: 'CHE-320', credits: 4, instructor: 'Dr. Robert Chen', attendance: 89, midterm: 'B (84%)', grade: 'B+', pct: '87.1%' },
];

const TRANSCRIPT = [
  { term: 'Fall Semester 2023', detail: "15 Credits • Dean's List", gpa: '3.91', standing: 'High', featured: true },
  { term: 'Spring Semester 2023', detail: '16 Credits • Regular Standing', gpa: '3.75', standing: 'Normal' },
  { term: 'Fall Semester 2022', detail: "18 Credits • Dean's List", gpa: '3.88', standing: 'High' },
];

export default function StudentGrades() {
  const [banner, setBanner] = useState(null);
  const flash = (msg) => { setBanner(msg); setTimeout(() => setBanner(null), 2400); };

  function exportReport() {
    const header = ['Course', 'Code', 'Credits', 'Instructor', 'Attendance', 'Midterm', 'Current Grade', 'Percentage'];
    const csv = [header, ...COURSES.map((c) => [c.name, c.code, c.credits, c.instructor, c.attendance + '%', c.midterm, c.grade, c.pct])].map((r) => r.map((x) => `"${x}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'grade_report.csv'; a.click(); URL.revokeObjectURL(url);
    flash('Grade report exported.');
  }

  function printTranscript() {
    const cur = COURSES.map((c) => `<tr><td>${c.name} (${c.code})</td><td>${c.credits}</td><td>${c.instructor}</td><td>${c.grade} — ${c.pct}</td></tr>`).join('');
    const hist = TRANSCRIPT.map((t) => `<tr><td>${t.term}</td><td>${t.detail}</td><td>${t.gpa} GPA — ${t.standing}</td></tr>`).join('');
    const html = `<!doctype html><html><head><title>Official Transcript</title>
      <style>body{font-family:Inter,Arial,sans-serif;padding:40px;color:#111d23}h1{color:#000666}h2{color:#1a237e;margin-top:24px;font-size:15px}
      table{width:100%;border-collapse:collapse;margin-top:8px}th,td{border:1px solid #c6c5d4;padding:8px;font-size:13px;text-align:left}th{background:#e3f0f8;text-transform:uppercase;font-size:11px}</style></head>
      <body><h1>Bridges Academy — Academic Transcript</h1><p>Marcus Sterling · Class of 2025 · Cumulative GPA 3.82 / 4.0</p>
      <h2>Current Term (Spring Semester 2024)</h2><table><thead><tr><th>Course</th><th>Credits</th><th>Instructor</th><th>Grade</th></tr></thead><tbody>${cur}</tbody></table>
      <h2>Previous Semesters</h2><table><thead><tr><th>Term</th><th>Details</th><th>Result</th></tr></thead><tbody>${hist}</tbody></table>
      <script>window.onload=function(){window.print()}<\/script></body></html>`;
    const w = window.open('', '_blank'); if (w) { w.document.write(html); w.document.close(); flash('Opening transcript…'); } else flash('Allow pop-ups to print.');
  }

  return (
    <div className="space-y-xl">
      {banner && <div className="fixed top-20 right-8 z-[70] bg-primary text-on-primary px-lg py-md rounded-xl shadow-[0_12px_32px_rgba(0,6,102,0.35)] font-label-md animate-fade-up">{banner}</div>}

      {/* header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-md">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-primary mb-xs">Grades &amp; Performance</h1>
          <p className="text-on-surface-variant font-body-md">Spring Semester 2024 • Senior Year</p>
        </div>
        <div className="flex gap-md">
          <button onClick={exportReport} className="flex items-center gap-sm px-lg py-sm bg-surface-container-lowest border border-secondary rounded-lg text-secondary font-label-md hover:bg-surface-container transition-colors"><Download size={18} /> Export Report</button>
          <button onClick={printTranscript} className="flex items-center gap-sm px-lg py-sm bg-primary text-on-primary rounded-lg font-label-md hover:opacity-90 transition-opacity"><Printer size={18} /> Print Transcript</button>
        </div>
      </div>

      {/* summary bento */}
      <div className="grid grid-cols-12 gap-gutter">
        <div className="col-span-12 md:col-span-4 card">
          <div className="flex items-center justify-between mb-lg">
            <p className="text-on-surface-variant font-label-md uppercase tracking-widest">Cumulative GPA</p>
            <TrendingUp size={20} className="text-primary" />
          </div>
          <div className="flex items-baseline gap-sm">
            <span className="text-[56px] font-bold text-primary leading-none">3.82</span>
            <span className="text-secondary font-label-md">/ 4.0</span>
          </div>
          <div className="mt-md flex items-center gap-xs"><span className="text-error font-bold">+0.12</span><span className="text-on-surface-variant text-body-sm">from last semester</span></div>
        </div>

        <div className="col-span-12 md:col-span-8 card flex flex-col">
          <div className="flex items-center justify-between mb-lg">
            <p className="text-on-surface-variant font-label-md uppercase tracking-widest">GPA Performance Trend</p>
            <div className="flex gap-md text-body-sm">
              <span className="flex items-center gap-xs text-primary"><span className="w-3 h-3 bg-primary rounded-full" /> GPA</span>
              <span className="flex items-center gap-xs text-secondary opacity-50"><span className="w-3 h-3 bg-secondary rounded-full" /> Target (3.5)</span>
            </div>
          </div>
          <div className="flex-1 mt-auto">
            <svg className="w-full h-[150px]" viewBox="0 0 600 150" preserveAspectRatio="none">
              <defs><linearGradient id="gpaGrad" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#1a237e" stopOpacity="0.2" /><stop offset="100%" stopColor="#1a237e" stopOpacity="0" /></linearGradient></defs>
              <path d="M0,120 L150,100 L300,110 L450,70 L600,45 V150 H0 Z" fill="url(#gpaGrad)" />
              <path d="M0,120 L150,100 L300,110 L450,70 L600,45" fill="none" stroke="#1a237e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="0" x2="600" y1="90" y2="90" stroke="#78909C" strokeDasharray="4,4" strokeWidth="1" opacity="0.4" />
            </svg>
            <div className="flex justify-between mt-sm text-body-sm text-on-surface-variant">
              <span>Freshman</span><span>Sophomore</span><span>Junior</span><span>Senior (Current)</span>
            </div>
          </div>
        </div>
      </div>

      {/* current term grades */}
      <div>
        <div className="flex items-center justify-between mb-lg">
          <h3 className="font-headline-md text-headline-md text-primary">Current Term Grades</h3>
          <p className="text-body-sm text-on-surface-variant">Final exams in 14 days</p>
        </div>
        <div className="card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[720px]">
              <thead><tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase">Course Name</th>
                <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase">Instructor</th>
                <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase">Attendance</th>
                <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase">Midterm</th>
                <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase text-right">Current Grade</th>
              </tr></thead>
              <tbody className="divide-y divide-outline-variant/30">
                {COURSES.map((c, i) => (
                  <tr key={c.code} className={`hover:bg-tertiary-fixed/10 transition-colors ${i % 2 ? 'bg-surface-container-lowest' : ''}`}>
                    <td className="px-lg py-lg"><div className="font-label-md text-on-surface">{c.name}</div><div className="text-body-sm text-on-surface-variant">{c.code} • {c.credits} Credits</div></td>
                    <td className="px-lg py-lg text-body-md">{c.instructor}</td>
                    <td className="px-lg py-lg"><span className="inline-flex items-center px-sm py-xs rounded bg-surface-container text-primary font-label-sm">{c.attendance}%</span></td>
                    <td className="px-lg py-lg text-body-md">{c.midterm}</td>
                    <td className="px-lg py-lg text-right"><span className="text-headline-sm font-bold text-primary">{c.grade}</span><p className="text-xs text-on-surface-variant">{c.pct}</p></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* graduation + transcript */}
      <div className="grid grid-cols-12 gap-gutter">
        <div className="col-span-12 lg:col-span-5 card">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-lg">Graduation Progress</h3>
          <div className="space-y-xl">
            <div>
              <div className="flex justify-between mb-sm"><span className="font-label-md text-on-surface">Total Credits Earned</span><span className="font-bold text-primary">112 / 120</span></div>
              <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden"><div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: '93.3%' }} /></div>
              <p className="mt-sm text-xs text-on-surface-variant">8 credits remaining for graduation eligibility.</p>
            </div>
            <div className="grid grid-cols-2 gap-md">
              <div className="p-md bg-surface-container-low rounded-lg border border-outline-variant/30">
                <p className="text-xs text-on-surface-variant uppercase font-bold">Core Credits</p>
                <p className="text-headline-sm font-bold text-primary">64/64</p>
                <span className="text-[10px] text-green-600 font-bold uppercase">Complete</span>
              </div>
              <div className="p-md bg-surface-container-low rounded-lg border border-outline-variant/30">
                <p className="text-xs text-on-surface-variant uppercase font-bold">Electives</p>
                <p className="text-headline-sm font-bold text-primary">48/56</p>
                <span className="text-[10px] text-primary opacity-50 uppercase font-bold">In Progress</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7 card">
          <div className="flex items-center justify-between mb-lg">
            <h3 className="font-headline-sm text-headline-sm text-primary">Transcript Highlights</h3>
            <button onClick={() => flash('Loading all semesters…')} className="text-primary font-label-md hover:underline">View All Semesters</button>
          </div>
          <div className="space-y-md">
            {TRANSCRIPT.map((t) => (
              <button key={t.term} onClick={() => flash(`${t.term}: ${t.gpa} GPA`)} className="w-full flex items-center justify-between gap-md p-md border border-outline-variant/30 rounded-lg hover:border-secondary transition-colors group text-left">
                <div className="flex items-center gap-md min-w-0">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${t.featured ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container text-secondary'}`}><History size={22} /></div>
                  <div className="min-w-0"><p className="font-label-md text-on-surface truncate">{t.term}</p><p className="text-body-sm text-on-surface-variant truncate">{t.detail}</p></div>
                </div>
                <div className="flex items-center gap-lg shrink-0">
                  <div className="text-right"><p className="font-bold text-primary">{t.gpa} GPA</p><p className="text-[10px] uppercase font-bold text-on-surface-variant">Standing: {t.standing}</p></div>
                  <ChevronRight size={20} className="text-outline group-hover:text-primary transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* honors banner */}
      <div className="bg-primary-container p-xl rounded-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-lg">
          <div className="flex items-center gap-xl">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border border-white/30 shrink-0"><Award size={32} className="text-white" /></div>
            <div>
              <h4 className="text-white font-headline-sm text-headline-sm">Honors Society Eligibility</h4>
              <p className="text-on-primary-container font-body-md max-w-xl">You are currently ranked in the top 5% of your class. Maintain a GPA of 3.8+ to secure an invitation to the Bridges Elite Society for the Spring 2025 convocation.</p>
            </div>
          </div>
          <button onClick={() => flash('Opening Honors Society requirements…')} className="px-lg py-sm bg-white text-primary font-bold rounded-lg hover:bg-surface-container transition-colors shadow-lg active:scale-95 shrink-0">Review Requirements</button>
        </div>
      </div>
    </div>
  );
}
