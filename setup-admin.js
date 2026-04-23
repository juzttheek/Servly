// Setup script to create admin user in Firestore
// Run: node setup-admin.js

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// This uses your .env credentials indirectly via Firebase config
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'servly-57374'
});

const db = admin.firestore();

async function setupAdmin() {
  try {
    console.log('🔧 Setting up admin user...\n');

    // Create the admins collection with first document
    const adminData = {
      email: 'admin@servly.com',
      name: 'Administrator',
      role: 'super_admin',
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      permissions: [
        'view_dashboard',
        'view_analytics',
        'view_users',
        'verify_users',
        'suspend_users',
        'unsuspend_users',
        'delete_users',
        'edit_users',
        'view_jobs',
        'approve_jobs',
        'reject_jobs',
        'edit_jobs',
        'delete_jobs',
        'view_requests',
        'approve_requests',
        'reject_requests',
        'manage_requests',
        'view_payments',
        'process_payments',
        'refund_payments',
        'view_escrow',
        'manage_escrow',
        'view_logs',
        'manage_admins',
        'manage_settings'
      ]
    };

    // Add document to admins collection
    const result = await db.collection('admins').doc('admin-user-1').set(adminData);
    
    console.log('✅ Admin user created successfully!');
    console.log('\nAdmin Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email:     admin@servly.com`);
    console.log(`🔐 Password:  Admin@123456`);
    console.log(`👤 Role:      super_admin`);
    console.log(`✨ Status:    Active`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📍 Document ID: admin-user-1');
    console.log('📍 Collection: admins\n');

    console.log('Next steps:');
    console.log('1. Go to Firebase Console → Authentication');
    console.log('2. Create a user with email: admin@servly.com');
    console.log('3. Password: Admin@123456');
    console.log('4. Go to your app: http://localhost:5173/admin/login');
    console.log('5. Login with above credentials\n');

    await admin.app().delete();
    console.log('✅ Setup complete!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error during setup:', error);
    process.exit(1);
  }
}

setupAdmin();
