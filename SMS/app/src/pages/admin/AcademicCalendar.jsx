import { useState, useMemo } from 'react';
import { Card, Input, Button, Modal } from '../../components/ui';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  SlidersHorizontal,
  CalendarDays,
  RefreshCw,
  Pencil,
  Trash2,
} from 'lucide-react';

// ============================================================
// CONFIG + SEED DATA
// ============================================================

const CATEGORIES = {
  academic: { label: 'Academic', dot: 'bg-primary', chip: 'bg-primary-fixed text-on-primary-fixed-variant' },
  admin: { label: 'Admin', dot: 'bg-secondary', chip: 'bg-secondary-fixed text-on-secondary-fixed-variant' },
  extracurricular: { label: 'Extracurricular', dot: 'bg-teal-500', chip: 'bg-teal-100 text-teal-800' },
};

const SEED_EVENTS = [
  { id: 1, title: 'Mid-Term Exams', date: '2024-10-05', time: '08:00 AM', location: 'Exam Halls', category: 'academic' },
  { id: 2, title: 'Board Meeting', date: '2024-10-12', time: '10:00 AM', location: 'Conference Room', category: 'admin' },
  { id: 3, title: 'Fall Arts Festival', date: '2024-10-14', time: '09:00 AM', location: 'Main Hall', category: 'extracurricular' },
  { id: 4, title: 'Faculty Development', date: '2024-10-20', time: '02:00 PM', location: 'Room 402', category: 'admin' },
  { id: 5, title: 'Project Deadline', date: '2024-10-28', time: '05:00 PM', location: 'Online', category: 'academic' },
  { id: 6, title: 'Q1 Grade Submission', date: '2024-10-28', time: '11:59 PM', location: 'Portal', category: 'academic' },
  { id: 7, title: 'Board Meeting', date: '2024-10-12', time: '10:00 AM', location: 'Conference Room', category: 'admin' },
  { id: 8, title: 'Faculty Workshop', date: '2024-10-20', time: '01:00 PM', location: 'Room 210', category: 'admin' },
];

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const TERM_PROGRESS = 64;
const EMPTY_FORM = { title: '', date: '', time: '09:00 AM', location: '', category: 'academic' };

// ============================================================
// DATE HELPERS
// ============================================================

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const addMonths = (d, n) => { const r = new Date(d); r.setMonth(r.getMonth() + n); return r; };
const startOfWeek = (d) => addDays(d, -((d.getDay() + 6) % 7)); // Monday
const sameDay = (a, b) => iso(a) === b;

const monthMatrix = (viewDate) => {
  const first = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const start = startOfWeek(first);
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
};

const fmtMonth = (d) => d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
const fmtDayLong = (d) => d.toLocaleString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
const fmtShort = (d) => d.toLocaleString('en-US', { month: 'short', day: 'numeric' });

// ============================================================
// PAGE
// ============================================================

