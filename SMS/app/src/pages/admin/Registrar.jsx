import { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Textarea, Button, Badge, Modal } from '../../components/ui';
import {
  User,
  GraduationCap,
  FileText,
  ClipboardCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Camera,
  Upload,
  Save,
  Star,
  BookOpen,
  Activity,
  Palette,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  PartyPopper,
} from 'lucide-react';

// ============================================================
// CONFIG
// ============================================================

const STEPS = [
  { label: 'Personal Info', icon: User },
  { label: 'Academic History', icon: GraduationCap },
  { label: 'Documents', icon: FileText },
  { label: 'Review & Submit', icon: ClipboardCheck },
];

const GRADES = ['Nursery', 'Kindergarten', ...Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`)];
const RELATIONS = ['Mother', 'Father', 'Guardian', 'Grandparent', 'Sibling', 'Other'];

const DOC_DEFS = [
  { key: 'photo', title: 'Student 2x2 Photo', hint: 'White background, face occupies 80% of the frame.', icon: Camera, accept: 'image/*' },
  { key: 'birthCert', title: 'Birth Certificate', hint: 'PSA / NSO certified copy.', icon: FileText, accept: '.pdf,image/*' },
  { key: 'form138', title: 'Form 138 (Report Card)', hint: 'Latest grade report from previous school.', icon: FileText, accept: '.pdf,image/*' },
  { key: 'goodMoral', title: 'Good Moral Certificate', hint: 'Issued by the previous school principal or registrar.', icon: FileText, accept: '.pdf,image/*' },
];

const ACHIEVEMENT_TAGS = [
  { key: 'Academic', icon: BookOpen },
  { key: 'Athletic', icon: Activity },
  { key: 'Artistic', icon: Palette },
];

const EMPTY = {
  fullName: '', dob: '', gender: '', nationality: '', phone: '', email: '',
  guardianName: '', relation: 'Mother', guardianPhone: '', guardianEmail: '', guardianAddress: '',
  prevSchool: '', gradeApplying: '', gpa: '', schoolLocation: '', specialNeeds: '', iepLater: false, honors: '', tags: [],
  documents: {},
};

// ============================================================
// PAGE
// ============================================================

export const Registrar = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [certify, setCertify] = useState(false);
  const [toast, setToast] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const set = (field) => (e) => {
    const value = e?.target?.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
  };

  const toggleTag = (tag) =>
    setForm((p) => ({ ...p, tags: p.tags.includes(tag) ? p.tags.filter((t) => t !== tag) : [...p.tags, tag] }));

  const uploadDoc = (key, file) =>
    setForm((p) => ({ ...p, documents: { ...p.documents, [key]: { name: file.name, size: file.size } } }));

  const docsCompleted = useMemo(() => Object.keys(form.documents).length, [form.documents]);

  // ----------------------------------------------------------
  // Validation per step
  // ----------------------------------------------------------
  const validateStep = (s) => {
    const e = {};
    if (s === 0) {
      if (!form.fullName.trim()) e.fullName = 'Full name is required';
      if (!form.dob) e.dob = 'Date of birth is required';
      if (!form.gender) e.gender = 'Select a gender';
      if (!form.nationality.trim()) e.nationality = 'Nationality is required';
      if (!form.phone.trim()) e.phone = 'Phone number is required';
      if (!form.email.trim()) e.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
      if (!form.guardianName.trim()) e.guardianName = 'Guardian name is required';
      if (!form.guardianPhone.trim()) e.guardianPhone = 'Guardian phone is required';
    }
    if (s === 1) {
      if (!form.prevSchool.trim()) e.prevSchool = 'Previous school is required';
      if (!form.gradeApplying) e.gradeApplying = 'Select a grade level';
      if (!form.gpa.trim()) e.gpa = 'GPA / average is required';
      if (!form.schoolLocation.trim()) e.schoolLocation = 'School location is required';
    }
    if (s === 2) {
      DOC_DEFS.forEach((d) => {
        if (d.key === 'goodMoral' && form.iepLater) return;
        if (!form.documents[d.key]) e[d.key] = 'missing';
      });
    }
    return e;
  };

  const next = () => {
    const e = validateStep(step);
    if (Object.keys(e).length > 0) {
      setErrors(e);
      if (step === 2) setToast('Please upload all required documents');
      setTimeout(() => setToast(''), 2500);
      return;
    }
    const n = Math.min(step + 1, STEPS.length - 1);
    setStep(n);
    setMaxStep((m) => Math.max(m, n));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const back = () => setStep((s) => Math.max(0, s - 1));
  const goTo = (s) => s <= maxStep && setStep(s);

  const saveDraft = () => {
    localStorage.setItem('registrar_draft', JSON.stringify(form));
    setToast('Draft saved');
    setTimeout(() => setToast(''), 2000);
  };

  const submit = () => {
    if (!certify) {
      setToast('Please certify the information is accurate');
      setTimeout(() => setToast(''), 2500);
      return;
    }
    localStorage.removeItem('registrar_draft');
    setSubmitted(true);
  };

  const reset = () => {
    setForm(EMPTY);
    setStep(0);
    setMaxStep(0);
    setCertify(false);
    setErrors({});
    setSubmitted(false);
  };

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-lg">
        <p className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mb-xs">
          Registrar · Student Registration
        </p>
        <div className="flex flex-wrap items-start justify-between gap-md">
          <div>
            <h1 className="font-headline-xl text-headline-xl text-primary mb-xs">{STEPS[step].label}</h1>
            <p className="font-body-md text-on-surface-variant">Step {step + 1} of {STEPS.length} · Enroll a new student.</p>
          </div>
          <Button variant="secondary" onClick={saveDraft} className="flex items-center gap-sm">
            <Save size={18} /> Save as Draft
          </Button>
        </div>
      </div>

      {/* Stepper */}
      <Card className="mb-lg">
        <div className="flex items-center">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = i < step;
            const active = i === step;
            return (
              <div key={s.label} className="flex items-center flex-1 last:flex-none">
                <button
                  onClick={() => goTo(i)}
                  disabled={i > maxStep}
                  className="flex flex-col items-center gap-xs disabled:cursor-not-allowed"
                >
                  <span
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      active
                        ? 'bg-gradient-to-br from-primary to-surface-tint text-on-primary shadow-[0_0_18px_rgba(76,86,175,0.55)]'
                        : done
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {done ? <Check size={18} /> : <Icon size={18} />}
                  </span>
                  <span className={`text-label-sm hidden sm:block ${active ? 'text-primary font-label-md' : 'text-on-surface-variant'}`}>
                    {s.label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-sm mb-lg rounded-full transition-colors ${i < step ? 'bg-primary' : 'bg-surface-variant'}`} />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Step body */}
      <div key={step} className="animate-fade-up">
        {step === 0 && <StepPersonal form={form} set={set} errors={errors} />}
        {step === 1 && <StepAcademic form={form} set={set} errors={errors} toggleTag={toggleTag} />}
        {step === 2 && <StepDocuments form={form} errors={errors} uploadDoc={uploadDoc} />}
        {step === 3 && <StepReview form={form} docsCompleted={docsCompleted} certify={certify} setCertify={setCertify} goTo={goTo} />}
      </div>

      {/* Footer nav */}
      <div className="flex items-center justify-between gap-md mt-lg">
        <div className="min-h-[1.5rem] font-body-sm text-error">{toast && <span>⚠ {toast}</span>}</div>
        <div className="flex items-center gap-md">
          {step > 0 ? (
            <Button variant="secondary" onClick={back} className="flex items-center gap-sm"><ChevronLeft size={18} /> Go Back</Button>
          ) : (
            <Button variant="secondary" onClick={() => navigate('/admin/requirements')}>Cancel</Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button onClick={next} className="flex items-center gap-sm">Continue to Step {step + 2} <ChevronRight size={18} /></Button>
          ) : (
            <Button onClick={submit} className="flex items-center gap-sm"><CheckCircle2 size={18} /> Confirm Registration</Button>
          )}
        </div>
      </div>

      {/* Success */}
      <Modal
        isOpen={submitted}
        onClose={reset}
        title="Registration Confirmed"
        actions={
          <>
            <Button variant="secondary" onClick={reset}>Register Another</Button>
            <Button onClick={() => navigate('/admin/students')}>Go to Students</Button>
          </>
        }
      >
        <div className="text-center py-md">
          <div className="inline-flex w-16 h-16 rounded-full bg-gradient-to-br from-primary to-surface-tint items-center justify-center shadow-[0_0_30px_rgba(76,86,175,0.6)] mb-md">
            <PartyPopper size={30} className="text-white" />
          </div>
          <p className="font-headline-sm text-headline-sm text-primary mb-xs">{form.fullName || 'Student'} enrolled!</p>
          <p className="font-body-md text-on-surface-variant">
            The registration for {form.gradeApplying || 'the selected grade'} has been submitted successfully.
          </p>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================
