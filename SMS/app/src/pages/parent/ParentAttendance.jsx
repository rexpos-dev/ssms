import { useMemo, useState } from 'react';
import {
  TrendingUp, ChevronLeft, ChevronRight, Star, HeartHandshake, AlertTriangle,
  Award, Download, User,
} from 'lucide-react';

/* attendance status per October 2023 date */
const OCT_STATUS = { 6: 'late', 10: 'absent' };
const EVENT_DAYS = new Set([20]);

const EVENTS = [
  { name: 'Science Symposium', date: 'Oct 18, 2023', category: 'Academic', status: 'Attended', cls: 'bg-primary/10 text-primary' },
  { name: 'Math Olympiad', date: 'Oct 12, 2023', category: 'Extra-curricular', status: 'Excused', cls: 'bg-secondary-fixed-dim/30 text-on-secondary-fixed' },
  { name: 'School Photo Day', date: 'Oct 05, 2023', category: 'Mandatory', status: 'Absent', cls: 'bg-error/10 text-error' },
];

const CONDUCT = [
  { icon: Star, tone: 'bg-primary-container text-on-primary-container', title: 'Academic Excellence', date: 'Oct 18', desc: 'Alex demonstrated exceptional leadership during the Science Symposium preparation.', tag: '+10 Merits', tagCls: 'bg-primary/10 text-primary', by: 'Mr. Henderson' },
  { icon: HeartHandshake, tone: 'bg-secondary-container text-on-secondary-container', title: 'Community Service', date: 'Oct 12', desc: 'Volunteered to assist younger students during the reading marathon event.', tag: '+5 Merits', tagCls: 'bg-primary/10 text-primary', by: 'Ms. Clarice' },
  { icon: AlertTriangle, tone: 'bg-error-container text-on-error-container', title: 'Late Arrival', date: 'Oct 06', desc: 'Student arrived 15 minutes late to first period without a valid excuse note.', tag: 'Caution', tagCls: 'bg-error/10 text-error', by: 'Admin Office' },
];

const HISTORY = [
  { date: 'Friday, Oct 20', status: 'Excused', arrival: '07:55 AM', checkout: '03:30 PM', note: '—' },
  { date: 'Thursday, Oct 19', status: 'Present', arrival: '07:52 AM', checkout: '03:30 PM', note: '—' },
  { date: 'Wednesday, Oct 18', status: 'Present', arrival: '07:58 AM', checkout: '03:30 PM', note: '—' },
  { date: 'Tuesday, Oct 17', status: 'Present', arrival: '07:50 AM', checkout: '03:30 PM', note: '—' },
  { date: 'Monday, Oct 16', status: 'Present', arrival: '07:54 AM', checkout: '03:30 PM', note: '—' },
  { date: 'Friday, Oct 13', status: 'Present', arrival: '07:49 AM', checkout: '03:30 PM', note: '—' },
  { date: 'Thursday, Oct 12', status: 'Present', arrival: '07:51 AM', checkout: '03:30 PM', note: 'Math Olympiad' },
  { date: 'Wednesday, Oct 11', status: 'Present', arrival: '07:56 AM', checkout: '03:30 PM', note: '—' },
  { date: 'Tuesday, Oct 10', status: 'Absent', arrival: '—', checkout: '—', note: 'Sick leave' },
  { date: 'Monday, Oct 09', status: 'Present', arrival: '07:53 AM', checkout: '03:30 PM', note: '—' },
  { date: 'Friday, Oct 06', status: 'Late', arrival: '08:12 AM', checkout: '03:30 PM', note: 'Traffic' },
  { date: 'Thursday, Oct 05', status: 'Present', arrival: '07:48 AM', checkout: '03:30 PM', note: '—' },
  { date: 'Wednesday, Oct 04', status: 'Present', arrival: '07:55 AM', checkout: '03:30 PM', note: '—' },
  { date: 'Tuesday, Oct 03', status: 'Present', arrival: '07:50 AM', checkout: '03:30 PM', note: '—' },
  { date: 'Monday, Oct 02', status: 'Present', arrival: '07:57 AM', checkout: '03:30 PM', note: '—' },
];

