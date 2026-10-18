import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './config';
import { handleFirestoreError, OperationType } from './errorHandler';
import { GroupItem, AppSettings } from '../types';

export interface AppSpaceData {
  groups: GroupItem[];
  settings?: AppSettings;
  updatedAt?: string;
  createdAt?: string;
}

const DEFAULT_SPACE_ID = 'default';

/**
 * Save links & settings directly to Firestore real-time database
 */
export async function saveMainSpace(
  groups: GroupItem[],
  settings: AppSettings
): Promise<void> {
  const path = `app_spaces/${DEFAULT_SPACE_ID}`;
  try {
    const payload: AppSpaceData = {
      groups,
      settings,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'app_spaces', DEFAULT_SPACE_ID), payload, { merge: true });
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.WRITE, path);
    } catch {
      // logged
    }
    throw error;
  }
}

/**
 * Get links & settings once from Firestore
 */
export async function getMainSpace(): Promise<AppSpaceData | null> {
  const path = `app_spaces/${DEFAULT_SPACE_ID}`;
  try {
    const snapshot = await getDoc(doc(db, 'app_spaces', DEFAULT_SPACE_ID));
    if (snapshot.exists()) {
      return snapshot.data() as AppSpaceData;
    }
    return null;
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.GET, path);
    } catch {
      // logged
    }
    return null;
  }
}

/**
 * Subscribe to real-time changes from Firestore
 */
export function subscribeToMainSpace(
  onData: (data: AppSpaceData) => void,
  onEmpty: () => void,
  onError?: (err: unknown) => void
) {
  const path = `app_spaces/${DEFAULT_SPACE_ID}`;
  const docRef = doc(db, 'app_spaces', DEFAULT_SPACE_ID);

  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as AppSpaceData;
        onData(data);
      } else {
        // Document does not exist in cloud yet: trigger initial upload
        onEmpty();
      }
    },
    (error) => {
      console.warn('Firestore onSnapshot error:', error);
      if (onError) onError(error);
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch {
        // logged
      }
    }
  );
}
