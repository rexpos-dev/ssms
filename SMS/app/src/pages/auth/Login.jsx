import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();
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

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await login(formData.email, formData.password);

      // Redirect based on role
      const roleRoutes = {
        admin: '/admin',
        teacher: '/teacher',
        student: '/student',
        parent: '/parent',
      };

      navigate(roleRoutes[response.user.role] || '/');
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
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
            <p className="text-label-sm font-label-md text-on-surface mb-xs">Demo Credentials:</p>
            <p className="text-body-sm text-on-surface-variant">Email: admin@school.edu</p>
            <p className="text-body-sm text-on-surface-variant">Password: demo123</p>
          </div>

          {/* Error Message */}
          {(errors.form || authError) && (
            <div className="bg-error/10 border border-error rounded-lg p-md mb-lg">
              <p className="text-error text-body-sm">{errors.form || authError}</p>
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
              disabled={loading}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
              disabled={loading}
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center mb-lg">
              <label className="flex items-center gap-sm">
                <input type="checkbox" className="rounded" />
                <span className="text-body-sm text-on-surface">Remember me</span>
              </label>
              <a href="#" className="text-primary text-body-sm hover:underline">Forgot password?</a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-lg flex items-center gap-md">
            <div className="flex-1 h-px bg-outline-variant"></div>
            <span className="text-on-surface-variant text-label-sm">Test Accounts</span>
            <div className="flex-1 h-px bg-outline-variant"></div>
          </div>

          {/* Role Quick Links */}
          <div className="space-y-sm">
            <p className="text-label-sm text-on-surface-variant text-center font-label-md">Try Different Roles:</p>
            <div className="grid grid-cols-2 gap-sm">
              <button
                type="button"
                onClick={() => {
                  setFormData({ email: 'admin@school.edu', password: 'demo123' });
                }}
                className="py-sm px-md bg-secondary-fixed text-on-secondary-fixed rounded hover:bg-secondary-fixed/80 transition text-body-sm"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({ email: 'teacher@school.edu', password: 'demo123' });
                }}
                className="py-sm px-md bg-secondary-fixed text-on-secondary-fixed rounded hover:bg-secondary-fixed/80 transition text-body-sm"
              >
                Teacher
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({ email: 'student@school.edu', password: 'demo123' });
                }}
                className="py-sm px-md bg-secondary-fixed text-on-secondary-fixed rounded hover:bg-secondary-fixed/80 transition text-body-sm"
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({ email: 'parent@school.edu', password: 'demo123' });
                }}
                className="py-sm px-md bg-secondary-fixed text-on-secondary-fixed rounded hover:bg-secondary-fixed/80 transition text-body-sm"
              >
                Parent
              </button>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-on-primary/70 text-body-sm mt-lg">
          © 2026 Bridges Academy. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
