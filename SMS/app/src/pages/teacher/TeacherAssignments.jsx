import { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Button, Input, Textarea } from '../../components/ui';
import {
  Plus, ChevronDown, ClipboardCheck, Clock, TrendingUp, AlertCircle,
  Eye, Upload, Star, Edit2, Trash2, BarChart3,
  Archive, Calendar, Users, Sparkles, RotateCcw, Check,
} from 'lucide-react';

const STORAGE_KEY = 'sms_assignments_v1';
const CLASSES = ['Physics 12-A', 'Applied Calculus', 'Grade 10 Mathematics', 'Astro-Biology'];

/* ---------------- seed + persistence ---------------- */
function seedAssignments() {
  return [
    { id: 1, title: 'Quantum Mechanics Problem Set #4', description: "Complex wave functions and Schrödinger's equation fundamentals.", class: 'Physics 12-A', dueDate: '2026-06-30', status: 'Published', submissions: 24, total: 32, averageScore: 86 },
    { id: 2, title: 'Differential Equation Modeling Project', description: 'Real-world application of derivatives in civil engineering contexts.', class: 'Applied Calculus', dueDate: '', status: 'Draft', submissions: 0, total: 28, averageScore: 0 },
    { id: 3, title: 'Midterm Reflection Paper', description: 'Summarizing laboratory findings from the kinetic energy experiments.', class: 'Physics 12-A', dueDate: '2026-06-12', status: 'Published', submissions: 30, total: 32, averageScore: 81 },
    { id: 4, title: 'Algebra Problem Set Chapter 5', description: 'Quadratic equations, factoring, and graphing parabolas.', class: 'Grade 10 Mathematics', dueDate: '2026-07-02', status: 'Published', submissions: 18, total: 28, averageScore: 84 },
    { id: 5, title: 'Quiz 1 — Derivatives', description: 'Short assessment covering power, product, and chain rules.', class: 'Applied Calculus', dueDate: '2026-06-18', status: 'Archived', submissions: 23, total: 24, averageScore: 88 },
  ];
}

function loadAssignments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) { const s = seedAssignments(); localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); return s; }
    return JSON.parse(raw);
  } catch { return seedAssignments(); }
}
function persist(list) { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }

