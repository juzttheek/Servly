// Role-based permission system for admin panel

export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',        // Full access
  JOBS_MANAGER: 'jobs_manager',      // Manage jobs & requests
  PAYMENTS_MANAGER: 'payments_manager', // Manage payments & transactions
  USERS_MANAGER: 'users_manager',    // Manage users & verification
  SUPPORT_ADMIN: 'support_admin'     // Support & reporting
};

export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_ANALYTICS: 'view_analytics',

  // Users Management
  VIEW_USERS: 'view_users',
  EDIT_USERS: 'edit_users',
  VERIFY_USERS: 'verify_users',
  SUSPEND_USERS: 'suspend_users',
  DELETE_USERS: 'delete_users',

  // Jobs Management
  VIEW_JOBS: 'view_jobs',
  APPROVE_JOBS: 'approve_jobs',
  REJECT_JOBS: 'reject_jobs',
  EDIT_JOBS: 'edit_jobs',
  DELETE_JOBS: 'delete_jobs',

  // Requests Management
  VIEW_REQUESTS: 'view_requests',
  APPROVE_REQUESTS: 'approve_requests',
  REJECT_REQUESTS: 'reject_requests',
  MANAGE_REQUESTS: 'manage_requests',

  // Payments Management
  VIEW_PAYMENTS: 'view_payments',
  PROCESS_PAYMENTS: 'process_payments',
  REFUND_PAYMENTS: 'refund_payments',
  VIEW_ESCROW: 'view_escrow',
  MANAGE_ESCROW: 'manage_escrow',

  // Audit & Logs
  VIEW_LOGS: 'view_logs',
  VIEW_REPORTS: 'view_reports',

  // System Management
  MANAGE_ADMINS: 'manage_admins',
  MANAGE_SETTINGS: 'manage_settings'
};

// Role to Permissions mapping
export const ROLE_PERMISSIONS = {
  super_admin: Object.values(PERMISSIONS),
  
  jobs_manager: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_JOBS,
    PERMISSIONS.APPROVE_JOBS,
    PERMISSIONS.REJECT_JOBS,
    PERMISSIONS.EDIT_JOBS,
    PERMISSIONS.VIEW_REQUESTS,
    PERMISSIONS.APPROVE_REQUESTS,
    PERMISSIONS.REJECT_REQUESTS,
    PERMISSIONS.VIEW_LOGS,
  ],

  payments_manager: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.PROCESS_PAYMENTS,
    PERMISSIONS.REFUND_PAYMENTS,
    PERMISSIONS.VIEW_ESCROW,
    PERMISSIONS.MANAGE_ESCROW,
    PERMISSIONS.VIEW_LOGS,
    PERMISSIONS.VIEW_REPORTS,
  ],

  users_manager: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.EDIT_USERS,
    PERMISSIONS.VERIFY_USERS,
    PERMISSIONS.SUSPEND_USERS,
    PERMISSIONS.VIEW_LOGS,
    PERMISSIONS.VIEW_ANALYTICS,
  ],

  support_admin: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.VIEW_JOBS,
    PERMISSIONS.VIEW_REQUESTS,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.VIEW_LOGS,
    PERMISSIONS.VIEW_REPORTS,
  ]
};

export const getPermissionsForRole = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};
