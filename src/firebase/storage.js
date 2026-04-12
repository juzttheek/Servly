import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

// Upload a file and return the download URL
export const uploadFile = async (file, path) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

// Upload profile image
export const uploadProfileImage = async (file, userId) => {
  const path = `profiles/${userId}/${Date.now()}_${file.name}`;
  return await uploadFile(file, path);
};

// Upload service image
export const uploadServiceImage = async (file, serviceId) => {
  const path = `services/${serviceId}/${Date.now()}_${file.name}`;
  return await uploadFile(file, path);
};

// Delete a file
export const deleteFile = async (fileUrl) => {
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};
