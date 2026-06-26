import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  Badge,
  Input,
  Button,
  Modal,
  Counter,
} from '../../components/ui';
import {
  Download,
  Plus,
  Check,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  Stethoscope,
  Cross,
  Activity,
  Pill,
  AlertTriangle,
} from 'lucide-react';

// ============================================================
// SEED DATA
// ============================================================

const GRADES = ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
const REASONS = ['Fever', 'Headache', 'Injury', 'Stomach Ache', 'Allergy', 'Routine Checkup', 'Vaccination'];
const SEVERITIES = ['Mild', 'Moderate', 'Severe'];
const VISIT_STATUSES = ['Under Observation', 'Medication Given', 'Referred', 'Resolved'];

const STATUS_VARIANT = {
  'Under Observation': 'warning',
  'Medication Given': 'info',
  Referred: 'error',
  Resolved: 'success',
};

const SEED = [
  { id: 1, student: 'Anderson, Lucas M.', grade: 'Grade 11', section: 'STEM', reason: 'Fever', severity: 'Moderate', status: 'Under Observation', date: '2024-10-26', nurse: 'Nurse Ramos' },
  { id: 2, student: 'Santiago, Clara J.', grade: 'Grade 9', section: 'Diamond', reason: 'Headache', severity: 'Mild', status: 'Medication Given', date: '2024-10-26', nurse: 'Nurse Cruz' },
  { id: 3, student: 'Bennett, Kevin O.', grade: 'Grade 12', section: 'HUMSS', reason: 'Injury', severity: 'Severe', status: 'Referred', date: '2024-10-25', nurse: 'Nurse Ramos' },
  { id: 4, student: 'Mendoza, Valerie T.', grade: 'Grade 8', section: 'Marie', reason: 'Allergy', severity: 'Moderate', status: 'Resolved', date: '2024-10-25', nurse: 'Nurse Cruz' },
  { id: 5, student: 'Wong, Ethan S.', grade: 'Grade 10', section: 'Newton', reason: 'Stomach Ache', severity: 'Mild', status: 'Medication Given', date: '2024-10-24', nurse: 'Nurse Ramos' },
  { id: 6, student: 'Reyes, Mia P.', grade: 'Grade 11', section: 'ABM', reason: 'Routine Checkup', severity: 'Mild', status: 'Resolved', date: '2024-10-24', nurse: 'Nurse Cruz' },
  { id: 7, student: 'Cruz, Daniel R.', grade: 'Grade 9', section: 'Ruby', reason: 'Fever', severity: 'Moderate', status: 'Under Observation', date: '2024-10-23', nurse: 'Nurse Ramos' },
  { id: 8, student: 'Lim, Sophia A.', grade: 'Grade 12', section: 'STEM', reason: 'Vaccination', severity: 'Mild', status: 'Resolved', date: '2024-10-23', nurse: 'Nurse Cruz' },
  { id: 9, student: 'Tan, Marcus B.', grade: 'Grade 10', section: 'Faraday', reason: 'Injury', severity: 'Moderate', status: 'Medication Given', date: '2024-10-22', nurse: 'Nurse Ramos' },
  { id: 10, student: 'Garcia, Lea M.', grade: 'Grade 11', section: 'STEM', reason: 'Headache', severity: 'Mild', status: 'Resolved', date: '2024-10-22', nurse: 'Nurse Cruz' },
  { id: 11, student: 'Park, Hana K.', grade: 'Grade 9', section: 'Emerald', reason: 'Allergy', severity: 'Severe', status: 'Referred', date: '2024-10-21', nurse: 'Nurse Ramos' },
  { id: 12, student: 'Ocampo, Jose L.', grade: 'Grade 12', section: 'HUMSS', reason: 'Stomach Ache', severity: 'Mild', status: 'Resolved', date: '2024-10-21', nurse: 'Nurse Cruz' },
];

const INVENTORY = [
  { item: 'Paracetamol 500mg', stock: 120, min: 50 },
  { item: 'Ibuprofen 200mg', stock: 32, min: 40 },
  { item: 'Antiseptic Solution', stock: 18, min: 20 },
  { item: 'Adhesive Bandages', stock: 240, min: 100 },
  { item: 'Oral Rehydration Salts', stock: 60, min: 30 },
];

const PAGE_SIZE = 8;
const EMPTY_FORM = { student: '', grade: 'Grade 7', section: '', reason: 'Fever', severity: 'Mild' };

const initials = (name) => {
  const parts = name.replace(',', '').split(' ').filter(Boolean);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
};

const today = () => new Date().toISOString().slice(0, 10);

// ============================================================
// PAGE
// ============================================================

