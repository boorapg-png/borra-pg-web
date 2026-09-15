import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  let credentialConfig;

  // 1. Try parsing the JSON environment variable if provided
  const jsonEnv = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (jsonEnv) {
    try {
      const cleanedJson = jsonEnv.trim().replace(/^["']|["']$/g, '');
      credentialConfig = JSON.parse(cleanedJson);
    } catch (e) {
      // Ignore parse failure and move to fallback
    }
  }

  // 2. Fallback to individual environment variables or project defaults for build safety
  if (!credentialConfig || !credentialConfig.project_id) {
    let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';
    privateKey = privateKey.trim().replace(/^["']|["']$/g, '').replace(/\\n/g, '\n');

    credentialConfig = {
      projectId: process.env.FIREBASE_PROJECT_ID || 'borra-pg',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@borra-pg.iam.gserviceaccount.com',
      privateKey: privateKey,
    };
  }

  // Only initialize if we have a valid-looking private key to prevent build crashes
  if (credentialConfig.privateKey && credentialConfig.privateKey.includes('BEGIN PRIVATE KEY')) {
    try {
      initializeApp({
        credential: cert(credentialConfig),
      });
    } catch (error) {
      console.error('Firebase admin initialization error:', error);
    }
  } else {
    console.warn('Firebase Admin: Private key missing or invalid during build phase. Skipping initialization.');
  }
}

// Safe exports to prevent runtime crashes if initialization skipped
export const adminAuth = getApps().length ? getAuth() : ({} as any);
export const adminDb = getApps().length ? getFirestore() : ({} as any);