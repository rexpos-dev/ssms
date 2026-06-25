import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button } from '../../components/ui';
import { GraduationCap, Check } from 'lucide-react';

const STEPS = ['Personal Info', 'Documents', 'Review & Submit'];

export const RegistrationStep1 = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(() => {
    const saved = sessionStorage.getItem('registrationStep1');
    return saved
      ? JSON.parse(saved)
      : { fullName: '', dob: '', gender: '', nationality: '', phone: '', email: '' };
  });
  const [errors, setErrors] = useState({});

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required';
    if (!form.dob) next.dob = 'Date of birth is required';
    if (!form.gender) next.gender = 'Please select a gender';
    if (!form.nationality.trim()) next.nationality = 'Nationality is required';
    if (!form.phone.trim()) next.phone = 'Phone number is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email';
    return next;
  };

  const handleNext = (e) => {
    e.preventDefault();
    const found = validate();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    sessionStorage.setItem('registrationStep1', JSON.stringify(form));
    navigate('/registration/step2');
  };

  return (
    <div className="min-h-screen p-margin-desktop flex items-center justify-center">
      <div className="w-full max-w-2xl animate-fade-up">
        {/* Brand + heading */}
        <div className="text-center mb-lg">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-surface-tint items-center justify-center shadow-[0_0_28px_rgba(76,86,175,0.55)] mb-md">
            <GraduationCap size={26} className="text-white" />
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary">Register New Student</h1>
          <p className="font-body-md text-on-surface-variant mt-xs">Enroll a new student in three quick steps.</p>
        </div>

        {/* Step indicator */}
        <Stepper current={0} />

        {/* Form card */}
        <Card className="mt-lg">
          <h2 className="font-headline-sm text-headline-sm text-primary mb-xs">Personal Information</h2>
          <p className="font-body-sm text-on-surface-variant mb-lg pb-md border-b border-surface-variant/60">Step 1 of 3</p>

          <form onSubmit={handleNext}>
            <Input label="Full Name" value={form.fullName} onChange={update('fullName')} error={errors.fullName} placeholder="Enter student's full name" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <Input label="Date of Birth" type="date" value={form.dob} onChange={update('dob')} error={errors.dob} />
              <div className="mb-lg">
                <label className="font-label-md text-label-md text-on-surface mb-sm block">Gender</label>
                <select className={`input-field ${errors.gender ? 'border-error' : ''}`} value={form.gender} onChange={update('gender')}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                {errors.gender && <p className="text-error text-label-sm mt-xs">{errors.gender}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <Input label="Nationality" value={form.nationality} onChange={update('nationality')} error={errors.nationality} placeholder="e.g. Filipino" />
              <Input label="Phone Number" type="tel" value={form.phone} onChange={update('phone')} error={errors.phone} placeholder="+63 000 000 0000" />
            </div>

            <Input label="Email Address" type="email" value={form.email} onChange={update('email')} error={errors.email} placeholder="student@example.com" />

            <div className="flex justify-end items-center gap-md pt-md border-t border-surface-variant/60">
              <Button type="button" variant="secondary" onClick={() => navigate('/')}>Cancel</Button>
              <Button type="submit">Continue to Step 2</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

// ============================================================
// STEPPER
// ============================================================

const Stepper = ({ current }) => (
  <div className="flex items-center">
    {STEPS.map((label, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <div key={label} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-label-md text-label-md transition-all ${
                active
                  ? 'bg-gradient-to-br from-primary to-surface-tint text-on-primary shadow-[0_0_18px_rgba(76,86,175,0.5)]'
                  : done
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              {done ? <Check size={16} /> : i + 1}
            </div>
            <span className={`mt-xs text-label-sm ${active ? 'text-primary font-label-md' : 'text-on-surface-variant'}`}>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-sm mb-lg rounded-full ${i < current ? 'bg-primary' : 'bg-surface-variant'}`} />
          )}
        </div>
      );
    })}
  </div>
);

export default RegistrationStep1;
