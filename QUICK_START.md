# QUICK START - Admin Panel Testing

## ⚡ 5-Minute Setup

### 1. **Create Admin User in Firebase** (RIGHT NOW)

Go to Firebase Console:
1. Select "Firestore Database"
2. Create new collection: `admins`
3. Add first document with:
   - Document ID: (your Firebase user UID)
   - Copy-paste this data:

```json
{
  "email": "your_email@example.com",
  "name": "Administrator",
  "role": "super_admin",
  "isActive": true,
  "createdAt": "TIMESTAMP_NOW",
  "updatedAt": "TIMESTAMP_NOW"
}
```

### 2. **Start the Dev Server**

```bash
npm run dev
```

### 3. **Navigate to Admin Login**

Open: `http://localhost:5173/admin/login`

### 4. **Login with Your Account**
- Email: (the email you used to create the admin user)
- Password: (your Firebase password)

### 5. **You're In!** ✅
- Should redirect to `/admin/dashboard`
- See all 7 admin pages in sidebar

---

## 🧪 Quick Test Path (5 minutes)

```
Step 1: /admin/dashboard
  └─ Check KPI cards load
  └─ See pending jobs/requests/payments

Step 2: /admin/users
  └─ Search a user
  └─ Try "View Details" button
  └─ (No real actions yet - just test UI)

Step 3: /admin/jobs
  └─ Check pending jobs list
  └─ Try "Review" modal opens

Step 4: /admin/requests
  └─ Check pending requests

Step 5: /admin/payments
  └─ See payment stats
  └─ Check status filter works

Step 6: /admin/reports
  └─ View analytics dashboard
```

---

## 📋 Required Collections in Firestore

Before you can see real data, create these collections:

```
1. admins/              ← Create this FIRST (above)
2. users/               ← Should already exist
3. jobs/                ← Should already exist
4. job_requests/        ← Create if missing
5. payments/            ← Create if missing
6. audit_logs/          ← Create if missing
```

---

## 🔑 Admin Roles Available

Once you're logged in, you can create more admin users with different roles:

| Role | Can View | Can Edit |
|------|----------|----------|
| **super_admin** | Everything | Everything |
| **jobs_manager** | Jobs, Requests | Jobs, Requests |
| **payments_manager** | Payments, Reports | Payments only |
| **users_manager** | Users, Reports | Users only |
| **support_admin** | Everything | Nothing (View-only) |

---

## 🚨 If You Get Errors:

### Error: "Invalid route"
- Make sure you're logged in first
- Go to `/admin/login`

### Error: "Access Denied"
- Your user doesn't have super_admin role
- Check the `admins` collection in Firebase
- Edit your admin document and set role to "super_admin"

### Error: "No data showing"
- Collections might be empty
- That's fine! Add test data:
  - Add a test user in `users/`
  - Add a test job in `jobs/`
  - Add a test payment in `payments/`

### Error: "CSS not loading"
- Clear browser cache: Ctrl+Shift+Delete
- Refresh page: Ctrl+F5

---

## ✅ Verification Checklist

- [ ] Can login to `/admin/login`
- [ ] Redirects to `/admin/dashboard`
- [ ] Dashboard loads without errors
- [ ] Sidebar shows all menu items
- [ ] Can navigate to all 7 pages
- [ ] Tables/grids render (even if empty)
- [ ] Buttons are clickable
- [ ] Modals open/close correctly
- [ ] Mobile menu works on small screens

---

## 📞 Quick Debug Commands

If something's wrong, check console (F12) for errors:

```javascript
// Check if admin is logged in
console.log(localStorage.getItem('adminUser'))

// Check current page route
console.log(window.location.pathname)
```

---

## 🎯 Next: Add Test Data

### Sample Job to Create:

```json
{
  "title": "Test Service Request",
  "description": "This is a test job",
  "category": "Web Development",
  "budget": 500,
  "postedBy": "USER_ID_HERE",
  "status": "pending",
  "createdAt": "TIMESTAMP",
  "updatedAt": "TIMESTAMP"
}
```

### Sample Payment to Create:

```json
{
  "jobId": "JOB_ID_HERE",
  "fromUser": "CUSTOMER_ID",
  "toUser": "WORKER_ID",
  "amount": 500,
  "status": "pending",
  "createdAt": "TIMESTAMP",
  "updatedAt": "TIMESTAMP"
}
```

---

## 🚀 You're All Set!

The admin panel is ready to test. Start with the 5-minute setup above, then explore all 7 pages.

**Questions? Check `ADMIN_PANEL_COMPLETE.md` for full documentation.**
