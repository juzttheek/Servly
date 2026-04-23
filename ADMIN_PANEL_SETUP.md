# Admin Panel Setup Guide

## 📋 What Was Created

### Phase 1: Foundation ✅ COMPLETE

#### 1. **Folder Structure** (`/src/admin/`)
```
admin/
├── pages/                    # Admin page components
│   ├── AdminLogin.jsx       # Admin login page
│   └── AdminDashboard.jsx   # Main dashboard
├── components/              # Reusable admin components
│   ├── AdminLayout.jsx      # Main layout wrapper
│   ├── AdminSidebar.jsx     # Navigation sidebar
│   ├── StatCard.jsx         # Dashboard stat cards
│   ├── AdminTable.jsx       # Data table component
│   └── AdminModal.jsx       # Modal dialog component
├── context/                 # State management
│   └── AdminAuthContext.jsx # Admin auth & permissions
├── hooks/                   # Custom React hooks
│   └── useAdminAuth.js      # Admin auth hook
├── utils/                   # Utility functions
│   ├── permissions.js       # Role-based permissions
│   └── firebaseAdmin.js     # Firestore operations
└── styles/                  # CSS files
    ├── AdminLayout.css
    ├── AdminSidebar.css
    ├── StatCard.css
    ├── AdminTable.css
    ├── AdminModal.css
    ├── AdminLogin.css
    └── AdminDashboard.css
```

---

## 🔐 Role-Based Access Control

### Defined Roles:

1. **super_admin** - Full system access
2. **jobs_manager** - Manage jobs, requests, and approvals
3. **payments_manager** - Handle payments, escrow, and transactions
4. **users_manager** - Manage users, verification, and suspension
5. **support_admin** - View-only access for support purposes

### Permission System:

See `/src/admin/utils/permissions.js` for the complete permission mapping.

**Examples:**
- `VIEW_DASHBOARD` - Access to main dashboard
- `APPROVE_JOBS` - Approve/reject job posts
- `APPROVE_REQUESTS` - Approve/reject job requests
- `PROCESS_PAYMENTS` - Handle payment processing
- `MANAGE_ADMINS` - Create/edit other admin accounts

---

## 🚀 Getting Started

### Step 1: Create First Admin User

Run this in your Firebase Console or create a script:

```javascript
// In Firebase Console > Firestore > Create Collection: "admins"
// Add document with user's UID:
{
  "uid": "user_uid_here",
  "email": "admin@servly.com",
  "name": "Admin Name",
  "role": "super_admin",
  "permissions": [...all permissions...],
  "createdAt": timestamp,
  "updatedAt": timestamp,
  "isActive": true
}
```

### Step 2: Access Admin Panel

- **Login URL:** `http://localhost:5173/admin/login`
- **Dashboard URL:** `http://localhost:5173/admin/dashboard`

---

## 🔗 Routes Overview

```
/admin/login              → AdminLogin page
/admin/dashboard          → AdminDashboard (main)
/admin/users             → Users Management (coming)
/admin/jobs              → Jobs Management (coming)
/admin/requests          → Requests Management (coming)
/admin/payments          → Payments Management (coming)
/admin/reports           → Reports & Analytics (coming)
/admin/logs              → Audit Logs (coming)
/admin/settings          → Admin Settings (coming - super_admin only)
```

---

## 🗄️ Firestore Collections Setup

### Collections Needed:

```
1. admins/
   ├── uid (document ID)
   ├── email
   ├── name
   ├── role
   ├── permissions
   ├── isActive
   ├── createdAt
   └── updatedAt

2. jobs/
   ├── id
   ├── title
   ├── description
   ├── category
   ├── budget
   ├── postedBy (user ID)
   ├── status (pending, approved, rejected, completed)
   ├── adminApprovedBy (admin ID)
   ├── adminApprovedAt (timestamp)
   ├── adminNotes
   ├── createdAt
   └── updatedAt

3. job_requests/
   ├── id
   ├── jobId
   ├── jobTitle
   ├── requestedBy (user ID)
   ├── workerAssignedTo
   ├── status (pending, approved, rejected)
   ├── adminApprovedBy (admin ID)
   ├── adminApprovedAt (timestamp)
   ├── adminNotes
   ├── createdAt
   └── updatedAt

4. payments/
   ├── id
   ├── jobId
   ├── fromUser (customer ID)
   ├── toUser (worker ID)
   ├── amount
   ├── status (pending, in_escrow, processing, completed, refunded)
   ├── transactionId (Stripe/PayPal)
   ├── processedBy (admin ID)
   ├── createdAt
   └── updatedAt

5. audit_logs/
   ├── id
   ├── adminId
   ├── action (job_approved, payment_released, user_suspended, etc)
   ├── details (JSON object with action details)
   ├── timestamp
   └── userAgent

6. users/ (enhance existing)
   ├── uid (document ID)
   ├── email
   ├── displayName
   ├── userType (customer, worker)
   ├── isVerified
   ├── isSuspended
   ├── suspendedReason
   ├── verificationNotes
   ├── createdAt
   └── updatedAt
```

