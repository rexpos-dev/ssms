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
  Input,
  Button,
  Modal,
  Counter,
} from '../../components/ui';
import { FileDown, Plus, Search, TrendingUp } from 'lucide-react';

// ============================================================
// SEED DATA
// ============================================================

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
const REVENUE = [720, 760, 810, 870, 902];
const EXPENSES = [540, 560, 600, 640, 690];

const FEE_STATUS = [
  { label: 'Paid', amount: 640200, color: '#6366f1' },
  { label: 'Pending', amount: 210000, color: '#f59e0b' },
  { label: 'Overdue', amount: 64500, color: '#ef4444' },
];

const SEED_TX = [
  { id: 1, payer: 'Elena Rodriguez', description: 'Annual Tuition Fee', date: '2024-10-12', amount: 12400 },
  { id: 2, payer: 'Marcus Chen', description: 'Lab & Materials', date: '2024-10-11', amount: 450 },
  { id: 3, payer: 'Sophia Williams', description: 'Sports Facility Fee', date: '2024-10-10', amount: 1200 },
  { id: 4, payer: 'Julian Vane', description: 'Tuition Installment', date: '2024-10-08', amount: 3000 },
  { id: 5, payer: 'Aria Thorne', description: 'Library Fine', date: '2024-10-07', amount: 150 },
  { id: 6, payer: 'Noah Patel', description: 'Annual Tuition Fee', date: '2024-10-05', amount: 12400 },
  { id: 7, payer: 'Grace Whitfield', description: 'Field Trip Fee', date: '2024-10-03', amount: 600 },
];

const EMPTY_FORM = { payer: '', description: '', date: '', amount: '' };

