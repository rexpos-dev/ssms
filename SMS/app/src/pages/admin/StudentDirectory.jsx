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
  Search,
  UserPlus,
  Pencil,
  Trash2,
  RefreshCw,
  Download,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Users,
  GraduationCap,
  ClipboardList,
} from 'lucide-react';

// ============================================================
// SEED DATA
// ============================================================

const SEED_STUDENTS = [
  { id: 1, studentId: 'BA-2022-0482', name: 'Jane Doe', joined: 'Aug 2022', grade: '11', section: 'A', guardian: 'Robert Doe', contact: '+1 (555) 902-3481', status: 'Active' },
  { id: 2, studentId: 'BA-2021-0115', name: 'Michael Smith', joined: 'Sep 2021', grade: '12', section: 'B', guardian: 'Sarah Smith', contact: '+1 (555) 123-4567', status: 'On Leave' },
  { id: 3, studentId: 'BA-2023-0912', name: 'Alice Lee', joined: 'Jan 2023', grade: '10', section: 'C', guardian: 'Kevin Lee', contact: '+1 (555) 789-0123', status: 'Active' },
  { id: 4, studentId: 'BA-2020-0004', name: 'David Wilson', joined: 'Aug 2020', grade: 'Graduate', section: 'A', guardian: 'Linda Wilson', contact: '+1 (555) 345-6789', status: 'Graduated' },
  { id: 5, studentId: 'BA-2022-0510', name: 'Elena Sterling', joined: 'Aug 2022', grade: '11', section: 'B', guardian: 'Marco Sterling', contact: '+1 (555) 221-8890', status: 'Active' },
  { id: 6, studentId: 'BA-2023-1001', name: 'Marcus Chen', joined: 'Jun 2023', grade: '9', section: 'A', guardian: 'Wei Chen', contact: '+1 (555) 660-1145', status: 'Pending' },
  { id: 7, studentId: 'BA-2021-0233', name: 'Aria Thorne', joined: 'Sep 2021', grade: '12', section: 'C', guardian: 'Diane Thorne', contact: '+1 (555) 412-7788', status: 'Active' },
  { id: 8, studentId: 'BA-2022-0666', name: 'Julian Ross', joined: 'Aug 2022', grade: '10', section: 'B', guardian: 'Patrick Ross', contact: '+1 (555) 933-2210', status: 'On Leave' },
  { id: 9, studentId: 'BA-2023-1190', name: 'Sophie Martin', joined: 'Jan 2023', grade: '9', section: 'D', guardian: 'Claire Martin', contact: '+1 (555) 100-4521', status: 'Active' },
  { id: 10, studentId: 'BA-2020-0078', name: 'Noah Patel', joined: 'Aug 2020', grade: 'Graduate', section: 'B', guardian: 'Anil Patel', contact: '+1 (555) 778-9012', status: 'Graduated' },
  { id: 11, studentId: 'BA-2022-0345', name: 'Olivia Brooks', joined: 'Aug 2022', grade: '11', section: 'C', guardian: 'Helen Brooks', contact: '+1 (555) 556-3344', status: 'Active' },
  { id: 12, studentId: 'BA-2023-1300', name: 'Liam Garcia', joined: 'Jun 2023', grade: '9', section: 'A', guardian: 'Maria Garcia', contact: '+1 (555) 224-5566', status: 'Pending' },
  { id: 13, studentId: 'BA-2021-0489', name: 'Emma Nguyen', joined: 'Sep 2021', grade: '12', section: 'A', guardian: 'Tuan Nguyen', contact: '+1 (555) 889-1234', status: 'Active' },
  { id: 14, studentId: 'BA-2022-0721', name: 'Ethan Clark', joined: 'Aug 2022', grade: '10', section: 'D', guardian: 'Grace Clark', contact: '+1 (555) 345-9988', status: 'Active' },
  { id: 15, studentId: 'BA-2023-1422', name: 'Ava Robinson', joined: 'Jan 2023', grade: '9', section: 'B', guardian: 'Derek Robinson', contact: '+1 (555) 667-1199', status: 'On Leave' },
  { id: 16, studentId: 'BA-2021-0590', name: 'Lucas Kim', joined: 'Sep 2021', grade: '11', section: 'A', guardian: 'Soo Kim', contact: '+1 (555) 998-7766', status: 'Active' },
];

