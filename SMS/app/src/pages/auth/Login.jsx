import { useState } from 'react';
import { Button, Input, Card } from '../../components/ui';

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [demoExpanded, setDemoExpanded] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    // Demo & registered users
    const demoUsers = {
      'admin@school.edu': { role: 'admin', name: 'Admin User', id: 'admin-001' },
      'teacher@school.edu': { role: 'teacher', name: 'Dr. Elena Rodriguez', id: 'teacher-001' },
      'student@school.edu': { role: 'student', name: 'Elena Sterling', id: 'student-001' },
      'parent@school.edu': { role: 'parent', name: 'Parent User', id: 'parent-001' },
    };

    // Check registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('sms_registered_users') || '{}');
    const userKey = Object.keys(registeredUsers).find(
      k => registeredUsers[k].email === formData.email && registeredUsers[k].password === formData.password
    );

    let demoUser = demoUsers[formData.email];
    let isRegistered = false;

    if (userKey && registeredUsers[userKey]) {
      demoUser = registeredUsers[userKey];
      isRegistered = true;
    } else if (!(formData.password === 'demo123' && demoUser)) {
      setErrors({ form: 'Invalid credentials. Check your email and password.' });
      setLoading(false);
      return;
    }

    if (demoUser) {
      // Create user data
      const userData = {
        ...demoUser,
        email: formData.email,
        id: demoUser.id || Math.random().toString(36).substr(2, 9),
      };

      // Store in localStorage
      const token = 'demo_token_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('sms_token', token);
      localStorage.setItem('sms_user', JSON.stringify(userData));

      // Redirect based on role
      const roleRoutes = {
        admin: '/admin',
        teacher: '/teacher',
        student: '/student',
        parent: '/parent',
      };

      // Use window.location for immediate redirect with page reload
      setTimeout(() => {
        window.location.href = roleRoutes[demoUser.role] || '/';
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-container to-primary-fixed flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Header - Animated */}
        <div className="text-center mb-lg animate-fade-up">
          <div className="text-7xl mb-md inline-block animate-bounce" style={{ animationDelay: '0.1s' }}>🏫</div>
          <h1 className="font-headline-lg text-headline-lg text-on-primary mb-sm">Bridges Academy</h1>
          <p className="text-on-primary/80 font-body-md">School Management System</p>
        </div>

        {/* Login Card - Animated */}
        <Card className="bg-white shadow-2xl animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="mb-lg">
            <h2 className="font-headline-md text-headline-md text-primary mb-xs">Sign In</h2>
            <p className="text-body-sm text-on-surface-variant">Enter your credentials to access your portal</p>
          </div>

          {/* Demo Credentials Info - Collapsible */}
          <div className="mb-lg">
            <button
              type="button"
              onClick={() => setDemoExpanded(!demoExpanded)}
              className="w-full bg-primary-fixed hover:bg-primary/10 rounded-lg p-md border-l-4 border-primary transition-all flex items-center justify-between"
            >
              <span className="text-label-sm font-label-md text-on-surface">Demo Credentials</span>
              <span className={`text-primary transition-transform ${demoExpanded ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {demoExpanded && (
              <div className="bg-primary-fixed rounded-b-lg p-md border border-t-0 border-primary/20 animate-fade-up">
                <div className="text-body-sm text-on-surface-variant space-y-xs">
                  <div className="flex items-center justify-between bg-white/50 p-xs rounded px-sm">
                    <span><strong>Admin:</strong> admin@school.edu</span>
                    <span className="text-primary text-xs">🔐</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/50 p-xs rounded px-sm">
                    <span><strong>Teacher:</strong> teacher@school.edu</span>
                    <span className="text-primary text-xs">👨‍🏫</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/50 p-xs rounded px-sm">
                    <span><strong>Student:</strong> student@school.edu</span>
                    <span className="text-primary text-xs">👨‍🎓</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/50 p-xs rounded px-sm">
                    <span><strong>Parent:</strong> parent@school.edu</span>
                    <span className="text-primary text-xs">👨‍👩‍👧</span>
                  </div>
                  <div className="border-t border-white/20 pt-xs mt-xs text-green-700 font-bold">
                    All accounts: Password is <code className="bg-white/70 px-1 rounded">demo123</code>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error Message - Animated */}
          {errors.form && (
            <div className="bg-error/10 border border-error rounded-lg p-md mb-lg animate-fade-up">
              <p className="text-error text-body-sm">⚠️ {errors.form}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div className="space-y-md">
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="admin@school.edu"
              />
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="••••••••"
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-lg hover:shadow-lg transition-all active:scale-95"
              >
                {loading ? (
                  <span className="flex items-center gap-sm justify-center">
                    <span className="inline-block animate-spin">⏳</span> Signing in...
                  </span>
                ) : (
                  '🔐 Sign In'
                )}
              </Button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-lg pt-md border-t border-surface-variant text-center">
            <p className="text-label-sm text-on-surface-variant">
              New here? <a href="#" className="text-primary font-bold hover:underline">Contact your administrator</a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
