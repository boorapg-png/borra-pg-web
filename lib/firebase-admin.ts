import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function getFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const jsonEnv = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  // If credentials are completely missing during the build phase, skip gracefully
  if (!jsonEnv && (!privateKey || !projectId)) {
    console.warn('Firebase Admin credentials missing during build. Skipping initialization.');
    return null;
  }

  try {
    let credentialConfig;
    
    if (jsonEnv) {
      try {
        const cleanedJson = jsonEnv.trim().replace(/^["']|["']$/g, '');
        credentialConfig = JSON.parse(cleanedJson);
      } catch (e) {
        console.warn('Could not parse FIREBASE_SERVICE_ACCOUNT_JSON, falling back to individual keys.');
      }
    }

    if (!credentialConfig || !credentialConfig.project_id) {
      let pk = (privateKey || '').trim().replace(/^["']|["']$/g, '').replace(/\\n/g, '\n');
      credentialConfig = {
        projectId: projectId || 'borra-pg',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
        privateKey: pk,
      };
    }

    // Ensure we actually have a private key before initializing
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

// Safe exports that won't crash your build if initialization is deferred
export const adminAuth = app ? getAuth(app) : ({} as any);
export const adminDb = app ? getFirestore(app) : ({} as any);