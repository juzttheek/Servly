# Admin Panel - Developer Quick Reference

## 🎯 Using Admin Features in Components

### 1. **Check Admin Permissions**

```javascript
import { useAdminAuth } from '../hooks/useAdminAuth';
import { PERMISSIONS } from '../utils/permissions';

function MyComponent() {
  const { hasPermission, adminUser, adminRole } = useAdminAuth();

  // Check if user can approve jobs
  if (hasPermission(PERMISSIONS.APPROVE_JOBS)) {
    // Show approval button
  }

  return (
    <div>
      <p>Admin: {adminUser?.name}</p>
      <p>Role: {adminRole}</p>
    </div>
  );
}
```

---

## 📊 Firestore Operations

### Get Dashboard Stats
```javascript
import { getDashboardStats } from '../utils/firebaseAdmin';

const stats = await getDashboardStats();
// Returns: { totalUsers, pendingJobs, pendingRequests, pendingPayments, ... }
```

### Jobs Management
```javascript
import { 
  getPendingJobs, 
  getAllJobs, 
  updateJobStatus 
} from '../utils/firebaseAdmin';

// Get pending jobs (limit 20)
const jobs = await getPendingJobs(20);

// Get all jobs with filter
const approvedJobs = await getAllJobs({ status: 'approved' }, 50);

// Approve a job
await updateJobStatus(
  jobId,
  'approved',
  adminUserId,
  'Good quality, approved for posting' // optional notes
);

// Reject a job
await updateJobStatus(
  jobId,
  'rejected',
  adminUserId,
  'Title does not match guidelines'
);
```

### Requests Management
```javascript
import { 
  getPendingRequests, 
  updateRequestStatus 
} from '../utils/firebaseAdmin';

// Get pending requests
const requests = await getPendingRequests(20);

// Approve request
await updateRequestStatus(
  requestId,
  'approved',
  adminUserId,
  'Worker qualified for this job'
);

// Reject request
await updateRequestStatus(
  requestId,
  'rejected',
  adminUserId,
  'Worker does not meet requirements'
);
```

### Payments Management
```javascript
import { 
  getAllPayments, 
  createPaymentRecord, 
  updatePaymentStatus 
} from '../utils/firebaseAdmin';

// Get all payments
const payments = await getAllPayments({}, 20);

// Get payments by status
const pendingPayments = await getAllPayments({ status: 'pending' }, 50);

// Update payment status
await updatePaymentStatus(
  paymentId,
  'completed',
  adminUserId,
  'stripe_charge_12345'  // optional transaction ID
);
```

### Audit Logging
```javascript
import { logAdminAction, getAuditLogs } from '../utils/firebaseAdmin';

// Log action (happens automatically in updateJobStatus, etc)
await logAdminAction(
  adminUserId,
  'job_approved',
  { jobId: '123', reason: 'Meets guidelines' }
);

// Get audit logs
const logs = await getAuditLogs({ adminId: adminUserId }, 50);
```

---

## 🧩 UI Components

### StatCard
```javascript
import StatCard from '../components/StatCard';
import { Users } from 'lucide-react';

<StatCard
  icon={Users}
  label="Total Users"
  value={1250}
  variant="default" // 'default', 'blue', 'warning', 'error'
  badge={{
    text: 'Action Required',
    variant: 'warning' // 'success', 'warning', 'error'
  }}
/>
```

### AdminTable
```javascript
import AdminTable from '../components/AdminTable';

const headers = [
  { label: 'Job Title', key: 'title' },
  { label: 'Posted By', key: 'postedBy' },
  { label: 'Budget', key: 'budget' },
];

const rows = [
  { id: 1, title: 'Build Website', postedBy: 'John', budget: '$500' },
  // ...
];

<AdminTable
  headers={headers}
  rows={rows}
  loading={isLoading}
  emptyMessage="No jobs found"
  onRowClick={(row) => console.log(row)}
  actions={(row) => (
    <>
      <button className="admin-action-btn success">Approve</button>
      <button className="admin-action-btn danger">Reject</button>
    </>
  )}
/>
```

