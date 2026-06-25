import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Input } from '../../components/ui';
import {
  Plus, MoreVertical, Clock, MapPin, Filter, Calculator, FlaskConical,
  Landmark, BookOpen, CalendarDays, Download, TrendingUp, Check,
  Edit2, Archive, Trash2, RotateCcw, BarChart3,
} from 'lucide-react';

const STORAGE_KEY = 'sms_classes_v1';
const ICONS = { Calculator, FlaskConical, Landmark, BookOpen };

/* ---------------- seed + persistence ---------------- */
function seedClasses() {
  return [
    { id: 1, name: 'Physics 12-A: Quantum Mechanics', dept: 'Science', badge: 'bg-primary/10 text-primary', schedule: 'Mon, Wed, Fri • 09:00 AM', room: 'Lab 402', students: 28, capacity: 30, attendance: 92, pending: 4, avg: 84.5, trend: '+2.1%', semester: 'Spring 2024', status: 'Active' },
    { id: 2, name: 'Biology 10-B', dept: 'Science', badge: 'bg-error-container text-on-error-container', subtitle: 'Genetics & Evolution Focus', room: 'Room 210', students: 24, capacity: 28, attendance: 88, pending: 2, avg: 81, semester: 'Spring 2024', status: 'Active' },
    { id: 3, name: 'Advanced Calculus', dept: 'Mathematics', badge: 'bg-secondary-container text-on-secondary-fixed-variant', subtitle: 'Section 12-C • Room 301', room: 'Room 301', icon: 'Calculator', students: 15, capacity: 20, attendance: 85, pending: 3, avg: 79, metricLabel: 'Average Grade', metricKind: 'avg', semester: 'Spring 2024', status: 'Active' },
    { id: 4, name: 'AP Chemistry', dept: 'Science', badge: 'bg-secondary-container text-on-secondary-fixed-variant', subtitle: 'Section 11-A • Lab 102', room: 'Lab 102', icon: 'FlaskConical', students: 22, capacity: 24, attendance: 95, pending: 1, avg: 90, metricLabel: 'Attendance', metricKind: 'attendance', nextExam: 'Friday', semester: 'Spring 2024', status: 'Active' },
    { id: 5, name: 'World History 9-A', dept: 'Humanities', badge: 'bg-secondary-container text-on-secondary-fixed-variant', subtitle: 'Section 9-A • Room 118', room: 'Room 118', icon: 'Landmark', students: 31, capacity: 34, attendance: 89, pending: 1, avg: 82, metricLabel: 'Average Grade', metricKind: 'avg', semester: 'Spring 2024', status: 'Active' },
    { id: 6, name: 'English Literature 11-B', dept: 'Humanities', badge: 'bg-secondary-container text-on-secondary-fixed-variant', subtitle: 'Section 11-B • Room 204', room: 'Room 204', icon: 'BookOpen', students: 22, capacity: 26, attendance: 90, pending: 1, avg: 86, metricLabel: 'Attendance', metricKind: 'attendance', semester: 'Spring 2024', status: 'Active' },
    { id: 7, name: 'Physics 11-B (2023)', dept: 'Science', badge: 'bg-secondary-container text-on-secondary-fixed-variant', subtitle: 'Section 11-B • Lab 402', room: 'Lab 402', icon: 'FlaskConical', students: 26, capacity: 30, attendance: 87, pending: 0, avg: 80, metricLabel: 'Average Grade', metricKind: 'avg', semester: 'Fall 2023', status: 'Archived' },
  ];
}
function loadClasses() {
  try { const r = localStorage.getItem(STORAGE_KEY); if (!r) { const s = seedClasses(); localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); return s; } return JSON.parse(r); } catch { return seedClasses(); }
}
function persist(list) { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }

const EMPTY = { name: '', dept: 'Science', schedule: '', room: '', capacity: 28, semester: 'Spring 2024' };