const peso = (n) => '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pesoShort = (n) =>
  n >= 1_000_000 ? `₱${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `₱${(n / 1000).toFixed(0)}k` : `₱${n}`;

// ============================================================
// PAGE
// ============================================================

export const Financials = () => {
  const [transactions, setTransactions] = useState(SEED_TX);
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});

  const totalRevenue = REVENUE[REVENUE.length - 1] * 1000;
  const feeTotal = FEE_STATUS.reduce((s, f) => s + f.amount, 0);
  const paidPct = Math.round((FEE_STATUS[0].amount / feeTotal) * 100);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return transactions.filter(
      (t) => !term || t.payer.toLowerCase().includes(term) || t.description.toLowerCase().includes(term)
    );
  }, [transactions, search]);

  const visibleTx = showAll ? filtered : filtered.slice(0, 4);

  // ----------------------------------------------------------
  // Handlers
  // ----------------------------------------------------------
  const openInvoice = () => {
    setForm({ ...EMPTY_FORM, date: new Date().toISOString().slice(0, 10) });
    setFormErrors({});
    setModalOpen(true);
  };

  const saveInvoice = (e) => {
    e.preventDefault();
    const errors = {};
    if (!form.payer.trim()) errors.payer = 'Payer is required';
    if (!form.description.trim()) errors.description = 'Description is required';
    if (!form.amount || Number(form.amount) <= 0) errors.amount = 'Enter a valid amount';
    if (!form.date) errors.date = 'Date is required';
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    const nextId = transactions.reduce((max, t) => Math.max(max, t.id), 0) + 1;
    setTransactions((prev) => [{ ...form, id: nextId, amount: Number(form.amount) }, ...prev]);
    setModalOpen(false);
  };

  const exportCSV = () => {
    const headers = ['Payer', 'Description', 'Date', 'Amount'];
    const rows = filtered.map((t) =>
      [t.payer, t.description, t.date, t.amount].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financials-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const updateForm = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------
  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-md mb-xl">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-primary mb-xs">Financial Overview</h1>
          <p className="font-body-md text-on-surface-variant">Monitoring Academy fiscal health for Q3 2024.</p>
        </div>
        <div className="flex items-center gap-sm">
          <Button variant="secondary" onClick={() => window.print()} className="flex items-center gap-sm">
            <FileDown size={18} /> Export PDF
          </Button>
          <Button onClick={openInvoice} className="flex items-center gap-sm">
            <Plus size={18} /> Create Invoice
          </Button>
        </div>
      </div>

      {/* Revenue + chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg mb-lg">
        <Card>
          <p className="font-label-md text-label-sm text-on-surface-variant uppercase tracking-wide mb-xs">Total Revenue for the Quarter</p>
          <p className="font-headline-lg text-headline-lg text-primary mb-xs"><Counter value={peso(totalRevenue)} /></p>
          <p className="font-body-sm text-green-700 flex items-center gap-xs mb-md">
            <TrendingUp size={14} /> +12.4% from Q2
          </p>
          <AreaChart values={REVENUE} />
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-lg">
            <h2 className="font-headline-sm text-headline-sm text-primary">Revenue vs Expenses</h2>
            <div className="flex items-center gap-lg text-label-sm">
              <span className="flex items-center gap-xs"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#6366f1' }} /> Revenue</span>
              <span className="flex items-center gap-xs"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#22d3ee' }} /> Expenses</span>
            </div>
          </div>
          <LineChart datasets={[{ values: REVENUE, color: '#6366f1' }, { values: EXPENSES, color: '#22d3ee' }]} labels={MONTHS} />
        </Card>
      </div>

      {/* Fee collection + transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg mb-lg">
        <Card>
          <h2 className="font-headline-sm text-headline-sm text-primary mb-lg">Fee Collection Status</h2>
          <div className="flex items-center justify-center mb-lg">
            <Donut segments={FEE_STATUS} centerLabel={`${paidPct}%`} centerNote="Paid" />
          </div>
          <div className="space-y-sm">
            {FEE_STATUS.map((f) => (
              <div key={f.label} className="flex items-center justify-between">
                <span className="flex items-center gap-sm font-body-sm text-on-surface">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: f.color }} />
                  {f.label}
                </span>
                <span className="font-label-md text-body-sm text-on-surface">{peso(f.amount)}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent>
            <div className="flex flex-wrap items-center justify-between gap-md mb-lg">
              <h2 className="font-headline-sm text-headline-sm text-primary">Recent Transactions</h2>
              <button onClick={() => setShowAll((v) => !v)} className="text-primary font-label-md text-label-md hover:underline">
                {showAll ? 'Show Recent' : 'View All'}
              </button>
            </div>

            <div className="relative mb-md max-w-md">
              <Search size={18} className="absolute left-md top-1/2 -translate-y-1/2 text-outline" />
              <input
                className="w-full pl-xl pr-md py-sm bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:outline-none focus:border-primary"
                placeholder="Search financials, invoices, or payers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Student / Payer</TableHeader>
                  <TableHeader>Description</TableHeader>
                  <TableHeader>Date</TableHeader>
                  <TableHeader align="right">Amount</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleTx.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell><span className="font-label-md text-on-surface">{t.payer}</span></TableCell>
                    <TableCell>{t.description}</TableCell>
                    <TableCell>{new Date(`${t.date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</TableCell>
                    <TableCell align="right"><span className="font-label-md text-primary">{peso(t.amount)}</span></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filtered.length === 0 && <p className="text-center py-xl text-on-surface-variant font-body-md">No transactions found.</p>}
          </CardContent>
        </Card>
      </div>

      {/* Bottom stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
        <StatCard bg="bg-primary text-on-primary" label="Active Scholarships" value="42 Students" note="Total Value: ₱145k" noteClass="text-on-primary/70" />
        <StatCard bg="bg-secondary text-on-secondary" label="Facility Maintenance" value={peso(24500)} note="Remaining Budget: ₱12k" noteClass="text-on-secondary/70" />
        <StatCard bg="bg-surface-container text-on-surface" label="Supply Procurement" value={peso(8120)} note="8 Active Orders" noteClass="text-on-surface-variant" />
        <StatCard bg="bg-tertiary text-on-tertiary" label="Reserve Fund" value="₱2.1M" note="Endowment Linked" noteClass="text-on-tertiary-container" />
      </div>

      {/* Create invoice modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Invoice"
        actions={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={saveInvoice}>Create Invoice</Button>
          </>
        }
      >
        <form onSubmit={saveInvoice} className="space-y-xs">
          <Input label="Student / Payer" value={form.payer} onChange={updateForm('payer')} error={formErrors.payer} placeholder="Elena Rodriguez" />
          <Input label="Description" value={form.description} onChange={updateForm('description')} error={formErrors.description} placeholder="Annual Tuition Fee" />
          <div className="grid grid-cols-2 gap-md">
            <Input label="Amount (₱)" type="number" min="0" value={form.amount} onChange={updateForm('amount')} error={formErrors.amount} placeholder="12400" />
            <Input label="Date" type="date" value={form.date} onChange={updateForm('date')} error={formErrors.date} />
          </div>
        </form>
      </Modal>
    </div>
  );
};

// ============================================================
// CHARTS + SUB-COMPONENTS (dependency-free SVG)
// ============================================================

const StatCard = ({ bg, label, value, note, noteClass }) => (
  <Card className={bg}>
    <p className="font-label-md text-label-sm uppercase tracking-wide opacity-80 mb-sm">{label}</p>
    <p className="font-headline-md text-headline-md mb-xs"><Counter value={value} /></p>
    <p className={`font-body-sm ${noteClass}`}>{note}</p>
  </Card>
);

const AreaChart = ({ values, height = 60 }) => {
  const W = 300;
  const max = Math.max(...values) * 1.1;
  const min = Math.min(...values) * 0.9;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * W, height - ((v - min) / (max - min)) * height]);
  const line = pts.map((p) => p.join(',')).join(' ');
  const area = `0,${height} ${line} ${W},${height}`;
  return (
    <svg viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#areaFill)" />
      <polyline points={line} fill="none" stroke="#6366f1" strokeWidth="2.5" className="neon-indigo" />
    </svg>
  );
};

const LineChart = ({ datasets, labels, height = 180 }) => {
  const W = 600;
  const pad = 8;
  const all = datasets.flatMap((d) => d.values);
  const max = Math.max(...all) * 1.1;
  const min = Math.min(...all) * 0.85;
  const x = (i, n) => (i / (n - 1)) * (W - pad * 2) + pad;
  const y = (v) => height - pad - ((v - min) / (max - min)) * (height - pad * 2);
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
        {[0.25, 0.5, 0.75, 1].map((g) => (
          <line key={g} x1="0" x2={W} y1={height - pad - g * (height - pad * 2)} y2={height - pad - g * (height - pad * 2)} stroke="currentColor" className="text-surface-variant" strokeWidth="1" />
        ))}
        {datasets.map((d, di) => (
          <polyline
            key={di}
            points={d.values.map((v, i) => `${x(i, d.values.length)},${y(v)}`).join(' ')}
            fill="none"
            stroke={d.color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={di === 0 ? 'neon-indigo' : 'neon-cyan'}
          />
        ))}
      </svg>
      <div className="flex justify-between mt-sm px-xs">
        {labels.map((l) => (
          <span key={l} className="text-label-sm text-on-surface-variant">{l}</span>
        ))}
      </div>
    </div>
  );
};

const Donut = ({ segments, centerLabel, centerNote, size = 160, stroke = 22 }) => {
  const total = segments.reduce((s, seg) => s + seg.amount, 0);
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" className="text-surface-variant" strokeWidth={stroke} />
          {segments.map((seg, i) => {
            const len = (seg.amount / total) * C;
            const circle = (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${len} ${C - len}`}
                strokeDashoffset={-offset}
                style={{ filter: `drop-shadow(0 0 5px ${seg.color}88)` }}
              />
            );
            offset += len;
            return circle;
          })}
        </g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-headline-md text-headline-md text-primary">{centerLabel}</span>
        <span className="text-label-sm text-on-surface-variant uppercase">{centerNote}</span>
      </div>
    </div>
  );
};

export default Financials;
