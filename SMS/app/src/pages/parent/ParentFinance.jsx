import { useMemo, useState } from 'react';
import { Modal, Button, Input } from '../../components/ui';
import {
  FileText, Download, CreditCard, Upload, BarChart3, CalendarDays,
  CheckCircle2, Info, Check,
} from 'lucide-react';

const peso = (n) => '₱' + Number(n).toLocaleString(undefined, { minimumFractionDigits: 2 });

const FEES = {
  Monthly: [
    { label: 'Registration Fee', value: '₱25,000/ ₱35,000.00' },
    { label: 'Miscellaneous Fee', value: '₱4,500.00' },
    { label: 'Tuition Fee', value: '₱3,000.00' },
  ],
  Quarterly: [
    { label: 'Registration Fee', value: '₱25,000/ ₱35,000.00' },
    { label: 'Miscellaneous Fee', value: '₱13,500.00' },
    { label: 'Tuition Fee', value: '₱9,000.00' },
  ],
  Yearly: [
    { label: 'Registration Fee', value: '₱35,000/ ₱35,000.00' },
    { label: 'Miscellaneous Fee', value: '₱54,000.00' },
    { label: 'Tuition Fee', value: '₱36,000.00' },
  ],
};

const TX = [
  { date: 'Sep 24, 2023', desc: 'Term 2 Tuition Fee', ref: 'INV-2023-0042', status: 'Pending', amount: 35000 },
  { date: 'Aug 12, 2023', desc: 'Annual Science Journal Subscription', ref: 'INV-2023-0015', status: 'Paid', amount: 1200 },
  { date: 'Aug 05, 2023', desc: 'School Bus Transport - Quarter 3', ref: 'INV-2023-0009', status: 'Paid', amount: 7500 },
  { date: 'Jul 28, 2023', desc: 'Library & Lab Access Fee', ref: 'INV-2023-0007', status: 'Paid', amount: 2500 },
  { date: 'Jul 15, 2023', desc: 'Sports Uniform Package', ref: 'INV-2023-0005', status: 'Paid', amount: 3200 },
  { date: 'Jul 02, 2023', desc: 'Term 1 Tuition Fee', ref: 'INV-2023-0002', status: 'Paid', amount: 35000 },
  { date: 'Jun 20, 2023', desc: 'Enrollment Registration', ref: 'INV-2023-0001', status: 'Paid', amount: 25000 },
  { date: 'Jun 10, 2023', desc: 'Field Trip Contribution', ref: 'INV-2023-0011', status: 'Pending', amount: 1800 },
  { date: 'May 30, 2023', desc: 'Music Program Materials', ref: 'INV-2023-0013', status: 'Paid', amount: 1500 },
  { date: 'May 18, 2023', desc: 'Annual Yearbook', ref: 'INV-2023-0018', status: 'Paid', amount: 1200 },
  { date: 'May 05, 2023', desc: 'Technology Fee', ref: 'INV-2023-0021', status: 'Paid', amount: 4000 },
  { date: 'Apr 22, 2023', desc: 'Examination Fee', ref: 'INV-2023-0024', status: 'Paid', amount: 2000 },
];

const PAGE_SIZE = 3;

