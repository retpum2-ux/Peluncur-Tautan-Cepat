import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from 'firebase/firestore';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  User,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, db, googleProvider } from './config';
import { handleFirestoreError, OperationType } from './errorHandler';
import { GroupItem, AppSettings } from '../types';

export interface UserSpaceData {
  ownerId: string;
  groups: GroupItem[];
  settings: AppSettings;
  updatedAt: string;
  createdAt?: string;
}

/**
 * Sign in with Google using popup
 */
export async function loginWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    console.error('Google Sign-in Error:', err);
    throw err;
  }
}

/**
 * Sign out current user
 */
export async function logoutUser(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (err) {
    console.error('Logout Error:', err);
    throw err;
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Save user links & settings to Firestore
 */
export async function saveUserSpaceToFirestore(
  userId: string,
  groups: GroupItem[],
  settings: AppSettings
): Promise<void> {
  const path = `user_spaces/${userId}`;
  try {
    const payload: UserSpaceData = {
      ownerId: userId,
      groups,
      settings,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'user_spaces', userId), payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Get user links & settings once from Firestore
 */
export async function getUserSpaceFromFirestore(
  userId: string
): Promise<UserSpaceData | null> {
  const path = `user_spaces/${userId}`;
  try {
    const snapshot = await getDoc(doc(db, 'user_spaces', userId));
    if (snapshot.exists()) {
      return snapshot.data() as UserSpaceData;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

/**
 * Subscribe to real-time changes from Firestore
 */
export function subscribeToUserSpace(
  userId: string,
  onData: (data: UserSpaceData) => void,
  onError?: (err: unknown) => void
) {
  const path = `user_spaces/${userId}`;
  return onSnapshot(
    doc(db, 'user_spaces', userId),
    (snapshot) => {
      if (snapshot.exists()) {
        onData(snapshot.data() as UserSpaceData);
      }
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}
