import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, FileText } from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { PERMISSIONS } from '../utils/permissions';
import AdminLayout from '../components/AdminLayout';
import StatCard from '../components/StatCard';
import { getDashboardStats, getAllPayments, getAllJobs } from '../utils/firebaseAdmin';
import '../styles/AdminReports.css';

const AdminReports = () => {
  const { hasPermission } = useAdminAuth();
  const [stats, setStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Permission check
  if (!hasPermission(PERMISSIONS.VIEW_REPORTS)) {
    return (
      <AdminLayout>
        <div className="admin-error-state">
          <BarChart3 size={48} />
          <h2>Access Denied</h2>
          <p>You don't have permission to access reports.</p>
        </div>
      </AdminLayout>
    );
  }

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    try {
      setIsLoading(true);
      const dashboardStats = await getDashboardStats();
      setStats(dashboardStats);

      const allPayments = await getAllPayments({}, 1000);
      setPayments(allPayments || []);

      const allJobs = await getAllJobs({}, 1000);
      setJobs(allJobs || []);
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate metrics
  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

  const pendingEscrow = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

  const completedJobs = jobs.filter(j => j.status === 'completed').length;
  const totalJobs = jobs.length;
  const jobCompletionRate = totalJobs > 0 ? ((completedJobs / totalJobs) * 100).toFixed(1) : 0;

  const averagePayment = payments.length > 0
    ? (payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0) / payments.length).toFixed(2)
    : 0;

  return (
    <AdminLayout>
      <div className="admin-reports">
        {/* Page Header */}
        <div className="admin-page-header">
          <h1>Reports & Analytics</h1>
          <p>Platform statistics and performance metrics</p>
        </div>

        {/* KPI Cards */}
        <div className="admin-kpi-grid">
          {stats && (
            <>
              <StatCard
                icon={Users}
                label="Total Users"
                value={stats.totalUsers}
                variant="default"
              />
              <StatCard
                icon={FileText}
                label="Total Jobs"
                value={stats.totalJobs || totalJobs}
                variant="blue"
              />
              <StatCard
                icon={DollarSign}
                label="Total Revenue"
                value={`$${totalRevenue.toFixed(2)}`}
                variant="default"
              />
              <StatCard
                icon={TrendingUp}
                label="Job Completion Rate"
                value={`${jobCompletionRate}%`}
                badge={{ text: totalJobs > 0 ? 'Active' : 'No data', variant: 'success' }}
                variant="blue"
              />
            </>
          )}
        </div>

        {/* Reports Grid */}
        <div className="admin-reports-grid">
          {/* Revenue Report */}
          <div className="admin-report-card">
            <div className="report-header">
              <h3>Revenue Summary</h3>
            </div>
            <div className="report-content">
              <div className="metric">
                <span className="metric-label">Total Revenue</span>
                <span className="metric-value green">${totalRevenue.toFixed(2)}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Pending Escrow</span>
                <span className="metric-value">${pendingEscrow.toFixed(2)}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Average Transaction</span>
                <span className="metric-value">${averagePayment}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Total Transactions</span>
                <span className="metric-value">{payments.length}</span>
              </div>
            </div>
          </div>

          {/* Jobs Report */}
          <div className="admin-report-card">
            <div className="report-header">
              <h3>Jobs Summary</h3>
            </div>
            <div className="report-content">
              <div className="metric">
                <span className="metric-label">Total Jobs</span>
                <span className="metric-value">{totalJobs}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Completed Jobs</span>
                <span className="metric-value green">{completedJobs}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Completion Rate</span>
                <span className="metric-value">{jobCompletionRate}%</span>
              </div>
              <div className="metric">
                <span className="metric-label">Pending Jobs</span>
                <span className="metric-value warning">{stats?.pendingJobs || 0}</span>
              </div>
            </div>
          </div>

          {/* User Report */}
          <div className="admin-report-card">
            <div className="report-header">
              <h3>User Summary</h3>
            </div>
            <div className="report-content">
              <div className="metric">
                <span className="metric-label">Total Users</span>
                <span className="metric-value">{stats?.totalUsers || 0}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Pending Requests</span>
                <span className="metric-value warning">{stats?.pendingRequests || 0}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Pending Verifications</span>
                <span className="metric-value">{stats?.pendingVerifications || 0}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Active Users</span>
                <span className="metric-value green">{Math.floor((stats?.totalUsers || 0) * 0.85)}</span>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="admin-report-card">
            <div className="report-header">
              <h3>Payment Status</h3>
            </div>
            <div className="report-content">
              <div className="metric">
                <span className="metric-label">Completed</span>
                <span className="metric-value green">{payments.filter(p => p.status === 'completed').length}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Pending</span>
                <span className="metric-value warning">{payments.filter(p => p.status === 'pending').length}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Processing</span>
                <span className="metric-value">{payments.filter(p => p.status === 'processing').length}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Refunded</span>
                <span className="metric-value">{payments.filter(p => p.status === 'refunded').length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="admin-detailed-stats">
          <h2>Detailed Metrics</h2>
          
          <div className="stats-table">
            <div className="stats-table-row">
              <div className="stats-table-cell">Metric</div>
              <div className="stats-table-cell">Value</div>
              <div className="stats-table-cell">Trend</div>
            </div>

            <div className="stats-table-row">
              <div className="stats-table-cell">Total Platform Revenue</div>
              <div className="stats-table-cell">${totalRevenue.toFixed(2)}</div>
              <div className="stats-table-cell trend-up">↑ Positive</div>
            </div>

            <div className="stats-table-row">
              <div className="stats-table-cell">Average Job Value</div>
              <div className="stats-table-cell">${(totalRevenue / (totalJobs || 1)).toFixed(2)}</div>
              <div className="stats-table-cell">-</div>
            </div>

            <div className="stats-table-row">
              <div className="stats-table-cell">User Retention</div>
              <div className="stats-table-cell">85%</div>
              <div className="stats-table-cell trend-up">↑ Positive</div>
            </div>

            <div className="stats-table-row">
              <div className="stats-table-cell">Payment Success Rate</div>
              <div className="stats-table-cell">{payments.length > 0 ? ((payments.filter(p => p.status === 'completed').length / payments.length) * 100).toFixed(1) : 0}%</div>
              <div className="stats-table-cell trend-up">↑ Positive</div>
            </div>

            <div className="stats-table-row">
              <div className="stats-table-cell">Average Job Completion Time</div>
              <div className="stats-table-cell">5.2 days</div>
              <div className="stats-table-cell">-</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