const GRADES = ['9', '10', '11', '12', 'Graduate'];
const SECTIONS = ['A', 'B', 'C', 'D'];
const STATUSES = ['Active', 'On Leave', 'Graduated', 'Pending'];

const STATUS_VARIANT = {
  Active: 'success',
  'On Leave': 'warning',
  Graduated: 'secondary',
  Pending: 'error',
};

const AVATAR_COLORS = [
  'bg-primary-container text-on-primary-container',
  'bg-secondary text-on-secondary',
  'bg-tertiary-container text-on-tertiary-container',
  'bg-primary text-on-primary',
];

const PAGE_SIZE = 8;
const EMPTY_FORM = { studentId: '', name: '', joined: '', grade: '9', section: 'A', guardian: '', contact: '', status: 'Active' };

const getInitials = (name) =>
  name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

const avatarColor = (id) => AVATAR_COLORS[id % AVATAR_COLORS.length];

// ============================================================
// PAGE
// ============================================================

export const StudentDirectory = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState(SEED_STUDENTS);
  const [search, setSearch] = useState('');

  // Draft filters live in the controls; applied filters drive the table.
  const [draft, setDraft] = useState({ grade: '', section: '', status: '', sort: 'name-asc' });
  const [applied, setApplied] = useState({ grade: '', section: '', status: '', sort: 'name-asc' });
  const [page, setPage] = useState(1);

  // Add / edit modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ----------------------------------------------------------
  // Derived data: filter -> sort
  // ----------------------------------------------------------
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let result = students.filter((s) => {
      const matchesSearch =
        !term ||
        s.name.toLowerCase().includes(term) ||
        s.studentId.toLowerCase().includes(term);
      const matchesGrade = !applied.grade || s.grade === applied.grade;
      const matchesSection = !applied.section || s.section === applied.section;
      const matchesStatus = !applied.status || s.status === applied.status;
      return matchesSearch && matchesGrade && matchesSection && matchesStatus;
    });

    result = [...result].sort((a, b) => {
      switch (applied.sort) {
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'grade':
          return a.grade.localeCompare(b.grade, undefined, { numeric: true });
        case 'id':
          return a.studentId.localeCompare(b.studentId);
        case 'name-asc':
        default:
          return a.name.localeCompare(b.name);
      }
    });
    return result;
  }, [students, search, applied]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  // KPIs derived from full dataset
  const stats = useMemo(
    () => ({
      total: students.length,
      active: students.filter((s) => s.status === 'Active').length,
      graduated: students.filter((s) => s.status === 'Graduated').length,
      pending: students.filter((s) => s.status === 'Pending').length,
    }),
    [students]
  );

  // ----------------------------------------------------------
  // Handlers
  // ----------------------------------------------------------
  const applyFilters = () => {
    setApplied(draft);
    setPage(1);
  };

  const resetFilters = () => {
    const cleared = { grade: '', section: '', status: '', sort: 'name-asc' };
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

  const openEdit = (student) => {
    setEditingId(student.id);
    setForm({ ...student });
    setFormErrors({});
    setModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Full name is required';
    if (!form.studentId.trim()) errors.studentId = 'Student ID is required';
    if (!form.guardian.trim()) errors.guardian = 'Guardian is required';
    if (!form.contact.trim()) errors.contact = 'Contact is required';
    return errors;
  };

  const saveStudent = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (editingId) {
      setStudents((prev) => prev.map((s) => (s.id === editingId ? { ...s, ...form } : s)));
    } else {
      const nextId = students.reduce((max, s) => Math.max(max, s.id), 0) + 1;
      const joined = form.joined.trim() || new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' });
      setStudents((prev) => [{ ...form, id: nextId, joined }, ...prev]);
      setPage(1);
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    setStudents((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const exportCSV = () => {
    const headers = ['Student ID', 'Name', 'Joined', 'Grade', 'Section', 'Guardian', 'Contact', 'Status'];
    const rows = filtered.map((s) =>
      [s.studentId, s.name, s.joined, s.grade, s.section, s.guardian, s.contact, s.status]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `student-directory-${new Date().toISOString().slice(0, 10)}.csv`;
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
        <div>
          <h1 className="font-headline-xl text-headline-xl text-primary mb-xs">Student Directory</h1>
          <p className="font-body-md text-on-surface-variant">
            Manage and track student information across all academic sections.
          </p>
        </div>
        <Button onClick={openNew} className="flex items-center gap-sm">
          <UserPlus size={18} />
          New Enrollment
        </Button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
        <StatCard icon={Users} label="Total Students" value={stats.total.toLocaleString()} note="+4% from last month" noteClass="text-green-700" />
        <StatCard icon={ClipboardList} label="Active Enrollment" value={stats.active.toLocaleString()} note="94.7% Attendance rate" />
        <StatCard icon={GraduationCap} label="Graduated (YTD)" value={stats.graduated.toLocaleString()} note="Class of 2024" />
        <StatCard icon={RefreshCw} label="Pending Records" value={stats.pending.toLocaleString()} note="Action required" noteClass="text-error" />
      </div>

      {/* Filter bar */}
      <Card className="mb-lg">
        <CardContent className="flex flex-wrap items-end gap-md">
          <FilterSelect
            label="Grade Level"
            value={draft.grade}
            onChange={(e) => setDraft((d) => ({ ...d, grade: e.target.value }))}
            allLabel="All Grades"
            options={GRADES.map((g) => ({ value: g, label: g === 'Graduate' ? 'Graduate' : `Grade ${g}` }))}
          />
          <FilterSelect
            label="Section"
            value={draft.section}
            onChange={(e) => setDraft((d) => ({ ...d, section: e.target.value }))}
            allLabel="All Sections"
            options={SECTIONS.map((s) => ({ value: s, label: `Section ${s}` }))}
          />
          <FilterSelect
            label="Status"
            value={draft.status}
            onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
            allLabel="Any Status"
            options={STATUSES.map((s) => ({ value: s, label: s }))}
          />
          <FilterSelect
            label="Sort By"
            value={draft.sort}
            onChange={(e) => setDraft((d) => ({ ...d, sort: e.target.value }))}
            options={[
              { value: 'name-asc', label: 'Name (A-Z)' },
              { value: 'name-desc', label: 'Name (Z-A)' },
              { value: 'grade', label: 'Grade Level' },
              { value: 'id', label: 'Student ID' },
            ]}
          />
          <Button onClick={applyFilters}>Apply Filters</Button>
          <button
            onClick={resetFilters}
            title="Reset filters"
            className="p-sm rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <RefreshCw size={18} />
          </button>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent>
          {/* Search inside the table card */}
          <div className="relative mb-lg max-w-md">
            <Search size={18} className="absolute left-md top-1/2 -translate-y-1/2 text-outline" />
            <input
              className="w-full pl-xl pr-md py-sm bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:outline-none focus:border-primary"
              placeholder="Search by name or student ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Student Name</TableHeader>
                <TableHeader>Student ID</TableHeader>
                <TableHeader>Grade/Section</TableHeader>
                <TableHeader>Guardian</TableHeader>
                <TableHeader>Contact</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader align="right">Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRows.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-md">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-label-md text-label-sm shrink-0 ${avatarColor(student.id)}`}>
                        {getInitials(student.name)}
                      </div>
                      <div>
                        <p className="font-label-md text-body-md text-on-surface">{student.name}</p>
                        <p className="text-body-sm text-on-surface-variant">Joined {student.joined}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>
                    {student.grade === 'Graduate' ? 'Graduate' : `Grade ${student.grade}`} • Section {student.section}
                  </TableCell>
                  <TableCell>{student.guardian}</TableCell>
                  <TableCell>{student.contact}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[student.status] || 'secondary'}>{student.status}</Badge>
                  </TableCell>
                  <TableCell align="right">
                    <div className="flex items-center justify-end gap-sm">
                      <button
                        onClick={() => openEdit(student)}
                        title="Edit student"
                        className="p-xs rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(student)}
                        title="Delete student"
                        className="p-xs rounded text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filtered.length === 0 && (
            <div className="text-center py-xxl text-on-surface-variant">
              <p className="font-body-md">No students match your filters.</p>
              <button onClick={resetFilters} className="text-primary font-label-md hover:underline mt-sm">
                Clear filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-md pt-lg mt-lg border-t border-surface-variant">
              <p className="font-body-sm text-on-surface-variant">
                Showing {startIndex + 1} to {Math.min(startIndex + PAGE_SIZE, filtered.length)} of{' '}
                {filtered.length.toLocaleString()} students
              </p>
              <div className="flex items-center gap-xs">
                <PageButton disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
                  <ChevronLeft size={16} /> Previous
                </PageButton>
                {pageNumbers.map((n, i) =>
                  n === '...' ? (
                    <span key={`gap-${i}`} className="px-sm text-on-surface-variant">…</span>
                  ) : (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`min-w-9 h-9 px-sm rounded-lg font-label-md text-label-md transition-colors ${
                        n === currentPage
                          ? 'bg-primary text-on-primary'
                          : 'border border-outline-variant text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      {n}
                    </button>
                  )
                )}
                <PageButton disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>
                  Next <ChevronRight size={16} />
                </PageButton>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mt-xl">
        <Card className="bg-primary text-on-primary">
          <h3 className="font-headline-sm text-headline-sm mb-xs">Generate Registry Report</h3>
          <p className="font-body-sm text-on-primary/80 mb-lg">
            Download the current filtered view as a CSV spreadsheet for administrative filing.
          </p>
          <Button variant="secondary" onClick={exportCSV} className="bg-on-primary text-primary border-on-primary flex items-center gap-sm">
            <Download size={18} />
            Export Data
          </Button>
        </Card>
        <Card>
          <h3 className="font-headline-sm text-headline-sm text-primary mb-xs">Academic Calendars</h3>
          <p className="font-body-sm text-on-surface-variant mb-lg">
            View all upcoming enrollment deadlines, exam schedules, and holiday periods for this semester.
          </p>
          <Button variant="secondary" onClick={() => navigate('/admin/calendar')} className="flex items-center gap-sm">
            <CalendarDays size={18} />
            View Calendar
          </Button>
        </Card>
      </div>

      {/* Add / Edit modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Student' : 'New Enrollment'}
        actions={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={saveStudent}>{editingId ? 'Save Changes' : 'Enroll Student'}</Button>
          </>
        }
      >
        <form onSubmit={saveStudent} className="space-y-xs">
          <Input label="Full Name" value={form.name} onChange={updateForm('name')} error={formErrors.name} placeholder="Jane Doe" />
          <Input label="Student ID" value={form.studentId} onChange={updateForm('studentId')} error={formErrors.studentId} placeholder="BA-2026-0001" />
          <div className="grid grid-cols-2 gap-md">
            <ModalSelect label="Grade Level" value={form.grade} onChange={updateForm('grade')} options={GRADES.map((g) => ({ value: g, label: g === 'Graduate' ? 'Graduate' : `Grade ${g}` }))} />
            <ModalSelect label="Section" value={form.section} onChange={updateForm('section')} options={SECTIONS.map((s) => ({ value: s, label: `Section ${s}` }))} />
          </div>
          <Input label="Guardian" value={form.guardian} onChange={updateForm('guardian')} error={formErrors.guardian} placeholder="Robert Doe" />
          <Input label="Contact" value={form.contact} onChange={updateForm('contact')} error={formErrors.contact} placeholder="+1 (555) 000-0000" />
          <ModalSelect label="Status" value={form.status} onChange={updateForm('status')} options={STATUSES.map((s) => ({ value: s, label: s }))} />
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Student"
        actions={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <p className="font-body-md text-on-surface">
          Are you sure you want to remove <span className="font-label-md">{deleteTarget?.name}</span> ({deleteTarget?.studentId})
          from the directory? This action cannot be undone.
        </p>
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

export default StudentDirectory;
