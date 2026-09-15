import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  let credentialConfig;

  // 1. Try parsing the JSON environment variable if it exists
  const jsonEnv = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (jsonEnv) {
    try {
      const cleanedJson = jsonEnv.trim().replace(/^["']|["']$/g, '');
      credentialConfig = JSON.parse(cleanedJson);
    } catch (e) {
      console.warn('Warning: FIREBASE_SERVICE_ACCOUNT_JSON was not valid JSON. Falling back to individual keys.');
    }
  }

  // 2. Fallback to individual env vars if JSON parsing wasn't used or failed
  if (!credentialConfig) {
    let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';
    // Clean up quotes and fix literal newlines for OpenSSL
    privateKey = privateKey.trim().replace(/^["']|["']$/g, '').replace(/\\n/g, '\n');

    credentialConfig = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    };
  }

  initializeApp({
    credential: cert(credentialConfig),
  });
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();