/* ========================================================= */
export default function TeacherClasses() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState(loadClasses);
  const [view, setView] = useState('Active');        // Active | Archived
  const [semester, setSemester] = useState('Spring 2024');
  const [dept, setDept] = useState('All Departments');
  const [menuId, setMenuId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [banner, setBanner] = useState(null);
  const menuRef = useRef(null);

  // create / edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => persist(classes), [classes]);
  useEffect(() => {
    const onClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuId(null); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function flash(msg) { setBanner(msg); setTimeout(() => setBanner(null), 2600); }

  const visible = useMemo(() => classes.filter((c) =>
    c.status === view &&
    (semester === 'All' || c.semester === semester) &&
    (dept === 'All Departments' || c.dept === dept)
  ), [classes, view, semester, dept]);

  const totals = useMemo(() => {
    const active = classes.filter((c) => c.status === 'Active');
    const students = active.reduce((s, c) => s + (c.students || 0), 0);
    const att = active.length ? (active.reduce((s, c) => s + (c.attendance || 0), 0) / active.length).toFixed(1) : '0';
    const pending = active.reduce((s, c) => s + (c.pending || 0), 0);
    return { count: active.length, students, att, pending };
  }, [classes]);

  /* ---------- actions ---------- */
  function openCreate() { setEditingId(null); setForm(EMPTY); setModalOpen(true); }
  function openEdit(c) {
    setEditingId(c.id);
    setForm({ name: c.name, dept: c.dept, schedule: c.schedule || c.subtitle || '', room: c.room || '', capacity: c.capacity || 28, semester: c.semester });
    setModalOpen(true);
    setMenuId(null);
  }
  function save() {
    if (!form.name.trim()) { flash('Please enter a class name.'); return; }
    if (editingId) {
      setClasses((p) => p.map((c) => c.id === editingId ? { ...c, name: form.name, dept: form.dept, room: form.room, capacity: Number(form.capacity), semester: form.semester, subtitle: form.schedule } : c));
      flash('Class updated.');
    } else {
      const id = Math.max(0, ...classes.map((c) => c.id)) + 1;
      setClasses((p) => [...p, {
        id, name: form.name.trim(), dept: form.dept, badge: 'bg-secondary-container text-on-secondary-fixed-variant',
        subtitle: form.schedule || `${form.room}`, room: form.room, icon: 'BookOpen',
        students: 0, capacity: Number(form.capacity) || 28, attendance: 100, pending: 0, avg: 0,
        metricLabel: 'Average Grade', metricKind: 'avg', semester: form.semester, status: 'Active',
      }]);
      flash('Class created.');
    }
    setModalOpen(false);
  }
  function toggleArchive(c) {
    setClasses((p) => p.map((x) => x.id === c.id ? { ...x, status: x.status === 'Active' ? 'Archived' : 'Active' } : x));
    setMenuId(null);
    flash(c.status === 'Active' ? 'Class archived.' : 'Class restored.');
  }
  function remove(c) {
    if (window.confirm(`Delete "${c.name}"?`)) { setClasses((p) => p.filter((x) => x.id !== c.id)); setMenuId(null); flash('Class deleted.'); }
  }

  function downloadReport() {
    const active = classes.filter((c) => c.status === 'Active');
    const rows = active.map((c) => `<tr><td>${c.name}</td><td>${c.dept}</td><td style="text-align:center">${c.students}/${c.capacity}</td><td style="text-align:center">${c.attendance}%</td><td style="text-align:center">${c.avg}%</td><td style="text-align:center">${c.pending}</td></tr>`).join('');
    const html = `<!doctype html><html><head><title>Semester Performance Report</title>
      <style>body{font-family:Inter,Arial,sans-serif;color:#111d23;padding:40px}h1{color:#000666}
      table{width:100%;border-collapse:collapse;margin-top:16px}th,td{border:1px solid #c6c5d4;padding:8px;text-align:left;font-size:13px}
      th{background:#e3f0f8;text-transform:uppercase;font-size:11px}.sum{margin-top:24px;color:#454652}</style></head>
      <body><h1>Bridges Academy — Semester Performance Report</h1>
      <p>${semester} · Generated ${new Date().toLocaleString()}</p>
      <table><thead><tr><th>Class</th><th>Department</th><th>Students</th><th>Attendance</th><th>Avg Grade</th><th>Pending</th></tr></thead>
      <tbody>${rows}</tbody></table>
      <div class="sum"><p>Total students managed: <b>${totals.students}</b> across ${totals.count} classes</p>
      <p>Overall average attendance: <b>${totals.att}%</b> · Pending gradings: <b>${totals.pending}</b></p></div>
      <script>window.onload=function(){window.print()}<\/script></body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); flash('Opening report — use “Save as PDF”.'); }
    else flash('Please allow pop-ups to download the report.');
  }

  /* ---------- card menu ---------- */
  function CardMenu({ c }) {
    return (
      <div className="relative" ref={menuId === c.id ? menuRef : null}>
        <button onClick={(e) => { e.stopPropagation(); setMenuId(menuId === c.id ? null : c.id); }} className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded-lg">
          <MoreVertical size={20} />
        </button>
        {menuId === c.id && (
          <div onClick={(e) => e.stopPropagation()} className="absolute right-0 mt-1 w-44 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_12px_32px_rgba(0,6,102,0.18)] z-30 overflow-hidden">
            <MenuItem icon={<Edit2 size={16} />} onClick={() => openEdit(c)}>Edit details</MenuItem>
            <MenuItem icon={c.status === 'Active' ? <Archive size={16} /> : <RotateCcw size={16} />} onClick={() => toggleArchive(c)}>{c.status === 'Active' ? 'Archive' : 'Restore'}</MenuItem>
            <MenuItem icon={<Trash2 size={16} />} danger onClick={() => remove(c)}>Delete</MenuItem>
          </div>
        )}
      </div>
    );
  }

  /* ========================================================= */
  return (
    <div className="space-y-xl">
      {banner && (
        <div className="fixed top-20 right-8 z-[70] bg-primary text-on-primary px-lg py-md rounded-xl shadow-[0_12px_32px_rgba(0,6,102,0.35)] flex items-center gap-sm animate-fade-up">
          <Check size={18} /> <span className="font-label-md">{banner}</span>
        </div>
      )}

      {/* header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-lg">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-primary">My Classes</h1>
          <p className="text-body-md text-on-surface-variant mt-xs">Manage your curriculum and monitor student performance across {semester} Semester.</p>
        </div>
        <div className="flex gap-md items-center">
          <div className="flex items-center bg-surface-container-high border border-outline-variant rounded-xl p-1">
            {['Active', 'Archived'].map((v) => (
              <button key={v} onClick={() => setView(v)} className={`px-lg py-sm font-label-md rounded-lg transition-all ${view === v ? 'text-primary bg-surface shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}>{v}</button>
            ))}
          </div>
          <Button onClick={openCreate} icon={<Plus size={18} />}>Add New Class</Button>
        </div>
      </div>

      {/* filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-md bg-surface-container-low p-md rounded-xl border border-outline-variant">
        <div className="flex items-center gap-lg">
          <label className="flex flex-col">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Semester</span>
            <select value={semester} onChange={(e) => setSemester(e.target.value)} className="bg-transparent border-none font-label-md text-primary focus:ring-0 p-0 cursor-pointer">
              <option>Spring 2024</option><option>Fall 2023</option><option>Summer 2023</option>
            </select>
          </label>
          <div className="h-8 w-px bg-outline-variant" />
          <label className="flex flex-col">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Department</span>
            <select value={dept} onChange={(e) => setDept(e.target.value)} className="bg-transparent border-none font-label-md text-primary focus:ring-0 p-0 cursor-pointer">
              <option>All Departments</option><option>Science</option><option>Mathematics</option><option>Humanities</option>
            </select>
          </label>
        </div>
        <div className="flex items-center gap-sm text-on-surface-variant text-label-sm">
          <Filter size={16} /> Showing {visible.length} {view} Classes
        </div>
      </div>

      {/* bento grid */}
      <div className="grid grid-cols-12 gap-gutter">
        {visible.length === 0 && <div className="col-span-12 card text-center py-xxl text-on-surface-variant">No {view.toLowerCase()} classes match these filters.</div>}
        {visible.map((c, i) => {
          if (i === 0) return <FeatureCard key={c.id} c={c} onOpen={() => setDetail(c)} menu={<CardMenu c={c} />} navigate={navigate} />;
          if (i === 1) return <SquareCard key={c.id} c={c} onOpen={() => setDetail(c)} menu={<CardMenu c={c} />} />;
          return <WideCard key={c.id} c={c} onOpen={() => setDetail(c)} menu={<CardMenu c={c} />} />;
        })}
      </div>

      {/* bottom quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter">
        <QuickStat label="Total Students Managed" value={totals.students} sub={`Across ${totals.count} classes`} />
        <QuickStat label="Overall Average Attendance" value={`${totals.att}%`} sub="Institutional Goal: 85%" />
        <QuickStat label="Pending Gradings" value={totals.pending} sub="Due within 48 hours" error />
        <div className="bg-primary p-lg rounded-2xl flex flex-col justify-center text-center text-on-primary">
          <p className="text-white/80 font-label-sm">Download Full Semester Performance Report</p>
          <button onClick={downloadReport} className="mt-sm text-white font-bold font-label-md underline decoration-2 underline-offset-4 inline-flex items-center justify-center gap-sm">
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>

      {/* create / edit modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Class' : 'Add New Class'}
        actions={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={save}>{editingId ? 'Save Changes' : 'Create Class'}</Button></>}
      >
        <div className="space-y-xs">
          <Input label="Class Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Physics 12-A: Quantum Mechanics" />
          <div className="grid grid-cols-2 gap-md">
            <div className="mb-lg">
              <label className="font-label-md text-label-md text-on-surface mb-sm block">Department</label>
              <select className="input-field" value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })}>
                <option>Science</option><option>Mathematics</option><option>Humanities</option>
              </select>
            </div>
            <div className="mb-lg">
              <label className="font-label-md text-label-md text-on-surface mb-sm block">Semester</label>
              <select className="input-field" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })}>
                <option>Spring 2024</option><option>Fall 2023</option><option>Summer 2023</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-md">
            <Input label="Schedule" value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} placeholder="Mon, Wed, Fri • 09:00 AM" />
            <Input label="Room" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} placeholder="Lab 402" />
          </div>
          <Input label="Capacity" type="number" min="1" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
        </div>
      </Modal>

      {/* detail modal */}
      <Modal isOpen={!!detail} onClose={() => setDetail(null)} title={detail?.name || ''}
        actions={<>
          <Button variant="secondary" onClick={() => { setDetail(null); navigate('/teacher/grading'); }} icon={<BarChart3 size={16} />}>Grading</Button>
          <Button onClick={() => { setDetail(null); navigate('/teacher/attendance'); }}>Attendance</Button>
        </>}>
        {detail && (
          <div className="space-y-lg">
            <span className={`inline-block px-3 py-1 rounded-full font-label-sm ${detail.badge}`}>{detail.dept} Dept.</span>
            <p className="text-body-sm text-on-surface-variant">{detail.subtitle || detail.schedule} · {detail.room}</p>
            <div className="grid grid-cols-2 gap-lg">
              <DetailStat label="Students" value={`${detail.students}/${detail.capacity}`} />
              <DetailStat label="Attendance" value={`${detail.attendance}%`} />
              <DetailStat label="Class Average" value={`${detail.avg}%`} />
              <DetailStat label="Pending Grading" value={detail.pending} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ---------------- card variants ---------------- */
function FeatureCard({ c, onOpen, menu }) {
  return (
    <div onClick={onOpen} className="col-span-12 lg:col-span-8 relative overflow-hidden card cursor-pointer hover:border-secondary transition-colors">
      <div className="flex justify-between items-start gap-md">
        <div className="space-y-sm">
          <span className={`inline-block px-3 py-1 rounded-full font-label-sm ${c.badge}`}>{c.dept} Dept.</span>
          <h3 className="font-headline-md text-headline-md text-primary">{c.name}</h3>
          <div className="flex items-center gap-lg text-on-surface-variant text-body-sm mt-xs flex-wrap">
            {c.schedule && <span className="flex items-center gap-1"><Clock size={16} /> {c.schedule}</span>}
            <span className="flex items-center gap-1"><MapPin size={16} /> {c.room}</span>
          </div>
        </div>
        <div className="bg-surface-container text-primary p-md rounded-xl flex flex-col items-center justify-center shrink-0">
          <span className="font-headline-sm font-bold">{c.attendance}%</span>
          <span className="text-[10px] font-bold uppercase text-on-surface-variant">Avg. Attendance</span>
        </div>
      </div>
      <div className="mt-xl grid grid-cols-3 gap-gutter border-t border-surface-container pt-lg">
        <Metric label="Total Students" value={`${c.students} / ${c.capacity}`} />
        <Metric label="Assignments Pending" value={String(c.pending).padStart(2, '0')} />
        <div>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Class Average</p>
          <div className="flex items-baseline gap-2">
            <p className="font-headline-sm text-primary">{c.avg}%</p>
            {c.trend && <span className="text-on-secondary-container font-label-sm flex items-center gap-0.5"><TrendingUp size={12} /> {c.trend}</span>}
          </div>
        </div>
      </div>
      <TrendingUp size={240} className="absolute -right-12 -bottom-12 opacity-[0.03] pointer-events-none" />
    </div>
  );
}

function SquareCard({ c, onOpen, menu }) {
  return (
    <div onClick={onOpen} className="col-span-12 lg:col-span-4 card cursor-pointer hover:border-secondary transition-colors flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-md">
          <span className={`inline-block px-3 py-1 rounded-full font-label-sm ${c.badge}`}>{c.dept} Dept.</span>
          {menu}
        </div>
        <h3 className="font-headline-sm text-headline-sm text-primary mb-1">{c.name}</h3>
        <p className="text-body-sm text-on-surface-variant">{c.subtitle}</p>
      </div>
      <div className="space-y-md mt-lg">
        <div className="flex justify-between items-end">
          <div><p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Attendance</p><p className="font-headline-sm text-primary">{c.attendance}%</p></div>
          <div className="text-right"><p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Students</p><p className="font-headline-sm text-primary">{c.students}</p></div>
        </div>
        <div className="w-full bg-surface-container rounded-full h-1.5"><div className="bg-primary h-1.5 rounded-full" style={{ width: `${c.attendance}%` }} /></div>
      </div>
    </div>
  );
}

function WideCard({ c, onOpen, menu }) {
  const Icon = ICONS[c.icon] || BookOpen;
  const metricValue = c.metricKind === 'attendance' ? `${c.attendance}%` : `${c.avg}%`;
  return (
    <div onClick={onOpen} className="col-span-12 lg:col-span-6 card cursor-pointer hover:border-secondary transition-colors flex items-center gap-lg">
      <div className="h-20 w-20 bg-primary-container/10 rounded-xl flex items-center justify-center text-primary shrink-0"><Icon size={36} /></div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-md">
          <div className="min-w-0">
            <h3 className="font-headline-sm text-headline-sm text-primary truncate">{c.name}</h3>
            <p className="text-body-sm text-on-surface-variant truncate">{c.subtitle}</p>
          </div>
          <div className="text-right shrink-0 flex items-start gap-sm">
            <div>
              <p className="font-headline-sm text-primary">{metricValue}</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{c.metricLabel}</p>
            </div>
            {menu}
          </div>
        </div>
        <div className="flex gap-md mt-md items-center">
          {c.nextExam ? (
            <span className="bg-surface-container text-on-secondary-container px-3 py-1 rounded-lg font-label-sm flex items-center gap-1"><CalendarDays size={14} /> Next Exam: {c.nextExam}</span>
          ) : (
            <>
              <div className="flex -space-x-2">
                <span className="w-6 h-6 rounded-full bg-primary ring-2 ring-white" />
                <span className="w-6 h-6 rounded-full bg-secondary ring-2 ring-white" />
                <span className="w-6 h-6 rounded-full bg-on-primary-container ring-2 ring-white" />
                <span className="w-6 h-6 rounded-full bg-surface-container-highest ring-2 ring-white flex items-center justify-center text-[8px] font-bold">+{Math.max(0, c.students - 3)}</span>
              </div>
              <p className="font-label-sm text-on-surface-variant">{c.students} students total</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- small bits ---------------- */
function Metric({ label, value }) {
  return (<div><p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">{label}</p><p className="font-headline-sm text-primary">{value}</p></div>);
}
function QuickStat({ label, value, sub, error }) {
  return (
    <div className="bg-surface-container p-lg rounded-2xl border border-outline-variant">
      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-sm">{label}</p>
      <h4 className={`font-headline-md text-headline-md ${error ? 'text-error' : 'text-primary'}`}>{value}</h4>
      <p className="text-label-sm text-on-secondary-container mt-1">{sub}</p>
    </div>
  );
}
function DetailStat({ label, value }) {
  return (<div className="bg-surface-container rounded-xl p-md"><p className="font-label-sm text-on-surface-variant uppercase mb-xs">{label}</p><p className="font-headline-sm text-primary">{value}</p></div>);
}
function MenuItem({ icon, children, onClick, danger }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-sm w-full text-left px-md py-sm text-label-md transition-colors ${danger ? 'text-error hover:bg-error-container' : 'text-on-surface hover:bg-surface-container'}`}>
      {icon} {children}
    </button>
  );
}
