import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from './config';

// Get a single document
export const getDocument = async (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

// Get all documents from a collection with optional filters
export const getDocuments = async (collectionName, filters = [], sortBy = null, limitCount = null) => {
  let q = collection(db, collectionName);
  const constraints = [];

  filters.forEach(filter => {
    constraints.push(where(filter.field, filter.operator, filter.value));
  });

  if (sortBy) {
    constraints.push(orderBy(sortBy.field, sortBy.direction || 'desc'));
  }

  if (limitCount) {
    constraints.push(limit(limitCount));
  }

  if (constraints.length > 0) {
    q = query(q, ...constraints);
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Add a document
export const addDocument = async (collectionName, data) => {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

// Update a document
export const updateDocument = async (collectionName, docId, data) => {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

// Delete a document
export const deleteDocument = async (collectionName, docId) => {
  await deleteDoc(doc(db, collectionName, docId));
};

// Real-time listener for a collection
export const subscribeToCollection = (collectionName, filters = [], callback) => {
  let q = collection(db, collectionName);
  const constraints = [];

  filters.forEach(filter => {
    constraints.push(where(filter.field, filter.operator, filter.value));
  });

  if (constraints.length > 0) {
    q = query(q, ...constraints);
  }

  return onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(docs);
  });
};

// Real-time listener for a single document
export const subscribeToDocument = (collectionName, docId, callback) => {
  const docRef = doc(db, collectionName, docId);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() });
    } else {
      callback(null);
    }
  });
};

// Get paginated documents
export const getPaginatedDocuments = async (collectionName, sortField, direction = 'desc', pageSize = 12, lastDoc = null) => {
  let constraints = [orderBy(sortField, direction), limit(pageSize)];
  
  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }

  const q = query(collection(db, collectionName), ...constraints);
  const snapshot = await getDocs(q);
  
  return {
    docs: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
    hasMore: snapshot.docs.length === pageSize
  };
};
