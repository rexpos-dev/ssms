import { useEffect, useMemo, useState } from 'react';
import {
  Users, TrendingUp, UserX, Clock, CheckCircle2, FileDown, BarChart3,
  ChevronLeft, ChevronRight, Check,
} from 'lucide-react';

const STORAGE_KEY = 'sms_attendance_v1';
const PAGE_SIZE = 6;
const DEFAULT_DATE = '2026-06-26';
const STATUSES = ['Present', 'Absent', 'Late', 'Sick'];

/* ---------------- classes + rosters ---------------- */
const CLASSES = [
  { id: 1, name: 'Grade 10 - Mathematics (Section B)', session: 'Session 02 (10:15 AM - 11:30 AM)' },
  { id: 2, name: 'Grade 11 - Mathematics (Section A)', session: 'Session 04 (1:00 PM - 2:15 PM)' },
  { id: 3, name: 'Grade 12 - Calculus (Advanced)', session: 'Session 01 (8:30 AM - 9:45 AM)' },
];

const LW = {
  p5: ['Present', 'Present', 'Present', 'Present', 'Present'],
  late: ['Present', 'Present', 'Present', 'Late', 'Present'],
  abs: ['Present', 'Absent', 'Present', 'Present', 'Absent'],
  sick: ['Present', 'Present', 'Present', 'Sick', 'Sick'],
  late2: ['Present', 'Late', 'Present', 'Present', 'Present'],
};

// First six match the reference design exactly (incl. seeded status + remark for the default session).
const SECTION_B = [
  { id: 'BA-10294', name: 'Adrian Bennett', tag: 'Mathematics Honors', lastWeek: LW.late },
  { id: 'BA-10311', name: 'Elena Rodriguez', tag: 'Class Representative', lastWeek: LW.p5 },
  { id: 'BA-10255', name: 'Julian Chen', tag: 'Mathematics Honors', lastWeek: LW.abs, seed: { status: 'Absent', remark: 'Unexcused absence' } },
  { id: 'BA-10422', name: 'Maya Thompson', tag: 'Mathematics Honors', lastWeek: LW.p5 },
  { id: 'BA-10281', name: 'Oliver Wright', tag: 'Mathematics Honors', lastWeek: LW.sick, seed: { status: 'Sick', remark: 'Medical certificate received' } },
  { id: 'BA-10398', name: 'Samuel Lee', tag: 'Mathematics Honors', lastWeek: LW.late2, seed: { status: 'Late', remark: 'Arrived 15m late' } },
];

const EXTRA_NAMES = [
  'Priya Nair', 'Daniel Okafor', 'Sofia Martinez', 'Liam Anderson', 'Chloe Kim',
  'Noah Williams', 'Ava Patel', 'Ethan Brooks', 'Isabella Rossi', 'Mason Clark',
  'Amara Diallo', 'Lucas Meyer', 'Zoe Nakamura', 'Henry Walsh', 'Layla Hassan',
  'Benjamin Cole', 'Nora Petrova', 'Caleb Wright', 'Hana Suzuki', 'Owen Foster',
  'Grace Mensah', 'Felix Berg',
];
const LW_CYCLE = [LW.p5, LW.late, LW.p5, LW.late2, LW.p5, LW.sick];

function buildRoster(classId) {
  if (classId === 1) {
    const extra = EXTRA_NAMES.map((name, i) => ({
      id: 'BA-' + (10500 + i),
      name,
      tag: 'Mathematics Honors',
      lastWeek: LW_CYCLE[i % LW_CYCLE.length],
    }));
    return [...SECTION_B, ...extra]; // 28 students
  }
  const size = classId === 2 ? 26 : 24;
  const names = [...EXTRA_NAMES, ...SECTION_B.map((s) => s.name)];
  return Array.from({ length: size }, (_, i) => ({
    id: 'BA-' + (20000 + classId * 100 + i),
    name: names[i % names.length],
    tag: classId === 3 ? 'Calculus Advanced' : 'Mathematics Honors',
    lastWeek: LW_CYCLE[i % LW_CYCLE.length],
  }));
}

