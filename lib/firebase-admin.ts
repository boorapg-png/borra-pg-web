import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function getFirebaseAdmin(): App | null {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const jsonEnv = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!jsonEnv && (!privateKey || !projectId)) {
    console.warn('Firebase Admin credentials missing during build. Skipping initialization.');
    return null;
  }

  try {
    let credentialConfig: Record<string, string> | undefined;
    
    if (jsonEnv) {
      try {
        const cleanedJson = jsonEnv.trim().replace(/^["']|["']$/g, '');
        credentialConfig = JSON.parse(cleanedJson);
      } catch {
        console.warn('Could not parse FIREBASE_SERVICE_ACCOUNT_JSON, falling back to individual keys.');
      }
    }

    if (!credentialConfig || !credentialConfig.project_id) {
      const pk = (privateKey || '').trim().replace(/^["']|["']$/g, '').replace(/\\n/g, '\n');
      credentialConfig = {
        projectId: projectId || 'borra-pg',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
        privateKey: pk,
      };
    }

    if (!credentialConfig.privateKey || !credentialConfig.privateKey.includes('BEGIN PRIVATE KEY')) {
      console.warn('Valid private key not found. Skipping Firebase Admin initialization.');
      return null;
    }

    return initializeApp({
      credential: cert(credentialConfig),
    });
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    return null;
  }
}

const app = getFirebaseAdmin();

export const adminAuth = app ? getAuth(app) : ({} as ReturnType<typeof getAuth>);
export const adminDb = app ? getFirestore(app) : ({} as ReturnType<typeof getFirestore>);