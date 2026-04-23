# Complete Admin Setup & Testing Guide

## 🎯 STEP-BY-STEP: Create Admin Account & Test

---

## **STEP 1: Create Firebase Admin User** (5 mins)

### Option A: Using Firebase Console (Recommended)

1. Go to: **Firebase Console → Authentication**
   - URL: `https://console.firebase.google.com`
   - Select your Servly project

2. Click **"Create user"** button (top right of Users tab)

3. Enter credentials:
   - **Email:** `admin@servly.com` (or any email you want)
   - **Password:** `Admin@123456` (strong password required)
   - Click **"Create user"**

4. **COPY THE UID** (important!)
   - You'll see: `UID: fA7x8B2c9D4e5F6g7H8i9...`
   - Click the copy icon next to it
   - Paste it somewhere safe (Notepad)

---

## **STEP 2: Create Firestore Admin Document** (3 mins)

### In Firebase Console:

1. Go to **Firestore Database**

2. Click **"Create collection"**
   - Collection ID: `admins`
   - Click **"Next"**

3. Click **"Auto-generate ID"** ⚠️ OR manually enter the UID:
   - If you want to match Firebase auth: Use the **UID you copied** from Step 1
   - Otherwise: Click "Auto-generate ID"
   - Click **"Save"**

4. Add these fields to the document:

| Field | Type | Value |
|-------|------|-------|
| `email` | String | `admin@servly.com` |
| `name` | String | `Administrator` |
| `role` | String | `super_admin` |
| `isActive` | Boolean | `true` |
| `createdAt` | Timestamp | Click "Server timestamp" |
| `updatedAt` | Timestamp | Click "Server timestamp" |

**Screenshot help:** Look for blue "+ Add field" button to add each field.

5. Click **"Save"**

---

## **STEP 3: Start Development Server** (2 mins)

Open terminal and run:

```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

---

## **STEP 4: Test Admin Login** (2 mins)

1. Open browser: `http://localhost:5173/admin/login`

2. You should see login form with:
   - Email input field
   - Password input field
   - "Login as Admin" button
   - "Back to Home" link

3. Enter:
   - **Email:** `admin@servly.com` (from Step 1)
   - **Password:** `Admin@123456` (from Step 1)

4. Click **"Login as Admin"** button

5. **Expected result:**
   - ✅ Should redirect to `/admin/dashboard`
   - ✅ You're logged in!
   - ✅ Sidebar shows admin menu

---

## **STEP 5: Explore Admin Dashboard** (5 mins)

Once logged in at `/admin/dashboard`, you'll see:

### Dashboard Overview:
- **4 KPI Cards** at top:
  - Total Users
  - Total Jobs
  - Total Revenue
  - Job Completion Rate

- **3 Tables** below:
  - Pending Jobs
  - Pending Requests
  - Pending Payments

### Navigate Using Sidebar:
```
📊 Dashboard        ← Current page
👥 Users           
📋 Jobs            
✋ Requests         
💰 Payments        
📈 Reports         
⚙️ Settings        
🚪 Logout          
```

---

## **STEP 6: Test Each Admin Page** (15 mins)

### 👥 **Page 1: Users** (`/admin/users`)

Click "👥 Users" in sidebar

**What you should see:**
- Search box at top
- Filter buttons: "All", "Workers", "Customers", "Verified", "Suspended"
- Table with columns: Name, Email, Type, Status, Actions