// STEP 1 — PERSONAL INFO
// ============================================================

const StepPersonal = ({ form, set, errors }) => (
  <Card>
    <h2 className="font-headline-sm text-headline-sm text-primary mb-lg pb-md border-b border-surface-variant/60">Personal Information</h2>
    <Input label="Full Name" value={form.fullName} onChange={set('fullName')} error={errors.fullName} placeholder="Enter student's full name" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
      <Input label="Date of Birth" type="date" value={form.dob} onChange={set('dob')} error={errors.dob} />
      <SelectField label="Gender" value={form.gender} onChange={set('gender')} error={errors.gender} placeholder="Select Gender" options={['Male', 'Female', 'Other', 'Prefer not to say']} />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
      <Input label="Nationality" value={form.nationality} onChange={set('nationality')} error={errors.nationality} placeholder="e.g. Filipino" />
      <Input label="Phone Number" type="tel" value={form.phone} onChange={set('phone')} error={errors.phone} placeholder="+63 000 000 0000" />
    </div>
    <Input label="Email Address" type="email" value={form.email} onChange={set('email')} error={errors.email} placeholder="student@example.com" />

    <h3 className="font-label-md text-body-md text-on-surface mt-lg mb-md pt-md border-t border-surface-variant/60">Guardian / Emergency Contact</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
      <Input label="Guardian Name" value={form.guardianName} onChange={set('guardianName')} error={errors.guardianName} placeholder="e.g. Eleanor Montgomery" />
      <SelectField label="Relationship" value={form.relation} onChange={set('relation')} options={RELATIONS} />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
      <Input label="Guardian Phone" type="tel" value={form.guardianPhone} onChange={set('guardianPhone')} error={errors.guardianPhone} placeholder="+63 000 000 0000" />
      <Input label="Guardian Email" type="email" value={form.guardianEmail} onChange={set('guardianEmail')} placeholder="guardian@example.com" />
    </div>
    <Input label="Home Address" value={form.guardianAddress} onChange={set('guardianAddress')} placeholder="22 Baker Street, City" />
  </Card>
);

