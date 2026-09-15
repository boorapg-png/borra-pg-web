import { NextResponse } from 'next/server';
// FIX: Using exact relative paths instead of the @ alias
import { adminAuth } from '../../../../lib/firebase-admin';
import { sendWelcomeEmail } from '../../../../lib/mailer';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    if (!email || !name) {
      return NextResponse.json({ error: 'Email and name are required' }, { status: 400 });
    }

    // 1. Generate a secure random 8-character password
    const tempPassword = crypto.randomBytes(4).toString('hex');

    // 2. Create the user in Firebase Auth silently (Admin SDK)
    const userRecord = await adminAuth.createUser({
      email,
      password: tempPassword,
      displayName: name,
    });

    // 3. Send the Welcome Email via Zoho
    await sendWelcomeEmail(email, name, tempPassword);

    // 4. Return the UID so the frontend can save it in the Firestore Tenant document
    return NextResponse.json({ 
      success: true, 
      uid: userRecord.uid 
    });

  } catch (error: any) {
    console.error('Error creating tenant auth:', error);
    
    // Handle the most common error gracefully
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json({ error: 'A user with this email already exists in the system.' }, { status: 409 });
    }
    
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}