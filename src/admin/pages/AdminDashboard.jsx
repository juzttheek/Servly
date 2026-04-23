import { useEffect, useState } from 'react';
import { Users, FileText, MessageSquare, CreditCard, TrendingUp, AlertCircle } from 'lucide-react';
import { getDashboardStats, getPendingJobs, getPendingRequests, getAllPayments } from '../utils/firebaseAdmin';
import { useAdminAuth } from '../hooks/useAdminAuth';
import AdminLayout from '../components/AdminLayout';
import StatCard from '../components/StatCard';
import AdminTable from '../components/AdminTable';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { hasPermission } = useAdminAuth();
  const [stats, setStats] = useState(null);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);

        // Load stats
        const dashboardStats = await getDashboardStats();
        setStats(dashboardStats);

        // Load pending jobs
        if (hasPermission('view_jobs')) {
          const jobs = await getPendingJobs(5);
          setPendingJobs(jobs);
        }

        // Load pending requests
        if (hasPermission('view_requests')) {
          const requests = await getPendingRequests(5);
          setPendingRequests(requests);
        }

        // Load recent payments
        if (hasPermission('view_payments')) {
          const payments = await getAllPayments({ status: 'pending' }, 5);
          setRecentPayments(payments);
        }
      } catch (err) {
        console.error('Error loading dashboard:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [hasPermission]);

  const jobHeaders = [
    { label: 'Job Title', key: 'title' },
    { label: 'Posted By', key: 'postedBy' },
    { label: 'Category', key: 'category' },
    { label: 'Amount', key: 'budget' },
  ];

  const requestHeaders = [
    { label: 'Job', key: 'jobTitle' },
    { label: 'Requested By', key: 'requestedBy' },
    { label: 'Status', key: 'status' },
    { label: 'Date', key: 'createdAt' },
  ];

  const paymentHeaders = [
    { label: 'Amount', key: 'amount' },
    { label: 'From', key: 'fromUser' },
    { label: 'To', key: 'toUser' },
    { label: 'Status', key: 'status' },
  ];

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        {/* Page Header */}
        <div className="admin-dashboard-header">
          <h1>Dashboard</h1>
          <p>Welcome back! Here's an overview of your system.</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="admin-dashboard-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        {stats && (
          <div className="admin-stats-grid">
            <StatCard
              icon={Users}
              label="Total Users"
              value={stats.totalUsers}
              variant="default"
            />
            <StatCard
              icon={FileText}
              label="Pending Jobs"
              value={stats.pendingJobs}
              badge={{ text: 'Action Required', variant: 'warning' }}
              variant="blue"
            />
            <StatCard
              icon={MessageSquare}
              label="Pending Requests"
              value={stats.pendingRequests}
              badge={{ text: 'Awaiting Approval', variant: 'warning' }}
              variant="blue"
            />
            <StatCard
              icon={CreditCard}
              label="Pending Payments"
              value={stats.pendingPayments}
              badge={{ text: 'In Escrow', variant: 'warning' }}
              variant="blue"
            />
          </div>
        )}

        {/* Recent Activity */}
        <div className="admin-dashboard-section">
          <div className="admin-section-header">
            <h2>Quick Overview</h2>
            <p>Latest pending items requiring your attention</p>
          </div>

          {/* Pending Jobs */}
          {hasPermission('view_jobs') && (
            <div className="admin-dashboard-card">
              <div className="admin-card-header">
                <h3>Pending Jobs</h3>
              </div>
              <AdminTable
                headers={jobHeaders}
                rows={pendingJobs}
                loading={isLoading}
                emptyMessage="No pending jobs"
              />
            </div>
          )}

          {/* Pending Requests */}
          {hasPermission('view_requests') && (
            <div className="admin-dashboard-card">
              <div className="admin-card-header">
                <h3>Pending Job Requests</h3>
              </div>
              <AdminTable
                headers={requestHeaders}
                rows={pendingRequests}
                loading={isLoading}
                emptyMessage="No pending requests"
              />
            </div>
          )}

          {/* Pending Payments */}
          {hasPermission('view_payments') && (
            <div className="admin-dashboard-card">
              <div className="admin-card-header">
                <h3>Recent Payments (In Escrow)</h3>
              </div>
              <AdminTable
                headers={paymentHeaders}
                rows={recentPayments}
                loading={isLoading}
                emptyMessage="No recent payments"
              />
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
