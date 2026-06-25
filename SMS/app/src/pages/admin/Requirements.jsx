import { useState, useMemo } from 'react';
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
  CalendarClock,
  AlertTriangle,
  Target,
  ClipboardList,
} from 'lucide-react';

// ============================================================
// SEED DATA
// ============================================================

const DOC_TYPES = ['Transcript of Records', 'Birth Certificate (PSA)', 'Good Moral Character', 'Form 137 / SF10', 'Medical Certificate', 'Health Card'];
const GRADES = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
const STATUSES = ['Under Review', 'Submitted', 'Pending', 'Missing', 'Verified', 'Rejected'];

const STATUS_VARIANT = {
  'Under Review': 'warning',
  Submitted: 'primary',
  Pending: 'warning',
  Missing: 'error',
  Verified: 'success',
  Rejected: 'error',
};

const SEED = [
  { id: 1, student: 'Anderson, Lucas M.', grade: 'Grade 11', section: 'STEM', docType: 'Transcript of Records', status: 'Under Review', received: '2023-10-24' },
  { id: 2, student: 'Santiago, Clara J.', grade: 'Grade 9', section: 'Diamond', docType: 'Birth Certificate (PSA)', status: 'Submitted', received: '2023-10-22' },
  { id: 3, student: 'Bennett, Kevin O.', grade: 'Grade 12', section: 'HUMSS', docType: 'Good Moral Character', status: 'Pending', received: '—' },
  { id: 4, student: 'Mendoza, Valerie T.', grade: 'Grade 8', section: 'Marie', docType: 'Form 137 / SF10', status: 'Missing', received: '—' },
  { id: 5, student: 'Wong, Ethan S.', grade: 'Grade 10', section: 'Newton', docType: 'Medical Certificate', status: 'Submitted', received: '2023-10-26' },
  { id: 6, student: 'Reyes, Mia P.', grade: 'Grade 11', section: 'ABM', docType: 'Health Card', status: 'Under Review', received: '2023-10-20' },
  { id: 7, student: 'Cruz, Daniel R.', grade: 'Grade 9', section: 'Ruby', docType: 'Transcript of Records', status: 'Pending', received: '—' },
  { id: 8, student: 'Lim, Sophia A.', grade: 'Grade 12', section: 'STEM', docType: 'Good Moral Character', status: 'Submitted', received: '2023-10-19' },
  { id: 9, student: 'Tan, Marcus B.', grade: 'Grade 10', section: 'Faraday', docType: 'Birth Certificate (PSA)', status: 'Missing', received: '—' },
  { id: 10, student: 'Garcia, Lea M.', grade: 'Grade 11', section: 'STEM', docType: 'Medical Certificate', status: 'Under Review', received: '2023-10-23' },
  { id: 11, student: 'Park, Hana K.', grade: 'Grade 9', section: 'Emerald', docType: 'Health Card', status: 'Submitted', received: '2023-10-18' },
  { id: 12, student: 'Ocampo, Jose L.', grade: 'Grade 12', section: 'HUMSS', docType: 'Form 137 / SF10', status: 'Pending', received: '—' },
];

const DISTRIBUTION = [
  { label: 'Birth Cert.', value: 78 },
  { label: 'Transcript', value: 92 },
  { label: 'Good Moral', value: 64 },
  { label: 'Health Card', value: 55 },
];

const PAGE_SIZE = 10;
const EMPTY_FORM = { name: '', appliesTo: 'All Grade Levels', mandatory: 'Yes' };

const initials = (name) => {
  const parts = name.replace(',', '').split(' ').filter(Boolean);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
};

// ============================================================
// PAGE
// ============================================================

