import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { sendWelcomeEmail } from '@/lib/mailer';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { email, name, uid } = await req.json();

    if (!email || !name || !uid) {
      return NextResponse.json({ error: 'Email, name, and UID are required' }, { status: 400 });
    }

    // 1. Generate a new 8-character password
    const newTempPassword = crypto.randomBytes(4).toString('hex');

    // 2. Update the user's password directly in Firebase Auth using their UID
    await adminAuth.updateUser(uid, {
      password: newTempPassword,
    });

    // 3. Send the updated credentials via Zoho (Reusing the welcome template for now)
    await sendWelcomeEmail(email, name, newTempPassword);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}