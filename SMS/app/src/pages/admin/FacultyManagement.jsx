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
  UserPlus,
  Pencil,
  Trash2,
  Download,
  SlidersHorizontal,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Users,
} from 'lucide-react';

// ============================================================
// SEED DATA
// ============================================================

const SEED_FACULTY = [
  { id: 1, name: 'Dr. Elena Rodriguez', email: 'elena.r@bridges.edu', department: 'Sciences', role: 'Department Head', load: 95, status: 'Active', pd: 100, joined: 'Aug 2015' },
  { id: 2, name: 'Julian Mercer', email: 'j.mercer@bridges.edu', department: 'Mathematics', role: 'Senior Lecturer', load: 70, status: 'Active', pd: 95, joined: 'Jan 2018' },
  { id: 3, name: 'Sarah Tildon', email: 's.tildon@bridges.edu', department: 'Arts & Design', role: 'Associate Faculty', load: 40, status: 'On Sabbatical', pd: 80, joined: 'Sep 2019' },
  { id: 4, name: 'Dr. Paul Kim', email: 'p.kim@bridges.edu', department: 'Humanities', role: 'Visiting Professor', load: 82, status: 'Active', pd: 90, joined: 'Aug 2021' },
  { id: 5, name: 'Maria Santos', email: 'm.santos@bridges.edu', department: 'Languages', role: 'Senior Lecturer', load: 88, status: 'Active', pd: 92, joined: 'Jun 2016' },
  { id: 6, name: 'Dr. Owen Bennett', email: 'o.bennett@bridges.edu', department: 'Sciences', role: 'Professor', load: 91, status: 'Active', pd: 98, joined: 'Aug 2012' },
  { id: 7, name: 'Hannah Lee', email: 'h.lee@bridges.edu', department: 'Mathematics', role: 'Lecturer', load: 55, status: 'Active', pd: 70, joined: 'Jan 2022' },
  { id: 8, name: 'David Okafor', email: 'd.okafor@bridges.edu', department: 'Technology', role: 'Department Head', load: 93, status: 'Active', pd: 96, joined: 'Sep 2014' },
  { id: 9, name: 'Priya Nair', email: 'p.nair@bridges.edu', department: 'Sciences', role: 'Associate Faculty', load: 48, status: 'On Leave', pd: 65, joined: 'Aug 2020' },
  { id: 10, name: 'Dr. Thomas Reed', email: 't.reed@bridges.edu', department: 'Humanities', role: 'Professor', load: 76, status: 'Active', pd: 88, joined: 'Jan 2013' },
  { id: 11, name: 'Grace Whitfield', email: 'g.whitfield@bridges.edu', department: 'Arts & Design', role: 'Lecturer', load: 62, status: 'Active', pd: 78, joined: 'Aug 2021' },
  { id: 12, name: 'Samuel Adebayo', email: 's.adebayo@bridges.edu', department: 'Physical Education', role: 'Senior Lecturer', load: 84, status: 'Active', pd: 85, joined: 'Sep 2017' },
  { id: 13, name: 'Dr. Aisha Karim', email: 'a.karim@bridges.edu', department: 'Languages', role: 'Department Head', load: 90, status: 'Active', pd: 99, joined: 'Aug 2011' },
  { id: 14, name: 'Nathan Cole', email: 'n.cole@bridges.edu', department: 'Technology', role: 'Associate Faculty', load: 38, status: 'On Sabbatical', pd: 60, joined: 'Jan 2023' },
];

const DEPARTMENTS = ['Sciences', 'Mathematics', 'Arts & Design', 'Humanities', 'Languages', 'Technology', 'Physical Education'];
const ROLES = ['Department Head', 'Professor', 'Senior Lecturer', 'Associate Faculty', 'Lecturer', 'Visiting Professor'];
const STATUSES = ['Active', 'On Sabbatical', 'On Leave'];

const STATUS_VARIANT = {
  Active: 'success',
  'On Sabbatical': 'warning',
  'On Leave': 'secondary',
};

const AVATAR_COLORS = [
  'bg-primary-container text-on-primary-container',
  'bg-secondary text-on-secondary',
  'bg-primary text-on-primary',
  'bg-tertiary-container text-on-tertiary-container',
];

const PAGE_SIZE = 6;
const EMPTY_FORM = { name: '', email: '', department: 'Sciences', role: 'Lecturer', load: 60, status: 'Active', pd: 80 };

const getInitials = (name) =>
  name.replace(/^Dr\.\s*/, '').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

const avatarColor = (id) => AVATAR_COLORS[id % AVATAR_COLORS.length];

