import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

const googleProvider = new GoogleAuthProvider();

// Register with email/password
export const registerWithEmail = async (email, password, displayName, role = 'customer') => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await updateProfile(user, { displayName });

  // Create user document in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    displayName,
    email: user.email,
    photoURL: user.photoURL || null,
    role,
    phone: '',
    location: '',
    bio: '',
    skills: [],
    rating: 0,
    reviewCount: 0,
    verified: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return user;
};

// Login with email/password
export const loginWithEmail = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Login with Google
export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Check if user document exists
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) {
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      role: 'customer',
      phone: '',
      location: '',
      bio: '',
      skills: [],
      rating: 0,
      reviewCount: 0,
      verified: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  return user;
};

// Logout
export const logout = async () => {
  await signOut(auth);
};

// Reset password
export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

// Get user profile from Firestore
export const getUserProfile = async (uid) => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() };
  }
  return null;
};
