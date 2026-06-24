import { useState, useRef } from 'react';
import { Card, Input, Textarea, Button } from '../../components/ui';
import { Info, ShieldCheck, SlidersHorizontal, Lock, Image as ImageIcon } from 'lucide-react';

// ============================================================
// CONFIG
// ============================================================

const TABS = [
  { key: 'general', label: 'General Settings', icon: Info },
  { key: 'permissions', label: 'User Permissions', icon: ShieldCheck },
  { key: 'system', label: 'System Configuration', icon: SlidersHorizontal },
  { key: 'security', label: 'Security', icon: Lock },
];

const DEFAULT_SETTINGS = {
  general: {
    academyName: 'Bridges Academy',
    email: 'admin@bridgesacademy.edu',
    contact: '+1 (555) 012-3456',
    address: '1200 Scholars Lane, Academic District, Boston, MA 02108',
    logo: null,
  },
  permissions: {
    admin: { manageUsers: true, editFinance: true, publishReports: true },
    teacher: { manageUsers: false, editFinance: false, publishReports: true },
    parent: { manageUsers: false, editFinance: false, publishReports: false },
  },
  system: { timezone: 'America/New_York', language: 'English', dateFormat: 'MM/DD/YYYY', maintenance: false },
  security: { twoFactor: true, passwordExpiry: '90', sessionTimeout: '60', enforceStrong: true },
};

const clone = (obj) => JSON.parse(JSON.stringify(obj));

// ============================================================
// PAGE
// ============================================================