### AdminModal
```javascript
import AdminModal from '../components/AdminModal';
import { useState } from 'react';

function JobApprovalModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Review Job</button>

      <AdminModal
        isOpen={isOpen}
        title="Review & Approve Job"
        size="md" // 'sm', 'md', 'lg', 'xl'
        onClose={() => setIsOpen(false)}
        actions={
          <>
            <button onClick={() => setIsOpen(false)}>Cancel</button>
            <button className="btn btn-primary">Approve</button>
          </>
        }
      >
        <div>
          <h3>Job Details</h3>
          <p>Title: {job.title}</p>
          <p>Budget: ${job.budget}</p>
        </div>
      </AdminModal>
    </>
  );
}
```

---

## 🔄 Common Page Patterns

### Setup a New Admin Page

```javascript
import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminTable from '../components/AdminTable';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { PERMISSIONS } from '../utils/permissions';
import './AdminNewPage.css';

function AdminNewPage() {
  const { hasPermission } = useAdminAuth();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check permission
  if (!hasPermission(PERMISSIONS.VIEW_JOBS)) {
    return <div>You don't have access to this page.</div>;
  }

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      // Load data from firebaseAdmin utils
      // const items = await getSomething();
      // setData(items);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <h1>Page Title</h1>
          <p>Description of this page</p>
        </div>

        <div className="admin-page-content">
          <AdminTable
            headers={headers}
            rows={data}
            loading={isLoading}
            emptyMessage="No data"
          />
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminNewPage;
```

### CSS Pattern for Admin Pages

```css
/* AdminNewPage.css */
@import '../../styles/index.css';

.admin-page {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.admin-page-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.admin-page-header h1 {
  margin: 0;
  font-size: var(--text-3xl);
  font-weight: 900;
  color: var(--color-heading);
}

.admin-page-header p {
  margin: 0;
  font-size: var(--text-base);
  color: var(--color-muted-blue-gray);
}

.admin-page-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Mobile */
@media (max-width: 768px) {
  .admin-page {
    gap: 24px;
  }
}
```

---

## 🎨 Available Icons

Use icons from `lucide-react`:

```javascript
import {
  LayoutDashboard,  // Dashboard
  Users,            // Users
  FileText,         // Jobs/Documents
  MessageSquare,    // Messages/Requests
  CreditCard,       // Payments
  BarChart3,        // Analytics/Reports
  CheckCircle,      // Approve/Success
  XCircle,          // Reject/Error
  Trash2,           // Delete
  Edit,             // Edit
  Eye,              // View
  Filter,           // Filter
  Download,         // Export
  Plus,             // Add
} from 'lucide-react';
```

---

## ⚡ Quick Actions Examples

### Approve Job with Modal
```javascript
const [selectedJob, setSelectedJob] = useState(null);
const [approvalNotes, setApprovalNotes] = useState('');

const handleApprove = async () => {
  await updateJobStatus(
    selectedJob.id,
    'approved',
    adminUser.uid,
    approvalNotes
  );
  // Refresh list
  await loadJobs();
  setSelectedJob(null);
};
```

### Batch Approval
```javascript
const handleBatchApprove = async (selectedIds) => {
  const batch = writeBatch(db);
  
  for (const jobId of selectedIds) {
    const jobRef = doc(db, 'jobs', jobId);
    batch.update(jobRef, {
      status: 'approved',
      adminApprovedBy: adminUser.uid,
      adminApprovedAt: Timestamp.now()
    });
  }
  
  await batch.commit();
};
```

### Export to CSV
```javascript
const exportToCSV = (data, filename) => {
  const csv = [
    Object.keys(data[0]).join(','),
    ...data.map(row => Object.values(row).join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
};
```

---

## 🔐 Permission Checks in Routes

```javascript
// Example: Protect a route by permission
function ProtectedAdminPage() {
  const { hasPermission } = useAdminAuth();

  if (!hasPermission(PERMISSIONS.MANAGE_ADMINS)) {
    return (
      <div className="admin-error">
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return <YourPageComponent />;
}
```

---

## 📦 Data Transformation Helpers

```javascript
// Format timestamp
const formatDate = (timestamp) => {
  return new Date(timestamp?.toDate?.()).toLocaleDateString();
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Get status badge color
const getStatusColor = (status) => {
  const colors = {
    pending: 'warning',
    approved: 'success',
    rejected: 'error',
    completed: 'success'
  };
  return colors[status] || 'default';
};
```

---

## 🚀 Ready to Build!

Use this reference while building:
1. AdminUsers page
2. AdminJobs page
3. AdminRequests page
4. AdminPayments page
5. AdminReports page

Each follows the same pattern - load data, display in table, allow actions!