**Test:**
- Try searching for a user name
- Click filter buttons (they'll show/hide data)
- Try "View Details" button (should open modal)
- **Note:** Verify/Suspend buttons disabled if no test data

---

### 📋 **Page 2: Jobs** (`/admin/jobs`)

Click "📋 Jobs" in sidebar

**What you should see:**
- Filter tabs: Pending, Approved, Rejected, Completed
- Search box by job title
- Table with: Title, Category, Posted By, Status, Actions

**Test:**
- Click "Pending" tab (shows pending jobs)
- Try "Review" button (should open job detail modal)
- **Note:** Approve/Reject buttons work only with test data

---

### ✋ **Page 3: Requests** (`/admin/requests`)

Click "✋ Requests" in sidebar

**What you should see:**
- Queue of pending job requests
- Search box
- Table with: Job, Worker, Status, Actions

**Test:**
- Try searching
- Click "View Details" (shows request modal)
- **Note:** Approve/Reject need test data

---

### 💰 **Page 4: Payments** (`/admin/payments`)

Click "💰 Payments" in sidebar

**What you should see:**
- **4 Stats Cards:**
  - Pending Escrow: $0 (no data yet)
  - Processing: 0
  - Completed: $0
  - Refunded: $0
- Status filter tabs: Pending, Processing, Completed, Refunded
- Table with: Job, Amount, Status, Actions

**Test:**
- Click status tabs
- Try "Release Payment" button (needs transaction ID in modal)
- **Note:** Will work once you add test payments

---

### 📈 **Page 5: Reports** (`/admin/reports`)

Click "📈 Reports" in sidebar

**What you should see:**
- **4 KPI Cards:**
  - Total Users
  - Total Jobs
  - Total Revenue
  - Completion Rate
- **4 Summary Cards:**
  - Revenue Summary
  - Jobs Summary
  - User Summary
  - Payment Status
- Detailed metrics table at bottom

**Test:**
- All stats should display
- Table should show detailed breakdown

---

### ⚙️ **Page 6: Settings** (`/admin/settings`)

Click "⚙️ Settings" in sidebar (if visible)

**Current:** Empty placeholder (can be enhanced)

---

## **STEP 7: Add Test Data** (Optional - For Better Testing)

### Create a Test User:

1. Go to your main app: `http://localhost:5173`
2. Register a new account:
   - Name: `John Doe`
   - Email: `john@test.com`
   - Password: `Test@123456`
   - Select: Worker or Customer

3. After registration, go back to admin:
   - `/admin/users`
   - Search for "John Doe"
   - You should see it in the table

### Create a Test Job:

1. Login as the regular user (if not already)
2. Go to "Post a Request" or "Browse Services"
3. Post a new job:
   - Title: `Test Web Design`
   - Category: `Web Design`
   - Budget: `$500`
   - Description: `Test job for admin`

4. Go back to admin:
   - `/admin/jobs`
   - Click "Pending" tab
   - You should see your test job
   - Click "Review" to approve it

---

## **STEP 8: Test Admin Actions** (10 mins)

### Approve a Job:

1. Go to `/admin/jobs`
2. Click "Pending" tab
3. Click "Review" on any job
4. Modal opens showing:
   - Job title, description, budget
   - Text area for "Admin Notes"
5. Add notes: `Looks good - approved`
6. Click "✅ Approve Job"
7. **Expected:** Job moves to "Approved" tab

### Reject a Job:

1. Go to `/admin/jobs`
2. Click "Pending" tab
3. Find another job
4. Click "Review"
5. Click "❌ Reject Job"
6. Enter reason: `Content violates guidelines`
7. **Expected:** Job moves to "Rejected" tab

### Verify a User:

1. Go to `/admin/users`
2. Click "Unverified" filter (or search for user)
3. Click "Verify" button
4. **Expected:** User moves to "Verified" filter

### Suspend a User:

1. Go to `/admin/users`
2. Click any user "View Details"
3. Click "Suspend User"
4. Enter reason: `Suspicious activity`
5. Click "Suspend"
6. **Expected:** User appears in "Suspended" filter

---

## **STEP 9: Logout & Test Re-login** (2 mins)

1. Click **"🚪 Logout"** in sidebar (bottom)
2. **Expected:** Redirects to `/admin/login`
3. Login again with same credentials
4. **Expected:** Back at dashboard

---

## **STEP 10: Test Permission Restrictions** (5 mins)

### Test with Different Roles:

Once you're comfortable, test other roles:

1. Create a second admin in Firestore:
   - Collection: `admins`
   - Email: `manager@servly.com`
   - Role: `jobs_manager` (NOT super_admin)
   - isActive: true

2. Create that user in Firebase Authentication:
   - Email: `manager@servly.com`
   - Password: `Manager@123456`

3. Login as `manager@servly.com`

4. **Expected restricted pages:**
   - ❌ Cannot see "Payments" (shows Access Denied)
   - ❌ Cannot see "Users" (shows Access Denied)
   - ✅ Can see "Jobs" and "Requests"

---

## **Common Issues & Fixes**

### ❌ "Invalid email/password" at login

**Fix:**
- Check email matches exactly in both places:
  - Firebase Authentication
  - Firestore `admins` collection
- Case-sensitive!

### ❌ "Access Denied" on all pages

**Fix:**
- Check Firestore `admins` collection:
  - Document ID = Firebase UID (must match exactly!)
  - Field "isActive" = true
  - Field "role" = super_admin (or valid role)

### ❌ Sidebar doesn't show

**Fix:**
- Check browser console (F12)
- Look for red errors
- Verify localStorage has adminUser:
  ```javascript
  // Open console (F12) and paste:
  console.log(localStorage.getItem('adminUser'))
  ```

### ❌ Page content blank/empty

**Fix:**
- Add test data (follow Step 7 above)
- Firestore collections empty = blank tables

### ❌ CSS not loading / styling looks weird

**Fix:**
- Hard refresh: `Ctrl+Shift+R` (not just F5)
- Clear cache: Ctrl+Shift+Delete → Clear browsing data

---

## **Quick Reference: Admin Login Credentials**

```
Email:    admin@servly.com
Password: Admin@123456
Role:     super_admin
Status:   Active
```

**Store somewhere safe!** (Password manager recommended)

---

## **Complete Testing Checklist** ✅

- [ ] Firebase user created (`admin@servly.com`)
- [ ] UID copied from Firebase
- [ ] Firestore `admins` collection created
- [ ] Admin document added with correct UID
- [ ] Dev server running (`npm run dev`)
- [ ] Can login to `/admin/login`
- [ ] Redirects to `/admin/dashboard`
- [ ] Dashboard loads with KPI cards
- [ ] Sidebar shows all menu items
- [ ] Can navigate to all 7 pages
- [ ] Users page loads (even if empty)
- [ ] Jobs page loads with Pending tab
- [ ] Requests page loads
- [ ] Payments page shows stats
- [ ] Reports page loads
- [ ] Can logout
- [ ] Can login again
- [ ] Modals open/close correctly
- [ ] Search boxes work (with test data)
- [ ] Filter tabs work (with test data)
- [ ] Action buttons visible and clickable

---

## **Next: Add Real Data**

Once all tests pass, add real data:

1. Create multiple test users via app signup
2. Post test jobs
3. Create test payment records
4. Test approvals/rejections
5. Monitor with admin dashboard

---

## **Still Stuck?**

1. Check browser console: F12
2. Check terminal for errors
3. Check Firestore data exists
4. Check Firebase Authentication shows user
5. Check email/password match exactly

**Email your admin credentials are set to: `admin@servly.com` with password `Admin@123456`**

Now follow Step 4 above and login! 🚀
