import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (privateKey) {
    // 1. Remove any accidental surrounding quotes from Vercel
    privateKey = privateKey.replace(/^["']|["']$/g, '');
    // 2. Convert literal \n text into actual newline breaks for OpenSSL
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();