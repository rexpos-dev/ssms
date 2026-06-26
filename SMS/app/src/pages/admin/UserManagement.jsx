import { useState, useMemo } from 'react';
import { Card, CardHeader, CardContent, Input, Button, Badge } from '../../components/ui';
import { UserPlus, Edit, Trash2, Search, RefreshCw, Lock, Mail, CheckCircle, Eye, EyeOff } from 'lucide-react';

const ROLES = ['Teacher', 'Parent', 'Student'];
const DEPARTMENTS = ['Mathematics', 'Sciences', 'English', 'History', 'Arts', 'Physical Education', 'Technology'];

export const UserManagement = () => {
  const [activeRole, setActiveRole] = useState('Teacher');
  const [search, setSearch] = useState('');
  const [showPassword, setShowPassword] = useState({});

  // Users state
  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem('sms_registered_users');
    return stored ? JSON.parse(stored) : {};
  });

  // Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    department: 'Mathematics',
    qualification: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [banner, setBanner] = useState('');

  // Filtered users
  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase();
    return Object.entries(users)
      .filter(([_, user]) => user.role === activeRole)
      .filter(([_, user]) =>
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term)
      )
      .map(([id, user]) => ({ id, ...user }));
  }, [users, activeRole, search]);

  const showBanner = (msg) => {
    setBanner(msg);
    setTimeout(() => setBanner(''), 3000);
  };

  const generateUserId = () => {
    const prefix = activeRole[0].toLowerCase();
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name required';
    if (!formData.email.trim()) errors.email = 'Email required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email';
    if (!formData.password) errors.password = 'Password required';
    if (formData.password.length < 6) errors.password = 'Password must be 6+ characters';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (activeRole === 'Teacher' && !formData.qualification) errors.qualification = 'Qualification required';

    // Check if email already exists
    if (Object.values(users).some(u => u.email === formData.email && u.id !== editingId)) {
      errors.email = 'Email already registered';
    }

    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingId(user.id);
      setFormData({
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        confirmPassword: '',
        department: user.department || 'Mathematics',
        qualification: user.qualification || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        department: 'Mathematics',
        qualification: '',
      });
    }
    setFormErrors({});
    setModalOpen(true);
  };

  const handleSaveUser = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const userId = editingId || generateUserId();
    const newUser = {
      id: userId,
      role: activeRole,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      department: formData.department,
      qualification: formData.qualification,
      createdAt: new Date().toISOString(),
      status: 'Active',
    };

    const updatedUsers = { ...users, [userId]: newUser };
    setUsers(updatedUsers);
    localStorage.setItem('sms_registered_users', JSON.stringify(updatedUsers));

    setModalOpen(false);
    showBanner(`✅ ${editingId ? 'User updated' : 'User registered'} successfully!`);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure? This cannot be undone.')) {
      const updatedUsers = { ...users };
      delete updatedUsers[userId];
      setUsers(updatedUsers);
      localStorage.setItem('sms_registered_users', JSON.stringify(updatedUsers));
      showBanner('❌ User deleted');
    }
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$';
    const pwd = Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    setFormData(prev => ({ ...prev, password: pwd, confirmPassword: pwd }));
  };

  const handleResetPassword = (userId) => {
    const newPass = prompt('Enter new password (min 6 characters):');
    if (newPass && newPass.length >= 6) {
      const updatedUsers = {
        ...users,
        [userId]: { ...users[userId], password: newPass }
      };
      setUsers(updatedUsers);
      localStorage.setItem('sms_registered_users', JSON.stringify(updatedUsers));
      showBanner('🔐 Password reset successfully');
    }
  };

  return (
    <div className="space-y-xl">
      {/* Banner */}
      {banner && (
        <div className="fixed top-20 right-8 z-50 bg-primary text-on-primary px-lg py-md rounded-lg shadow-lg animate-fade-up">
          {banner}
        </div>
      )}

      <div>
        <h1 className="font-headline-xl text-headline-xl text-primary mb-xs">User Management</h1>
        <p className="font-body-md text-on-surface-variant">Register and manage teachers, parents, and students</p>
      </div>

      {/* Role Tabs */}
      <div className="flex gap-sm bg-surface-container-low rounded-lg p-sm">
        {ROLES.map(role => (
          <button
            key={role}
            onClick={() => setActiveRole(role)}
            className={`flex-1 py-md px-lg rounded-md font-label-md transition-all ${
              activeRole === role
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-secondary hover:text-primary'
            }`}
          >
            {role}s ({filteredUsers.length})
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-md items-center">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-md top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-xl pr-md py-sm bg-surface border border-outline-variant rounded-lg font-body-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
          />
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-sm whitespace-nowrap"
        >
          <UserPlus size={18} /> Add {activeRole}
        </Button>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader title={`${activeRole}s (${filteredUsers.length})`} />
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-xl text-on-surface-variant">
              <p className="text-body-md mb-sm">No {activeRole.toLowerCase()}s registered yet</p>
              <Button onClick={() => handleOpenModal()}>Register First {activeRole}</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="px-lg py-md text-left text-label-sm font-bold text-secondary">Name</th>
                    <th className="px-lg py-md text-left text-label-sm font-bold text-secondary">Email</th>
                    <th className="px-lg py-md text-left text-label-sm font-bold text-secondary">Phone</th>
                    {activeRole === 'Teacher' && (
                      <>
                        <th className="px-lg py-md text-left text-label-sm font-bold text-secondary">Department</th>
                        <th className="px-lg py-md text-left text-label-sm font-bold text-secondary">Qualification</th>
                      </>
                    )}
                    <th className="px-lg py-md text-left text-label-sm font-bold text-secondary">Status</th>
                    <th className="px-lg py-md text-center text-label-sm font-bold text-secondary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                      <td className="px-lg py-md font-label-md text-on-surface">{user.name}</td>
                      <td className="px-lg py-md text-body-sm text-on-surface-variant flex items-center gap-sm">
                        <Mail size={14} /> {user.email}
                      </td>
                      <td className="px-lg py-md text-body-sm text-on-surface-variant">{user.phone || '—'}</td>
                      {activeRole === 'Teacher' && (
                        <>
                          <td className="px-lg py-md text-body-sm text-on-surface">{user.department}</td>
                          <td className="px-lg py-md text-body-sm text-on-surface">{user.qualification}</td>
                        </>
                      )}
                      <td className="px-lg py-md">
                        <Badge variant="success">{user.status}</Badge>
                      </td>
                      <td className="px-lg py-md text-center space-x-sm flex items-center justify-center">
                        <button
                          onClick={() => handleResetPassword(user.id)}
                          title="Reset password"
                          className="p-xs text-primary hover:bg-primary/10 rounded transition-colors"
                        >
                          <Lock size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenModal(user)}
                          title="Edit"
                          className="p-xs text-primary hover:bg-primary/10 rounded transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          title="Delete"
                          className="p-xs text-error hover:bg-error/10 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-up">
            <CardHeader
              title={`${editingId ? 'Edit' : 'Register'} ${activeRole}`}
              action={
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-on-surface hover:text-primary text-xl"
                >
                  ✕
                </button>
              }
            />
            <CardContent className="space-y-md">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-xs">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-md py-sm border rounded-lg font-body-sm focus:ring-1 focus:ring-primary outline-none ${
                      formErrors.firstName ? 'border-error' : 'border-outline-variant'
                    }`}
                    placeholder="John"
                  />
                  {formErrors.firstName && <p className="text-error text-label-sm mt-xs">{formErrors.firstName}</p>}
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-xs">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-md py-sm border rounded-lg font-body-sm focus:ring-1 focus:ring-primary outline-none ${
                      formErrors.lastName ? 'border-error' : 'border-outline-variant'
                    }`}
                    placeholder="Doe"
                  />
                  {formErrors.lastName && <p className="text-error text-label-sm mt-xs">{formErrors.lastName}</p>}
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-xs">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-md py-sm border rounded-lg font-body-sm focus:ring-1 focus:ring-primary outline-none ${
                      formErrors.email ? 'border-error' : 'border-outline-variant'
                    }`}
                    placeholder="john@school.edu"
                  />
                  {formErrors.email && <p className="text-error text-label-sm mt-xs">{formErrors.email}</p>}
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-xs">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-md py-sm border border-outline-variant rounded-lg font-body-sm focus:ring-1 focus:ring-primary outline-none"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div>
                <div className="flex items-center justify-between mb-xs">
                  <label className="text-label-sm font-bold text-on-surface">Password</label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-primary text-label-sm hover:underline"
                  >
                    🎲 Generate
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword.pwd ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-md py-sm border rounded-lg font-body-sm focus:ring-1 focus:ring-primary outline-none pr-12 ${
                      formErrors.password ? 'border-error' : 'border-outline-variant'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => ({ ...p, pwd: !p.pwd }))}
                    className="absolute right-md top-1/2 -translate-y-1/2 text-outline hover:text-primary"
                  >
                    {showPassword.pwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {formErrors.password && <p className="text-error text-label-sm mt-xs">{formErrors.password}</p>}
              </div>

              <div>
                <label className="text-label-sm font-bold text-on-surface block mb-xs">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showPassword.conf ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-md py-sm border rounded-lg font-body-sm focus:ring-1 focus:ring-primary outline-none pr-12 ${
                      formErrors.confirmPassword ? 'border-error' : 'border-outline-variant'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => ({ ...p, conf: !p.conf }))}
                    className="absolute right-md top-1/2 -translate-y-1/2 text-outline hover:text-primary"
                  >
                    {showPassword.conf ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {formErrors.confirmPassword && <p className="text-error text-label-sm mt-xs">{formErrors.confirmPassword}</p>}
              </div>

              {/* Teacher-specific fields */}
              {activeRole === 'Teacher' && (
                <>
                  <div>
                    <label className="text-label-sm font-bold text-on-surface block mb-xs">Department</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-md py-sm border border-outline-variant rounded-lg font-body-sm focus:ring-1 focus:ring-primary outline-none"
                    >
                      {DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-label-sm font-bold text-on-surface block mb-xs">Qualification</label>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleInputChange}
                      className={`w-full px-md py-sm border rounded-lg font-body-sm focus:ring-1 focus:ring-primary outline-none ${
                        formErrors.qualification ? 'border-error' : 'border-outline-variant'
                      }`}
                      placeholder="e.g., B.Sc., M.A., Ph.D."
                    />
                    {formErrors.qualification && <p className="text-error text-label-sm mt-xs">{formErrors.qualification}</p>}
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="flex gap-md justify-end pt-md border-t border-outline-variant">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-lg py-sm border border-outline-variant rounded-lg font-label-md text-on-surface hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <Button
                  onClick={handleSaveUser}
                  className="flex items-center gap-sm"
                >
                  <CheckCircle size={18} /> {editingId ? 'Update User' : 'Register User'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
