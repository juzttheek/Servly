# Admin Permissions System Documentation

## Overview

The admin panel uses a **role-based access control (RBAC)** system with 5 pre-defined roles and 25+ granular permissions.

---

## 5 Admin Roles

### 1. **Super Admin** 🔓
**Full system access - Can do everything**

```
✅ View all data
✅ Edit all data
✅ Approve/reject jobs
✅ Manage users
✅ Process payments
✅ View analytics
✅ Manage other admins
✅ View audit logs
```

**Use for:** Owner, System Administrator

---

### 2. **Jobs Manager** 📋
**Manage jobs and worker requests only**

```
✅ View/manage jobs (approve, reject)
✅ View/manage job requests (approve, reject)
✅ View jobs analytics
❌ Cannot manage users
❌ Cannot manage payments
❌ Cannot manage admins
```

**Use for:** Job moderators, Content team

---

### 3. **Payments Manager** 💰
**Manage payments and escrow only**

```
✅ View all payments
✅ Process/release payments
✅ Issue refunds
✅ View payment analytics
❌ Cannot manage jobs
❌ Cannot manage users
❌ Cannot manage admins
```

**Use for:** Finance team, Accounting staff

---

### 4. **Users Manager** 👥
**Manage user accounts only**

```
✅ View all users
✅ Verify users
✅ Suspend/unsuspend users
✅ Delete users
✅ View user analytics
❌ Cannot manage jobs
❌ Cannot manage payments
❌ Cannot manage admins
```

**Use for:** Customer support, Community managers

---

### 5. **Support Admin** 🔍
**View-only access - Cannot make changes**

```
✅ View everything (jobs, users, payments, analytics)
✅ View audit logs
❌ Cannot approve anything
❌ Cannot delete anything
❌ Cannot edit anything
```

**Use for:** Support staff, Analytics team, Monitoring

---

## 25 Granular Permissions

### Dashboard Permissions
- `view_dashboard` - Access admin dashboard
- `view_analytics` - View reports and analytics

### User Management Permissions
- `view_users` - View user list and details
- `verify_users` - Approve user accounts
- `suspend_users` - Suspend user accounts
- `unsuspend_users` - Reactivate suspended users
- `delete_users` - Delete user accounts
- `edit_users` - Edit user information

### Jobs Management Permissions
- `view_jobs` - View all jobs
- `approve_jobs` - Approve pending jobs
- `reject_jobs` - Reject pending jobs
- `edit_jobs` - Edit job details
- `delete_jobs` - Delete jobs

### Job Requests Permissions
- `view_requests` - View job requests
- `approve_requests` - Accept worker requests
- `reject_requests` - Deny worker requests
- `manage_requests` - Full request management

### Payments & Escrow Permissions
- `view_payments` - View payment records
- `process_payments` - Release payments to workers
- `refund_payments` - Issue refunds to customers
- `view_escrow` - View escrow account
- `manage_escrow` - Full escrow management

### Admin & Audit Permissions
- `view_logs` - View audit logs
- `manage_admins` - Create/edit admin accounts
- `manage_settings` - Change system settings

---

## Role-to-Permission Mapping

| Permission | Super Admin | Jobs Manager | Payments Manager | Users Manager | Support Admin |
|-----------|:-:|:-:|:-:|:-:|:-:|
| view_dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| view_analytics | ✅ | ✅ | ✅ | ✅ | ✅ |
| view_users | ✅ | ✅ | ❌ | ✅ | ✅ |
| verify_users | ✅ | ❌ | ❌ | ✅ | ❌ |
| suspend_users | ✅ | ❌ | ❌ | ✅ | ❌ |
| unsuspend_users | ✅ | ❌ | ❌ | ✅ | ❌ |
| delete_users | ✅ | ❌ | ❌ | ✅ | ❌ |
| edit_users | ✅ | ❌ | ❌ | ✅ | ❌ |
| view_jobs | ✅ | ✅ | ❌ | ❌ | ✅ |
| approve_jobs | ✅ | ✅ | ❌ | ❌ | ❌ |
| reject_jobs | ✅ | ✅ | ❌ | ❌ | ❌ |
| edit_jobs | ✅ | ✅ | ❌ | ❌ | ❌ |
| delete_jobs | ✅ | ✅ | ❌ | ❌ | ❌ |
| view_requests | ✅ | ✅ | ❌ | ❌ | ✅ |
| approve_requests | ✅ | ✅ | ❌ | ❌ | ❌ |
| reject_requests | ✅ | ✅ | ❌ | ❌ | ❌ |
| manage_requests | ✅ | ✅ | ❌ | ❌ | ❌ |
| view_payments | ✅ | ❌ | ✅ | ❌ | ✅ |
| process_payments | ✅ | ❌ | ✅ | ❌ | ❌ |
| refund_payments | ✅ | ❌ | ✅ | ❌ | ❌ |
| view_escrow | ✅ | ❌ | ✅ | ❌ | ✅ |
| manage_escrow | ✅ | ❌ | ✅ | ❌ | ❌ |
| view_logs | ✅ | ✅ | ✅ | ✅ | ✅ |
| manage_admins | ✅ | ❌ | ❌ | ❌ | ❌ |
| manage_settings | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## How Permission Checks Work

