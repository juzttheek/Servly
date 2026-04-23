import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Shield, Ban, Trash2, Eye } from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { PERMISSIONS } from '../utils/permissions';
import AdminLayout from '../components/AdminLayout';
import AdminTable from '../components/AdminTable';
import AdminModal from '../components/AdminModal';
import Button from '../../components/common/Button';
import { db } from '../../firebase/config';
import { collection, getDocs, query, where, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import '../styles/AdminUsers.css';

const AdminUsers = () => {
  const { hasPermission } = useAdminAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Permission check
  if (!hasPermission(PERMISSIONS.VIEW_USERS)) {
    return (
      <AdminLayout>
        <div className="admin-error-state">
          <Shield size={48} />
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
        </div>
      </AdminLayout>
    );
  }

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, filterType]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by type
    if (filterType === 'worker') {
      filtered = filtered.filter(user => user.userType === 'worker');
    } else if (filterType === 'customer') {
      filtered = filtered.filter(user => user.userType === 'customer');
    } else if (filterType === 'suspended') {
      filtered = filtered.filter(user => user.isSuspended);
    } else if (filterType === 'verified') {
      filtered = filtered.filter(user => user.isVerified);
    }

    setFilteredUsers(filtered);
  };

  const handleVerifyUser = async (userId) => {
    if (!hasPermission(PERMISSIONS.VERIFY_USERS)) {
      alert('You do not have permission to verify users');
      return;
    }

    try {
      setActionLoading(true);
      await updateDoc(doc(db, 'users', userId), {
        isVerified: true,
        verifiedAt: new Date(),
        verificationNotes: 'Verified by admin'
      });
      await loadUsers();
      alert('User verified successfully');
    } catch (error) {
      console.error('Error verifying user:', error);
      alert('Failed to verify user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspendUser = async () => {
    if (!hasPermission(PERMISSIONS.SUSPEND_USERS)) {
      alert('You do not have permission to suspend users');
      return;
    }

    try {
      setActionLoading(true);
      await updateDoc(doc(db, 'users', selectedUser.id), {
        isSuspended: true,
        suspendedAt: new Date(),
        suspendedReason: suspendReason || 'Suspended by admin'
      });
      await loadUsers();
      setShowSuspendModal(false);
      setSuspendReason('');
      setSelectedUser(null);
      alert('User suspended successfully');
    } catch (error) {
      console.error('Error suspending user:', error);
      alert('Failed to suspend user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnsuspendUser = async (userId) => {
    if (!hasPermission(PERMISSIONS.SUSPEND_USERS)) {
      alert('You do not have permission to manage user suspension');
      return;
    }

    try {
      setActionLoading(true);
      await updateDoc(doc(db, 'users', userId), {
        isSuspended: false,
        suspendedAt: null,
        suspendedReason: null
      });
      await loadUsers();
      alert('User unsuspended successfully');
    } catch (error) {
      console.error('Error unsuspending user:', error);
      alert('Failed to unsuspend user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!hasPermission(PERMISSIONS.DELETE_USERS)) {
      alert('You do not have permission to delete users');
      return;
    }

    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(true);
      await deleteDoc(doc(db, 'users', userId));
      await loadUsers();
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    } finally {
      setActionLoading(false);
    }
  };

  const headers = [
    { label: 'Name', key: 'displayName' },
    { label: 'Email', key: 'email' },
    { label: 'Type', key: 'userType' },
    { label: 'Verified', key: 'isVerified' },
    { label: 'Status', key: 'isSuspended' },
    { label: 'Joined', key: 'createdAt' }
  ];

  const formatData = (users) => {
    return users.map(user => ({
      ...user,
      isVerified: user.isVerified ? '✓ Verified' : 'Pending',
      isSuspended: user.isSuspended ? '🔒 Suspended' : 'Active',
      userType: user.userType || 'Unknown',
      createdAt: user.createdAt?.toDate?.().toLocaleDateString() || '-'
    }));
  };

  return (
    <AdminLayout>
      <div className="admin-users">
        {/* Page Header */}
        <div className="admin-page-header">
          <h1>Users Management</h1>
          <p>Manage users, verify accounts, and handle suspensions</p>
        </div>

        {/* Filters & Search */}
        <div className="admin-users-controls">
          <div className="admin-search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="admin-filter-select"
          >
            <option value="all">All Users</option>
            <option value="worker">Workers</option>
            <option value="customer">Customers</option>
            <option value="verified">Verified</option>
            <option value="suspended">Suspended</option>
          </select>

          <div className="admin-stats-inline">
            <span>Total: <strong>{users.length}</strong></span>
            <span>Filtered: <strong>{filteredUsers.length}</strong></span>
          </div>
        </div>

        {/* Users Table */}
        <div className="admin-table-card">
          <AdminTable
            headers={headers}
            rows={formatData(filteredUsers)}
            loading={isLoading}
            emptyMessage="No users found"
            onRowClick={(user) => {
              setSelectedUser(user);
              setShowDetailsModal(true);
            }}
            actions={(row) => (
              <div className="admin-actions-group">
                <button
                  className="admin-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedUser(row);
                    setShowDetailsModal(true);
                  }}
                  title="View Details"
                >
                  <Eye size={14} />
                </button>

                {!row.isVerified?.includes('✓') && hasPermission(PERMISSIONS.VERIFY_USERS) && (
                  <button
                    className="admin-action-btn success"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVerifyUser(row.id);
                    }}
                    title="Verify User"
                    disabled={actionLoading}
                  >
                    ✓ Verify
                  </button>
                )}

                {!row.isSuspended?.includes('Suspended') && hasPermission(PERMISSIONS.SUSPEND_USERS) && (
                  <button
                    className="admin-action-btn warning"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUser(row);
                      setShowSuspendModal(true);
                    }}
                    title="Suspend User"
                  >
                    <Ban size={14} />
                  </button>
                )}

                {row.isSuspended?.includes('Suspended') && hasPermission(PERMISSIONS.SUSPEND_USERS) && (
                  <button
                    className="admin-action-btn success"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnsuspendUser(row.id);
                    }}
                    title="Unsuspend User"
                    disabled={actionLoading}
                  >
                    Unsuspend
                  </button>
                )}

                {hasPermission(PERMISSIONS.DELETE_USERS) && (
                  <button
                    className="admin-action-btn danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteUser(row.id);
                    }}
                    title="Delete User"
                    disabled={actionLoading}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            )}
          />
        </div>

        {/* Details Modal */}
        <AdminModal
          isOpen={showDetailsModal}
          title="User Details"
          size="md"
          onClose={() => setShowDetailsModal(false)}
        >
          {selectedUser && (
            <div className="admin-user-details">
              <div className="detail-group">
                <label>Name</label>
                <p>{selectedUser.displayName || '-'}</p>
              </div>
              <div className="detail-group">
                <label>Email</label>
                <p>{selectedUser.email || '-'}</p>
              </div>
              <div className="detail-group">
                <label>User Type</label>
                <p>{selectedUser.userType || '-'}</p>
              </div>
              <div className="detail-group">
                <label>Verified</label>
                <p>{selectedUser.isVerified ? 'Yes ✓' : 'No'}</p>
              </div>
              <div className="detail-group">
                <label>Status</label>
                <p>{selectedUser.isSuspended ? 'Suspended 🔒' : 'Active'}</p>
              </div>
              {selectedUser.isSuspended && (
                <div className="detail-group">
                  <label>Suspended Reason</label>
                  <p>{selectedUser.suspendedReason || '-'}</p>
                </div>
              )}
              <div className="detail-group">
                <label>Joined</label>
                <p>{selectedUser.createdAt?.toDate?.().toLocaleDateString() || '-'}</p>
              </div>
            </div>
          )}
        </AdminModal>

        {/* Suspend Modal */}
        <AdminModal
          isOpen={showSuspendModal}
          title="Suspend User"
          size="sm"
          onClose={() => {
            setShowSuspendModal(false);
            setSuspendReason('');
          }}
          actions={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowSuspendModal(false);
                  setSuspendReason('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSuspendUser}
                disabled={actionLoading}
              >
                {actionLoading ? 'Suspending...' : 'Confirm Suspend'}
              </Button>
            </>
          }
        >
          <div className="admin-suspend-form">
            <p>Are you sure you want to suspend this user?</p>
            <label>Reason for Suspension</label>
            <textarea
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="Enter reason for suspension..."
              rows="4"
            />
          </div>
        </AdminModal>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
