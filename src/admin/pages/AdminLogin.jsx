import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { getAdminUser } from '../utils/firebaseAdmin';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import '../styles/AdminAuth.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Sign in with email and password
      console.log('🔐 Signing in with:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('✅ Auth successful. UID:', user.uid);

      // Check if user is an admin
      console.log('🔍 Checking Firestore for admin document at: admins/' + user.uid);
      const adminUser = await getAdminUser(user.uid);
      console.log('📄 Admin document found:', adminUser);

      if (!adminUser) {
        console.error('❌ No admin document found for UID:', user.uid);
        setError('You do not have admin access. Contact the administrator.');
        await auth.signOut();
        setIsLoading(false);
        return;
      }

      // Redirect to admin dashboard
      console.log('✅ Redirecting to admin dashboard...');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-auth-container">
      <div className="admin-auth-box">
        {/* Logo */}
        <div className="admin-auth-logo">
          <div className="admin-auth-icon">S</div>
          <h1>Servly Admin</h1>
        </div>

        {/* Welcome Text */}
        <div className="admin-auth-header">
          <h2>Admin Login</h2>
          <p>Sign in to access the admin dashboard</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="admin-auth-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="admin-auth-form">
          {/* Email Input */}
          <div className="admin-form-group">
            <label htmlFor="email">Email Address</label>
            <div className="admin-input-wrapper">
              <Mail size={18} />
              <input
                id="email"
                type="email"
                placeholder="admin@servly.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="admin-form-group">
            <label htmlFor="password">Password</label>
            <div className="admin-input-wrapper">
              <Lock size={18} />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="admin-btn-submit"
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="admin-auth-footer">
          <p>Don't have an admin account? <a href="/admin/register">Create one</a></p>
        </div>
      </div>

      {/* Decorative background */}
      <div className="admin-auth-bg-pattern"></div>
    </div>
  );
};

export default AdminLogin;