### In Code (AdminAuthContext.jsx):

```javascript
const { hasPermission } = useAdminAuth();

// Check single permission
if (!hasPermission('approve_jobs')) {
  return <AccessDenied />;
}

// Check multiple permissions (ANY match)
if (!hasPermission(['approve_jobs', 'approve_requests'])) {
  return <AccessDenied />;
}
```

### What Happens Without Permission:

1. **Page-level:** Entire page shows "Access Denied" message
2. **Action-level:** Buttons are disabled or hidden
3. **UI-level:** Restricted sections don't render

Example from AdminUsers.jsx:
```javascript
const { hasPermission } = useAdminAuth();

return (
  <div>
    {hasPermission('verify_users') && (
      <button onClick={verifyUser}>Verify User</button>
    )}
    {!hasPermission('delete_users') && (
      <div className="access-denied">You can't delete users</div>
    )}
  </div>
);
```

---

## Creating New Admin Users

### Step 1: Create Firebase Auth Account
```bash
# In Firebase Console or via code:
firebase auth:add-user --email=admin@servly.com --password=SecurePassword123
```

### Step 2: Get Their User ID (UID)
```bash
# In Firebase Console > Authentication > Users
# Copy the UID
```

### Step 3: Add to Firestore `admins` Collection

```json
{
  "uid": "THEIR_UID_HERE",
  "email": "admin@servly.com",
  "name": "John Smith",
  "role": "jobs_manager",
  "isActive": true,
  "createdAt": "TIMESTAMP",
  "updatedAt": "TIMESTAMP"
}
```

The permissions will be automatically assigned based on their role.

---

## Changing Admin Roles

### To Upgrade/Downgrade an Admin:

```javascript
// In firebaseAdmin.js (or Firebase Console)
await updateAdminRole(adminUid, 'payments_manager');

// Permissions are auto-loaded based on new role
```

### Example Workflow:
1. John starts as `support_admin` (view-only)
2. After training, promote to `jobs_manager`
3. All permissions auto-update
4. He can now approve jobs immediately

---

## Custom Role Creation (Future)

Currently, only the 5 pre-defined roles are available.

To add custom roles in the future:

```javascript
// In permissions.js, add:
ROLE_PERMISSIONS['custom_role'] = [
  'view_dashboard',
  'view_jobs',
  'approve_jobs',
  // ... custom permission set
];
```

Then create admin user with `"role": "custom_role"`.

---

## Permission Audit Trail

Every admin action is logged in `audit_logs` collection:

```json
{
  "adminId": "admin_uid",
  "adminEmail": "admin@servly.com",
  "action": "job_approved",
  "permission": "approve_jobs",
  "details": {
    "jobId": "job_123",
    "newStatus": "approved",
    "notes": "Looks good"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

This allows tracking:
- Who did what
- When they did it
- What permission they used
- Full details of the change

---

## Best Practices

### Principle of Least Privilege
Assign the minimum permissions needed:
- Support staff → `support_admin` (view-only)
- Moderators → `jobs_manager` (jobs only)
- Accountant → `payments_manager` (payments only)
- Owner → `super_admin` (everything)

### Regular Access Reviews
- Monthly: Review who has which roles
- Quarterly: Audit admin action logs
- Yearly: Update role definitions

### Separation of Duties
- Don't let one person approve and release payments
- Separate job approval from user verification
- Have payment reviews by different team members

### Logging & Monitoring
- Check audit logs regularly
- Alert on unusual activity
- Keep records for compliance

---

## Troubleshooting

### Admin Can't See a Page

**Check:**
1. Firestore `admins` document exists for their UID
2. They have the correct role assigned
3. Their role includes `view_` permission for that section
4. `isActive` is set to `true`

### Permissions Not Updating

**Solution:**
1. Logout: `/admin/login` → Click logout
2. Login again: Their permissions reload from Firestore
3. Or refresh: F5 (hard refresh: Ctrl+Shift+R)

### "Access Denied" on All Pages

**Check:**
1. User exists in `admins` collection
2. Document ID matches their Firebase UID exactly
3. Role field is one of: super_admin, jobs_manager, payments_manager, users_manager, support_admin
4. isActive is true

---

## Summary

✅ **5 pre-defined roles** for different team functions
✅ **25+ granular permissions** for fine-grained control
✅ **Automatic permission assignment** based on role
✅ **Easy to change** - just update the role field
✅ **Fully audited** - all actions logged

**Your admin team is secure, scalable, and organized!** 🔐
