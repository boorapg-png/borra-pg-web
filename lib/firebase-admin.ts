import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Intelligent private key normalizer to fix OpenSSL decoding errors
function formatPrivateKey(key: string | undefined): string {
  if (!key) return '';
  
  // 1. Remove any surrounding quotes from Vercel/env files
  let formatted = key.trim().replace(/^["']|["']$/g, '');
  
  // 2. Convert literal backslash-n strings into actual newline characters
  formatted = formatted.replace(/\\n/g, '\n');
  
  return formatted;
}

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY),
    }),
  });
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();