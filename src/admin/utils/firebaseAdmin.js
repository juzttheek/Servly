import { db } from '../../firebase/config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  runTransaction,
  writeBatch
} from 'firebase/firestore';
import { ROLE_PERMISSIONS } from './permissions';

const ADMINS_COLLECTION = 'admins';
const USERS_COLLECTION = 'users';
const JOBS_COLLECTION = 'jobs';
const REQUESTS_COLLECTION = 'job_requests';
const PAYMENTS_COLLECTION = 'payments';
const AUDIT_LOGS_COLLECTION = 'audit_logs';

// ============ ADMIN USER MANAGEMENT ============

export const getAdminUser = async (userId) => {
  try {
    console.log(`🔍 Fetching admin user with UID: ${userId}`);
    const adminRef = doc(db, ADMINS_COLLECTION, userId);
    console.log(`📍 Document path: admins/${userId}`);
    const adminSnap = await getDoc(adminRef);
    
    if (adminSnap.exists()) {
      console.log(`✅ Admin document found:`, adminSnap.data());
      return adminSnap.data();
    } else {
      console.warn(`⚠️ Admin document does NOT exist at admins/${userId}`);
      return null;
    }
  } catch (error) {
    console.error('❌ Error fetching admin user:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
};

export const createAdminUser = async (userId, userData, role = 'support_admin') => {
  try {
    const adminRef = doc(db, ADMINS_COLLECTION, userId);
    const adminData = {
      uid: userId,
      email: userData.email,
      name: userData.displayName || 'Admin',
      role,
      permissions: ROLE_PERMISSIONS[role] || [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      isActive: true
    };
    await setDoc(adminRef, adminData);
    return adminData;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
};

export const updateAdminRole = async (userId, newRole) => {
  try {
    const adminRef = doc(db, ADMINS_COLLECTION, userId);
    await updateDoc(adminRef, {
      role: newRole,
      permissions: ROLE_PERMISSIONS[newRole] || [],
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating admin role:', error);
    throw error;
  }
};

export const updateAdminPermissions = async (userId, permissions) => {
  try {
    const adminRef = doc(db, ADMINS_COLLECTION, userId);
    await updateDoc(adminRef, {
      permissions,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating admin permissions:', error);
    throw error;
  }
};

export const getAllAdmins = async () => {
  try {
    const adminsRef = collection(db, ADMINS_COLLECTION);
    const q = query(adminsRef, where('isActive', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, uid: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching admins:', error);
    throw error;
  }
};

// Check if super admin exists
export const superAdminExists = async () => {
  try {
    const adminsRef = collection(db, ADMINS_COLLECTION);
    const q = query(adminsRef, where('role', '==', 'super_admin'), where('isActive', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.length > 0;
  } catch (error) {
    console.error('Error checking super admin:', error);
    return false;
  }
};

// ============ AUDIT LOGGING ============

export const logAdminAction = async (adminId, action, details) => {
  try {
    const logsRef = collection(db, AUDIT_LOGS_COLLECTION);
    await setDoc(doc(logsRef), {
      adminId,
      action,
      details,
      timestamp: Timestamp.now(),
      userAgent: navigator.userAgent
    });
  } catch (error) {
    console.error('Error logging admin action:', error);
    throw error;
  }
};

export const getAuditLogs = async (filters = {}, pageSize = 50) => {
  try {
    const logsRef = collection(db, AUDIT_LOGS_COLLECTION);
    let q = query(logsRef, orderBy('timestamp', 'desc'), limit(pageSize));

    if (filters.adminId) {
      q = query(logsRef, where('adminId', '==', filters.adminId), orderBy('timestamp', 'desc'), limit(pageSize));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
};

// ============ JOBS MANAGEMENT ============

export const getPendingJobs = async (pageSize = 20) => {
  try {
    const jobsRef = collection(db, JOBS_COLLECTION);
    const q = query(jobsRef, where('status', '==', 'pending'), orderBy('createdAt', 'desc'), limit(pageSize));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching pending jobs:', error);
    throw error;
  }
};

export const getAllJobs = async (filters = {}, pageSize = 20) => {
  try {
    const jobsRef = collection(db, JOBS_COLLECTION);
    let q = query(jobsRef, orderBy('createdAt', 'desc'), limit(pageSize));

    if (filters.status) {
      q = query(jobsRef, where('status', '==', filters.status), orderBy('createdAt', 'desc'), limit(pageSize));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

export const updateJobStatus = async (jobId, status, adminId, notes = '') => {
  try {
    const jobRef = doc(db, JOBS_COLLECTION, jobId);
    await updateDoc(jobRef, {
      status,
      adminApprovedBy: adminId,
      adminApprovedAt: Timestamp.now(),
      adminNotes: notes,
      updatedAt: Timestamp.now()
    });

    // Log the action
    await logAdminAction(adminId, `job_${status}`, { jobId, status, notes });
  } catch (error) {
    console.error('Error updating job status:', error);
    throw error;
  }
};

// ============ REQUESTS MANAGEMENT ============

export const getPendingRequests = async (pageSize = 20) => {
  try {
    const requestsRef = collection(db, REQUESTS_COLLECTION);
    const q = query(requestsRef, where('status', '==', 'pending'), orderBy('createdAt', 'desc'), limit(pageSize));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    throw error;
  }
};

export const updateRequestStatus = async (requestId, status, adminId, notes = '') => {
  try {
    const requestRef = doc(db, REQUESTS_COLLECTION, requestId);
    await updateDoc(requestRef, {
      status,
      adminApprovedBy: adminId,
      adminApprovedAt: Timestamp.now(),
      adminNotes: notes,
      updatedAt: Timestamp.now()
    });

    // Log the action
    await logAdminAction(adminId, `request_${status}`, { requestId, status, notes });
  } catch (error) {
    console.error('Error updating request status:', error);
    throw error;
  }
};

// ============ PAYMENTS MANAGEMENT ============

export const getAllPayments = async (filters = {}, pageSize = 20) => {
  try {
    const paymentsRef = collection(db, PAYMENTS_COLLECTION);
    let q = query(paymentsRef, orderBy('createdAt', 'desc'), limit(pageSize));

    if (filters.status) {
      q = query(paymentsRef, where('status', '==', filters.status), orderBy('createdAt', 'desc'), limit(pageSize));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

export const createPaymentRecord = async (paymentData) => {
  try {
    const paymentsRef = collection(db, PAYMENTS_COLLECTION);
    const docRef = await setDoc(doc(paymentsRef), {
      ...paymentData,
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef;
  } catch (error) {
    console.error('Error creating payment record:', error);
    throw error;
  }
};

export const updatePaymentStatus = async (paymentId, status, adminId, transactionId = null) => {
  try {
    const paymentRef = doc(db, PAYMENTS_COLLECTION, paymentId);
    const updateData = {
      status,
      updatedAt: Timestamp.now(),
      processedBy: adminId
    };

    if (transactionId) {
      updateData.transactionId = transactionId;
    }

    await updateDoc(paymentRef, updateData);
    await logAdminAction(adminId, `payment_${status}`, { paymentId, status, transactionId });
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

// ============ DASHBOARD STATISTICS ============

export const getDashboardStats = async () => {
  try {
    const stats = await runTransaction(db, async (transaction) => {
      // Get total users
      const usersRef = collection(db, USERS_COLLECTION);
      const usersSnap = await getDocs(usersRef);
      const totalUsers = usersSnap.size;

      // Get pending jobs
      const jobsRef = collection(db, JOBS_COLLECTION);
      const pendingJobsQ = query(jobsRef, where('status', '==', 'pending'));
      const pendingJobsSnap = await getDocs(pendingJobsQ);
      const pendingJobs = pendingJobsSnap.size;

      // Get pending requests
      const requestsRef = collection(db, REQUESTS_COLLECTION);
      const pendingReqQ = query(requestsRef, where('status', '==', 'pending'));
      const pendingReqSnap = await getDocs(pendingReqQ);
      const pendingRequests = pendingReqSnap.size;

      // Get pending payments
      const paymentsRef = collection(db, PAYMENTS_COLLECTION);
      const pendingPayQ = query(paymentsRef, where('status', '==', 'pending'));
      const pendingPaySnap = await getDocs(pendingPayQ);
      const pendingPayments = pendingPaySnap.size;

      return {
        totalUsers,
        pendingJobs,
        pendingRequests,
        pendingPayments,
        totalJobs: usersSnap.size,
        totalRequests: pendingReqSnap.size,
        totalPayments: pendingPaySnap.size
      };
    });

    return stats;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};