const loadCategory = (load) => {
  if (load >= 90) return { label: 'Heavy', text: 'text-error', bar: 'bg-error' };
  if (load >= 60) return { label: 'Optimal', text: 'text-green-700', bar: 'bg-primary' };
  return { label: 'Available', text: 'text-on-surface-variant', bar: 'bg-secondary' };
};

// ============================================================
// PAGE
// ============================================================

export const FacultyManagement = () => {
  const [faculty, setFaculty] = useState(SEED_FACULTY);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [draft, setDraft] = useState({ department: '', role: '', status: '', sort: 'name-asc' });
  const [applied, setApplied] = useState({ department: '', role: '', status: '', sort: 'name-asc' });
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ----------------------------------------------------------
  // Derived data
  // ----------------------------------------------------------
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let result = faculty.filter((f) => {
      const matchesSearch =
        !term ||
        f.name.toLowerCase().includes(term) ||
        f.email.toLowerCase().includes(term) ||
        f.department.toLowerCase().includes(term) ||
        f.role.toLowerCase().includes(term);
      const matchesDept = !applied.department || f.department === applied.department;
      const matchesRole = !applied.role || f.role === applied.role;
      const matchesStatus = !applied.status || f.status === applied.status;
      return matchesSearch && matchesDept && matchesRole && matchesStatus;
    });

    result = [...result].sort((a, b) => {
      switch (applied.sort) {
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'load-desc':
          return b.load - a.load;
        case 'load-asc':
          return a.load - b.load;
        case 'department':
          return a.department.localeCompare(b.department);
        case 'name-asc':
        default:
          return a.name.localeCompare(b.name);
      }
    });
    return result;
  }, [faculty, search, applied]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  const stats = useMemo(() => {
    const total = faculty.length;
    const avgLoad = total ? faculty.reduce((sum, f) => sum + f.load, 0) / total : 0;
    const avgPd = total ? faculty.reduce((sum, f) => sum + f.pd, 0) / total : 0;
    const departments = new Set(faculty.map((f) => f.department)).size;
    return {
      total,
      utilization: avgLoad.toFixed(1),
      pd: Math.round(avgPd),
      departments,
    };
  }, [faculty]);

  // ----------------------------------------------------------
  // Handlers
  // ----------------------------------------------------------
  const applyFilters = () => {
    setApplied(draft);
    setPage(1);
  };

  const resetFilters = () => {
    const cleared = { department: '', role: '', status: '', sort: 'name-asc' };
    setDraft(cleared);
    setApplied(cleared);
    setSearch('');
    setPage(1);
  };

  const openNew = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (member) => {
    setEditingId(member.id);
    setForm({ ...member });
    setFormErrors({});
    setModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Full name is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email';
    const load = Number(form.load);
    if (Number.isNaN(load) || load < 0 || load > 100) errors.load = 'Load must be 0–100';
    return errors;
  };

  const saveMember = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    const payload = { ...form, load: Number(form.load), pd: Number(form.pd) || 0 };

    if (editingId) {
      setFaculty((prev) => prev.map((f) => (f.id === editingId ? { ...f, ...payload } : f)));
    } else {
      const nextId = faculty.reduce((max, f) => Math.max(max, f.id), 0) + 1;
      const joined = new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' });
      setFaculty((prev) => [{ ...payload, id: nextId, joined }, ...prev]);
      setPage(1);
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    setFaculty((prev) => prev.filter((f) => f.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Department', 'Role', 'Load %', 'Status', 'PD %'];
    const rows = filtered.map((f) =>
      [f.name, f.email, f.department, f.role, f.load, f.status, f.pd]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `faculty-directory-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const pageNumbers = getPageNumbers(currentPage, totalPages);
  const updateForm = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------
  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-md mb-xl">
        <div className="max-w-2xl">
          <h1 className="font-headline-xl text-headline-xl text-primary mb-xs">Faculty Management</h1>
          <p className="font-body-md text-on-surface-variant">
            Monitor academic staff performance, resource allocation, and continuous professional development
            progress across all departments.
          </p>
        </div>
        <Button onClick={openNew} className="flex items-center gap-sm">
          <UserPlus size={18} />
          Hire New Faculty
        </Button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
        <Card>
          <div className="flex items-start justify-between mb-md">
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wide">Resource Utilization</p>
            <span className="w-8 h-8 rounded bg-primary-fixed flex items-center justify-center">
              <BarChart3 size={16} className="text-primary" />
            </span>
          </div>
          <p className="font-headline-lg text-headline-lg text-primary mb-md"><Counter value={`${stats.utilization}%`} /></p>
          <div className="h-2 rounded-full bg-surface-variant overflow-hidden mb-sm">
            <div className="h-full bg-primary rounded-full" style={{ width: `${stats.utilization}%` }} />
          </div>
          <p className="font-body-sm text-on-surface-variant">
            Across {stats.departments} active departments. Target: 85%
          </p>
        </Card>

        <Card>
          <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wide mb-md">PD Completion</p>
          <p className="font-headline-lg text-headline-lg text-primary mb-md"><Counter value={`${stats.pd}%`} /></p>
          <p className="font-body-sm text-green-700 flex items-center gap-xs">
            <TrendingUp size={14} /> +4% from last quarter
          </p>
        </Card>

        <Card>
          <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wide mb-md">Total Staff</p>
          <p className="font-headline-lg text-headline-lg text-primary mb-md"><Counter value={stats.total} /></p>
          <AvatarStack members={faculty} />
        </Card>
      </div>

      {/* Directory */}
      <Card>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-md mb-lg">
            <h2 className="font-headline-sm text-headline-sm text-primary">Faculty Directory</h2>
            <div className="flex items-center gap-sm">
              <button
                onClick={() => setShowFilters((v) => !v)}
                className={`flex items-center gap-sm px-md py-sm rounded-lg border font-label-md text-label-md transition-colors ${
                  showFilters ? 'bg-primary text-on-primary border-primary' : 'border-outline-variant text-on-surface hover:bg-surface-container'
                }`}
              >
                <SlidersHorizontal size={16} /> Filters
              </button>
              <button
                onClick={exportCSV}
                className="flex items-center gap-sm px-md py-sm rounded-lg border border-outline-variant text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors"
              >
                <Download size={16} /> Export
              </button>
            </div>
          </div>

          {/* Collapsible filter panel */}
          {showFilters && (
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-lg mb-lg">
              <div className="relative mb-md max-w-md">
                <Search size={18} className="absolute left-md top-1/2 -translate-y-1/2 text-outline" />
                <input
                  className="w-full pl-xl pr-md py-sm bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md focus:outline-none focus:border-primary"
                  placeholder="Search faculty, roles, or departments..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <div className="flex flex-wrap items-end gap-md">
                <FilterSelect label="Department" value={draft.department} allLabel="All Departments"
                  onChange={(e) => setDraft((d) => ({ ...d, department: e.target.value }))}
                  options={DEPARTMENTS.map((d) => ({ value: d, label: d }))} />
                <FilterSelect label="Role" value={draft.role} allLabel="All Roles"
                  onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))}
                  options={ROLES.map((r) => ({ value: r, label: r }))} />
                <FilterSelect label="Status" value={draft.status} allLabel="Any Status"
                  onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
                  options={STATUSES.map((s) => ({ value: s, label: s }))} />
                <FilterSelect label="Sort By" value={draft.sort}
                  onChange={(e) => setDraft((d) => ({ ...d, sort: e.target.value }))}
                  options={[
                    { value: 'name-asc', label: 'Name (A-Z)' },
                    { value: 'name-desc', label: 'Name (Z-A)' },
                    { value: 'load-desc', label: 'Load (High-Low)' },
                    { value: 'load-asc', label: 'Load (Low-High)' },
                    { value: 'department', label: 'Department' },
                  ]} />
                <Button onClick={applyFilters}>Apply</Button>
                <button onClick={resetFilters} title="Reset filters"
                  className="p-sm rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors">
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>
          )}

          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Faculty Member</TableHeader>
                <TableHeader>Department</TableHeader>
                <TableHeader>Role</TableHeader>
                <TableHeader>Load</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader align="right">Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRows.map((member) => {
                const cat = loadCategory(member.load);
                return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-md">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-label-md text-label-sm shrink-0 ${avatarColor(member.id)}`}>
                          {getInitials(member.name)}
                        </div>
                        <div>
                          <p className="font-label-md text-body-md text-on-surface">{member.name}</p>
                          <p className="text-body-sm text-on-surface-variant">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>
                      <div className="w-32">
                        <div className="h-1.5 rounded-full bg-surface-variant overflow-hidden mb-xs">
                          <div className={`h-full rounded-full ${cat.bar}`} style={{ width: `${member.load}%` }} />
                        </div>
                        <p className={`text-label-sm ${cat.text}`}>{member.load}% ({cat.label})</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[member.status] || 'secondary'}>{member.status}</Badge>
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex items-center justify-end gap-sm">
                        <button onClick={() => openEdit(member)} title="Edit faculty"
                          className="p-xs rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => setDeleteTarget(member)} title="Remove faculty"
                          className="p-xs rounded text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filtered.length === 0 && (
            <div className="text-center py-xxl text-on-surface-variant">
              <p className="font-body-md">No faculty match your filters.</p>
              <button onClick={resetFilters} className="text-primary font-label-md hover:underline mt-sm">Clear filters</button>
            </div>
          )}

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-md pt-lg mt-lg border-t border-surface-variant">
              <p className="font-body-sm text-on-surface-variant">
                Showing {startIndex + 1}-{Math.min(startIndex + PAGE_SIZE, filtered.length)} of{' '}
                {filtered.length.toLocaleString()} faculty members
              </p>
              <div className="flex items-center gap-xs">
                <PageButton disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
                  <ChevronLeft size={16} />
                </PageButton>
                {pageNumbers.map((n, i) =>
                  n === '...' ? (
                    <span key={`gap-${i}`} className="px-sm text-on-surface-variant">…</span>
                  ) : (
                    <button key={n} onClick={() => setPage(n)}
                      className={`min-w-9 h-9 px-sm rounded-lg font-label-md text-label-md transition-colors ${
                        n === currentPage ? 'bg-primary text-on-primary' : 'border border-outline-variant text-on-surface hover:bg-surface-container'
                      }`}>
                      {n}
                    </button>
                  )
                )}
                <PageButton disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>
                  <ChevronRight size={16} />
                </PageButton>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Faculty' : 'Hire New Faculty'}
        actions={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={saveMember}>{editingId ? 'Save Changes' : 'Hire Faculty'}</Button>
          </>
        }
      >
        <form onSubmit={saveMember} className="space-y-xs">
          <Input label="Full Name" value={form.name} onChange={updateForm('name')} error={formErrors.name} placeholder="Dr. Jane Doe" />
          <Input label="Email" type="email" value={form.email} onChange={updateForm('email')} error={formErrors.email} placeholder="j.doe@bridges.edu" />
          <div className="grid grid-cols-2 gap-md">
            <ModalSelect label="Department" value={form.department} onChange={updateForm('department')} options={DEPARTMENTS.map((d) => ({ value: d, label: d }))} />
            <ModalSelect label="Role" value={form.role} onChange={updateForm('role')} options={ROLES.map((r) => ({ value: r, label: r }))} />
          </div>
          <div className="grid grid-cols-2 gap-md">
            <Input label="Load (%)" type="number" min="0" max="100" value={form.load} onChange={updateForm('load')} error={formErrors.load} />
            <ModalSelect label="Status" value={form.status} onChange={updateForm('status')} options={STATUSES.map((s) => ({ value: s, label: s }))} />
          </div>
          <Input label="PD Completion (%)" type="number" min="0" max="100" value={form.pd} onChange={updateForm('pd')} />
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Remove Faculty"
        actions={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Remove</Button>
          </>
        }
      >
        <p className="font-body-md text-on-surface">
          Are you sure you want to remove <span className="font-label-md">{deleteTarget?.name}</span> from the
          faculty directory? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

