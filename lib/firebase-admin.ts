import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function getFirebaseAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  try {
    let credentialConfig;
    const jsonEnv = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    
    if (jsonEnv) {
      try {
        const cleanedJson = jsonEnv.trim().replace(/^["']|["']$/g, '');
        credentialConfig = JSON.parse(cleanedJson);
      } catch (e) {
        console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON, falling back to individual keys.');
      }
    }

    if (!credentialConfig || !credentialConfig.project_id) {
      let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';
      privateKey = privateKey.trim().replace(/^["']|["']$/g, '').replace(/\\n/g, '\n');

      credentialConfig = {
        projectId: process.env.FIREBASE_PROJECT_ID || 'borra-pg',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
        privateKey: privateKey,
      };
    }

    return initializeApp({
      credential: cert(credentialConfig),
    });
  } catch (error) {
    console.error('CRITICAL: Firebase Admin initialization failed:', error);
    throw error;
  }
}

const app = getFirebaseAdminApp();

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);