// ============================================================
// STEP 2 — ACADEMIC HISTORY
// ============================================================

const StepAcademic = ({ form, set, errors, toggleTag }) => (
  <div className="space-y-lg">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
      <Card className="lg:col-span-2">
        <h2 className="font-headline-sm text-headline-sm text-primary mb-lg">Previous Education</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <Input label="Previous School Name" value={form.prevSchool} onChange={set('prevSchool')} error={errors.prevSchool} placeholder="e.g. St. Mary's Secondary" />
          <SelectField label="Grade Level Applying For" value={form.gradeApplying} onChange={set('gradeApplying')} error={errors.gradeApplying} placeholder="Select Grade" options={GRADES} />
          <Input label="GPA / Grade Average (Last Year)" value={form.gpa} onChange={set('gpa')} error={errors.gpa} placeholder="e.g. 3.8 / 4.0" />
          <Input label="School Location (City/Country)" value={form.schoolLocation} onChange={set('schoolLocation')} error={errors.schoolLocation} placeholder="e.g. London, UK" />
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-tertiary to-[#0d1b3a] text-on-tertiary">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-md">
          <Star size={20} className="text-primary-fixed-dim" />
        </div>
        <h3 className="font-headline-sm text-headline-sm mb-sm">Academic Excellence</h3>
        <p className="font-body-sm text-on-tertiary-container mb-lg">
          Bridges Academy prioritizes students with a track record of consistent growth and intellectual curiosity.
        </p>
        <div className="bg-black/20 rounded-lg p-md">
          <p className="text-label-sm uppercase tracking-wide text-on-tertiary-container mb-xs">Status</p>
          <p className="font-label-md text-body-md">Draft · In Progress</p>
        </div>
      </Card>
    </div>

    <Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        <div>
          <h3 className="font-label-md text-body-md text-primary mb-xs">Special Education Needs</h3>
          <p className="font-body-sm text-on-surface-variant mb-md">Does the student require any specific accommodations or support services?</p>
          <Textarea rows={4} value={form.specialNeeds} onChange={set('specialNeeds')} placeholder="Please describe any IEP, 504 plans, or specific learning requirements..." />
          <label className="flex items-center gap-sm cursor-pointer select-none">
            <input type="checkbox" checked={form.iepLater} onChange={set('iepLater')} className="rounded" />
            <span className="font-body-sm text-on-surface">IEP documentation will be provided in Step 3</span>
          </label>
        </div>
        <div>
          <h3 className="font-label-md text-body-md text-primary mb-xs">Honors &amp; Achievements</h3>
          <p className="font-body-sm text-on-surface-variant mb-md">List any awards, scholarships, or notable extracurricular achievements from the last 2 years.</p>
          <Textarea rows={4} value={form.honors} onChange={set('honors')} placeholder="e.g. Science Fair Winner, National Merit Scholar, Captain of Debate Team..." />
          <div className="grid grid-cols-3 gap-sm">
            {ACHIEVEMENT_TAGS.map(({ key, icon: Icon }) => {
              const on = form.tags.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleTag(key)}
                  className={`flex flex-col items-center gap-xs py-md rounded-lg border transition-all ${
                    on ? 'border-primary bg-primary-fixed text-primary shadow-[0_0_16px_rgba(0,6,102,0.2)]' : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-label-sm">{key}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  </div>
);

// ============================================================
// STEP 3 — DOCUMENTS
// ============================================================

const StepDocuments = ({ form, errors, uploadDoc }) => (
  <div className="space-y-lg">
    <p className="font-body-md text-on-surface-variant">
      Ensure all documents are clearly scanned. Accepted formats: PDF, JPG, PNG (max 5MB per file).
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
      {DOC_DEFS.map((def) => (
        <DocCard key={def.key} def={def} file={form.documents[def.key]} missing={!!errors[def.key]} onUpload={(f) => uploadDoc(def.key, f)} />
      ))}
    </div>
    <Card className="bg-surface-container-low/70">
      <h3 className="font-label-md text-body-md text-primary mb-md">Document Guide</h3>
      <ul className="space-y-sm font-body-sm text-on-surface-variant">
        <li className="flex gap-sm"><Check size={16} className="text-primary shrink-0 mt-0.5" /> Documents must be scanned in high resolution (300dpi recommended).</li>
        <li className="flex gap-sm"><Check size={16} className="text-primary shrink-0 mt-0.5" /> Original copies must be presented for verification during the on-campus interview.</li>
      </ul>
    </Card>
  </div>
);

const DocCard = ({ def, file, missing, onUpload }) => {
  const ref = useRef();
  const Icon = def.icon;
  return (
    <Card className={missing ? 'ring-1 ring-error/40' : ''}>
      <div className="flex items-start justify-between mb-md">
        <div className="flex items-center gap-sm">
          <span className="w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center text-primary"><Icon size={18} /></span>
          <h3 className="font-label-md text-body-md text-on-surface">{def.title}</h3>
        </div>
        {file ? <Badge variant="success" size="sm">UPLOADED</Badge> : <Badge variant={missing ? 'error' : 'warning'} size="sm">{missing ? 'MISSING' : 'REQUIRED'}</Badge>}
      </div>

      <input ref={ref} type="file" accept={def.accept} className="hidden" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />

      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="w-full border-2 border-dashed border-outline-variant rounded-lg py-lg flex flex-col items-center gap-xs text-on-surface-variant hover:border-primary hover:bg-surface-container-low transition-colors"
      >
        {file ? (
          <>
            <CheckCircle2 size={24} className="text-green-600" />
            <span className="font-label-md text-label-md text-on-surface truncate max-w-[90%]">{file.name}</span>
            <span className="text-label-sm">Click to replace</span>
          </>
        ) : (
          <>
            <Upload size={24} />
            <span className="font-label-md text-label-md">Drop file or click to upload</span>
            <span className="text-label-sm">{def.hint}</span>
          </>
        )}
      </button>
    </Card>
  );
};

// ============================================================
// STEP 4 — REVIEW & SUBMIT
// ============================================================

const StepReview = ({ form, docsCompleted, certify, setCertify, goTo }) => (
  <div className="space-y-lg">
    <p className="font-body-md text-on-surface-variant">Please review all information before finalizing the student registration.</p>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
      <ReviewCard title="Identity" onEdit={() => goTo(0)}>
        <Field label="Full Name" value={form.fullName} />
        <Field label="Date of Birth" value={form.dob} />
        <Field label="Gender" value={form.gender} />
        <Field label="Nationality" value={form.nationality} />
        <Field label="Email" value={form.email} icon={Mail} />
        <Field label="Phone" value={form.phone} icon={Phone} />
      </ReviewCard>

      <ReviewCard title="Academic Placement" onEdit={() => goTo(1)}>
        <Field label="Grade Applying For" value={form.gradeApplying} icon={GraduationCap} />
        <Field label="Previous School" value={form.prevSchool} />
        <Field label="School Location" value={form.schoolLocation} icon={MapPin} />
        <Field label="GPA / Average" value={form.gpa} />
        {form.tags.length > 0 && (
          <div className="flex flex-wrap gap-xs pt-xs">
            {form.tags.map((t) => <Badge key={t} variant="primary" size="sm">{t}</Badge>)}
          </div>
        )}
      </ReviewCard>

      <ReviewCard title="Uploaded Documents" onEdit={() => goTo(2)} badge={`${docsCompleted} of ${DOC_DEFS.length} Completed`}>
        <div className="space-y-sm">
          {DOC_DEFS.map((d) => (
            <div key={d.key} className="flex items-center justify-between">
              <span className="flex items-center gap-sm font-body-sm text-on-surface">
                <FileText size={16} className="text-primary" /> {d.title}
              </span>
              {form.documents[d.key] ? (
                <CheckCircle2 size={18} className="text-green-600" />
              ) : (
                <span className="text-label-sm text-error">Missing</span>
              )}
            </div>
          ))}
        </div>
      </ReviewCard>

      <ReviewCard title="Emergency Contact" onEdit={() => goTo(0)}>
        <Field label="Name" value={form.guardianName} />
        <Field label="Relationship" value={form.relation} />
        <Field label="Phone" value={form.guardianPhone} icon={Phone} />
        <Field label="Email" value={form.guardianEmail} icon={Mail} />
        <Field label="Address" value={form.guardianAddress} icon={MapPin} />
      </ReviewCard>
    </div>

    <Card>
      <label className="flex items-start gap-sm cursor-pointer select-none">
        <input type="checkbox" checked={certify} onChange={(e) => setCertify(e.target.checked)} className="rounded mt-0.5" />
        <span className="font-body-sm text-on-surface">
          I certify that all the information provided is accurate and I have the authority to register this student.
        </span>
      </label>
    </Card>
  </div>
);

// ============================================================
// SHARED SUB-COMPONENTS
// ============================================================

const SelectField = ({ label, value, onChange, error, options, placeholder }) => (
  <div className="mb-lg">
    <label className="font-label-md text-label-md text-on-surface mb-sm block">{label}</label>
    <select className={`input-field ${error ? 'border-error' : ''}`} value={value} onChange={onChange}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
    {error && <p className="text-error text-label-sm mt-xs">{error}</p>}
  </div>
);

const ReviewCard = ({ title, onEdit, badge, children }) => (
  <Card>
    <div className="flex items-center justify-between mb-md pb-md border-b border-surface-variant/60">
      <h3 className="font-headline-sm text-headline-sm text-primary">{title}</h3>
      {badge ? <Badge variant="success" size="sm">{badge}</Badge> : (
        <button onClick={onEdit} className="text-primary font-label-md text-label-md hover:underline">Edit</button>
      )}
    </div>
    {children}
  </Card>
);

const Field = ({ label, value, icon: Icon }) => (
  <div className="flex items-center justify-between py-xs">
    <span className="font-body-sm text-on-surface-variant">{label}</span>
    <span className="flex items-center gap-xs font-label-md text-body-sm text-on-surface text-right">
      {Icon && <Icon size={14} className="text-on-surface-variant" />}
      {value || <span className="text-on-surface-variant font-body-sm">—</span>}
    </span>
  </div>
);

export default Registrar;