const STATUS_BADGE = {
  Present: 'bg-primary/10 text-primary',
  Excused: 'bg-secondary-fixed-dim/30 text-on-secondary-fixed',
  Late: 'bg-secondary-fixed-dim/30 text-on-secondary-fixed',
  Absent: 'bg-error/10 text-error',
};
const PAGE_SIZE = 5;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function ParentAttendance() {
  const [cursor, setCursor] = useState({ y: 2023, m: 9 }); // October = 9
  const [filter, setFilter] = useState('All Statuses');
  const [page, setPage] = useState(1);
  const [banner, setBanner] = useState(null);
  const flash = (msg) => { setBanner(msg); setTimeout(() => setBanner(null), 2400); };

  const isOctober = cursor.y === 2023 && cursor.m === 9;

  /* build calendar cells (Mon-based) */
  const cells = useMemo(() => {
    const first = new Date(cursor.y, cursor.m, 1);
    const days = new Date(cursor.y, cursor.m + 1, 0).getDate();
    const lead = (first.getDay() + 6) % 7; // convert Sun=0 to Mon=0
    const arr = Array.from({ length: lead }, () => null);
    for (let d = 1; d <= days; d++) {
      const wd = new Date(cursor.y, cursor.m, d).getDay();
      const weekend = wd === 0 || wd === 6;
      let status = 'none';
      if (isOctober) {
        if (weekend) status = 'weekend';
        else if (d > 22) status = 'future';
        else status = OCT_STATUS[d] || 'present';
      } else {
        status = weekend ? 'weekend' : 'present';
      }
      arr.push({ d, status, event: isOctober && EVENT_DAYS.has(d) });
    }
    return arr;
  }, [cursor, isOctober]);

  const cellCls = (s) => {
    switch (s) {
      case 'present': return 'bg-primary-container text-on-primary-container';
      case 'late': return 'bg-secondary-fixed-dim text-on-secondary-fixed';
      case 'absent': return 'bg-error-container text-on-error-container';
      case 'future': return 'bg-surface-container text-on-surface';
      default: return 'border border-surface-container-high text-on-surface-variant opacity-40';
    }
  };

  const move = (delta) => { setCursor((c) => { let m = c.m + delta, y = c.y; if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; } return { y, m }; }); };

  const filtered = filter === 'All Statuses' ? HISTORY : HISTORY.filter((h) => h.status === filter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function exportPDF() {
    const rows = filtered.map((h) => `<tr><td>${h.date}</td><td>${h.status}</td><td>${h.arrival}</td><td>${h.checkout}</td><td>${h.note}</td></tr>`).join('');
    const html = `<!doctype html><html><head><title>Attendance — Alex Mercer</title>
      <style>body{font-family:Inter,Arial,sans-serif;padding:40px;color:#111d23}h1{color:#000666}
      table{width:100%;border-collapse:collapse;margin-top:16px}th,td{border:1px solid #c6c5d4;padding:8px;font-size:13px;text-align:left}th{background:#e3f0f8;text-transform:uppercase;font-size:11px}</style></head>
      <body><h1>Attendance History — ${MONTHS[cursor.m]} ${cursor.y}</h1><p>Alex Mercer · Grade 10 · 98.2% academic-year attendance</p>
      <table><thead><tr><th>Date</th><th>Status</th><th>Arrival</th><th>Check-out</th><th>Notes</th></tr></thead><tbody>${rows}</tbody></table>
      <script>window.onload=function(){window.print()}<\/script></body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); flash('Opening attendance report…'); } else flash('Allow pop-ups to export.');
  }

  const dash = 2 * Math.PI * 44;

  return (
    <div className="space-y-xl">
      {banner && <div className="fixed top-20 right-8 z-[70] bg-primary text-on-primary px-lg py-md rounded-xl shadow-[0_12px_32px_rgba(0,6,102,0.35)] font-label-md animate-fade-up">{banner}</div>}

      {/* header */}
      <div className="flex items-center justify-between gap-md flex-wrap">
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold">Attendance &amp; Conduct</h1>
        <div className="flex items-center gap-sm px-md py-xs bg-surface-container rounded-full">
          <User size={18} className="text-primary" />
          <span className="font-label-md text-on-surface">Alex Mercer (Grade 10)</span>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-lg">
        <div className="md:col-span-2 card flex flex-col justify-between">
          <div>
            <h3 className="font-label-md text-secondary uppercase tracking-wider mb-sm">Academic Year Attendance</h3>
            <div className="flex items-end gap-md">
              <span className="font-headline-xl text-headline-xl text-primary">98.2%</span>
              <span className="text-green-600 font-label-md mb-xs flex items-center gap-xs"><TrendingUp size={16} /> +0.5% from last term</span>
            </div>
          </div>
          <div className="mt-xl space-y-md">
            <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden"><div className="h-full bg-primary-container rounded-full" style={{ width: '98.2%' }} /></div>
            <div className="flex justify-between font-label-sm text-secondary"><span>172 Days Present</span><span>3 Days Absent</span></div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-label-md text-secondary uppercase tracking-wider mb-sm">Conduct Score</h3>
          <div className="flex flex-col items-center justify-center py-sm">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
                <circle className="text-surface-container-high" cx="48" cy="48" r="44" fill="transparent" stroke="currentColor" strokeWidth="8" />
                <circle className="text-primary" cx="48" cy="48" r="44" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray={dash} strokeDashoffset={dash * 0.1} strokeLinecap="round" />
              </svg>
              <span className="absolute font-headline-md text-headline-md text-primary">A+</span>
            </div>
            <p className="mt-md font-label-md text-on-surface">Exemplary Behavior</p>
          </div>
        </div>

        <div className="bg-primary-container text-on-primary-container rounded-2xl p-xl">
          <h3 className="font-label-md opacity-80 uppercase tracking-wider mb-sm">Merit Points</h3>
          <div className="flex items-center gap-md py-md">
            <Award size={40} />
            <div><span className="font-headline-lg text-headline-lg block text-white">42</span><span className="font-label-sm opacity-80">Ranked #4 in Year 10</span></div>
          </div>
        </div>
      </div>

      {/* calendar + conduct */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
        <div className="lg:col-span-2 card !p-0 overflow-hidden">
          <div className="p-lg border-b border-surface-container-high flex justify-between items-center gap-md flex-wrap">
            <div className="flex items-center gap-md">
              <h3 className="font-headline-sm text-headline-sm text-primary">{MONTHS[cursor.m]} {cursor.y}</h3>
              <div className="flex gap-xs">
                <button onClick={() => move(-1)} className="p-xs hover:bg-surface-container-low rounded-lg transition-colors"><ChevronLeft size={18} /></button>
                <button onClick={() => move(1)} className="p-xs hover:bg-surface-container-low rounded-lg transition-colors"><ChevronRight size={18} /></button>
              </div>
            </div>
            <div className="flex gap-md font-label-sm">
              <span className="flex items-center gap-xs"><span className="w-3 h-3 bg-primary-container rounded-full" /> Present</span>
              <span className="flex items-center gap-xs"><span className="w-3 h-3 bg-secondary-fixed-dim rounded-full" /> Late</span>
              <span className="flex items-center gap-xs"><span className="w-3 h-3 bg-error-container rounded-full" /> Absent</span>
            </div>
          </div>
          <div className="p-lg">
            <div className="grid grid-cols-7 mb-sm">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d) => <div key={d} className="text-center font-label-sm text-secondary py-sm">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-sm">
              {cells.map((c, i) => c == null
                ? <div key={i} className="aspect-square" />
                : <div key={i} className={`aspect-square flex items-center justify-center rounded-lg font-body-md relative ${cellCls(c.status)}`} title={c.status}>{c.d}{c.event && <span className="absolute bottom-1 w-1 h-1 bg-white rounded-full" />}</div>)}
            </div>
          </div>
          {/* event history */}
          <div className="border-t border-surface-container-high">
            <div className="p-lg border-b border-surface-container-high"><h3 className="font-headline-sm text-headline-sm text-primary">Event Attendance History</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead><tr className="bg-surface-container-low border-b border-surface-container-high">
                  {['Event Name', 'Date', 'Category', 'Status'].map((h) => <th key={h} className="px-lg py-md font-label-sm text-secondary uppercase tracking-wider">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-surface-container-high">
                  {EVENTS.map((e, i) => (
                    <tr key={e.name} className={`hover:bg-surface-container-low transition-colors ${i % 2 ? 'bg-tertiary/5' : ''}`}>
                      <td className="px-lg py-md font-body-md text-on-surface">{e.name}</td>
                      <td className="px-lg py-md font-body-sm text-secondary">{e.date}</td>
                      <td className="px-lg py-md font-body-sm text-secondary">{e.category}</td>
                      <td className="px-lg py-md"><span className={`px-sm py-xs text-xs font-bold rounded-lg uppercase ${e.cls}`}>{e.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* conduct sidebar */}
        <div className="card !p-0 overflow-hidden flex flex-col">
          <div className="p-lg border-b border-surface-container-high"><h3 className="font-headline-sm text-headline-sm text-primary">Recent Conduct</h3></div>
          <div className="flex-grow p-lg space-y-lg">
            {CONDUCT.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="flex gap-md">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${c.tone}`}><Icon size={16} /></div>
                    {i < CONDUCT.length - 1 && <div className="w-px flex-1 bg-outline-variant my-sm" />}
                  </div>
                  <div className="pb-sm flex-1">
                    <div className="flex justify-between items-start gap-sm"><h4 className="font-label-md text-on-surface">{c.title}</h4><span className="font-label-sm text-secondary shrink-0">{c.date}</span></div>
                    <p className="font-body-sm text-secondary mt-xs">{c.desc}</p>
                    <div className="mt-sm flex items-center gap-sm flex-wrap"><span className={`px-sm py-[2px] rounded-lg font-label-sm ${c.tagCls}`}>{c.tag}</span><span className="font-label-sm text-on-tertiary-container italic">— {c.by}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="p-lg bg-surface-container-low border-t border-surface-container-high">
            <button onClick={() => flash('Loading all conduct records…')} className="w-full py-sm bg-primary text-on-primary rounded-lg font-label-md hover:opacity-90 transition-all">View All Conduct Records</button>
          </div>
        </div>
      </div>

      {/* detailed history */}
      <div className="card !p-0 overflow-hidden">
        <div className="p-lg border-b border-surface-container-high flex justify-between items-center gap-md flex-wrap">
          <h3 className="font-headline-sm text-headline-sm text-primary">Attendance History - {MONTHS[cursor.m]}</h3>
          <div className="flex gap-md">
            <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }} className="bg-surface border border-outline-variant rounded-lg px-md py-xs font-label-md focus:ring-1 focus:ring-primary outline-none">
              <option>All Statuses</option><option>Present</option><option>Absent</option><option>Late</option><option>Excused</option>
            </select>
            <button onClick={exportPDF} className="flex items-center gap-sm px-md py-xs border border-outline-variant rounded-lg font-label-md hover:bg-surface-container-low transition-colors"><Download size={16} /> Export PDF</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead><tr className="bg-surface-container-low border-b border-surface-container-high">
              {['Date', 'Status', 'Homeroom Arrival', 'Check-out Time', 'Notes/Remarks'].map((h) => <th key={h} className="px-lg py-md font-label-sm text-secondary uppercase tracking-wider">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-surface-container-high">
              {pageRows.map((h, i) => (
                <tr key={h.date} className={`hover:bg-surface-container-low transition-colors ${i % 2 ? 'bg-tertiary/5' : ''}`}>
                  <td className="px-lg py-md font-body-md text-on-surface">{h.date}</td>
                  <td className="px-lg py-md"><span className={`px-sm py-xs text-xs font-bold rounded-lg uppercase ${STATUS_BADGE[h.status]}`}>{h.status}</span></td>
                  <td className="px-lg py-md font-body-sm text-secondary">{h.arrival}</td>
                  <td className="px-lg py-md font-body-sm text-secondary">{h.checkout}</td>
                  <td className="px-lg py-md font-body-sm text-on-tertiary-container">{h.note}</td>
                </tr>
              ))}
              {pageRows.length === 0 && <tr><td colSpan={5} className="px-lg py-xl text-center text-on-surface-variant">No records for this filter.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="p-lg flex items-center justify-between border-t border-surface-container-high">
          <span className="font-label-sm text-secondary">Showing {filtered.length} records for {MONTHS[cursor.m]}</span>
          <div className="flex gap-sm">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-md py-sm border border-outline-variant rounded-lg font-label-md disabled:opacity-50 hover:bg-surface-container-low">Previous</button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-md py-sm border border-outline-variant rounded-lg font-label-md disabled:opacity-50 hover:bg-surface-container-low">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
