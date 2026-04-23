import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { superAdminExists } from '../utils/firebaseAdmin';
import { createAdminUser } from '../utils/firebaseAdmin';
import { Mail, Lock, User, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import '../styles/AdminAuth.css';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  // Check if super admin already exists
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const exists = await superAdminExists();
        setAdminExists(exists);
      } catch (err) {
        console.error('Error checking admin:', err);
      } finally {
        setIsChecking(false);
      }
    };
    checkAdmin();
  }, []);

  // If admin exists, redirect to login
  useEffect(() => {
    if (!isChecking && adminExists) {
      navigate('/admin/login');
    }
  }, [isChecking, adminExists, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { name, email, password, confirmPassword } = formData;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (!email.includes('@')) {
      setError('Invalid email format');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Check again if admin was created while user was filling form
    if (adminExists) {
      setError('Admin account already exists. Please login instead.');
      return;
    }

    setIsLoading(true);

    try {
      // Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Create super admin document in Firestore
      await createAdminUser(uid, {
        email,
        displayName: name
      }, 'super_admin');

      setSuccess('✅ Super Admin account created successfully!');
      
      // Redirect to admin dashboard after 2 seconds
      setTimeout(() => {
        navigate('/admin/login');
      }, 2000);

    } catch (err) {
      console.error('Registration error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else {
        setError(err.message || 'Failed to create admin account');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isChecking) {
    return (
      <div className="admin-auth-container">
        <div className="admin-auth-box">
          <div className="loader">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-auth-container">
      <div className="admin-auth-box">
        {/* Logo */}
        <div className="admin-auth-logo">
          <div className="admin-auth-icon">S</div>
          <h1>Servly Admin</h1>
        </div>

        {/* Header */}
        <div className="admin-auth-header">
          <h2>Create Super Admin Account</h2>
          <p>Setup your admin account to manage the platform</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="admin-auth-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="admin-auth-success">
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="admin-auth-form">
          {/* Name Input */}
          <div className="admin-form-group">
            <label htmlFor="name">Full Name</label>
            <div className="admin-input-wrapper">
              <User size={18} />
              <input
                id="name"
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="admin-form-group">
            <label htmlFor="email">Email Address</label>
            <div className="admin-input-wrapper">
              <Mail size={18} />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="admin@servly.com"
                value={formData.email}
                onChange={handleInputChange}
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
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <small>Minimum 6 characters</small>
          </div>

          {/* Confirm Password Input */}
          <div className="admin-form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="admin-input-wrapper">
              <Lock size={18} />
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="admin-info-box">
            <p>⚠️ <strong>Important:</strong> This creates a Super Admin account with full system access.</p>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="admin-btn-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              <>
                Create Super Admin
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="admin-auth-footer">
          <p>Already have an admin account? <a href="/admin/login">Login here</a></p>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="admin-auth-bg-pattern"></div>
    </div>
  );
};

export default AdminRegister;
