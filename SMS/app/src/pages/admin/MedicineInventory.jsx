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
  Search,
  Pencil,
  Trash2,
  PackagePlus,
  Boxes,
  AlertTriangle,
  Package,
  ChevronLeft,
} from 'lucide-react';

// ============================================================
// SEED DATA
// ============================================================

const CATEGORIES = ['Analgesic', 'Antibiotic', 'Antiseptic', 'First Aid', 'Vitamins', 'Others'];

const SEED = [
  { id: 1, name: 'Paracetamol 500mg', category: 'Analgesic', stock: 120, min: 50, unit: 'tablets', expiry: '2026-04-30' },
  { id: 2, name: 'Ibuprofen 200mg', category: 'Analgesic', stock: 32, min: 40, unit: 'tablets', expiry: '2025-11-15' },
  { id: 3, name: 'Antiseptic Solution', category: 'Antiseptic', stock: 18, min: 20, unit: 'bottles', expiry: '2026-08-01' },
  { id: 4, name: 'Adhesive Bandages', category: 'First Aid', stock: 240, min: 100, unit: 'pcs', expiry: '2027-01-20' },
  { id: 5, name: 'Oral Rehydration Salts', category: 'Others', stock: 60, min: 30, unit: 'sachets', expiry: '2025-12-31' },
  { id: 6, name: 'Amoxicillin 250mg', category: 'Antibiotic', stock: 0, min: 25, unit: 'capsules', expiry: '2026-03-10' },
  { id: 7, name: 'Vitamin C 500mg', category: 'Vitamins', stock: 200, min: 60, unit: 'tablets', expiry: '2026-06-30' },
  { id: 8, name: 'Cotton Rolls', category: 'First Aid', stock: 45, min: 30, unit: 'rolls', expiry: '2028-01-01' },
];

const PAGE_SIZE = 8;
const EMPTY_FORM = { name: '', category: 'Analgesic', stock: '', min: '', unit: 'tablets', expiry: '' };

const today = () => new Date().toISOString().slice(0, 10);

const stockStatus = (item) => {
  if (item.stock <= 0) return { label: 'Out of Stock', variant: 'error' };
  if (item.stock <= item.min) return { label: 'Low Stock', variant: 'warning' };
  return { label: 'In Stock', variant: 'success' };
};

// ============================================================
// PAGE
// ============================================================

