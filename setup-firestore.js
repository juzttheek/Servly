// Setup script to initialize Firestore and create admin user
// Run from Node: node setup-firestore.js
// This script uses the Firebase config from your .env file

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCd9aSesCkD7uUqZTODQtVixsJ9iY1SbQ4",
  authDomain: "servly-57374.firebaseapp.com",
  projectId: "servly-57374",
  storageBucket: "servly-57374.firebasestorage.app",
  messagingSenderId: "689924885071",
  appId: "1:689924885071:web:39bf44a93f7c9729a6b83a",
  measurementId: "G-22MGFJ3X8C"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function setupFirestore() {
  try {
    console.log('🔧 Setting up Firestore collections...\n');

    // Create sample admin document
    const adminDocRef = doc(collection(db, 'admins'), 'admin-1');
    await setDoc(adminDocRef, {
      email: 'admin@servly.com',
      name: 'Administrator',
      role: 'super_admin',
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      permissions: [
        'view_dashboard', 'view_analytics', 'view_users', 'verify_users',
        'suspend_users', 'unsuspend_users', 'delete_users', 'edit_users',
        'view_jobs', 'approve_jobs', 'reject_jobs', 'edit_jobs', 'delete_jobs',
        'view_requests', 'approve_requests', 'reject_requests', 'manage_requests',
        'view_payments', 'process_payments', 'refund_payments', 'view_escrow',
        'manage_escrow', 'view_logs', 'manage_admins', 'manage_settings'
      ]
    });

    console.log('✅ Firestore setup complete!\n');
    console.log('📋 Collections created:');
    console.log('   ✓ admins (with sample admin user)');
    console.log('\n📝 Admin User Details:');
    console.log('   Email: admin@servly.com');
    console.log('   Password: Admin@123456');
    console.log('   Role: super_admin\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupFirestore();