/* ---------------- persistence ---------------- */
function loadStore() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
}
function saveStore(store) { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); }

// Build the record map for a class/date, falling back to seeded/present defaults.
function defaultsFor(classId, date, roster) {
  const map = {};
  const seeded = classId === 1 && date === DEFAULT_DATE;
  roster.forEach((s) => {
    map[s.id] = seeded && s.seed
      ? { status: s.seed.status, remark: s.seed.remark }
      : { status: 'Present', remark: '' };
  });
  return map;
}

/* ---------------- helpers ---------------- */
function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}
const AVATAR_TONES = ['bg-primary text-on-primary', 'bg-secondary text-white', 'bg-tertiary text-white'];
function toneFor(id) {
  const n = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_TONES[n % AVATAR_TONES.length];
}
const DOT_COLOR = { Present: 'bg-green-600', Absent: 'bg-red-600', Late: 'bg-orange-500', Sick: 'bg-blue-600' };
const ACTIVE_BTN = {
  Present: 'bg-green-700 text-white border-green-700',
  Absent: 'bg-red-700 text-white border-red-700',
  Late: 'bg-orange-600 text-white border-orange-600',
  Sick: 'bg-blue-800 text-white border-blue-800',
};

/* ========================================================= */
export default function TeacherAttendance() {
  const [classId, setClassId] = useState(1);
  const [date, setDate] = useState(DEFAULT_DATE);
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState({});      // { studentId: {status, remark} }
  const [submitState, setSubmitState] = useState('idle'); // idle | saving | done
  const [banner, setBanner] = useState(null);

  const roster = useMemo(() => buildRoster(classId), [classId]);
  const key = `${classId}_${date}`;

  // load records whenever class/date changes
  useEffect(() => {
    const store = loadStore();
    setRecords(store[key] || defaultsFor(classId, date, roster));
    setPage(1);
    setSubmitState('idle');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, date]);

  function flash(msg) { setBanner(msg); setTimeout(() => setBanner(null), 2600); }

  function persistRecords(next) {
    setRecords(next);
    const store = loadStore();
    store[key] = next;
    saveStore(store);
  }

  function setStatus(id, status) {
    persistRecords({ ...records, [id]: { ...records[id], status } });
  }
  function setRemark(id, remark) {
    persistRecords({ ...records, [id]: { ...records[id], remark } });
  }
  function markAll(status) {
    const next = {};
    roster.forEach((s) => { next[s.id] = { ...records[s.id], status }; });
    persistRecords(next);
    flash(`Marked all students as ${status}.`);
  }

  /* ---------- stats ---------- */
  const stats = useMemo(() => {
    const vals = roster.map((s) => records[s.id]?.status || 'Present');
    const total = roster.length;
    const absent = vals.filter((v) => v === 'Absent').length;
    const present = vals.filter((v) => v === 'Present').length;
    const late = vals.filter((v) => v === 'Late').length;
    const rate = total ? (((present + late) / total) * 100).toFixed(1) : '0.0';
    return { total, absent, rate };
  }, [roster, records]);

  const excused = useMemo(
    () => roster.filter((s) => records[s.id]?.status === 'Sick').map((s) => ({ name: s.name, remark: records[s.id]?.remark || 'Excused' })),
    [roster, records]
  );

  /* ---------- pagination ---------- */
  const totalPages = Math.ceil(roster.length / PAGE_SIZE);
  const pageRows = roster.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* ---------- export ---------- */
  function exportCSV() {
    const header = ['Student ID', 'Name', 'Status', 'Remarks'];
    const lines = roster.map((s) => {
      const r = records[s.id] || {};
      return [s.id, s.name, r.status || 'Present', (r.remark || '').replace(/"/g, '""')];
    });
    const csv = [header, ...lines].map((row) => row.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${CLASSES.find((c) => c.id === classId)?.name.replace(/[^a-z0-9]/gi, '_')}_${date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    flash('Attendance report exported.');
  }

  function submitAttendance() {
    setSubmitState('saving');
    const store = loadStore();
    store[key] = records;
    store[`${key}_submitted`] = new Date().toISOString();
    saveStore(store);
    setTimeout(() => {
      setSubmitState('done');
      setTimeout(() => setSubmitState('idle'), 2200);
    }, 900);
  }

  const currentClass = CLASSES.find((c) => c.id === classId);

  /* ========================================================= */
  return (
    <div className="space-y-xl">
      {banner && (
        <div className="fixed top-20 right-8 z-[60] bg-primary text-on-primary px-lg py-md rounded-xl shadow-[0_12px_32px_rgba(0,6,102,0.35)] flex items-center gap-sm animate-fade-up">
          <Check size={18} /> <span className="font-label-md">{banner}</span>
        </div>
      )}

      {/* header */}
      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-end gap-lg">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight">Attendance Tracking</h1>
          <div className="flex items-center gap-md mt-sm flex-wrap text-on-surface-variant">
            <select
              value={classId}
              onChange={(e) => setClassId(Number(e.target.value))}
              className="bg-transparent font-medium text-on-surface border-none focus:ring-0 p-0 pr-6 cursor-pointer hover:text-primary"
            >
              {CLASSES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <span className="w-1 h-1 rounded-full bg-outline-variant" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent border-none focus:ring-0 p-0 text-on-surface-variant cursor-pointer hover:text-primary"
            />
            <span className="w-1 h-1 rounded-full bg-outline-variant" />
            <span>{currentClass?.session}</span>
          </div>
        </div>
        <div className="flex gap-md flex-wrap">
          <button onClick={exportCSV} className="px-lg py-sm rounded-xl border border-secondary text-secondary font-label-md hover:bg-secondary-container transition-all flex items-center gap-sm">
            <FileDown size={18} /> Export Report
          </button>
          <button onClick={() => flash('Generating school-year report…')} className="px-lg py-sm rounded-xl border border-secondary text-secondary font-label-md hover:bg-secondary-container transition-all flex items-center gap-sm">
            <BarChart3 size={18} /> School Year Report
          </button>
          <button
            onClick={submitAttendance}
            disabled={submitState !== 'idle'}
            className={`px-lg py-sm rounded-xl text-on-primary font-label-md shadow-sm transition-all flex items-center gap-sm disabled:opacity-90 ${
              submitState === 'done' ? 'bg-green-700' : 'bg-primary-container hover:opacity-90'
            }`}
          >
            {submitState === 'saving' ? (
              <><Clock size={18} className="animate-spin" /> Submitting…</>
            ) : submitState === 'done' ? (
              <><CheckCircle2 size={18} /> Submitted</>
            ) : (
              <><CheckCircle2 size={18} /> Submit Attendance</>
            )}
          </button>
        </div>
      </div>

      {/* bento summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-lg">
        <SummaryCard label="Total Students" value={stats.total} icon={<Users size={22} />} tone="primary" />
        <SummaryCard label="Present Rate" value={`${stats.rate}%`} icon={<TrendingUp size={22} />} tone="primary" />
        <SummaryCard label="Absentees" value={stats.absent} icon={<UserX size={22} />} tone="error" />
        <div className="card">
          <div className="flex items-center justify-between mb-md">
            <p className="font-label-sm text-on-surface-variant uppercase tracking-wider">Excused Absences</p>
            <Clock size={18} className="text-on-secondary-container" />
          </div>
          <div className="space-y-sm max-h-24 overflow-y-auto scrollbar-hide">
            {excused.length === 0 && <p className="text-body-sm text-on-surface-variant">No excused absences.</p>}
            {excused.map((e, i) => (
              <div key={i} className="flex justify-between items-center gap-md border-b border-outline-variant/30 last:border-0 pb-1">
                <p className="font-body-sm text-on-surface truncate">{e.name}</p>
                <p className="text-xs text-on-surface-variant truncate shrink-0">{e.remark}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* roster */}
      <div className="card !p-0 overflow-hidden">
        <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center gap-md flex-wrap">
          <h3 className="font-headline-sm text-headline-sm text-primary">Class Roster</h3>
          <div className="flex items-center gap-md">
            <span className="text-sm text-on-surface-variant">Mark all as:</span>
            <button onClick={() => markAll('Present')} className="px-md py-1 rounded-lg text-xs font-bold bg-surface-container-lowest border border-outline hover:bg-surface-container transition-colors">PRESENT</button>
            <button onClick={() => markAll('Absent')} className="px-md py-1 rounded-lg text-xs font-bold bg-surface-container-lowest border border-outline hover:bg-surface-container transition-colors">ABSENT</button>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[820px]">
            <thead>
              <tr className="bg-surface-container text-on-secondary-container border-b border-outline-variant">
                <th className="px-xl py-md font-label-sm uppercase tracking-wider">Student Name</th>
                <th className="px-xl py-md font-label-sm uppercase tracking-wider">Student ID</th>
                <th className="px-xl py-md font-label-sm uppercase tracking-wider">Last Week</th>
                <th className="px-xl py-md font-label-sm uppercase tracking-wider text-center">Status Toggle</th>
                <th className="px-xl py-md font-label-sm uppercase tracking-wider">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {pageRows.map((s, i) => {
                const rec = records[s.id] || { status: 'Present', remark: '' };
                return (
                  <tr key={s.id} className={`transition-colors hover:bg-surface ${i % 2 ? 'bg-tertiary/5' : ''}`}>
                    <td className="px-xl py-md">
                      <div className="flex items-center gap-md">
                        <span className={`w-10 h-10 rounded-full flex items-center justify-center text-label-sm font-bold shrink-0 ${toneFor(s.id)} ${rec.status === 'Absent' ? 'opacity-50' : ''}`}>{initials(s.name)}</span>
                        <div>
                          <p className="font-label-md text-on-surface">{s.name}</p>
                          <p className="text-xs text-on-surface-variant">{s.tag}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-xl py-md text-sm font-mono text-on-secondary-container">#{s.id}</td>
                    <td className="px-xl py-md">
                      <div className="flex gap-1">
                        {s.lastWeek.map((st, j) => (
                          <span key={j} className={`w-2 h-2 rounded-full ${DOT_COLOR[st]}`} title={st} />
                        ))}
                      </div>
                    </td>
                    <td className="px-xl py-md">
                      <div className="flex justify-center gap-1">
                        {STATUSES.map((st) => (
                          <button
                            key={st}
                            onClick={() => setStatus(s.id, st)}
                            className={`px-sm py-1.5 border rounded-lg text-xs font-bold transition-all ${
                              rec.status === st ? ACTIVE_BTN[st] : 'border-outline text-on-surface hover:bg-surface-container'
                            }`}
                          >
                            {st.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="px-xl py-md">
                      <input
                        type="text"
                        value={rec.remark}
                        onChange={(e) => setRemark(s.id, e.target.value)}
                        placeholder="Add note…"
                        className={`w-full min-w-[140px] bg-transparent border-b border-transparent focus:border-primary text-sm py-1 focus:ring-0 focus:outline-none ${rec.status === 'Absent' ? 'text-error' : 'text-on-surface'}`}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* footer / pagination */}
        <div className="px-xl py-md bg-surface-container-low border-t border-outline-variant flex justify-between items-center">
          <p className="text-sm text-on-surface-variant">
            Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, roster.length)} of {roster.length} students
          </p>
          <div className="flex gap-xs items-center">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container-lowest transition-colors disabled:opacity-40">
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                  p === page ? 'bg-primary text-on-primary' : 'border border-outline-variant hover:bg-surface-container-lowest'
                }`}
              >
                {p}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container-lowest transition-colors disabled:opacity-40">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- small component ---------------- */
function SummaryCard({ label, value, icon, tone }) {
  const valCls = tone === 'error' ? 'text-error' : 'text-primary';
  const iconBox = tone === 'error' ? 'bg-error/10 text-error' : 'bg-primary/5 text-primary';
  return (
    <div className="card flex items-center justify-between">
      <div>
        <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-sm">{label}</p>
        <p className={`font-headline-md text-headline-md font-bold ${valCls}`}>{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBox}`}>{icon}</div>
    </div>
  );
}
