import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { sendWelcomeEmail } from '@/lib/mailer';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name } = body;

    if (!email || !name) {
      return NextResponse.json({ error: 'Email and name are required' }, { status: 400 });
    }

    // Guard check: Ensure Firebase Admin Auth is active
    if (!adminAuth || typeof adminAuth.createUser !== 'function') {
      return NextResponse.json({ 
        error: 'Firebase Admin is not initialized. Please verify your Vercel Environment Variables.' 
      }, { status: 500 });
    }

    // 1. Generate a secure random 8-character password
    const tempPassword = crypto.randomBytes(4).toString('hex');

    // 2. Create the user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email: email.trim(),
      password: tempPassword,
      displayName: name.trim(),
    });

    // 3. Send the Welcome Email via Zoho
    try {
      await sendWelcomeEmail(email.trim(), name.trim(), tempPassword);
    } catch (mailError: any) {
      console.error('Warning: Failed to send welcome email:', mailError.message);
      // We still return success because the Firebase account was successfully created
    }

    return NextResponse.json({ 
      success: true, 
      uid: userRecord.uid 
    });

  } catch (error: any) {
    console.error('Error creating tenant auth:', error);
    
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json({ error: 'A user with this email already exists in Firebase Authentication.' }, { status: 409 });
    }
    
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}