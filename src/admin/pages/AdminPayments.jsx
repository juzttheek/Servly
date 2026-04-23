import { useEffect, useState } from 'react';
import { CreditCard, Search, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { PERMISSIONS } from '../utils/permissions';
import AdminLayout from '../components/AdminLayout';
import AdminTable from '../components/AdminTable';
import AdminModal from '../components/AdminModal';
import Button from '../../components/common/Button';
import { getAllPayments, updatePaymentStatus } from '../utils/firebaseAdmin';
import '../styles/AdminPayments.css';

const AdminPayments = () => {
  const { hasPermission, adminUser } = useAdminAuth();
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Permission check
  if (!hasPermission(PERMISSIONS.VIEW_PAYMENTS)) {
    return (
      <AdminLayout>
        <div className="admin-error-state">
          <CreditCard size={48} />
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
        </div>
      </AdminLayout>
    );
  }

  useEffect(() => {
    loadPayments();
  }, [filterStatus]);

  useEffect(() => {
    filterPayments();
  }, [payments, searchQuery]);

  const loadPayments = async () => {
    try {
      setIsLoading(true);
      const paymentsList = await getAllPayments({ status: filterStatus }, 100);
      setPayments(paymentsList || []);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = payments;

    if (searchQuery) {
      filtered = filtered.filter(payment =>
        payment.fromUser?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.toUser?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.jobId?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPayments(filtered);
  };

  const handleReleasePayment = async () => {
    if (!hasPermission(PERMISSIONS.PROCESS_PAYMENTS)) {
      alert('You do not have permission to process payments');
      return;
    }

    if (!transactionId) {
      alert('Please enter a transaction ID');
      return;
    }

    try {
      setActionLoading(true);
      await updatePaymentStatus(selectedPayment.id, 'completed', adminUser.uid, transactionId);
      await loadPayments();
      setShowDetailsModal(false);
      setSelectedPayment(null);
      setTransactionId('');
      alert('Payment released successfully');
    } catch (error) {
      console.error('Error releasing payment:', error);
      alert('Failed to release payment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefundPayment = async () => {
    if (!hasPermission(PERMISSIONS.REFUND_PAYMENTS)) {
      alert('You do not have permission to refund payments');
      return;
    }

    if (!transactionId) {
      alert('Please enter a transaction ID');
      return;
    }

    try {
      setActionLoading(true);
      await updatePaymentStatus(selectedPayment.id, 'refunded', adminUser.uid, transactionId);
      await loadPayments();
      setShowDetailsModal(false);
      setSelectedPayment(null);
      setTransactionId('');
      alert('Payment refunded successfully');
    } catch (error) {
      console.error('Error refunding payment:', error);
      alert('Failed to refund payment');
    } finally {
      setActionLoading(false);
    }
  };

  const getTotalAmount = (paymentsList) => {
    return paymentsList.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  };

  const headers = [
    { label: 'Amount', key: 'amount' },
    { label: 'From', key: 'fromUser' },
    { label: 'To', key: 'toUser' },
    { label: 'Job ID', key: 'jobId' },
    { label: 'Status', key: 'status' },
    { label: 'Date', key: 'createdAt' }
  ];

  const formatData = (payments) => {
    return payments.map(payment => ({
      ...payment,
      amount: `$${parseFloat(payment.amount || 0).toFixed(2)}`,
      status: payment.status?.toUpperCase() || 'PENDING',
      createdAt: payment.createdAt?.toDate?.().toLocaleDateString() || '-'
    }));
  };

  return (
    <AdminLayout>
      <div className="admin-payments">
        {/* Page Header */}
        <div className="admin-page-header">
          <h1>Payments & Escrow Management</h1>
          <p>Process payments and manage escrow transactions</p>
        </div>

        {/* Stats Cards */}
        <div className="admin-payment-stats">
          <div className="stat-box">
            <div className="stat-label">Pending Escrow</div>
            <div className="stat-value">${getTotalAmount(payments.filter(p => p.status === 'pending')).toFixed(2)}</div>
            <div className="stat-count">{payments.filter(p => p.status === 'pending').length} payments</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Processing</div>
            <div className="stat-value">${getTotalAmount(payments.filter(p => p.status === 'processing')).toFixed(2)}</div>
            <div className="stat-count">{payments.filter(p => p.status === 'processing').length} payments</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Completed</div>
            <div className="stat-value">${getTotalAmount(payments.filter(p => p.status === 'completed')).toFixed(2)}</div>
            <div className="stat-count">{payments.filter(p => p.status === 'completed').length} payments</div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="admin-payments-controls">
          <div className="admin-search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search payments by user or job..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="admin-filter-select"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="refunded">Refunded</option>
          </select>

          <div className="admin-stats-inline">
            <span>Total: <strong>{payments.length}</strong></span>
            <span>Amount: <strong>${getTotalAmount(filteredPayments).toFixed(2)}</strong></span>
          </div>
        </div>

        {/* Payments Table */}
        <div className="admin-table-card">
          <AdminTable
            headers={headers}
            rows={formatData(filteredPayments)}
            loading={isLoading}
            emptyMessage={`No ${filterStatus} payments found`}
            onRowClick={(payment) => {
              setSelectedPayment(payment);
              setShowDetailsModal(true);
              setTransactionId('');
            }}
            actions={(row) => (
              <div className="admin-actions-group">
                {filterStatus === 'pending' && hasPermission(PERMISSIONS.PROCESS_PAYMENTS) && (
                  <button
                    className="admin-action-btn success"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPayment(row);
                      setShowDetailsModal(true);
                    }}
                    title="Process Payment"
                  >
                    <CheckCircle size={14} />
                  </button>
                )}

                {filterStatus !== 'completed' && filterStatus !== 'refunded' && hasPermission(PERMISSIONS.REFUND_PAYMENTS) && (
                  <button
                    className="admin-action-btn danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPayment(row);
                      setShowDetailsModal(true);
                    }}
                    title="Refund Payment"
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
          title="Payment Details"
          size="md"
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedPayment(null);
            setTransactionId('');
          }}
          actions={
            filterStatus === 'pending' ? (
              <>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedPayment(null);
                    setTransactionId('');
                  }}
                >
                  Close
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleRefundPayment}
                  disabled={actionLoading || !transactionId}
                >
                  {actionLoading ? 'Refunding...' : 'Refund'}
                </Button>
                <Button
                  variant="primary"
                  onClick={handleReleasePayment}
                  disabled={actionLoading || !transactionId}
                >
                  {actionLoading ? 'Releasing...' : 'Release Payment'}
                </Button>
              </>
            ) : (
              <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                Close
              </Button>
            )
          }
        >
          {selectedPayment && (
            <div className="admin-payment-details">
              <div className="detail-row">
                <div className="detail-group">
                  <label>Amount</label>
                  <p className="detail-amount">${parseFloat(selectedPayment.amount || 0).toFixed(2)}</p>
                </div>
                <div className="detail-group">
                  <label>Status</label>
                  <p>{selectedPayment.status?.toUpperCase() || '-'}</p>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-group">
                  <label>From (Customer)</label>
                  <p>{selectedPayment.fromUser || '-'}</p>
                </div>
                <div className="detail-group">
                  <label>To (Worker)</label>
                  <p>{selectedPayment.toUser || '-'}</p>
                </div>
              </div>

              <div className="detail-group">
                <label>Job ID</label>
                <p className="detail-code">{selectedPayment.jobId || '-'}</p>
              </div>

              <div className="detail-row">
                <div className="detail-group">
                  <label>Created Date</label>
                  <p>{selectedPayment.createdAt?.toDate?.().toLocaleString() || '-'}</p>
                </div>
                <div className="detail-group">
                  <label>Last Updated</label>
                  <p>{selectedPayment.updatedAt?.toDate?.().toLocaleString() || '-'}</p>
                </div>
              </div>

              {filterStatus === 'pending' && (
                <div className="detail-group">
                  <label>Transaction ID</label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter Stripe/PayPal transaction ID..."
                  />
                </div>
              )}

              {selectedPayment.transactionId && (
                <div className="detail-group">
                  <label>Transaction ID</label>
                  <p className="detail-code">{selectedPayment.transactionId}</p>
                </div>
              )}
            </div>
          )}
        </AdminModal>
      </div>
    </AdminLayout>
  );
};

export default AdminPayments;
