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

    if (!adminAuth || typeof adminAuth.createUser !== 'function') {
      return NextResponse.json({ 
        error: 'Firebase Admin failed to initialize. Check Vercel environment variables.' 
      }, { status: 500 });
    }

    const tempPassword = crypto.randomBytes(4).toString('hex');

    const userRecord = await adminAuth.createUser({
      email: email.trim(),
      password: tempPassword,
      displayName: name.trim(),
    });

    try {
      await sendWelcomeEmail(email.trim(), name.trim(), tempPassword);
    } catch (mailError: any) {
      console.error('Warning: Failed to send welcome email:', mailError.message);
    }

    return NextResponse.json({ 
      success: true, 
      uid: userRecord.uid 
    });

  } catch (error: any) {
    console.error('Detailed error in create-tenant:', error);
    // Returns the exact error string to the frontend alert instead of generic 500
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}