import { useEffect, useState } from 'react';
import { MessageSquare, Search, CheckCircle, XCircle } from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { PERMISSIONS } from '../utils/permissions';
import AdminLayout from '../components/AdminLayout';
import AdminTable from '../components/AdminTable';
import AdminModal from '../components/AdminModal';
import Button from '../../components/common/Button';
import { getPendingRequests, updateRequestStatus } from '../utils/firebaseAdmin';
import '../styles/AdminRequests.css';

const AdminRequests = () => {
  const { hasPermission, adminUser } = useAdminAuth();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Permission check
  if (!hasPermission(PERMISSIONS.VIEW_REQUESTS)) {
    return (
      <AdminLayout>
        <div className="admin-error-state">
          <MessageSquare size={48} />
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
        </div>
      </AdminLayout>
    );
  }

  useEffect(() => {
    loadRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, searchQuery]);

  const loadRequests = async () => {
    try {
      setIsLoading(true);
      const requestsList = await getPendingRequests(100);
      setRequests(requestsList || []);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = requests;

    if (searchQuery) {
      filtered = filtered.filter(req =>
        req.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.requestedBy?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  };

  const handleApproveRequest = async () => {
    if (!hasPermission(PERMISSIONS.APPROVE_REQUESTS)) {
      alert('You do not have permission to approve requests');
      return;
    }

    try {
      setActionLoading(true);
      await updateRequestStatus(selectedRequest.id, 'approved', adminUser.uid, approvalNotes);
      await loadRequests();
      setShowDetailsModal(false);
      setSelectedRequest(null);
      setApprovalNotes('');
      alert('Request approved successfully');
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!hasPermission(PERMISSIONS.REJECT_REQUESTS)) {
      alert('You do not have permission to reject requests');
      return;
    }

    if (!approvalNotes) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      setActionLoading(true);
      await updateRequestStatus(selectedRequest.id, 'rejected', adminUser.uid, approvalNotes);
      await loadRequests();
      setShowDetailsModal(false);
      setSelectedRequest(null);
      setApprovalNotes('');
      alert('Request rejected successfully');
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request');
    } finally {
      setActionLoading(false);
    }
  };

  const headers = [
    { label: 'Job Title', key: 'jobTitle' },
    { label: 'Requested By', key: 'requestedBy' },
    { label: 'For Worker', key: 'workerAssignedTo' },
    { label: 'Status', key: 'status' },
    { label: 'Request Date', key: 'createdAt' }
  ];

  const formatData = (requests) => {
    return requests.map(req => ({
      ...req,
      status: req.status?.toUpperCase() || 'PENDING',
      createdAt: req.createdAt?.toDate?.().toLocaleDateString() || '-'
    }));
  };

  return (
    <AdminLayout>
      <div className="admin-requests">
        {/* Page Header */}
        <div className="admin-page-header">
          <h1>Job Requests Management</h1>
          <p>Review and approve worker job requests</p>
        </div>

        {/* Filters & Search */}
        <div className="admin-requests-controls">
          <div className="admin-search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search requests by job or worker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="admin-stats-inline">
            <span>Pending: <strong>{filteredRequests.length}</strong></span>
            <span>Total: <strong>{requests.length}</strong></span>
          </div>
        </div>

        {/* Requests Table */}
        <div className="admin-table-card">
          <AdminTable
            headers={headers}
            rows={formatData(filteredRequests)}
            loading={isLoading}
            emptyMessage="No pending requests found"
            onRowClick={(request) => {
              setSelectedRequest(request);
              setShowDetailsModal(true);
              setApprovalNotes('');
            }}
            actions={(row) => (
              <div className="admin-actions-group">
                {hasPermission(PERMISSIONS.APPROVE_REQUESTS) && (
                  <button
                    className="admin-action-btn success"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRequest(row);
                      setShowDetailsModal(true);
                    }}
                    title="Review & Approve"
                  >
                    <CheckCircle size={14} />
                  </button>
                )}

                {hasPermission(PERMISSIONS.REJECT_REQUESTS) && (
                  <button
                    className="admin-action-btn danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRequest(row);
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
          title="Review Job Request"
          size="md"
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedRequest(null);
            setApprovalNotes('');
          }}
          actions={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedRequest(null);
                  setApprovalNotes('');
                }}
              >
                Close
              </Button>
              <Button
                variant="secondary"
                onClick={handleRejectRequest}
                disabled={actionLoading || !approvalNotes}
              >
                {actionLoading ? 'Rejecting...' : 'Reject'}
              </Button>
              <Button
                variant="primary"
                onClick={handleApproveRequest}
                disabled={actionLoading}
              >
                {actionLoading ? 'Approving...' : 'Approve'}
              </Button>
            </>
          }
        >
          {selectedRequest && (
            <div className="admin-request-details">
              <div className="detail-group">
                <label>Job Title</label>
                <p>{selectedRequest.jobTitle || '-'}</p>
              </div>
              <div className="detail-row">
                <div className="detail-group">
                  <label>Requested By</label>
                  <p>{selectedRequest.requestedBy || '-'}</p>
                </div>
                <div className="detail-group">
                  <label>For Worker</label>
                  <p>{selectedRequest.workerAssignedTo || '-'}</p>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-group">
                  <label>Job ID</label>
                  <p className="detail-code">{selectedRequest.jobId || '-'}</p>
                </div>
                <div className="detail-group">
                  <label>Status</label>
                  <p>{selectedRequest.status?.toUpperCase() || '-'}</p>
                </div>
              </div>
              <div className="detail-group">
                <label>Request Date</label>
                <p>{selectedRequest.createdAt?.toDate?.().toLocaleString() || '-'}</p>
              </div>
              <div className="detail-group">
                <label>Notes/Reason</label>
                <textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Add notes for approval or reason for rejection..."
                  rows="3"
                />
              </div>
            </div>
          )}
        </AdminModal>
      </div>
    </AdminLayout>
  );
};

export default AdminRequests;