/* ---------------- helpers ---------------- */
const TODAY = new Date('2026-06-26');
function fmtDate(d) {
  if (!d) return 'Not set';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function isPastDue(a) {
  return a.status === 'Published' && a.dueDate && new Date(a.dueDate + 'T00:00:00') < TODAY && a.submissions < a.total;
}
function initials(name = '') {
  return name.replace(/\(.*?\)/g, '').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

const RECENT_SEED = [
  { id: 1, name: 'Ethan Sterling', work: 'Quantum Mechanics #4', when: '2 mins ago', flag: 'new', color: 'bg-primary text-on-primary' },
  { id: 2, name: 'Sienna Thorne', work: 'Quantum Mechanics #4', when: '14 mins ago', flag: 'new', color: 'bg-secondary text-white' },
  { id: 3, name: 'Marcus Aurelius Jr.', work: 'Midterm Reflection', when: 'Just now', flag: 'late', color: 'bg-error text-on-error' },
  { id: 4, name: 'Luna Lovegood', work: 'Differential Equation Modeling', when: '1 hour ago', flag: 'new', color: 'bg-tertiary text-white' },
];

const EMPTY_FORM = { title: '', description: '', class: '', dueDate: '', total: 28 };

/* ========================================================= */
export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState(loadAssignments);
  const [tab, setTab] = useState('all');            // all | drafts | archived
  const [classFilter, setClassFilter] = useState('');
  const [sortDue, setSortDue] = useState(false);
  const [recent] = useState(RECENT_SEED);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [banner, setBanner] = useState(null);

  // create / edit modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  // submissions modal
  const [viewing, setViewing] = useState(null);

  // disciplinary dropdown
  const [discOpen, setDiscOpen] = useState(false);
  const discRef = useRef(null);

  useEffect(() => persist(assignments), [assignments]);

  useEffect(() => {
    const onClick = (e) => { if (discRef.current && !discRef.current.contains(e.target)) setDiscOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function flash(msg) { setBanner(msg); setTimeout(() => setBanner(null), 2600); }

  /* ---------- stats ---------- */
  const stats = useMemo(() => {
    const active = assignments.filter((a) => a.status === 'Published');
    const pendingGrading = active.reduce((s, a) => s + a.submissions, 0);
    const graded = assignments.filter((a) => a.averageScore > 0);
    const avg = graded.length ? Math.round(graded.reduce((s, a) => s + a.averageScore, 0) / graded.length) : 0;
    const missing = assignments.filter(isPastDue).reduce((s, a) => s + (a.total - a.submissions), 0);
    return { active: active.length, pendingGrading, avg, missing };
  }, [assignments]);

  /* ---------- filtered list ---------- */
  const visible = useMemo(() => {
    let list = assignments.filter((a) => {
      if (tab === 'drafts') return a.status === 'Draft';
      if (tab === 'archived') return a.status === 'Archived';
      return a.status !== 'Archived';            // "All" hides archived
    });
    if (classFilter) list = list.filter((a) => a.class === classFilter);
    if (sortDue) list = [...list].sort((a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999'));
    return list;
  }, [assignments, tab, classFilter, sortDue]);

  /* ---------- actions ---------- */
  function openCreate() { setEditingId(null); setForm(EMPTY_FORM); setModalOpen(true); }
  function openEdit(a) {
    setEditingId(a.id);
    setForm({ title: a.title, description: a.description, class: a.class, dueDate: a.dueDate, total: a.total });
    setModalOpen(true);
  }
  function saveAssignment(status) {
    if (!form.title.trim() || !form.class) { flash('Please add a title and select a class.'); return; }
    if (editingId) {
      setAssignments((prev) => prev.map((a) => a.id === editingId ? { ...a, ...form, total: Number(form.total) || a.total } : a));
      flash('Assignment updated.');
    } else {
      const id = Math.max(0, ...assignments.map((a) => a.id)) + 1;
      setAssignments((prev) => [
        { id, title: form.title.trim(), description: form.description.trim(), class: form.class, dueDate: form.dueDate, status, submissions: 0, total: Number(form.total) || 28, averageScore: 0 },
        ...prev,
      ]);
      flash(status === 'Published' ? 'Assignment published.' : 'Draft saved.');
    }
    setModalOpen(false);
  }
  function publish(id) { setAssignments((p) => p.map((a) => a.id === id ? { ...a, status: 'Published' } : a)); flash('Assignment published.'); }
  function archive(id) { setAssignments((p) => p.map((a) => a.id === id ? { ...a, status: 'Archived' } : a)); flash('Assignment archived.'); }
  function restore(id) { setAssignments((p) => p.map((a) => a.id === id ? { ...a, status: 'Published' } : a)); flash('Assignment restored.'); }
  function remove(id) { if (window.confirm('Delete this assignment? This cannot be undone.')) { setAssignments((p) => p.filter((a) => a.id !== id)); flash('Assignment deleted.'); } }

  const disciplinaryOptions = ['Verbal Warning', 'Detention', 'Community Service', 'Counseling Referral', 'Parent Conference'];

  /* ========================================================= */
  return (
    <div className="space-y-xl">
      {/* toast */}
      {banner && (
        <div className="fixed top-20 right-8 z-[60] bg-primary text-on-primary px-lg py-md rounded-xl shadow-[0_12px_32px_rgba(0,6,102,0.35)] flex items-center gap-sm animate-fade-up">
          <Check size={18} /> <span className="font-label-md">{banner}</span>
        </div>
      )}

      {/* header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-lg">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight">Assignments</h1>
          <p className="text-body-md text-on-surface-variant mt-xs">Manage, track, and grade student submissions across all your active courses.</p>
        </div>
        <div className="flex items-center gap-md">
          <Button onClick={openCreate} icon={<Plus size={18} />}>Create New Assignment</Button>
          <div className="relative" ref={discRef}>
            <Button variant="tertiary" onClick={() => setDiscOpen((s) => !s)} icon={<ChevronDown size={18} />} iconPosition="right">
              Disciplinary Action
            </Button>
            {discOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_12px_32px_rgba(0,6,102,0.18)] z-50 overflow-hidden animate-fade-up">
                {disciplinaryOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setDiscOpen(false); flash(`Logged disciplinary action: ${opt}.`); }}
                    className="block w-full text-left px-lg py-sm text-label-md text-on-surface hover:bg-surface-container transition-colors"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* stats bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-gutter">
        <StatCard label="Active Assignments" value={stats.active} icon={<ClipboardCheck size={22} />} tone="primary" />
        <StatCard label="Pending Grading" value={stats.pendingGrading} icon={<Clock size={22} />} tone="secondary" />
        <StatCard label="Average Score" value={`${stats.avg}%`} icon={<TrendingUp size={22} />} tone="tertiary" />
        <StatCard label="Missing Work" value={String(stats.missing).padStart(2, '0')} icon={<AlertCircle size={22} />} tone="error" />
      </div>

      {/* main grid */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* list column */}
        <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-gutter">
          {/* filter bar */}
          <div className="card !p-md flex flex-wrap items-center gap-md">
            <div className="flex-1 flex gap-xs overflow-x-auto scrollbar-hide">
              {[['all', 'All Assignments'], ['drafts', 'Drafts'], ['archived', 'Archived']].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`px-md py-sm rounded-lg text-label-md whitespace-nowrap transition-colors ${
                    tab === key ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="h-6 w-px bg-outline-variant hidden md:block" />
            <div className="flex items-center gap-md">
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant rounded-lg text-label-md px-md py-sm focus:outline-none focus:border-primary"
              >
                <option value="">All Classes</option>
                {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <button
                onClick={() => setSortDue((s) => !s)}
                className={`flex items-center gap-sm border px-md py-sm rounded-lg text-label-md transition-all ${
                  sortDue ? 'border-primary text-primary bg-primary-fixed' : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <Calendar size={16} /> Due Date
              </button>
            </div>
          </div>

          {/* cards */}
          <div className="space-y-md">
            {visible.length === 0 && (
              <div className="card text-center py-xxl text-on-surface-variant">No assignments in this view.</div>
            )}
            {visible.map((a) => {
              const past = isPastDue(a);
              const pct = a.total ? Math.round((a.submissions / a.total) * 100) : 0;
              const barColor = a.status === 'Draft' ? 'bg-outline-variant' : past ? 'bg-error' : 'bg-primary';
              const statusBadge = a.status === 'Draft'
                ? { text: 'Draft', cls: 'bg-surface-container-high text-on-surface-variant' }
                : a.status === 'Archived'
                ? { text: 'Archived', cls: 'bg-surface-container-high text-on-surface-variant' }
                : past
                ? { text: 'Past Due', cls: 'bg-error-container text-error' }
                : { text: 'Published', cls: 'bg-primary-fixed text-primary' };

              return (
                <div key={a.id} className="card hover:border-secondary/60 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center gap-lg">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-sm mb-sm flex-wrap">
                        <span className="bg-secondary-container text-on-secondary-fixed-variant text-[10px] uppercase font-bold px-2 py-0.5 rounded">{a.class}</span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${statusBadge.cls}`}>{statusBadge.text}</span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-primary mb-1">{a.title}</h3>
                      <p className="text-body-sm text-on-surface-variant">{a.description}</p>

                      <div className="mt-lg grid grid-cols-2 md:grid-cols-4 gap-md items-center">
                        <div className="flex items-center gap-sm">
                          <Clock size={16} className={past ? 'text-error' : 'text-outline'} />
                          <span className={`text-label-md ${past ? 'text-error font-bold' : a.dueDate ? '' : 'italic text-on-surface-variant'}`}>{fmtDate(a.dueDate)}</span>
                        </div>
                        <div className="flex items-center gap-sm">
                          <Users size={16} className="text-outline" />
                          <span className="text-label-md">{a.total} Students</span>
                        </div>
                        <div className="col-span-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-label-sm text-on-surface-variant">Submission Progress</span>
                            <span className={`text-label-sm font-bold ${past ? 'text-error' : 'text-primary'}`}>{a.submissions} / {a.total}</span>
                          </div>
                          <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                            <div className={`h-full ${barColor} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* actions */}
                    <div className="flex flex-row md:flex-col gap-sm shrink-0 border-t md:border-t-0 md:border-l border-outline-variant pt-md md:pt-0 md:pl-lg">
                      {a.status === 'Draft' ? (
                        <button onClick={() => publish(a.id)} className="flex-1 flex items-center justify-center gap-sm px-lg py-sm text-primary border border-primary rounded-lg font-bold hover:bg-primary-fixed transition-colors text-label-md whitespace-nowrap">
                          <Upload size={16} /> Publish
                        </button>
                      ) : a.status === 'Archived' ? (
                        <button onClick={() => restore(a.id)} className="flex-1 flex items-center justify-center gap-sm px-lg py-sm text-primary border border-primary rounded-lg font-bold hover:bg-primary-fixed transition-colors text-label-md whitespace-nowrap">
                          <RotateCcw size={16} /> Restore
                        </button>
                      ) : past ? (
                        <button onClick={() => setViewing(a)} className="flex-1 flex items-center justify-center gap-sm px-lg py-sm bg-primary text-on-primary rounded-lg font-bold hover:opacity-90 transition-all text-label-md whitespace-nowrap">
                          <Star size={16} /> Grade Now
                        </button>
                      ) : (
                        <button onClick={() => setViewing(a)} className="flex-1 flex items-center justify-center gap-sm px-lg py-sm text-primary border border-primary rounded-lg font-bold hover:bg-primary-fixed transition-colors text-label-md whitespace-nowrap">
                          <Eye size={16} /> Submissions
                        </button>
                      )}
                      <div className="flex gap-xs justify-center">
                        <IconBtn title="Edit" onClick={() => openEdit(a)}><Edit2 size={18} /></IconBtn>
                        {a.status === 'Draft' ? (
                          <IconBtn title="Delete" danger onClick={() => remove(a.id)}><Trash2 size={18} /></IconBtn>
                        ) : a.status === 'Archived' ? (
                          <IconBtn title="Delete" danger onClick={() => remove(a.id)}><Trash2 size={18} /></IconBtn>
                        ) : (
                          <>
                            <IconBtn title="Analytics" onClick={() => flash(`Average score for "${a.title}": ${a.averageScore || 0}%`)}><BarChart3 size={18} /></IconBtn>
                            <IconBtn title="Archive" onClick={() => archive(a.id)}><Archive size={18} /></IconBtn>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* right sidebar */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-gutter">
          <div className="card !p-0 overflow-hidden">
            <div className="p-md border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-headline-sm text-headline-sm text-primary">Recent Submissions</h3>
              <span className="bg-primary text-on-primary text-[10px] px-2 py-0.5 rounded-full">New</span>
            </div>
            <div className="divide-y divide-outline-variant/60">
              {recent.map((r) => (
                <button key={r.id} onClick={() => flash(`Opening ${r.name}'s submission for ${r.work}…`)} className="w-full text-left p-md hover:bg-surface-container transition-colors group">
                  <div className="flex items-center gap-md">
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center text-label-sm font-bold shrink-0 ${r.color}`}>{initials(r.name)}</span>
                    <div className="min-w-0">
                      <p className={`font-label-md truncate ${r.flag === 'late' ? 'text-error' : 'text-primary'}`}>{r.name}</p>
                      <p className="text-[11px] text-on-surface-variant truncate">{r.work}</p>
                    </div>
                  </div>
                  <div className="mt-sm flex justify-between items-center">
                    {r.flag === 'late'
                      ? <span className="text-label-sm font-bold text-error flex items-center gap-1"><AlertCircle size={14} /> LATE</span>
                      : <span className="text-label-sm text-on-surface-variant">{r.when}</span>}
                    <span className="text-label-sm font-bold text-secondary group-hover:underline">Review</span>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => flash('Loading all submissions…')} className="w-full p-md text-center text-label-md text-primary font-bold hover:bg-surface-container-high transition-colors">
              View All Submissions
            </button>
          </div>

          {/* AI card */}
          <div className="bg-primary-container p-lg rounded-2xl text-on-primary">
            <h4 className="font-headline-sm text-[16px] mb-sm flex items-center gap-sm"><Sparkles size={18} /> AI Grading Assistant</h4>
            <p className="text-body-sm opacity-90 mb-md">
              {aiEnabled
                ? 'Assistant is active. New submissions are pre-scanned for common errors before you grade.'
                : `You have ${stats.pendingGrading} pending submissions. Would you like to use the AI assistant to pre-scan for common errors?`}
            </p>
            <button
              onClick={() => { setAiEnabled((v) => !v); flash(aiEnabled ? 'AI assistant disabled.' : 'AI assistant enabled.'); }}
              className="w-full py-sm bg-surface-container-lowest text-primary rounded-lg font-bold text-label-md hover:brightness-105 transition-all flex items-center justify-center gap-sm"
            >
              {aiEnabled ? <><Check size={16} /> Assistant Enabled</> : 'Enable Assistant'}
            </button>
          </div>
        </div>
      </div>

      {/* create / edit modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Assignment' : 'Create New Assignment'}
        actions={
          editingId ? (
            <>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={() => saveAssignment('Published')}>Save Changes</Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={() => saveAssignment('Draft')}>Save as Draft</Button>
              <Button onClick={() => saveAssignment('Published')} icon={<Upload size={16} />}>Publish</Button>
            </>
          )
        }
      >
        <div className="space-y-xs">
          <Input label="Assignment Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g., Quantum Mechanics Problem Set #5" />
          <Textarea label="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What should students do?" />
          <div className="grid grid-cols-2 gap-md">
            <div className="mb-lg">
              <label className="font-label-md text-label-md text-on-surface mb-sm block">Class</label>
              <select className="input-field" value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })}>
                <option value="">Select class</option>
                {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <Input label="Due Date" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </div>
          <Input label="Number of Students" type="number" min="1" value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })} />
        </div>
      </Modal>

      {/* submissions modal */}
      <Modal isOpen={!!viewing} onClose={() => setViewing(null)} title={viewing ? `Submissions · ${viewing.title}` : ''}
        actions={<Button variant="secondary" onClick={() => setViewing(null)}>Close</Button>}>
        {viewing && (
          <div className="space-y-md">
            <div className="flex items-center justify-between text-label-md">
              <span className="text-on-surface-variant">{viewing.class}</span>
              <span className="font-bold text-primary">{viewing.submissions} / {viewing.total} submitted</span>
            </div>
            <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${Math.round((viewing.submissions / viewing.total) * 100)}%` }} />
            </div>
            <div className="divide-y divide-outline-variant/60 -mx-2">
              {recent.slice(0, 3).map((r) => (
                <div key={r.id} className="flex items-center justify-between px-2 py-sm">
                  <div className="flex items-center gap-md">
                    <span className={`w-9 h-9 rounded-full flex items-center justify-center text-label-sm font-bold ${r.color}`}>{initials(r.name)}</span>
                    <div>
                      <p className="font-label-md text-on-surface">{r.name}</p>
                      <p className="text-[11px] text-on-surface-variant">{r.flag === 'late' ? 'Submitted late' : `Submitted ${r.when}`}</p>
                    </div>
                  </div>
                  <button onClick={() => flash(`Grading ${r.name}…`)} className="text-label-md font-bold text-secondary hover:underline">Grade</button>
                </div>
              ))}
            </div>
            <p className="text-label-sm text-on-surface-variant text-center pt-sm">
              {viewing.total - viewing.submissions} student{viewing.total - viewing.submissions === 1 ? '' : 's'} have not submitted yet.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ---------------- small components ---------------- */
function StatCard({ label, value, icon, tone }) {
  const tones = {
    primary: { box: 'bg-primary-fixed text-primary', val: 'text-primary' },
    secondary: { box: 'bg-secondary-container text-secondary', val: 'text-primary' },
    tertiary: { box: 'bg-tertiary-fixed text-tertiary', val: 'text-primary' },
    error: { box: 'bg-error-container text-error', val: 'text-error' },
  }[tone];
  return (
    <div className="card flex items-start justify-between">
      <div>
        <p className="text-label-md text-on-surface-variant uppercase tracking-wider">{label}</p>
        <h3 className={`font-headline-md text-headline-md font-bold mt-sm ${tones.val}`}>{value}</h3>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tones.box}`}>{icon}</div>
    </div>
  );
}

function IconBtn({ children, title, onClick, danger }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`p-2 rounded-lg transition-all ${danger ? 'text-error hover:bg-error-container' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'}`}
    >
      {children}
    </button>
  );
}
