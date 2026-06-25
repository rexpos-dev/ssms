import { useState } from 'react';
import { Button, Input, Card } from '../../components/ui';

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

    // Demo login credentials
    const demoUsers = {
      'admin@school.edu': { role: 'admin', name: 'Admin User' },
      'teacher@school.edu': { role: 'teacher', name: 'Dr. Elena Rodriguez' },
      'student@school.edu': { role: 'student', name: 'Elena Sterling' },
      'parent@school.edu': { role: 'parent', name: 'Parent User' },
    };

    const demoUser = demoUsers[formData.email];

    if (formData.password === 'demo123' && demoUser) {
      // Create user data
      const userData = {
        ...demoUser,
        email: formData.email,
        id: Math.random().toString(36).substr(2, 9),
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
      window.location.href = roleRoutes[demoUser.role] || '/';
    } else {
      setErrors({ form: 'Invalid credentials. Use demo123 with admin@school.edu, teacher@school.edu, student@school.edu, or parent@school.edu' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-container flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-lg">
          <div className="text-6xl mb-md">🏫</div>
          <h1 className="font-headline-lg text-headline-lg text-on-primary mb-sm">Bridges Academy</h1>
          <p className="text-on-primary/80 font-body-md">School Management System</p>
        </div>

        {/* Login Card */}
        <Card className="bg-white">
          <div className="mb-lg">
            <h2 className="font-headline-md text-headline-md text-primary mb-xs">Sign In</h2>
            <p className="text-body-sm text-on-surface-variant">Enter your credentials to access your portal</p>
          </div>

          {/* Demo Credentials Info */}
          <div className="bg-primary-fixed rounded-lg p-md mb-lg border-l-4 border-primary">
            <p className="text-label-sm font-label-md text-on-surface mb-sm">Demo Credentials:</p>
            <div className="text-body-sm text-on-surface-variant space-y-xs">
              <p><strong>Admin:</strong> admin@school.edu</p>
              <p><strong>Teacher:</strong> teacher@school.edu</p>
              <p><strong>Student:</strong> student@school.edu</p>
              <p><strong>Parent:</strong> parent@school.edu</p>
              <p className="border-t border-white/20 pt-xs mt-xs"><strong>Password:</strong> demo123 (all users)</p>
            </div>
          </div>

          {/* Error Message */}
          {errors.form && (
            <div className="bg-error/10 border border-error rounded-lg p-md mb-lg">
              <p className="text-error text-body-sm">{errors.form}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin}>
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
              className="w-full mt-lg"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
