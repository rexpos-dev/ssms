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
import { SlidersHorizontal, FilePlus2, FileText, Download, Eye } from 'lucide-react';

// ============================================================
// SEED DATA
// ============================================================

const ACADEMIC_BARS = [
  { label: 'Grade 9', base: 70, top: 18 },
  { label: 'Grade 10', base: 74, top: 16 },
  { label: 'Grade 11', base: 80, top: 14 },
  { label: 'Grade 12', base: 83, top: 12 },
  { label: 'AP Scholars', base: 88, top: 10 },
];

const FINANCIAL_BARS = [
  { label: 'Tuition Revenue', value: '$2.4M', pct: 95, color: 'bg-primary' },
  { label: 'Scholarship Fund', value: '$420K', pct: 35, color: 'bg-secondary' },
  { label: 'Operational Costs', value: '$1.1M', pct: 60, color: 'bg-error' },
];

const SEED_REPORTS = [
  { id: 1, name: 'Q2 Enrollment Statistics', department: 'Admissions', date: '2023-10-24', type: 'Academic' },
  { id: 2, name: 'Faculty Performance Audit', department: 'Academic Affairs', date: '2023-10-21', type: 'Academic' },
  { id: 3, name: 'End-of-Year Financial Summary', department: 'Finance', date: '2023-10-15', type: 'Financial' },
  { id: 4, name: 'Scholarship Disbursement', department: 'Finance', date: '2023-09-30', type: 'Financial' },
  { id: 5, name: 'Curriculum Review', department: 'Academic Affairs', date: '2023-09-12', type: 'Academic' },
];

const PROJECTIONS = [
  { phase: 'Phase 1', value: 350, label: 'Early Applications' },
  { phase: 'Phase 2', value: 580, label: 'Standard Admissions' },
  { phase: 'Phase 3', value: 120, label: 'Late Waitlist' },
];

const TEACHER_REPORTS = [
  { id: 1, name: 'Dr. Ana Thorne', department: 'Mathematics', subject: 'Advanced Calculus', status: 'Completed', date: '2023-10-26' },
  { id: 2, name: 'Prof. Elena Vance', department: 'Science', subject: 'Molecular Biology', status: 'Completed', date: '2023-10-25' },
  { id: 3, name: 'Ms. Sarah Jenkins', department: 'English', subject: 'World Literature', status: 'Completed', date: '2023-10-25' },
  { id: 4, name: 'Mr. Julian Ross', department: 'Arts', subject: 'Visual Design', status: 'Pending', date: '—' },
];

const REPORT_TABS = ['All', 'Academic', 'Financial'];
const EMPTY_FORM = { name: '', department: 'Admissions', type: 'Academic' };

const initials = (name) => name.replace(/^(Dr|Prof|Ms|Mr)\.\s*/, '').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

// ============================================================
// PAGE
// ============================================================

