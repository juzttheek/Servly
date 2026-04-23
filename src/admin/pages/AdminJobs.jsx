import { useEffect, useState } from 'react';
import { FileText, Search, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { PERMISSIONS } from '../utils/permissions';
import AdminLayout from '../components/AdminLayout';
import AdminTable from '../components/AdminTable';
import AdminModal from '../components/AdminModal';
import Button from '../../components/common/Button';
import { getPendingJobs, getAllJobs, updateJobStatus } from '../utils/firebaseAdmin';
import '../styles/AdminJobs.css';

const AdminJobs = () => {
  const { hasPermission, adminUser } = useAdminAuth();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Permission check
  if (!hasPermission(PERMISSIONS.VIEW_JOBS)) {
    return (
      <AdminLayout>
        <div className="admin-error-state">
          <FileText size={48} />
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
        </div>
      </AdminLayout>
    );
  }

  useEffect(() => {
    loadJobs();
  }, [filterStatus]);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchQuery]);

  const loadJobs = async () => {
    try {
      setIsLoading(true);
      let jobsList;
      if (filterStatus === 'pending') {
        jobsList = await getPendingJobs(100);
      } else {
        jobsList = await getAllJobs({ status: filterStatus }, 100);
      }
      setJobs(jobsList || []);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = jobs;

    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  };

  const handleApproveJob = async () => {
    if (!hasPermission(PERMISSIONS.APPROVE_JOBS)) {
      alert('You do not have permission to approve jobs');
      return;
    }

    try {
      setActionLoading(true);
      await updateJobStatus(selectedJob.id, 'approved', adminUser.uid, approvalNotes);
      await loadJobs();
      setShowDetailsModal(false);
      setSelectedJob(null);
      setApprovalNotes('');
      alert('Job approved successfully');
    } catch (error) {
      console.error('Error approving job:', error);
      alert('Failed to approve job');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectJob = async () => {
    if (!hasPermission(PERMISSIONS.REJECT_JOBS)) {
      alert('You do not have permission to reject jobs');
      return;
    }

    if (!approvalNotes) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      setActionLoading(true);
      await updateJobStatus(selectedJob.id, 'rejected', adminUser.uid, approvalNotes);
      await loadJobs();
      setShowDetailsModal(false);
      setSelectedJob(null);
      setApprovalNotes('');
      alert('Job rejected successfully');
    } catch (error) {
      console.error('Error rejecting job:', error);
      alert('Failed to reject job');
    } finally {
      setActionLoading(false);
    }
  };

  const headers = [
    { label: 'Title', key: 'title' },
    { label: 'Category', key: 'category' },
    { label: 'Budget', key: 'budget' },
    { label: 'Posted By', key: 'postedBy' },
    { label: 'Status', key: 'status' },
    { label: 'Posted Date', key: 'createdAt' }
  ];

  const formatData = (jobs) => {
    return jobs.map(job => ({
      ...job,
      budget: job.budget ? `$${job.budget}` : '-',
      status: job.status?.toUpperCase() || 'PENDING',
      createdAt: job.createdAt?.toDate?.().toLocaleDateString() || '-'
    }));
  };

  return (
    <AdminLayout>
      <div className="admin-jobs">
        {/* Page Header */}
        <div className="admin-page-header">
          <h1>Jobs Management</h1>
          <p>Review and approve job postings</p>
        </div>

        {/* Filters & Search */}
        <div className="admin-jobs-controls">
          <div className="admin-search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search jobs by title, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="admin-filter-select"
          >
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>

          <div className="admin-stats-inline">
            <span>Total: <strong>{jobs.length}</strong></span>
            <span>Filtered: <strong>{filteredJobs.length}</strong></span>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="admin-table-card">
          <AdminTable
            headers={headers}
            rows={formatData(filteredJobs)}
            loading={isLoading}
            emptyMessage={`No ${filterStatus} jobs found`}
            onRowClick={(job) => {
              setSelectedJob(job);
              setShowDetailsModal(true);
              setApprovalNotes('');
            }}
            actions={(row) => (
              <div className="admin-actions-group">
                {filterStatus === 'pending' && hasPermission(PERMISSIONS.APPROVE_JOBS) && (
                  <button
                    className="admin-action-btn success"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedJob(row);
                      setShowDetailsModal(true);
                    }}
                    title="Review & Approve"
                  >
                    <CheckCircle size={14} />
                  </button>
                )}

                {filterStatus === 'pending' && hasPermission(PERMISSIONS.REJECT_JOBS) && (
                  <button
                    className="admin-action-btn danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedJob(row);
                      setShowDetailsModal(true);
                    }}
                    title="Review & Reject"
                  >
                    <XCircle size={14} />
                  </button>
                )}
              </div>
            )}
          />
        </div>

        {/* Details Modal */}
        <AdminModal
          isOpen={showDetailsModal}
          title={filterStatus === 'pending' ? 'Review Job' : 'Job Details'}
          size="lg"
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedJob(null);
            setApprovalNotes('');
          }}
          actions={
            filterStatus === 'pending' ? (
              <>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedJob(null);
                    setApprovalNotes('');
                  }}
                >
                  Close
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleRejectJob}
                  disabled={actionLoading || !approvalNotes}
                >
                  {actionLoading ? 'Rejecting...' : 'Reject'}
                </Button>
                <Button
                  variant="primary"
                  onClick={handleApproveJob}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Approving...' : 'Approve'}
                </Button>
              </>
            ) : (
              <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                Close
              </Button>
            )
          }
        >
          {selectedJob && (
            <div className="admin-job-details">
              <div className="detail-group">
                <label>Job Title</label>
                <p>{selectedJob.title || '-'}</p>
              </div>
              <div className="detail-group">
                <label>Description</label>
                <p className="detail-long">{selectedJob.description || '-'}</p>
              </div>
              <div className="detail-row">
                <div className="detail-group">
                  <label>Category</label>
                  <p>{selectedJob.category || '-'}</p>
                </div>
                <div className="detail-group">
                  <label>Budget</label>
                  <p>${selectedJob.budget || '-'}</p>
                </div>
                <div className="detail-group">
                  <label>Status</label>
                  <p>{selectedJob.status?.toUpperCase() || '-'}</p>
                </div>
              </div>
              <div className="detail-group">
                <label>Posted By</label>
                <p>{selectedJob.postedBy || '-'}</p>
              </div>
              <div className="detail-group">
                <label>Posted Date</label>
                <p>{selectedJob.createdAt?.toDate?.().toLocaleString() || '-'}</p>
              </div>

              {filterStatus === 'pending' && (
                <div className="detail-group">
                  <label>Notes/Reason</label>
                  <textarea
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    placeholder="Add notes for approval or reason for rejection..."
                    rows="3"
                  />
                </div>
              )}

              {filterStatus !== 'pending' && selectedJob.adminNotes && (
                <div className="detail-group">
                  <label>Admin Notes</label>
                  <p className="detail-long">{selectedJob.adminNotes}</p>
                </div>
              )}
            </div>
          )}
        </AdminModal>
      </div>
    </AdminLayout>
  );
};

export default AdminJobs;
