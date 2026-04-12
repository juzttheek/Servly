import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, AlertCircle, Briefcase, UserCheck } from 'lucide-react';
import { registerWithEmail, loginWithGoogle } from '../firebase/auth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const { name, email, password, confirmPassword, role } = formData;
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await registerWithEmail(email, password, name, role);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err.code, err.message, err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered.');
      } else if (err.code === 'auth/invalid-api-key') {
        setError('Invalid Firebase API key. Check your config.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Check your connection.');
      } else {
        setError(`Registration failed: ${err.code || err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-left-pattern" />
          <div className="auth-left-text">
            <Link to="/" className="auth-logo">
              <div className="auth-logo-icon">S</div>
              <span>Servly</span>
            </Link>
            <h2>Join Servly</h2>
            <p>Create your account and start finding or offering services in minutes.</p>
            <div className="auth-left-features">
              <div className="auth-feature"><span className="auth-feature-dot" />Free to join</div>
              <div className="auth-feature"><span className="auth-feature-dot" />Access verified providers</div>
              <div className="auth-feature"><span className="auth-feature-dot" />Secure platform</div>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h1>Create Account</h1>
            <p>Fill in your details to get started</p>
          </div>

          {error && (
            <div className="auth-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Role Selection */}
          <div className="auth-role-select">
            <button
              className={`auth-role-btn ${formData.role === 'customer' ? 'active' : ''}`}
              type="button"
              onClick={() => updateField('role', 'customer')}
            >
              <UserCheck size={20} />
              <span>I need services</span>
            </button>
            <button
              className={`auth-role-btn ${formData.role === 'provider' ? 'active' : ''}`}
              type="button"
              onClick={() => updateField('role', 'provider')}
            >
              <Briefcase size={20} />
              <span>I offer services</span>
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              type="text"
              icon={User}
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
            />
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
            <div className="auth-form-row">
              <Input
                label="Password"
                type="password"
                icon={Lock}
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
              />
              <Input
                label="Confirm Password"
                type="password"
                icon={Lock}
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
              />
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} icon={ArrowRight} iconPosition="right">
              Create Account
            </Button>
          </form>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <button className="auth-google-btn" onClick={handleGoogle}>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