// ============================================================
// SUB-COMPONENTS
// ============================================================

const AvatarStack = ({ members }) => {
  const shown = members.slice(0, 4);
  const rest = members.length - shown.length;
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {shown.map((m) => (
          <div key={m.id}
            className={`w-8 h-8 rounded-full border-2 border-surface-container-lowest flex items-center justify-center text-label-sm font-label-md ${avatarColor(m.id)}`}>
            {getInitials(m.name)}
          </div>
        ))}
      </div>
      {rest > 0 && (
        <span className="ml-sm px-sm py-xs rounded-full bg-surface-container text-on-surface-variant text-label-sm font-label-md">
          +{rest}
        </span>
      )}
    </div>
  );
};

const FilterSelect = ({ label, value, onChange, options, allLabel }) => (
  <div className="min-w-[150px] flex-1">
    <label className="font-label-md text-label-sm text-on-surface-variant mb-xs block">{label}</label>
    <select className="input-field" value={value} onChange={onChange}>
      {allLabel && <option value="">{allLabel}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

const ModalSelect = ({ label, value, onChange, options }) => (
  <div className="mb-lg">
    <label className="font-label-md text-label-md text-on-surface mb-sm block">{label}</label>
    <select className="input-field" value={value} onChange={onChange}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

const PageButton = ({ children, disabled, onClick }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex items-center gap-xs h-9 px-md rounded-lg border border-outline-variant font-label-md text-label-md text-on-surface hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
  >
    {children}
  </button>
);

// ============================================================
// HELPERS
// ============================================================

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
}

export default FacultyManagement;
