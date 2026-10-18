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
 * Save links & settings directly to Firestore real-time database without requiring login
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
    handleFirestoreError(error, OperationType.WRITE, path);
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
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

/**
 * Subscribe to real-time changes from Firestore
 */
export function subscribeToMainSpace(
  onData: (data: AppSpaceData) => void,
  onError?: (err: unknown) => void
) {
  const path = `app_spaces/${DEFAULT_SPACE_ID}`;
  return onSnapshot(
    doc(db, 'app_spaces', DEFAULT_SPACE_ID),
    (snapshot) => {
      if (snapshot.exists()) {
        onData(snapshot.data() as AppSpaceData);
      }
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}