export const MedicineInventory = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState(SEED);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  // Add / edit modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});

  // Restock modal
  const [restockItem, setRestockItem] = useState(null);
  const [restockQty, setRestockQty] = useState('');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter(
      (i) => (!category || i.category === category) && (!term || i.name.toLowerCase().includes(term))
    );
  }, [items, search, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  const stats = useMemo(() => {
    const totalItems = items.length;
    const totalUnits = items.reduce((s, i) => s + i.stock, 0);
    const low = items.filter((i) => i.stock > 0 && i.stock <= i.min).length;
    const out = items.filter((i) => i.stock <= 0).length;
    return { totalItems, totalUnits, low, out };
  }, [items]);

  // ----------------------------------------------------------
  // Actions
  // ----------------------------------------------------------
  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({ name: item.name, category: item.category, stock: String(item.stock), min: String(item.min), unit: item.unit, expiry: item.expiry === '—' ? '' : item.expiry });
    setFormErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Medicine name is required';
    if (form.stock === '' || Number(form.stock) < 0) errs.stock = 'Enter a valid stock quantity';
    if (form.min === '' || Number(form.min) < 0) errs.min = 'Enter a valid minimum';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const saveItem = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      name: form.name.trim(),
      category: form.category,
      stock: Number(form.stock),
      min: Number(form.min),
      unit: form.unit.trim() || 'units',
      expiry: form.expiry || '—',
    };
    if (editingId) {
      setItems((prev) => prev.map((i) => (i.id === editingId ? { ...i, ...payload } : i)));
    } else {
      const nextId = items.reduce((max, i) => Math.max(max, i.id), 0) + 1;
      setItems((prev) => [{ id: nextId, ...payload }, ...prev]);
      setPage(1);
    }
    setModalOpen(false);
  };

  const openRestock = (item) => {
    setRestockItem(item);
    setRestockQty('');
  };

  const confirmRestock = (e) => {
    e.preventDefault();
    const qty = Number(restockQty);
    if (!qty || qty <= 0) return;
    setItems((prev) => prev.map((i) => (i.id === restockItem.id ? { ...i, stock: i.stock + qty } : i)));
    setRestockItem(null);
  };

  const removeItem = (id) => {
    if (window.confirm('Remove this medicine from inventory?')) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const exportCSV = () => {
    const headers = ['Medicine', 'Category', 'Stock', 'Unit', 'Min Threshold', 'Status', 'Expiry'];
    const rows = filtered.map((i) =>
      [i.name, i.category, i.stock, i.unit, i.min, stockStatus(i).label, i.expiry]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `medicine-inventory-${today()}.csv`;
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
          <button onClick={() => navigate('/admin/medical')} className="flex items-center gap-xs text-on-surface-variant hover:text-primary font-label-md text-label-md mb-sm transition-colors">
            <ChevronLeft size={16} /> Back to Medical
          </button>
          <h1 className="font-headline-xl text-headline-xl text-primary mb-xs">Medicine Inventory</h1>
          <p className="font-body-md text-on-surface-variant">Manage clinic medicine and supply stock levels</p>
        </div>
        <div className="flex items-center gap-sm">
          <Button variant="secondary" onClick={exportCSV} className="flex items-center gap-sm"><Download size={18} /> Export Data</Button>
          <Button onClick={openAdd} className="flex items-center gap-sm"><Plus size={18} /> Add Medicine</Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
        <StatCard icon={Boxes} label="Total Items" value={stats.totalItems} note="Distinct medicines" />
        <StatCard icon={Package} label="Units in Stock" value={stats.totalUnits.toLocaleString()} note="Across all items" noteClass="text-green-700" />
        <StatCard icon={AlertTriangle} label="Low Stock" value={stats.low} note="Restock soon" noteClass="text-yellow-700" />
        <StatCard icon={AlertTriangle} label="Out of Stock" value={stats.out} note="Action needed" noteClass="text-error" />
      </div>

      {/* Inventory table */}
      <Card>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-md mb-lg">
            <div className="flex flex-wrap items-center gap-sm">
              <div className="relative">
                <Search size={18} className="absolute left-md top-1/2 -translate-y-1/2 text-outline" />
                <input
                  className="pl-xl pr-md py-sm bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:outline-none focus:border-primary"
                  placeholder="Search medicine..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              <select className="input-field !w-auto" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <p className="font-body-sm text-primary">
              Showing {filtered.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + PAGE_SIZE, filtered.length)} of {filtered.length} items
            </p>
          </div>

          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Medicine</TableHeader>
                <TableHeader>Category</TableHeader>
                <TableHeader>Stock Level</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Expiry</TableHeader>
                <TableHeader align="right">Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRows.map((i) => {
                const st = stockStatus(i);
                const low = i.stock <= i.min;
                const pct = Math.min(100, Math.round((i.stock / Math.max(1, i.min * 2)) * 100));
                return (
                  <TableRow key={i.id}>
                    <TableCell><span className="font-label-md text-on-surface">{i.name}</span></TableCell>
                    <TableCell>{i.category}</TableCell>
                    <TableCell>
                      <div className="min-w-[140px]">
                        <span className="font-body-sm text-on-surface-variant">{i.stock} {i.unit} <span className="text-outline">/ min {i.min}</span></span>
                        <div className="h-2 mt-xs rounded-full bg-surface-variant overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: low ? 'linear-gradient(90deg,#f87171,#dc2626)' : 'linear-gradient(90deg,#818cf8,#4338ca)' }} />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant={st.variant}>{st.label}</Badge></TableCell>
                    <TableCell>{fmtDate(i.expiry)}</TableCell>
                    <TableCell align="right">
                      <div className="flex items-center justify-end gap-xs">
                        <button onClick={() => openRestock(i)} title="Restock" className="p-xs rounded text-green-700 hover:bg-green-100 transition-colors"><PackagePlus size={16} /></button>
                        <button onClick={() => openEdit(i)} title="Edit" className="p-xs rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"><Pencil size={16} /></button>
                        <button onClick={() => removeItem(i.id)} title="Delete" className="p-xs rounded text-error hover:bg-error/10 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filtered.length === 0 && <p className="text-center py-xl text-on-surface-variant font-body-md">No medicines match your search.</p>}

          {totalPages > 1 && (
            <div className="flex items-center justify-end gap-xs pt-lg mt-lg border-t border-surface-variant">
              <button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}
                className="h-9 px-md rounded-lg border border-outline-variant font-label-md text-label-md hover:bg-surface-container disabled:opacity-40 transition-colors">
                Previous
              </button>
              <span className="font-body-sm text-on-surface-variant px-sm">Page {currentPage} of {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}
                className="h-9 px-md rounded-lg border border-outline-variant font-label-md text-label-md hover:bg-surface-container disabled:opacity-40 transition-colors">
                Next
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add / edit modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Medicine' : 'Add Medicine'}
        actions={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={saveItem}>{editingId ? 'Save Changes' : 'Add to Inventory'}</Button>
          </>
        }
      >
        <form onSubmit={saveItem} className="space-y-xs">
          <Input label="Medicine Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} error={formErrors.name} placeholder="Paracetamol 500mg" />
          <div className="grid grid-cols-2 gap-md">
            <div className="mb-lg">
              <label className="font-label-md text-label-md text-on-surface mb-sm block">Category</label>
              <select className="input-field" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <Input label="Unit" value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))} placeholder="tablets" />
          </div>
          <div className="grid grid-cols-2 gap-md">
            <Input label="Current Stock" type="number" min="0" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} error={formErrors.stock} placeholder="120" />
            <Input label="Minimum Threshold" type="number" min="0" value={form.min} onChange={(e) => setForm((f) => ({ ...f, min: e.target.value }))} error={formErrors.min} placeholder="50" />
          </div>
          <Input label="Expiry Date" type="date" value={form.expiry} onChange={(e) => setForm((f) => ({ ...f, expiry: e.target.value }))} />
        </form>
      </Modal>

      {/* Restock modal */}
      <Modal
        isOpen={!!restockItem}
        onClose={() => setRestockItem(null)}
        title={`Restock — ${restockItem?.name || ''}`}
        actions={
          <>
            <Button variant="secondary" onClick={() => setRestockItem(null)}>Cancel</Button>
            <Button onClick={confirmRestock}>Add Stock</Button>
          </>
        }
      >
        <form onSubmit={confirmRestock} className="space-y-xs">
          <p className="font-body-sm text-on-surface-variant mb-md">
            Current stock: <span className="font-label-md text-on-surface">{restockItem?.stock} {restockItem?.unit}</span>
          </p>
          <Input label="Quantity to Add" type="number" min="1" value={restockQty} onChange={(e) => setRestockQty(e.target.value)} placeholder="50" autoFocus />
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

export default MedicineInventory;