export const Reports = () => {
  const [reports, setReports] = useState(SEED_REPORTS);
  const [tab, setTab] = useState('All');
  const [perfView, setPerfView] = useState('trends'); // trends | department
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});

  const totalTarget = PROJECTIONS.reduce((s, p) => s + p.value, 0);

  const filteredReports = useMemo(
    () => (tab === 'All' ? reports : reports.filter((r) => r.type === tab)),
    [reports, tab]
  );

  const generateReport = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setFormErrors({ name: 'Report name is required' });
      return;
    }
    const nextId = reports.reduce((max, r) => Math.max(max, r.id), 0) + 1;
    setReports((prev) => [{ ...form, id: nextId, date: new Date().toISOString().slice(0, 10) }, ...prev]);
    setModalOpen(false);
  };

  const downloadReport = (report) => {
    const content = `BRIDGES ACADEMY REPORT\n\nName: ${report.name}\nDepartment: ${report.department}\nType: ${report.type}\nGenerated: ${report.date}\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.name.replace(/\s+/g, '-').toLowerCase()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const fmtDate = (d) => (d === '—' ? '—' : new Date(`${d}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }));

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------
  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-md mb-xl">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-primary mb-xs">Institutional Reports Hub</h1>
          <p className="font-body-md text-on-surface-variant">
            Real-time academic, financial, and operational insights for Bridges Academy.
          </p>
        </div>
        <div className="flex items-center gap-sm">
          <Button variant="secondary" className="flex items-center gap-sm">
            <SlidersHorizontal size={18} /> Filter Views
          </Button>
          <Button onClick={() => { setForm(EMPTY_FORM); setFormErrors({}); setModalOpen(true); }} className="flex items-center gap-sm">
            <FilePlus2 size={18} /> Generate Custom Report
          </Button>
        </div>
      </div>

      {/* Academic performance + enrollment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg mb-lg">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-lg">
            <h2 className="font-headline-sm text-headline-sm text-primary">Academic Performance</h2>
            <div className="inline-flex rounded-lg border border-outline-variant overflow-hidden text-label-sm">
              {[['trends', 'GPA Trends'], ['department', 'By Department']].map(([key, label]) => (
                <button key={key} onClick={() => setPerfView(key)}
                  className={`px-md py-xs transition-colors ${perfView === key ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <BarChart bars={ACADEMIC_BARS} />
        </Card>

        <Card className="bg-primary text-on-primary">
          <p className="font-label-md text-label-sm uppercase tracking-wide opacity-80 mb-xs">Active Enrollment</p>
          <p className="font-headline-lg text-headline-lg mb-lg"><Counter value="1,248" /></p>
          <div className="space-y-sm">
            {[['Full Enrolled', '1,156'], ['Partial Scholars', '312'], ['Regular Students', '780']].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between border-b border-on-primary/15 pb-sm">
                <span className="font-body-sm opacity-80">{k}</span>
                <span className="font-label-md text-body-md">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-lg">
            <p className="font-label-md text-label-sm uppercase tracking-wide opacity-80 mb-xs">Faculty Ratio</p>
            <p className="font-headline-md text-headline-md">14:1</p>
            <p className="font-body-sm opacity-70 mt-xs">Maintaining institutional standard</p>
          </div>
        </Card>
      </div>

      {/* Financials snapshot + recent reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg mb-lg">
        <Card>
          <div className="flex items-center justify-between mb-lg">
            <h2 className="font-headline-sm text-headline-sm text-primary">Financials</h2>
            <button className="text-primary font-label-md text-label-md hover:underline">View Ledger</button>
          </div>
          <div className="space-y-lg">
            {FINANCIAL_BARS.map((b) => (
              <div key={b.label}>
                <div className="flex items-center justify-between mb-xs">
                  <span className="font-body-sm text-on-surface">{b.label}</span>
                  <span className="font-label-md text-body-sm text-on-surface">{b.value}</span>
                </div>
                <div className="h-1.5 rounded-full bg-surface-variant overflow-hidden">
                  <div className={`h-full rounded-full ${b.color}`} style={{ width: `${b.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="font-body-sm text-on-surface-variant mt-lg">Budget allocation is pending for 120 departments.</p>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent>
            <div className="flex flex-wrap items-center justify-between gap-md mb-lg">
              <h2 className="font-headline-sm text-headline-sm text-primary">Recent Reports</h2>
              <div className="inline-flex rounded-lg border border-outline-variant overflow-hidden text-label-sm">
                {REPORT_TABS.map((t) => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`px-md py-xs transition-colors ${tab === t ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Report Name</TableHeader>
                  <TableHeader>Department</TableHeader>
                  <TableHeader>Date Generated</TableHeader>
                  <TableHeader align="right">Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReports.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <span className="flex items-center gap-sm font-label-md text-on-surface">
                        <FileText size={16} className="text-primary shrink-0" /> {r.name}
                      </span>
                    </TableCell>
                    <TableCell>{r.department}</TableCell>
                    <TableCell>{fmtDate(r.date)}</TableCell>
                    <TableCell align="right">
                      <div className="flex items-center justify-end gap-sm">
                        <button onClick={() => downloadReport(r)} title="Download" className="p-xs rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors">
                          <Download size={16} />
                        </button>
                        <button title="View" className="p-xs rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors">
                          <Eye size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="text-center mt-md">
              <button className="text-primary font-label-md text-label-md hover:underline">View Archive</button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrollment growth projections */}
      <Card className="mb-lg">
        <div className="flex flex-wrap items-center justify-between gap-md mb-lg">
          <h2 className="font-headline-sm text-headline-sm text-primary">Enrollment Growth Projections</h2>
          <Badge variant="success">Confidence Level: 92%</Badge>
        </div>
        <p className="font-body-sm text-on-surface-variant mb-lg">Forecasted student intake for the 2024-2025 academic year.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-lg mb-lg">
          {PROJECTIONS.map((p) => (
            <div key={p.phase}>
              <p className="font-label-md text-label-sm text-on-surface-variant uppercase">{p.phase}</p>
              <p className="font-headline-md text-headline-md text-primary">{p.value}</p>
              <p className="font-body-sm text-on-surface-variant">{p.label}</p>
            </div>
          ))}
          <div>
            <p className="font-label-md text-label-sm text-on-surface-variant uppercase">Total</p>
            <p className="font-headline-md text-headline-md text-primary">{totalTarget.toLocaleString()}</p>
            <p className="font-body-sm text-on-surface-variant">Expected Target</p>
          </div>
        </div>
        <div className="flex h-3 rounded-full overflow-hidden bg-surface-variant">
          {PROJECTIONS.map((p, i) => (
            <div key={p.phase} className={i === 0 ? 'bg-primary' : i === 1 ? 'bg-secondary' : 'bg-tertiary-fixed-dim'} style={{ width: `${(p.value / totalTarget) * 100}%` }} />
          ))}
        </div>
      </Card>

      {/* Teacher report completions */}
      <Card>
        <CardContent>
          <h2 className="font-headline-sm text-headline-sm text-primary mb-lg">Teachers Report Completions</h2>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Teacher Name</TableHeader>
                <TableHeader>Department</TableHeader>
                <TableHeader>Subject</TableHeader>
                <TableHeader>Submission Status</TableHeader>
                <TableHeader align="right">Completion Date</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {TEACHER_REPORTS.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <span className="flex items-center gap-md">
                      <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-label-sm font-label-md shrink-0">{initials(t.name)}</span>
                      <span className="font-label-md text-on-surface">{t.name}</span>
                    </span>
                  </TableCell>
                  <TableCell>{t.department}</TableCell>
                  <TableCell>{t.subject}</TableCell>
                  <TableCell><Badge variant={t.status === 'Completed' ? 'success' : 'warning'}>{t.status}</Badge></TableCell>
                  <TableCell align="right">{fmtDate(t.date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Generate report modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Generate Custom Report"
        actions={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={generateReport}>Generate</Button>
          </>
        }
      >
        <form onSubmit={generateReport} className="space-y-xs">
          <Input label="Report Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} error={formErrors.name} placeholder="Q3 Enrollment Statistics" />
          <div className="grid grid-cols-2 gap-md">
            <div className="mb-lg">
              <label className="font-label-md text-label-md text-on-surface mb-sm block">Department</label>
              <select className="input-field" value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}>
                {['Admissions', 'Academic Affairs', 'Finance', 'Operations'].map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="mb-lg">
              <label className="font-label-md text-label-md text-on-surface mb-sm block">Type</label>
              <select className="input-field" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                {['Academic', 'Financial'].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// ============================================================
// BAR CHART
// ============================================================

const BarChart = ({ bars }) => {
  const max = Math.max(...bars.map((b) => b.base + b.top));
  return (
    <div className="flex items-end justify-between gap-md h-48">
      {bars.map((b) => {
        const baseH = (b.base / max) * 100;
        const topH = (b.top / max) * 100;
        return (
          <div key={b.label} className="flex-1 flex flex-col items-center gap-sm h-full justify-end">
            <div className="w-full max-w-[48px] flex flex-col justify-end neon-bar" style={{ height: '100%' }}>
              <div className="w-full rounded-t" style={{ height: `${topH}%`, background: 'linear-gradient(180deg,#a5b4fc,#6366f1)' }} title={`${b.top}`} />
              <div className="w-full" style={{ height: `${baseH}%`, background: 'linear-gradient(180deg,#6366f1,#312e81)' }} title={`${b.base}`} />
            </div>
            <span className="text-label-sm text-on-surface-variant text-center">{b.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Reports;