---

## 🛠️ Current Implementation

### AdminAuthContext
- ✅ Handles admin authentication
- ✅ Manages admin role & permissions
- ✅ Permission checking (`hasPermission()`)
- ✅ Auto-logout on missing admin access

### Firestore Operations
- ✅ Admin CRUD operations
- ✅ Job approval/rejection
- ✅ Request management
- ✅ Payment tracking
- ✅ Audit logging
- ✅ Dashboard statistics

### UI Components
- ✅ Admin Sidebar with role-based menu
- ✅ Admin Layout wrapper
- ✅ Dashboard with stats
- ✅ Reusable StatCard
- ✅ AdminTable for data display
- ✅ AdminModal for approvals
- ✅ Responsive design

---

## 📝 Next Steps (Phase 2)

### 1. Create Users Management Page
**File:** `/src/admin/pages/AdminUsers.jsx`
- List all users with filtering
- Verify/suspend users
- View user details
- Edit user information

### 2. Create Jobs Management Page
**File:** `/src/admin/pages/AdminJobs.jsx`
- View all jobs with status filter
- Quick approve/reject buttons
- View job details & requirements
- Add approval notes

### 3. Create Requests Management Page
**File:** `/src/admin/pages/AdminRequests.jsx`
- Queue of pending job requests
- Match requests to workers
- Approve/reject with notifications
- Track request history

### 4. Create Payments Management Page
**File:** `/src/admin/pages/AdminPayments.jsx`
- Escrow management dashboard
- Payment status tracking
- Release funds to workers
- Process refunds
- Transaction history

### 5. Create Reports Page
**File:** `/src/admin/pages/AdminReports.jsx`
- Revenue charts & graphs
- User statistics
- Job completion rates
- Payment volume trends

---

## 🔔 Key Features to Implement

### Notifications
When admin approves a job:
```javascript
// Send notification to worker
sendNotification({
  userId: job.postedBy,
  type: 'job_approved',
  message: `Your job "${job.title}" has been approved!`
});
```

### Payment Flow
```
1. Customer pays → Goes to Admin's Stripe account (escrow)
2. Admin approves request → Notifies worker
3. Worker completes job
4. Admin approves completion → Releases funds to worker
```

### Audit Trail
Every admin action is logged automatically via `logAdminAction()`

---

## ⚙️ Configuration

### Environment Variables (if needed)
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
```

### Styling
- Uses your existing color system from `/src/styles/index.css`
- Green accent color: `#0DB87A` (from your recent update)
- Fully responsive design for mobile

---

## 🐛 Troubleshooting

### "You do not have admin access"
- Ensure admin record exists in `admins` collection
- Check user UID matches between Auth and Firestore

### Missing data on dashboard
- Check Firestore collections are created
- Verify documents have required fields
- Check browser console for errors

### Sidebar not showing
- Ensure AdminAuthProvider wraps the app (check App.jsx)
- Check hasPermission() returns true for menu items

---

## 📱 Mobile Support

All admin pages are fully responsive:
- Sidebar collapses on mobile
- Tables scroll horizontally
- Modals are full-screen on small screens
- Touch-friendly buttons and spacing

---

## 🎨 Styling Notes

Admin panel uses your existing design system:
- Font: Inter (headings), Plus Jakarta Sans (body)
- Colors: Navy (#1B3561), Green (#0DB87A), Blues
- Spacing: 8px grid system
- Shadows & transitions from design tokens

---

## 📞 Support

For issues or questions:
1. Check `/src/admin/utils/firebaseAdmin.js` for Firestore operations
2. Review `/src/admin/utils/permissions.js` for role definitions
3. Check console logs for Firebase errors
4. Verify Firestore rules allow admin access

---

**Admin Panel v1.0** - Ready for next phase! 🚀