export const Medical = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState(SEED);
  const [filters, setFilters] = useState({ grade: '', status: '', reason: '' });
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});

  const filtered = useMemo(
    () =>
      records.filter(
        (r) =>
          (!filters.grade || r.grade === filters.grade) &&
          (!filters.status || r.status === filters.status) &&
          (!filters.reason || r.reason === filters.reason)
      ),
    [records, filters]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  const stats = useMemo(() => {
    const total = records.length;
    const observation = records.filter((r) => r.status === 'Under Observation').length;
    const referred = records.filter((r) => r.status === 'Referred').length;
    const resolved = records.filter((r) => r.status === 'Resolved').length;
    const clearance = total ? Math.round((resolved / total) * 100) : 0;
    return { total, observation, referred, clearance };
  }, [records]);

  const setStatus = (id, status) => setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

  const setFilter = (key) => (e) => {
    setFilters((f) => ({ ...f, [key]: e.target.value }));
    setPage(1);
  };

  const addVisit = (e) => {
    e.preventDefault();
    if (!form.student.trim()) {
      setFormErrors({ student: 'Student name is required' });
      return;
    }
    const nextId = records.reduce((max, r) => Math.max(max, r.id), 0) + 1;
    setRecords((prev) => [
      {
        id: nextId,
        student: form.student.trim(),
        grade: form.grade,
        section: form.section.trim() || '—',
        reason: form.reason,
        severity: form.severity,
        status: 'Under Observation',
        date: today(),
        nurse: 'Nurse on Duty',
      },
      ...prev,
    ]);
    setModalOpen(false);
    setPage(1);
  };

  const exportCSV = () => {
    const headers = ['Student', 'Grade', 'Section', 'Reason', 'Severity', 'Status', 'Date', 'Attending'];
    const rows = filtered.map((r) =>
      [r.student, r.grade, r.section, r.reason, r.severity, r.status, r.date, r.nurse]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clinic-visits-${today()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const fmtDate = (d) => (d === '—' ? '—' : new Date(`${d}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }));
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------
  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-md mb-xl">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-primary mb-xs">Medical & Clinic</h1>
          <p className="font-body-md text-on-surface-variant">Clinic visit log and health records for Academic Year 2024-2025</p>
        </div>
        <div className="flex items-center gap-sm">
          <Button variant="secondary" onClick={exportCSV} className="flex items-center gap-sm"><Download size={18} /> Export Data</Button>
          <Button onClick={() => { setForm(EMPTY_FORM); setFormErrors({}); setModalOpen(true); }} className="flex items-center gap-sm"><Plus size={18} /> New Clinic Visit</Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
        <StatCard icon={Stethoscope} label="Total Clinic Visits" value={stats.total} note="This academic year" />
        <StatCard icon={Activity} label="Under Observation" value={stats.observation} note="Currently monitored" noteClass="text-yellow-700" />
        <StatCard icon={Cross} label="Referred to Hospital" value={stats.referred} note="Attention needed" noteClass="text-error" />
        <StatCard icon={HeartPulse} label="Resolved Rate" value={`${stats.clearance}%`} note="Cases closed" noteClass="text-green-700" />
      </div>

      {/* Visit log table */}
      <Card className="mb-lg">
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-md mb-lg">
            <div className="flex flex-wrap items-center gap-sm">
              <select className="input-field !w-auto" value={filters.grade} onChange={setFilter('grade')}>
                <option value="">All Grade Levels</option>
                {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
              <select className="input-field !w-auto" value={filters.status} onChange={setFilter('status')}>
                <option value="">All Statuses</option>
                {VISIT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select className="input-field !w-auto" value={filters.reason} onChange={setFilter('reason')}>
                <option value="">All Reasons</option>
                {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <p className="font-body-sm text-primary">
              Showing {filtered.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + PAGE_SIZE, filtered.length)} of {filtered.length} visits
            </p>
          </div>

          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Student</TableHeader>
                <TableHeader>Reason</TableHeader>
                <TableHeader>Severity</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader align="right">Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="flex items-center gap-md">
                      <span className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-label-sm font-label-md shrink-0">{initials(r.student)}</span>
                      <div>
                        <p className="font-label-md text-on-surface">{r.student}</p>
                        <p className="text-body-sm text-on-surface-variant">{r.grade} • {r.section}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{r.reason}</TableCell>
                  <TableCell>
                    <Badge variant={r.severity === 'Severe' ? 'error' : r.severity === 'Moderate' ? 'warning' : 'secondary'}>{r.severity}</Badge>
                  </TableCell>
                  <TableCell><Badge variant={STATUS_VARIANT[r.status] || 'secondary'}>{r.status}</Badge></TableCell>
                  <TableCell>{fmtDate(r.date)}</TableCell>
                  <TableCell align="right">
                    <div className="flex items-center justify-end gap-xs">
                      <button onClick={() => setStatus(r.id, 'Resolved')} title="Mark Resolved" className="p-xs rounded text-green-700 hover:bg-green-100 transition-colors"><Check size={16} /></button>
                      <button onClick={() => setStatus(r.id, 'Referred')} title="Refer to Hospital" className="p-xs rounded text-error hover:bg-error/10 transition-colors"><Cross size={16} /></button>
                      <button title="View Record" className="p-xs rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"><Eye size={16} /></button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filtered.length === 0 && <p className="text-center py-xl text-on-surface-variant font-body-md">No clinic visits match your filters.</p>}

          {filtered.length > 0 && (
            <div className="flex items-center justify-end gap-xs pt-lg mt-lg border-t border-surface-variant">
              <button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}
                className="flex items-center gap-xs h-9 px-md rounded-lg border border-outline-variant font-label-md text-label-md hover:bg-surface-container disabled:opacity-40 transition-colors">
                <ChevronLeft size={16} /> Previous
              </button>
              {pageNumbers.map((n, i) =>
                n === '...' ? <span key={`g-${i}`} className="px-sm text-on-surface-variant">…</span> : (
                  <button key={n} onClick={() => setPage(n)}
                    className={`min-w-9 h-9 px-sm rounded-lg font-label-md text-label-md transition-colors ${n === currentPage ? 'bg-primary text-on-primary' : 'border border-outline-variant text-on-surface hover:bg-surface-container'}`}>
                    {n}
                  </button>
                )
              )}
              <button disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}
                className="flex items-center gap-xs h-9 px-md rounded-lg border border-outline-variant font-label-md text-label-md hover:bg-surface-container disabled:opacity-40 transition-colors">
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inventory + quick guide */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-lg">
            <h2 className="font-headline-sm text-headline-sm text-primary">Medicine Inventory</h2>
            <button onClick={() => navigate('/admin/medical/inventory')} className="flex items-center gap-xs text-primary font-label-md text-label-md hover:underline">
              Manage Inventory <ChevronRight size={16} />
            </button>
          </div>
          <div className="space-y-md">
            {INVENTORY.map((m) => {
              const low = m.stock <= m.min;
              const pct = Math.min(100, Math.round((m.stock / (m.min * 2)) * 100));
              return (
                <div key={m.item}>
                  <div className="flex items-center justify-between mb-xs">
                    <span className="flex items-center gap-sm font-label-md text-label-md text-on-surface">
                      <Pill size={16} className="text-primary" /> {m.item}
                    </span>
                    <span className="flex items-center gap-sm">
                      <span className="font-body-sm text-on-surface-variant">{m.stock} in stock</span>
                      {low && <Badge variant="error" icon={<AlertTriangle size={12} />}>Low</Badge>}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-variant overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: low ? 'linear-gradient(90deg,#f87171,#dc2626)' : 'linear-gradient(90deg,#818cf8,#4338ca)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="bg-tertiary text-on-tertiary">
          <h3 className="font-headline-sm text-headline-sm mb-lg">Clinic Guidelines</h3>
          <ul className="space-y-md font-body-sm text-on-tertiary-container">
            <li>• Severe cases must be referred and parents/guardians notified immediately.</li>
            <li>• Record vitals for every fever or injury visit before dispensing medication.</li>
            <li>• Restock any medicine that falls below its minimum threshold within 48 hours.</li>
            <li>• For emergencies, contact the School Physician at ext. 119.</li>
          </ul>
          <button className="w-full mt-lg bg-primary-container text-on-primary-container py-sm rounded-lg font-label-md text-label-md active:scale-95 transition-transform">
            View Health Protocols
          </button>
        </Card>
      </div>

      {/* New clinic visit modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New Clinic Visit"
        actions={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={addVisit}>Log Visit</Button>
          </>
        }
      >
        <form onSubmit={addVisit} className="space-y-xs">
          <Input label="Student Name" value={form.student} onChange={(e) => setForm((f) => ({ ...f, student: e.target.value }))} error={formErrors.student} placeholder="Dela Cruz, Juan" />
          <div className="grid grid-cols-2 gap-md">
            <div className="mb-lg">
              <label className="font-label-md text-label-md text-on-surface mb-sm block">Grade Level</label>
              <select className="input-field" value={form.grade} onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))}>
                {GRADES.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
            <Input label="Section" value={form.section} onChange={(e) => setForm((f) => ({ ...f, section: e.target.value }))} placeholder="STEM" />
          </div>
          <div className="grid grid-cols-2 gap-md">
            <div className="mb-lg">
              <label className="font-label-md text-label-md text-on-surface mb-sm block">Reason for Visit</label>
              <select className="input-field" value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}>
                {REASONS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="mb-lg">
              <label className="font-label-md text-label-md text-on-surface mb-sm block">Severity</label>
              <select className="input-field" value={form.severity} onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value }))}>
                {SEVERITIES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// ============================================================
// SUB-COMPONENTS
// ============================================================

const StatCard = ({ icon: Icon, label, value, note, noteClass = 'text-on-surface-variant' }) => (
  <Card>
    <div className="flex items-start justify-between mb-md">
      <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wide">{label}</p>
      <Icon size={18} className="text-outline" />
    </div>
    <p className="font-headline-lg text-headline-lg text-primary"><Counter value={value} /></p>
    <p className={`font-body-sm mt-xs ${noteClass}`}>{note}</p>
  </Card>
);

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
}

export default Medical;
