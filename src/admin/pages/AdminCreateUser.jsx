import { useState } from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { createAdminUser, getAllAdmins } from '../utils/firebaseAdmin';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { Plus, AlertCircle, CheckCircle } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import '../styles/AdminCreateUser.css';

const AdminCreateUser = () => {
  const { hasPermission } = useAdminAuth();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    role: 'support_admin'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [admins, setAdmins] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Fetch existing admins
  const fetchAdmins = async () => {
    try {
      const result = await getAllAdmins();
      setAdmins(result);
    } catch (err) {
      console.error('Error fetching admins:', err);
    }
  };

  // Load admins on mount
  useState(() => {
    fetchAdmins();
  }, []);

  // Check permission
  if (!hasPermission('manage_admins')) {
    return (
      <AdminLayout>
        <div className="admin-page">
          <div className="access-denied">
            <AlertCircle size={32} />
            <h2>Access Denied</h2>
            <p>You don't have permission to create admin users.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.name || !formData.password) {
      setError('All fields are required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Invalid email format');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const uid = userCredential.user.uid;

      // Create admin document in Firestore
      await createAdminUser(uid, {
        email: formData.email,
        displayName: formData.name
      }, formData.role);

      setSuccess(`Admin user "${formData.name}" created successfully!`);
      
      // Reset form
      setFormData({
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
        role: 'support_admin'
      });

      // Refresh admins list
      await fetchAdmins();
      
      // Close form after 2 seconds
      setTimeout(() => {
        setShowForm(false);
      }, 2000);

    } catch (err) {
      console.error('Error creating admin:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else {
        setError(err.message || 'Failed to create admin user');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <h1>Create Admin User</h1>
          <p>Add new admin accounts to the system</p>
        </div>

        {/* Create Button */}
        {!showForm && (
          <div className="admin-create-button-wrapper">
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <Plus size={18} />
              Create New Admin
            </button>
          </div>
        )}

        {/* Create Form */}
        {showForm && (
          <div className="admin-create-form-wrapper">
            <form onSubmit={handleSubmit} className="admin-create-form">
              <div className="form-header">
                <h2>New Admin Account</h2>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowForm(false)}
                >
                  ✕
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="form-error">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="form-success">
                  <CheckCircle size={18} />
                  <span>{success}</span>
                </div>
              )}

              {/* Name */}
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
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

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <small>Minimum 6 characters</small>
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
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

              {/* Role Selection */}
              <div className="form-group">
                <label htmlFor="role">Admin Role *</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="support_admin">Support Admin (View Only)</option>
                  <option value="users_manager">Users Manager</option>
                  <option value="jobs_manager">Jobs Manager</option>
                  <option value="payments_manager">Payments Manager</option>
                  <option value="super_admin">Super Admin (Full Access)</option>
                </select>
              </div>

              {/* Role Description */}
              <div className="role-description">
                {formData.role === 'super_admin' && (
                  <p>⚠️ <strong>Super Admin:</strong> Full system access, can create and manage all admins</p>
                )}
                {formData.role === 'jobs_manager' && (
                  <p>📋 <strong>Jobs Manager:</strong> Can approve/reject jobs and manage job requests</p>
                )}
                {formData.role === 'users_manager' && (
                  <p>👥 <strong>Users Manager:</strong> Can verify, suspend, and manage user accounts</p>
                )}
                {formData.role === 'payments_manager' && (
                  <p>💰 <strong>Payments Manager:</strong> Can process and manage payments and refunds</p>
                )}
                {formData.role === 'support_admin' && (
                  <p>🔍 <strong>Support Admin:</strong> Read-only access to all sections</p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Admins List */}
        <div className="admin-list-section">
          <h2>Existing Admin Accounts ({admins.length})</h2>
          
          {admins.length === 0 ? (
            <p className="no-data">No admin accounts created yet</p>
          ) : (
            <div className="admin-list-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map(admin => (
                    <tr key={admin.uid}>
                      <td>{admin.name}</td>
                      <td>{admin.email}</td>
                      <td>
                        <span className={`role-badge role-${admin.role}`}>
                          {admin.role.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td>
                        {admin.isActive ? (
                          <span className="status-active">Active</span>
                        ) : (
                          <span className="status-inactive">Inactive</span>
                        )}
                      </td>
                      <td>{admin.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCreateUser;
