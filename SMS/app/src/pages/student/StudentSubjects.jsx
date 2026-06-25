import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, MessagesSquare, BookOpen, FlaskConical, Atom, Landmark,
  GraduationCap, Search, Check,
} from 'lucide-react';

const SUBJECTS = [
  { id: 1, size: 'feature', code: 'MATH402', codeCls: 'bg-primary-fixed text-on-primary-fixed-variant', name: 'AP Calculus BC', instructor: 'Dr. Elena Rodriguez', grade: '94%', letter: 'A', desc: 'An intensive exploration of differential and integral calculus, including sequences, series, and polar coordinates. Designed for advanced engineering and physics pathways.' },
  { id: 2, size: 'side', code: 'ECON301', codeCls: 'bg-secondary-fixed text-on-secondary-fixed-variant', name: 'Advanced Microeconomics', instructor: 'Prof. Marcus Chen', progress: 88, letter: 'B+' },
  { id: 3, size: 'media', icon: BookOpen, code: 'ENGL404', codeCls: 'bg-tertiary-fixed text-on-tertiary-fixed-variant', name: 'World Literature IV', instructor: 'Dr. Sarah Jenkins', grade: '92%', desc: 'Focusing on Post-Modernist movements across the Eastern hemisphere. Recent studies in Murakami and Desai.' },
  { id: 4, size: 'circle', code: 'CHEM301', codeCls: 'bg-error-container text-on-error-container', name: 'Organic Chemistry I', instructor: 'Dr. Julian Vane', ring: 85, desc: 'Foundational concepts in molecular structure, bonding, and reaction mechanisms of carbon-based compounds.', lab: true },
  { id: 5, size: 'media', icon: Atom, code: 'PHYS210', codeCls: 'bg-secondary-fixed text-on-secondary-fixed-variant', name: 'Physics II', instructor: 'Prof. James Chen', grade: '89%', desc: 'Electromagnetism, waves, and an introduction to modern physics with weekly problem workshops.' },
  { id: 6, size: 'circle', icon: Landmark, code: 'HIST150', codeCls: 'bg-tertiary-fixed text-on-tertiary-fixed-variant', name: 'Modern World History', instructor: 'Mr. William Foster', ring: 91, desc: 'Global political and social movements from the Renaissance to the present day.' },
];

export default function StudentSubjects() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [banner, setBanner] = useState(null);
  const flash = (msg) => { setBanner(msg); setTimeout(() => setBanner(null), 2400); };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SUBJECTS;
    return SUBJECTS.filter((s) => s.name.toLowerCase().includes(q) || s.instructor.toLowerCase().includes(q) || s.code.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="space-y-xl">
      {banner && <div className="fixed top-20 right-8 z-[70] bg-primary text-on-primary px-lg py-md rounded-xl shadow-[0_12px_32px_rgba(0,6,102,0.35)] flex items-center gap-sm font-label-md animate-fade-up"><Check size={18} /> {banner}</div>}

      {/* welcome */}
      <section>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-lg">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-primary">My Subjects</h1>
            <p className="font-body-md text-on-surface-variant mt-xs">Spring Semester 2024 • Academic Overview</p>
          </div>
          <div className="relative w-full max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search courses, instructors…" className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-2 pl-10 pr-4 text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
        </div>
        <div className="mt-lg inline-flex bg-primary text-on-primary px-xl py-lg rounded-2xl shadow-sm items-center gap-xl">
          <div><p className="font-label-sm opacity-80 uppercase tracking-wider">Current GPA</p><p className="font-headline-xl text-headline-xl">3.92</p></div>
          <div className="h-12 w-px bg-white/20" />
          <div><p className="font-label-sm opacity-80 uppercase tracking-wider">Credits Enrolled</p><p className="font-headline-xl text-headline-xl">18</p></div>
        </div>
      </section>

      {/* bento */}
      <div className="grid grid-cols-12 gap-gutter">
        {visible.length === 0 && <div className="col-span-12 card text-center py-xxl text-on-surface-variant">No subjects match “{query}”.</div>}
        {visible.map((s) => {
          if (s.size === 'feature') return <FeatureCard key={s.id} s={s} navigate={navigate} flash={flash} />;
          if (s.size === 'side') return <SideCard key={s.id} s={s} flash={flash} />;
          if (s.size === 'media') return <MediaCard key={s.id} s={s} flash={flash} />;
          return <CircleCard key={s.id} s={s} flash={flash} />;
        })}

        {/* catalog banner */}
        <div className="col-span-12 bg-primary-container text-on-primary-container p-xl rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-lg">
          <div className="max-w-2xl">
            <h4 className="font-headline-sm text-headline-sm mb-xs text-white">Looking to expand your curriculum?</h4>
            <p className="font-body-md opacity-90">Enrollment for Summer Session 2024 Electives is now open. Explore over 40 new interdisciplinary courses in Emerging Tech and Global Policy.</p>
          </div>
          <button onClick={() => flash('Opening course catalog…')} className="bg-on-primary-container text-primary-container px-xl py-md rounded-lg font-bold hover:scale-105 transition-transform shrink-0">Browse Catalog</button>
        </div>
      </div>
    </div>
  );
}

function Code({ s }) {
  return <span className={`font-label-sm px-sm py-xs rounded-lg mb-sm inline-block ${s.codeCls}`}>{s.code}</span>;
}