export const Settings = () => {
  const [tab, setTab] = useState('general');
  const [settings, setSettings] = useState(clone(DEFAULT_SETTINGS));
  const [saved, setSaved] = useState(clone(DEFAULT_SETTINGS));
  const [toast, setToast] = useState('');
  const fileRef = useRef(null);

  const dirty = JSON.stringify(settings) !== JSON.stringify(saved);

  const save = () => {
    setSaved(clone(settings));
    setToast('Settings saved');
    setTimeout(() => setToast(''), 2000);
  };
  const discard = () => setSettings(clone(saved));

  const setGeneral = (field) => (e) => setSettings((s) => ({ ...s, general: { ...s.general, [field]: e.target.value } }));
  const setSystem = (field, value) => setSettings((s) => ({ ...s, system: { ...s.system, [field]: value } }));
  const setSecurity = (field, value) => setSettings((s) => ({ ...s, security: { ...s.security, [field]: value } }));
  const togglePermission = (role, perm) =>
    setSettings((s) => ({ ...s, permissions: { ...s.permissions, [role]: { ...s.permissions[role], [perm]: !s.permissions[role][perm] } } }));

  const onLogo = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setSettings((s) => ({ ...s, general: { ...s.general, logo: reader.result } }));
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative">
      <div className="mb-xl">
        <h1 className="font-headline-xl text-headline-xl text-primary mb-xs">System Settings</h1>
        <p className="font-body-md text-on-surface-variant">Configure school-wide parameters, security protocols, and user access control.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-lg">
        {/* Tab nav */}
        <nav className="space-y-xs">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`w-full flex items-center gap-md px-md py-sm rounded-lg font-label-md text-label-md transition-colors ${
                tab === key ? 'bg-primary-fixed text-on-primary-fixed-variant' : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              <Icon size={18} /> {label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="space-y-lg">
          {tab === 'general' && (
            <>
              <Card>
                <h2 className="font-headline-sm text-headline-sm text-primary mb-lg pb-md border-b border-surface-variant">School Identity</h2>
                <Input label="Academy Name" value={settings.general.academyName} onChange={setGeneral('academyName')} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <Input label="Primary Email" type="email" value={settings.general.email} onChange={setGeneral('email')} />
                  <Input label="Contact Number" value={settings.general.contact} onChange={setGeneral('contact')} />
                </div>
                <Textarea label="Physical Address" rows={3} value={settings.general.address} onChange={setGeneral('address')} />
              </Card>

              <Card>
                <h2 className="font-headline-sm text-headline-sm text-primary mb-lg pb-md border-b border-surface-variant">Branding Assets</h2>
                <div className="flex items-center gap-lg">
                  <div className="w-24 h-24 rounded-lg border-2 border-dashed border-outline-variant flex items-center justify-center overflow-hidden bg-surface-container-low shrink-0">
                    {settings.general.logo ? (
                      <img src={settings.general.logo} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={28} className="text-outline" />
                    )}
                  </div>
                  <div>
                    <p className="font-label-md text-body-md text-on-surface mb-xs">Institutional Logo</p>
                    <p className="font-body-sm text-on-surface-variant mb-md">Recommended size: 512×512px. PNG or SVG format.</p>
                    <div className="flex items-center gap-sm">
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onLogo} />
                      <Button onClick={() => fileRef.current?.click()}>Upload New</Button>
                      <Button variant="secondary" onClick={() => setSettings((s) => ({ ...s, general: { ...s.general, logo: null } }))}>Remove</Button>
                    </div>
                  </div>
                </div>
              </Card>
            </>
          )}

          {tab === 'permissions' && (
            <Card>
              <h2 className="font-headline-sm text-headline-sm text-primary mb-lg pb-md border-b border-surface-variant">Role Permissions</h2>
              <div className="space-y-lg">
                {Object.entries(settings.permissions).map(([role, perms]) => (
                  <div key={role}>
                    <p className="font-label-md text-body-md text-on-surface capitalize mb-sm">{role}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm">
                      {Object.entries(perms).map(([perm, on]) => (
                        <Toggle key={perm} label={labelize(perm)} checked={on} onChange={() => togglePermission(role, perm)} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === 'system' && (
            <Card>
              <h2 className="font-headline-sm text-headline-sm text-primary mb-lg pb-md border-b border-surface-variant">System Configuration</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <SelectField label="Timezone" value={settings.system.timezone} onChange={(v) => setSystem('timezone', v)}
                  options={['America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Asia/Manila', 'UTC']} />
                <SelectField label="Language" value={settings.system.language} onChange={(v) => setSystem('language', v)}
                  options={['English', 'Filipino', 'Spanish', 'French']} />
                <SelectField label="Date Format" value={settings.system.dateFormat} onChange={(v) => setSystem('dateFormat', v)}
                  options={['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']} />
              </div>
              <div className="mt-lg">
                <Toggle label="Maintenance Mode" checked={settings.system.maintenance} onChange={() => setSystem('maintenance', !settings.system.maintenance)} />
              </div>
            </Card>
          )}

          {tab === 'security' && (
            <Card>
              <h2 className="font-headline-sm text-headline-sm text-primary mb-lg pb-md border-b border-surface-variant">Security</h2>
              <div className="space-y-md">
                <Toggle label="Require Two-Factor Authentication" checked={settings.security.twoFactor} onChange={() => setSecurity('twoFactor', !settings.security.twoFactor)} />
                <Toggle label="Enforce Strong Passwords" checked={settings.security.enforceStrong} onChange={() => setSecurity('enforceStrong', !settings.security.enforceStrong)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md pt-sm">
                  <Input label="Password Expiry (days)" type="number" value={settings.security.passwordExpiry} onChange={(e) => setSecurity('passwordExpiry', e.target.value)} />
                  <Input label="Session Timeout (minutes)" type="number" value={settings.security.sessionTimeout} onChange={(e) => setSecurity('sessionTimeout', e.target.value)} />
                </div>
              </div>
            </Card>
          )}

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-lg pt-md border-t border-surface-variant">
            {toast && <span className="mr-auto font-body-sm text-green-700">✓ {toast}</span>}
            <button onClick={discard} disabled={!dirty} className="font-label-md text-label-md text-primary hover:underline disabled:opacity-40 disabled:no-underline">
              Discard Changes
            </button>
            <Button onClick={save} disabled={!dirty}>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SUB-COMPONENTS
// ============================================================

const labelize = (s) => s.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());

const Toggle = ({ label, checked, onChange }) => (
  <label className="flex items-center justify-between gap-md p-sm rounded-lg border border-outline-variant cursor-pointer select-none">
    <span className="font-body-sm text-on-surface">{label}</span>
    <button
      type="button"
      onClick={onChange}
      className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${checked ? 'bg-primary' : 'bg-surface-variant'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : ''}`} />
    </button>
  </label>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div className="mb-lg">
    <label className="font-label-md text-label-md text-on-surface mb-sm block">{label}</label>
    <select className="input-field" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

export default Settings;