export default function ParentFinance() {
  const [period, setPeriod] = useState('Monthly');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [payOpen, setPayOpen] = useState(false);
  const [payForm, setPayForm] = useState({ amount: '42500', method: 'Visa Ending in 4242' });
  const [banner, setBanner] = useState(null);
  const flash = (msg) => { setBanner(msg); setTimeout(() => setBanner(null), 2600); };

  const filtered = statusFilter === 'All' ? TX : TX.filter((t) => t.status === statusFilter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function exportCSV() {
    const header = ['Date', 'Description', 'Ref ID', 'Status', 'Amount'];
    const csv = [header, ...filtered.map((t) => [t.date, t.desc, t.ref, t.status, t.amount])].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'transactions.csv'; a.click(); URL.revokeObjectURL(url);
    flash('Transactions exported.');
  }

  function printDoc(title, body) {
    const html = `<!doctype html><html><head><title>${title}</title>
      <style>body{font-family:Inter,Arial,sans-serif;padding:40px;color:#111d23}h1{color:#000666}table{width:100%;border-collapse:collapse;margin-top:16px}th,td{border:1px solid #c6c5d4;padding:8px;font-size:13px;text-align:left}th{background:#e3f0f8}</style></head>
      <body><h1>${title}</h1>${body}<script>window.onload=function(){window.print()}<\/script></body></html>`;
    const w = window.open('', '_blank'); if (w) { w.document.write(html); w.document.close(); } else flash('Allow pop-ups to download.');
  }
  function downloadSOA() {
    const rowsHtml = TX.map((t) => `<tr><td>${t.date}</td><td>${t.desc}</td><td>${t.ref}</td><td>${t.status}</td><td>${peso(t.amount)}</td></tr>`).join('');
    printDoc('Statement of Account — Marcus Chen', `<p>Outstanding balance: <b>${peso(42500)}</b> · Due Oct 15, 2023</p><table><thead><tr><th>Date</th><th>Description</th><th>Ref</th><th>Status</th><th>Amount</th></tr></thead><tbody>${rowsHtml}</tbody></table>`);
    flash('Opening Statement of Account…');
  }

  function submitPayment() {
    setPayOpen(false);
    flash(`Payment of ${peso(payForm.amount || 0)} submitted via ${payForm.method}.`);
  }

  const fees = useMemo(() => FEES[period], [period]);

  return (
    <div className="space-y-xl">
      {banner && <div className="fixed top-20 right-8 z-[70] bg-primary text-on-primary px-lg py-md rounded-xl shadow-[0_12px_32px_rgba(0,6,102,0.35)] flex items-center gap-sm font-label-md animate-fade-up"><Check size={18} /> {banner}</div>}

      <h1 className="font-headline-lg text-headline-lg text-primary font-bold">Fees &amp; Finance</h1>

      {/* overview */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="bg-primary-container rounded-2xl p-xl text-white flex flex-col justify-between shadow-lg">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-md">Current Outstanding Balance</h3>
            <p className="font-headline-xl text-headline-xl mb-xs">{peso(42500)}</p>
            <p className="text-sm opacity-80">Due by October 15, 2023</p>
          </div>
          <div className="mt-xl space-y-md">
            <button onClick={() => { setPayForm({ amount: '42500', method: 'Visa Ending in 4242' }); setPayOpen(true); }} className="w-full bg-white text-primary py-md rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-md">Pay Now</button>
            <button onClick={downloadSOA} className="w-full border border-white/20 text-white py-md rounded-lg font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-sm"><FileText size={18} /> Download SOA</button>
          </div>
        </div>

        <div className="lg:col-span-2 card flex flex-col">
          <div className="flex justify-between items-start mb-lg gap-md flex-wrap">
            <h3 className="font-headline-sm text-headline-sm text-primary">Bill Breakdown</h3>
            <div className="flex items-center gap-md">
              <span className="bg-error/5 text-error px-md py-1 rounded text-xs font-bold border border-error/20">SY Balance: {peso(55000)}</span>
              <div className="inline-flex rounded-lg border border-outline-variant p-1 bg-surface-container-low">
                {['Monthly', 'Quarterly', 'Yearly'].map((p) => (
                  <button key={p} onClick={() => setPeriod(p)} className={`px-md py-1.5 text-xs font-bold rounded-md transition-all ${period === p ? 'bg-primary text-on-primary shadow-sm' : 'text-secondary hover:text-primary'}`}>{p}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-md mb-lg">
            {fees.map((f) => (
              <div key={f.label} className="border border-outline-variant rounded-lg p-md">
                <p className="text-[10px] text-on-surface-variant uppercase font-bold mb-1">{f.label}</p>
                <p className="text-lg font-bold text-primary">{f.value}</p>
              </div>
            ))}
          </div>
          <div className="bg-primary/5 border-l-4 border-primary p-md flex items-start gap-md rounded-r-lg">
            <Info size={20} className="text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-on-surface-variant">The balance includes a carry-over from the previous term activities. Early bird discounts have been applied.</p>
          </div>
        </div>
      </section>

      {/* transactions */}
      <section className="card !p-0 overflow-hidden">
        <div className="p-lg border-b border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-md">
          <h3 className="font-headline-sm text-headline-sm text-primary">Transaction History</h3>
          <div className="flex flex-wrap items-center gap-sm">
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="flex items-center px-md py-sm text-sm border border-outline-variant rounded-lg text-on-surface-variant focus:ring-1 focus:ring-primary outline-none">
              <option value="All">All Statuses</option><option>Paid</option><option>Pending</option>
            </select>
            <button onClick={exportCSV} className="flex items-center gap-sm px-md py-sm text-sm bg-primary text-on-primary rounded-lg hover:opacity-90"><Download size={16} /> Export CSV</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[720px]">
            <thead><tr className="bg-surface-container-low border-b border-outline-variant text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              <th className="px-lg py-md">Date</th><th className="px-lg py-md">Description</th><th className="px-lg py-md">Ref ID</th><th className="px-lg py-md">Status</th><th className="px-lg py-md">Amount</th><th className="px-lg py-md text-center">Invoice</th>
            </tr></thead>
            <tbody className="divide-y divide-surface-container-high">
              {rows.map((t) => (
                <tr key={t.ref} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-lg py-md text-sm text-on-surface-variant">{t.date}</td>
                  <td className="px-lg py-md text-sm font-medium text-primary">{t.desc}</td>
                  <td className="px-lg py-md text-xs text-on-surface-variant font-mono">{t.ref}</td>
                  <td className="px-lg py-md"><span className={`px-2.5 py-1 rounded text-xs font-medium ${t.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-surface-container-high text-secondary'}`}>{t.status}</span></td>
                  <td className="px-lg py-md text-sm font-bold text-primary">{peso(t.amount)}</td>
                  <td className="px-lg py-md text-center"><button onClick={() => printDoc(`Invoice ${t.ref}`, `<p><b>${t.desc}</b></p><p>Date: ${t.date}<br>Status: ${t.status}<br>Amount: ${peso(t.amount)}</p>`)} className="text-primary hover:text-surface-tint"><FileText size={18} className="mx-auto" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-lg py-md bg-surface-container-low border-t border-outline-variant flex items-center justify-between">
          <span className="text-xs text-secondary">Showing {rows.length} of {filtered.length} records</span>
          <div className="flex items-center gap-sm">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1 border border-outline-variant rounded hover:bg-surface-container-lowest disabled:opacity-50"><ChevronGlyph dir="left" /></button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1 border border-outline-variant rounded hover:bg-surface-container-lowest disabled:opacity-50"><ChevronGlyph dir="right" /></button>
          </div>
        </div>
      </section>

      {/* footer */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-lg pb-8">
        <div className="lg:col-span-2 card">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-lg">Payment Methods</h3>
          <div className="flex flex-col md:flex-row gap-lg">
            <div className="flex-1 border-2 border-primary rounded-xl p-lg relative bg-primary/5">
              <div className="flex justify-between items-start mb-lg">
                <div className="p-2 bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/40"><CreditCard size={28} className="text-primary" /></div>
                <CheckCircle2 size={22} className="text-green-600" />
              </div>
              <p className="font-bold text-primary">Visa Ending in 4242</p>
              <p className="text-xs text-on-surface-variant mt-1">Default Method • Exp 12/25</p>
            </div>
            <button onClick={() => flash('Upload a payment receipt (jpg, png, pdf).')} className="flex-1 border border-outline-variant rounded-xl p-lg hover:border-primary transition-colors text-left group">
              <div className="flex justify-between items-start mb-lg"><div className="p-2 bg-surface-container-low rounded-lg group-hover:bg-surface-container-lowest transition-colors"><Upload size={28} className="text-on-surface-variant group-hover:text-primary" /></div></div>
              <p className="font-bold text-on-surface-variant group-hover:text-primary">Attached File Here</p>
              <p className="text-xs text-on-surface-variant mt-1">Use Screenshot or download (jpg, png, pdf)</p>
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-lg">Quick Actions</h3>
          <div className="space-y-sm">
            <button onClick={downloadSOA} className="w-full flex items-center gap-md px-md py-sm border border-outline-variant rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-low font-medium"><BarChart3 size={18} className="text-on-surface-variant" /> Statement of Account</button>
            <button onClick={() => printDoc('Payment Schedule', '<table><thead><tr><th>Due Date</th><th>Description</th><th>Amount</th></tr></thead><tbody><tr><td>Oct 15, 2023</td><td>Term 2 Balance</td><td>₱42,500.00</td></tr><tr><td>Jan 15, 2024</td><td>Term 3 Tuition</td><td>₱35,000.00</td></tr></tbody></table>')} className="w-full flex items-center gap-md px-md py-sm border border-outline-variant rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-low font-medium"><CalendarDays size={18} className="text-on-surface-variant" /> Payment Schedule</button>
          </div>
        </div>
      </section>

      {/* pay modal */}
      <Modal isOpen={payOpen} onClose={() => setPayOpen(false)} title="Pay Outstanding Balance"
        actions={<><Button variant="secondary" onClick={() => setPayOpen(false)}>Cancel</Button><Button onClick={submitPayment} icon={<CreditCard size={16} />}>Pay {peso(payForm.amount || 0)}</Button></>}>
        <div className="space-y-xs">
          <Input label="Amount (₱)" type="number" value={payForm.amount} onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })} />
          <div className="mb-lg">
            <label className="font-label-md text-label-md text-on-surface mb-sm block">Payment Method</label>
            <select className="input-field" value={payForm.method} onChange={(e) => setPayForm({ ...payForm, method: e.target.value })}>
              <option>Visa Ending in 4242</option><option>Bank Transfer</option><option>GCash</option>
            </select>
          </div>
          <p className="text-label-sm text-on-surface-variant">This is a demo — no real payment is processed.</p>
        </div>
      </Modal>
    </div>
  );
}

function ChevronGlyph({ dir }) {
  return <svg className="w-5 h-5 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={dir === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} /></svg>;
}