function FeatureCard({ s, navigate, flash }) {
  return (
    <div className="col-span-12 md:col-span-8 card flex flex-col justify-between hover:border-secondary transition-colors">
      <div>
        <div className="flex justify-between items-start mb-md gap-md">
          <div>
            <Code s={s} />
            <h4 className="font-headline-md text-headline-md text-primary">{s.name}</h4>
            <p className="font-body-md text-on-surface-variant mt-xs">Instructor: {s.instructor}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-label-sm text-on-surface-variant uppercase tracking-widest">Current Grade</p>
            <p className="font-headline-lg text-headline-lg text-primary">{s.grade} <span className="text-headline-sm font-normal text-on-surface-variant">({s.letter})</span></p>
          </div>
        </div>
        <p className="font-body-md text-on-surface-variant line-clamp-2 mb-lg">{s.desc}</p>
      </div>
      <div className="flex items-center justify-between pt-md border-t border-surface-variant gap-md flex-wrap">
        <div className="flex gap-md">
          <button onClick={() => flash(`Opening ${s.name} syllabus…`)} className="flex items-center gap-xs text-primary font-label-md hover:underline"><FileText size={18} /> Syllabus</button>
          <button onClick={() => navigate('/student/communication')} className="flex items-center gap-xs text-primary font-label-md hover:underline"><MessagesSquare size={18} /> Course Chat</button>
        </div>
        <button onClick={() => flash('Opening course materials…')} className="bg-primary text-on-primary font-label-md px-lg py-sm rounded-lg hover:opacity-90 transition-opacity">View Course Materials</button>
      </div>
    </div>
  );
}

function SideCard({ s, flash }) {
  return (
    <div className="col-span-12 md:col-span-4 card flex flex-col hover:border-secondary transition-colors">
      <div className="mb-md">
        <Code s={s} />
        <h4 className="font-headline-sm text-headline-sm text-primary">{s.name}</h4>
        <p className="font-body-sm text-on-surface-variant mt-xs">{s.instructor}</p>
      </div>
      <div className="bg-surface-container-low rounded-lg p-md mb-lg">
        <div className="flex justify-between items-center mb-xs"><p className="font-label-sm text-on-surface-variant">Grade Progress</p><p className="font-label-md font-bold">{s.progress}% ({s.letter})</p></div>
        <div className="w-full bg-outline-variant h-1 rounded-full overflow-hidden"><div className="bg-secondary h-1 rounded-full" style={{ width: `${s.progress}%` }} /></div>
      </div>
      <button onClick={() => flash('Opening course materials…')} className="mt-auto w-full border border-secondary text-secondary font-label-md py-sm rounded-lg hover:bg-secondary-fixed transition-colors">Course Materials</button>
    </div>
  );
}

function MediaCard({ s, flash }) {
  const Icon = s.icon || BookOpen;
  return (
    <div className="col-span-12 md:col-span-6 card flex flex-col hover:border-secondary transition-colors">
      <div className="flex items-start gap-lg mb-lg">
        <div className="w-24 h-24 rounded-lg bg-tertiary-fixed flex items-center justify-center text-primary shrink-0"><Icon size={40} /></div>
        <div><Code s={s} /><h4 className="font-headline-sm text-headline-sm text-primary">{s.name}</h4><p className="font-body-sm text-on-surface-variant">{s.instructor}</p></div>
      </div>
      <p className="font-body-md text-on-surface-variant mb-lg">{s.desc}</p>
      <div className="flex items-center justify-between border-t border-surface-variant pt-md mt-auto">
        <div><p className="font-label-sm text-on-surface-variant">Grade</p><p className="font-headline-sm text-headline-sm text-primary">{s.grade}</p></div>
        <button onClick={() => flash(`Entering ${s.name} classroom…`)} className="bg-primary text-on-primary font-label-md px-lg py-sm rounded-lg hover:opacity-90 transition-opacity">Enter Classroom</button>
      </div>
    </div>
  );
}

function CircleCard({ s, flash }) {
  return (
    <div className="col-span-12 md:col-span-6 card flex flex-col hover:border-secondary transition-colors">
      <div className="flex justify-between items-start mb-md gap-md">
        <div><Code s={s} /><h4 className="font-headline-sm text-headline-sm text-primary">{s.name}</h4><p className="font-body-sm text-on-surface-variant mt-xs">{s.instructor}</p></div>
        <div className="relative w-14 h-14 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="5" className="text-secondary/20" /><circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className="text-secondary" strokeDasharray={2 * Math.PI * 20} strokeDashoffset={2 * Math.PI * 20 * (1 - s.ring / 100)} /></svg>
          <span className="absolute inset-0 flex items-center justify-center font-label-sm font-bold">{s.ring}%</span>
        </div>
      </div>
      <p className="font-body-md text-on-surface-variant mb-lg">{s.desc}</p>
      <div className="flex gap-md mt-auto">
        <button onClick={() => flash('Opening course materials…')} className="flex-1 bg-primary text-on-primary font-label-md py-sm rounded-lg hover:opacity-90 transition-opacity">Course Materials</button>
        {s.lab && <button onClick={() => flash('Opening lab schedule…')} className="flex-1 border border-outline text-on-surface-variant font-label-md py-sm rounded-lg hover:bg-surface-variant transition-colors">Lab Schedule</button>}
      </div>
    </div>
  );
}