export const Requirements = () => {
  const [records, setRecords] = useState(SEED);
  const [filters, setFilters] = useState({ grade: '', status: '', type: '' });
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
          (!filters.type || r.docType === filters.type)
      ),
    [records, filters]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  const stats = useMemo(() => {
    const pending = records.filter((r) => ['Pending', 'Under Review', 'Submitted'].includes(r.status)).length;
    const overdue = records.filter((r) => r.status === 'Missing').length;
    const verified = records.filter((r) => r.status === 'Verified').length;
    const completion = records.length ? Math.round((verified / records.length) * 100) : 0;
    return { total: 2482, pending, overdue, completion: completion || 84.5 };
  }, [records]);

  const setStatus = (id, status) => setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

  const setFilter = (key) => (e) => {
    setFilters((f) => ({ ...f, [key]: e.target.value }));
    setPage(1);
  };

  const addType = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setFormErrors({ name: 'Requirement name is required' });
      return;
    }
    // New requirement type seeds one queued record for demonstration.
    const nextId = records.reduce((max, r) => Math.max(max, r.id), 0) + 1;
    setRecords((prev) => [
      { id: nextId, student: 'New Applicant', grade: 'Grade 9', section: '—', docType: form.name, status: 'Pending', received: '—' },
      ...prev,
    ]);
    setModalOpen(false);
  };

  const exportCSV = () => {
    const headers = ['Student', 'Grade', 'Document Type', 'Status', 'Date Received'];
    const rows = filtered.map((r) =>
      [r.student, r.grade, r.docType, r.status, r.received].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `requirements-${new Date().toISOString().slice(0, 10)}.csv`;
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
          <h1 className="font-headline-xl text-headline-xl text-primary mb-xs">Student Requirements</h1>
          <p className="font-body-md text-on-surface-variant">Verification queue for Academic Year 2024-2025</p>
        </div>
        <div className="flex items-center gap-sm">
          <Button variant="secondary" onClick={exportCSV} className="flex items-center gap-sm"><Download size={18} /> Export Data</Button>
          <Button onClick={() => { setForm(EMPTY_FORM); setFormErrors({}); setModalOpen(true); }} className="flex items-center gap-sm"><Plus size={18} /> New Requirement Type</Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
        <StatCard icon={ClipboardList} label="Total Requirements" value={stats.total.toLocaleString()} note="+4% vs last month" noteClass="text-green-700" />
        <StatCard icon={CalendarClock} label="Pending Verifications" value={stats.pending} note="High Priority" noteClass="text-yellow-700" />
        <StatCard icon={AlertTriangle} label="Overdue Documents" value={stats.overdue} note="Attention Needed" noteClass="text-error" />
        <StatCard icon={Target} label="Completion Rate" value={`${stats.completion}%`} note="Target: 90%" />
      </div>

      {/* Table */}
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
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select className="input-field !w-auto" value={filters.type} onChange={setFilter('type')}>
                <option value="">Requirement Type</option>
                {DOC_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <p className="font-body-sm text-primary">
              Showing {filtered.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + PAGE_SIZE, filtered.length)} of {filtered.length} pending
            </p>
          </div>

          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Student Name</TableHeader>
                <TableHeader>Document Type</TableHeader>
                <TableHeader>Submission Status</TableHeader>
                <TableHeader>Date Received</TableHeader>
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
                  <TableCell>{r.docType}</TableCell>
                  <TableCell><Badge variant={STATUS_VARIANT[r.status] || 'secondary'}>{r.status}</Badge></TableCell>
                  <TableCell>{fmtDate(r.received)}</TableCell>
                  <TableCell align="right">
                    <div className="flex items-center justify-end gap-xs">
                      <button onClick={() => setStatus(r.id, 'Verified')} title="Approve" className="p-xs rounded text-green-700 hover:bg-green-100 transition-colors"><Check size={16} /></button>
                      <button onClick={() => setStatus(r.id, 'Rejected')} title="Reject" className="p-xs rounded text-error hover:bg-error/10 transition-colors"><X size={16} /></button>
                      <button title="View" className="p-xs rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"><Eye size={16} /></button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filtered.length === 0 && <p className="text-center py-xl text-on-surface-variant font-body-md">No requirements match your filters.</p>}

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

      {/* Distribution + quick guide */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <Card className="lg:col-span-2">
          <h2 className="font-headline-sm text-headline-sm text-primary mb-lg">Requirements Distribution</h2>
          <div className="flex items-end justify-between gap-md h-44">
            {DISTRIBUTION.map((d) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-sm h-full justify-end">
                <span className="text-label-sm text-on-surface-variant">{d.value}%</span>
                <div className="w-full max-w-[56px] rounded-t neon-bar" style={{ height: `${d.value}%`, background: 'linear-gradient(180deg,#818cf8,#4338ca)' }} />
                <span className="text-label-sm text-on-surface-variant text-center">{d.label}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-tertiary text-on-tertiary">
          <h3 className="font-headline-sm text-headline-sm mb-lg">Quick Guide</h3>
          <ul className="space-y-md font-body-sm text-on-tertiary-container">
            <li>• Ensure all Birth Certificates are verified against the National PSA Registry.</li>
            <li>• Approved documents are automatically synced with the student's main directory profile.</li>
            <li>• Need help? Contact the Registrar Tech Support at ext. 402.</li>
          </ul>
          <button className="w-full mt-lg bg-primary-container text-on-primary-container py-sm rounded-lg font-label-md text-label-md active:scale-95 transition-transform">
            View Documentation
          </button>
        </Card>
      </div>

      {/* New requirement type modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New Requirement Type"
        actions={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={addType}>Add Requirement</Button>
          </>
        }
      >
        <form onSubmit={addType} className="space-y-xs">
          <Input label="Requirement Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} error={formErrors.name} placeholder="Vaccination Card" />
          <div className="grid grid-cols-2 gap-md">
            <div className="mb-lg">
              <label className="font-label-md text-label-md text-on-surface mb-sm block">Applies To</label>
              <select className="input-field" value={form.appliesTo} onChange={(e) => setForm((f) => ({ ...f, appliesTo: e.target.value }))}>
                <option>All Grade Levels</option>
                {GRADES.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="mb-lg">
              <label className="font-label-md text-label-md text-on-surface mb-sm block">Mandatory</label>
              <select className="input-field" value={form.mandatory} onChange={(e) => setForm((f) => ({ ...f, mandatory: e.target.value }))}>
                <option>Yes</option>
                <option>No</option>
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

export default Requirements;