export const AcademicCalendar = () => {
  const [events, setEvents] = useState(SEED_EVENTS);
  const [cursor, setCursor] = useState(new Date(2024, 9, 1)); // October 2024
  const [view, setView] = useState('month'); // month | week | day
  const [search, setSearch] = useState('');
  const [enabled, setEnabled] = useState({ academic: true, admin: true, extracurricular: true });
  const [synced, setSynced] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ----------------------------------------------------------
  // Derived
  // ----------------------------------------------------------
  const visibleEvents = useMemo(() => {
    const term = search.trim().toLowerCase();
    return events.filter(
      (e) => enabled[e.category] && (!term || e.title.toLowerCase().includes(term) || e.location.toLowerCase().includes(term))
    );
  }, [events, enabled, search]);

  const eventsByDate = useMemo(() => {
    const map = {};
    visibleEvents.forEach((e) => {
      (map[e.date] = map[e.date] || []).push(e);
    });
    return map;
  }, [visibleEvents]);

  const comingUp = useMemo(
    () => [...visibleEvents].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)).slice(0, 3),
    [visibleEvents]
  );

  const title =
    view === 'month' ? fmtMonth(cursor)
    : view === 'week' ? `${fmtShort(startOfWeek(cursor))} – ${fmtShort(addDays(startOfWeek(cursor), 6))}, ${cursor.getFullYear()}`
    : fmtDayLong(cursor);

  // ----------------------------------------------------------
  // Handlers
  // ----------------------------------------------------------
  const navigate = (dir) => {
    if (view === 'month') setCursor((c) => addMonths(c, dir));
    else if (view === 'week') setCursor((c) => addDays(c, dir * 7));
    else setCursor((c) => addDays(c, dir));
  };

  const toggleCategory = (key) => setEnabled((e) => ({ ...e, [key]: !e[key] }));

  const openNew = (dateStr) => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, date: dateStr || iso(cursor) });
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (event) => {
    setEditingId(event.id);
    setForm({ ...event });
    setFormErrors({});
    setModalOpen(true);
  };

  const saveEvent = (e) => {
    e.preventDefault();
    const errors = {};
    if (!form.title.trim()) errors.title = 'Title is required';
    if (!form.date) errors.date = 'Date is required';
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    if (editingId) {
      setEvents((prev) => prev.map((ev) => (ev.id === editingId ? { ...ev, ...form } : ev)));
    } else {
      const nextId = events.reduce((max, ev) => Math.max(max, ev.id), 0) + 1;
      setEvents((prev) => [...prev, { ...form, id: nextId }]);
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    setEvents((prev) => prev.filter((ev) => ev.id !== deleteTarget.id));
    setDeleteTarget(null);
    setModalOpen(false);
  };

  const updateForm = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const agendaDays =
    view === 'week' ? Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(cursor), i)) : [cursor];

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------
  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-md mb-lg">
        <h1 className="font-headline-xl text-headline-xl text-primary">Academic Calendar</h1>
        <div className="relative w-full max-w-xs">
          <Search size={18} className="absolute left-md top-1/2 -translate-y-1/2 text-outline" />
          <input
            className="w-full pl-xl pr-md py-sm bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:outline-none focus:border-primary"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Toolbar: view toggle + category filters */}
      <div className="flex flex-wrap items-center justify-between gap-md mb-lg">
        <div className="inline-flex rounded-lg border border-outline-variant overflow-hidden">
          {['month', 'week', 'day'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-lg py-sm font-label-md text-label-md capitalize transition-colors ${
                view === v ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-lg">
          {Object.entries(CATEGORIES).map(([key, meta]) => (
            <label key={key} className="flex items-center gap-sm cursor-pointer select-none">
              <input type="checkbox" checked={enabled[key]} onChange={() => toggleCategory(key)} className="rounded" />
              <span className={`w-2.5 h-2.5 rounded-full ${meta.dot}`} />
              <span className="font-label-md text-label-md text-on-surface">{meta.label}</span>
            </label>
          ))}
          <button className="flex items-center gap-sm px-md py-sm rounded-lg border border-outline-variant text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors">
            <SlidersHorizontal size={16} /> More Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-lg">
        {/* Calendar */}
        <Card>
          <div className="flex items-center justify-between mb-lg">
            <div className="flex items-center gap-sm">
              <h2 className="font-headline-sm text-headline-sm text-primary">{title}</h2>
              <button onClick={() => navigate(-1)} className="p-xs rounded hover:bg-surface-container text-on-surface-variant"><ChevronLeft size={20} /></button>
              <button onClick={() => navigate(1)} className="p-xs rounded hover:bg-surface-container text-on-surface-variant"><ChevronRight size={20} /></button>
            </div>
            <Button onClick={() => openNew()} className="flex items-center gap-sm">
              <Plus size={18} /> Add Event
            </Button>
          </div>

          {view === 'month' ? (
            <MonthGrid cursor={cursor} eventsByDate={eventsByDate} onDayClick={openNew} onEventClick={openEdit} />
          ) : (
            <AgendaView days={agendaDays} eventsByDate={eventsByDate} onEventClick={openEdit} onDayClick={openNew} />
          )}
        </Card>

        {/* Sidebar */}
        <div className="space-y-lg">
          <Card>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wide mb-xs">Term Progress</p>
            <p className="font-headline-md text-headline-md text-primary mb-md">{TERM_PROGRESS}%</p>
            <div className="h-2 rounded-full bg-surface-variant overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${TERM_PROGRESS}%` }} />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-md">
              <h3 className="font-headline-sm text-headline-sm text-primary">Coming Up</h3>
              <button onClick={() => setSearch('')} className="text-primary font-label-md text-label-md hover:underline">View All</button>
            </div>
            <div className="space-y-md">
              {comingUp.length === 0 && <p className="text-body-sm text-on-surface-variant">No upcoming events.</p>}
              {comingUp.map((e) => {
                const d = new Date(`${e.date}T00:00:00`);
                return (
                  <button key={e.id} onClick={() => openEdit(e)} className="w-full flex gap-md text-left group">
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-surface-container shrink-0">
                      <span className="text-label-sm text-on-surface-variant uppercase">{d.toLocaleString('en-US', { month: 'short' })}</span>
                      <span className="font-headline-sm text-headline-sm text-primary leading-none">{d.getDate()}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-label-md text-body-md text-on-surface group-hover:text-primary truncate">{e.title}</p>
                      <p className="text-body-sm text-on-surface-variant">{e.time} • {e.location}</p>
                      <span className={`inline-block mt-xs px-sm py-px rounded text-label-sm ${CATEGORIES[e.category].chip}`}>
                        {CATEGORIES[e.category].label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="bg-tertiary text-on-tertiary">
            <h3 className="font-headline-sm text-headline-sm mb-xs">Sync Calendar</h3>
            <p className="font-body-sm text-on-tertiary-container mb-lg">
              Export Bridges Academy schedule to your personal calendar.
            </p>
            <button
              onClick={() => { setSynced(true); setTimeout(() => setSynced(false), 2000); }}
              className="w-full flex items-center justify-center gap-sm bg-primary-container text-on-primary-container py-sm rounded-lg font-label-md text-label-md active:scale-95 transition-transform"
            >
              <RefreshCw size={16} /> {synced ? 'Synced ✓' : 'Sync Now'}
            </button>
          </Card>
        </div>
      </div>

      {/* Add / Edit modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Event' : 'Add Event'}
        actions={
          <>
            {editingId && (
              <Button variant="danger" onClick={() => setDeleteTarget(events.find((e) => e.id === editingId))} className="mr-auto flex items-center gap-sm">
                <Trash2 size={16} /> Delete
              </Button>
            )}
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={saveEvent}>{editingId ? 'Save Changes' : 'Add Event'}</Button>
          </>
        }
      >
        <form onSubmit={saveEvent} className="space-y-xs">
          <Input label="Event Title" value={form.title} onChange={updateForm('title')} error={formErrors.title} placeholder="Mid-Term Exams" />
          <div className="grid grid-cols-2 gap-md">
            <Input label="Date" type="date" value={form.date} onChange={updateForm('date')} error={formErrors.date} />
            <Input label="Time" value={form.time} onChange={updateForm('time')} placeholder="09:00 AM" />
          </div>
          <Input label="Location" value={form.location} onChange={updateForm('location')} placeholder="Main Hall" />
          <div className="mb-lg">
            <label className="font-label-md text-label-md text-on-surface mb-sm block">Category</label>
            <select className="input-field" value={form.category} onChange={updateForm('category')}>
              {Object.entries(CATEGORIES).map(([key, meta]) => (
                <option key={key} value={key}>{meta.label}</option>
              ))}
            </select>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Event"
        actions={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <p className="font-body-md text-on-surface">
          Delete <span className="font-label-md">{deleteTarget?.title}</span>? This cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

// ============================================================
// SUB-COMPONENTS
// ============================================================

const MonthGrid = ({ cursor, eventsByDate, onDayClick, onEventClick }) => {
  const days = monthMatrix(cursor);
  const month = cursor.getMonth();
  const todayIso = iso(new Date());

  return (
    <div>
      <div className="grid grid-cols-7 border-b border-outline-variant">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-sm text-center font-label-sm text-label-sm text-on-surface-variant">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const key = iso(day);
          const inMonth = day.getMonth() === month;
          const dayEvents = eventsByDate[key] || [];
          return (
            <div
              key={key}
              onClick={() => onDayClick(key)}
              className={`min-h-[92px] border-b border-r border-outline-variant p-xs cursor-pointer hover:bg-surface-container-low transition-colors ${
                inMonth ? '' : 'bg-surface-container-low/50'
              }`}
            >
              <span className={`text-label-md ${
                key === todayIso ? 'bg-primary text-on-primary rounded-full w-6 h-6 inline-flex items-center justify-center'
                : inMonth ? 'text-on-surface' : 'text-outline'
              }`}>
                {day.getDate()}
              </span>
              <div className="mt-xs space-y-px">
                {dayEvents.slice(0, 3).map((e) => (
                  <button
                    key={e.id}
                    onClick={(ev) => { ev.stopPropagation(); onEventClick(e); }}
                    className={`block w-full text-left truncate px-xs py-px rounded text-label-sm ${CATEGORIES[e.category].chip}`}
                    title={`${e.title} • ${e.time}`}
                  >
                    {e.title}
                  </button>
                ))}
                {dayEvents.length > 3 && (
                  <span className="block text-label-sm text-on-surface-variant px-xs">+{dayEvents.length - 3} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AgendaView = ({ days, eventsByDate, onEventClick, onDayClick }) => (
  <div className="divide-y divide-surface-variant">
    {days.map((day) => {
      const key = iso(day);
      const dayEvents = (eventsByDate[key] || []).sort((a, b) => a.time.localeCompare(b.time));
      return (
        <div key={key} className="py-md flex gap-lg">
          <button onClick={() => onDayClick(key)} className="w-24 shrink-0 text-left">
            <p className="font-label-md text-label-md text-on-surface">{day.toLocaleString('en-US', { weekday: 'short' })}</p>
            <p className="font-headline-sm text-headline-sm text-primary">{day.getDate()}</p>
            <p className="text-label-sm text-on-surface-variant">{day.toLocaleString('en-US', { month: 'short' })}</p>
          </button>
          <div className="flex-1 space-y-sm">
            {dayEvents.length === 0 && <p className="text-body-sm text-on-surface-variant py-sm">No events</p>}
            {dayEvents.map((e) => (
              <button
                key={e.id}
                onClick={() => onEventClick(e)}
                className="w-full flex items-center gap-md p-sm rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors text-left"
              >
                <span className={`w-1.5 h-10 rounded-full ${CATEGORIES[e.category].dot}`} />
                <div className="min-w-0">
                  <p className="font-label-md text-body-md text-on-surface truncate">{e.title}</p>
                  <p className="text-body-sm text-on-surface-variant">{e.time} • {e.location}</p>
                </div>
                <span className={`ml-auto px-sm py-px rounded text-label-sm shrink-0 ${CATEGORIES[e.category].chip}`}>
                  {CATEGORIES[e.category].label}
                </span>
              </button>
            ))}
          </div>
        </div>
      );
    })}
  </div>
);

export default AcademicCalendar;
